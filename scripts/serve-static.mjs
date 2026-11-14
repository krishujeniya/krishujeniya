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
  const pathname = decodeURIComponent(new URL(request.url ?? '/', 'http://localhost').pathname);
  const pagePath = pathname.replace(/^\/krishujeniya(?=\/|$)/, '');
  const relativePath = normalize(pagePath.replace(/^\/+/, ''));
  const target = join(root, relativePath);
  const pathFromRoot = relative(root, target);
  if (pathFromRoot.startsWith('..') || isAbsolute(pathFromRoot) || !existsSync(target)) {
    response.writeHead(404).end('Not found');
    return;
  }

  const file = statSync(target).isDirectory() ? join(target, 'index.html') : target;
  if (!existsSync(file)) {
    response.writeHead(404).end('Not found');
    return;
  }

  response.writeHead(200, { 'content-type': contentTypes[extname(file)] ?? 'application/octet-stream' });
  createReadStream(file).pipe(response);
}).listen(4173, '127.0.0.1');
