import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, isAbsolute, join, normalize, relative } from 'node:path';

const root = join(process.cwd(), 'out');
const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
};

createServer((request, response) => {
  try {
    let pathname;
    try {
      pathname = decodeURIComponent(new URL(request.url ?? '/', 'http://localhost').pathname);
    } catch {
      response.writeHead(400, {
        'content-type': 'text/plain; charset=utf-8',
        'x-content-type-options': 'nosniff',
        'x-frame-options': 'DENY',
      }).end('Bad Request: Malformed URI');
      return;
    }

    const pagePath = pathname.replace(/^\/krishujeniya(?=\/|$)/, '');
    const relativePath = normalize(pagePath.replace(/^\/+/, ''));
    const target = join(root, relativePath);
    const pathFromRoot = relative(root, target);

    if (pathFromRoot.startsWith('..') || isAbsolute(pathFromRoot) || !existsSync(target)) {
      response.writeHead(404, {
        'content-type': 'text/plain; charset=utf-8',
        'x-content-type-options': 'nosniff',
        'x-frame-options': 'DENY',
      }).end('Not found');
      return;
    }

    let file;
    try {
      file = statSync(target).isDirectory() ? join(target, 'index.html') : target;
    } catch {
      response.writeHead(500, {
        'content-type': 'text/plain; charset=utf-8',
        'x-content-type-options': 'nosniff',
        'x-frame-options': 'DENY',
      }).end('Internal Server Error');
      return;
    }

    if (!existsSync(file)) {
      response.writeHead(404, {
        'content-type': 'text/plain; charset=utf-8',
        'x-content-type-options': 'nosniff',
        'x-frame-options': 'DENY',
      }).end('Not found');
      return;
    }

    let fileSize;
    try {
      fileSize = statSync(file).size;
    } catch {
      response.writeHead(500, {
        'content-type': 'text/plain; charset=utf-8',
        'x-content-type-options': 'nosniff',
        'x-frame-options': 'DENY',
      }).end('Internal Server Error');
      return;
    }

    response.writeHead(200, {
      'access-control-allow-origin': '*',
      'content-length': fileSize,
      'content-type': contentTypes[extname(file)] ?? 'application/octet-stream',
      'x-content-type-options': 'nosniff',
      'x-frame-options': 'DENY',
      'referrer-policy': 'strict-origin-when-cross-origin',
      'permissions-policy': 'camera=(), microphone=(), geolocation=()',
    });

    const stream = createReadStream(file);
    stream.on('error', error => {
      console.error(`Static file read failed for ${pathname}: ${error.message}`);
      if (!response.headersSent) {
        response.writeHead(500, {
          'content-type': 'text/plain; charset=utf-8',
          'x-content-type-options': 'nosniff',
          'x-frame-options': 'DENY',
        }).end('Internal Server Error');
      } else {
        response.destroy();
      }
    });
    stream.pipe(response);
  } catch (error) {
    console.error('Unhandled request error:', error);
    if (!response.headersSent) {
      response.writeHead(500, {
        'content-type': 'text/plain; charset=utf-8',
        'x-content-type-options': 'nosniff',
        'x-frame-options': 'DENY',
      }).end('Internal Server Error');
    } else {
      response.destroy();
    }
  }
}).listen(4173, '127.0.0.1');
