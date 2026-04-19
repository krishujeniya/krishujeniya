'use client';

import React from 'react';
import Image from 'next/image';

interface AboutItem {
    title: string;
    content: string;
    icon: any;
}

interface AboutProps {
    profile: {
        name: string;
        photo: {
            webp: string;
            jpg: string;
        };
    };
    about: AboutItem[];
}

export const About: React.FC<AboutProps> = ({ profile, about }) => {
    return (
        <section id="about" className="py-24 px-6 md:px-12 bg-white text-black rounded-[40px] md:rounded-[80px] mt-20 relative z-10 scroll-mt-20">
            <div className="max-w-[1440px] mx-auto">
                <div className="grid lg:grid-cols-12 gap-12 items-end mb-20">
                    <div className="lg:col-span-7 flex flex-col gap-4">
                        <span className="text-[11px] font-black uppercase tracking-[0.4em] text-[#A1A1A1]">/ Info</span>
                        <h2 className="text-[clamp(3rem,8vw,8rem)] font-black tracking-tighter uppercase leading-none">About <br /><span className="text-[#A1A1A1]">Krish</span></h2>
                    </div>
                    
                    <div className="lg:col-span-5 flex lg:justify-end">
                        <div className="relative w-full max-w-sm aspect-square rounded-[20px] sm:rounded-[40px] overflow-hidden border border-black/5 bg-[#F5F5F5]">
                            <Image 
                                src={profile.photo.webp} 
                                alt={profile.name} 
                                fill
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 384px, 384px"
                                className="object-cover"
                                priority
                            />
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-12">
                    {about.map((item, i) => (
                        <div key={i} className="flex flex-col gap-6">
                            <div className="w-12 h-12 flex items-center justify-center bg-black text-white rounded-2xl">
                                <item.icon size={20} />
                            </div>
                            <h3 className="text-2xl font-black uppercase tracking-tight">{item.title}</h3>
                            <p className="text-lg text-black/60 leading-relaxed">
                                {item.content}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
