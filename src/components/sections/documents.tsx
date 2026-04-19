'use client';

import React, { useState } from 'react';
import { File } from 'lucide-react';

interface FileItem {
    name: string;
    type: string;
}

interface Folder {
    name: string;
    description: string;
    icon: any;
    files: FileItem[];
    path: string;
}

interface DocumentsProps {
    documents: Folder[];
}

const DOCS_BASE_URL = 'https://raw.githubusercontent.com/krishujeniya/krishujeniya/main/public/docs';

export const Documents: React.FC<DocumentsProps> = ({ documents }) => {
    const [expandedFolder, setExpandedFolder] = useState<number | null>(null);

    return (
        <section id="documents" className="py-24 px-6 md:px-12 bg-white/5 scroll-mt-20">
            <div className="max-w-[1440px] mx-auto">
                <div className="flex flex-col items-center text-center gap-6 mb-32">
                    <span className="text-[11px] font-black uppercase tracking-[0.4em] text-[#A1A1A1]">/ Resources</span>
                    <h2 className="text-[clamp(2.5rem,7vw,7rem)] font-black tracking-tighter uppercase leading-none">Technical <br />Resources</h2>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {documents.map((folder, i) => (
                        <div key={i} className="group flex flex-col p-8 rounded-[32px] bg-white/5 border border-white/5 hover:border-white/10 transition-all duration-500 w-full min-w-0 overflow-hidden">
                            <div className="flex items-center justify-between mb-12">
                                <div className="w-12 h-12 flex items-center justify-center bg-black text-white rounded-2xl group-hover:bg-[#A1A1A1] transition-colors">
                                    <folder.icon size={20} />
                                </div>
                                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#A1A1A1]">{folder.files.length} Files</span>
                            </div>
                            <h3 className="text-2xl font-black uppercase tracking-tight mb-4">{folder.name}</h3>
                            <p className="text-[#A1A1A1] leading-relaxed text-sm mb-8 flex-grow">{folder.description}</p>
                            
                            <button 
                                onClick={() => setExpandedFolder(expandedFolder === i ? null : i)}
                                aria-label={expandedFolder === i ? `Collapse ${folder.name}` : `Expand ${folder.name}`}
                                className="flex items-center justify-between w-full py-4 border-t border-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-white hover:text-[#A1A1A1] transition-colors"
                            >
                                <span>{expandedFolder === i ? 'Collapse' : 'View Docs'}</span>
                                <span className="material-symbols-outlined text-[16px]" aria-hidden="true">
                                    {expandedFolder === i ? 'expand_less' : 'expand_more'}
                                </span>
                            </button>

                            <div
                                className="overflow-hidden transition-all duration-500"
                                style={{
                                    maxHeight: expandedFolder === i ? '800px' : '0px',
                                    opacity: expandedFolder === i ? 1 : 0,
                                }}
                                aria-hidden={expandedFolder !== i}
                            >
                                <div className="pt-4 space-y-2 w-full max-w-full">
                                    {folder.files.map((file, fi) => (
                                        <a 
                                            key={fi}
                                            href={`${DOCS_BASE_URL}/${folder.path}/${file.name.split('/').map(segment => encodeURIComponent(segment)).join('/')}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label={`Open ${file.name}`}
                                            tabIndex={expandedFolder === i ? 0 : -1}
                                            className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all group/file w-full min-w-0"
                                        >
                                            <div className="flex items-center gap-3 min-w-0 flex-1">
                                                <File size={14} className="text-white/40 shrink-0" aria-hidden="true" />
                                                <span className="text-[11px] font-bold text-[#A1A1A1] group-hover/file:text-white truncate">{file.name.split('/').pop()}</span>
                                            </div>
                                            <span className="text-[9px] font-black uppercase text-white/40 ml-2 shrink-0">{file.type}</span>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
