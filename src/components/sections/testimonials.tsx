'use client';

import React from 'react';
import Image from 'next/image';
import { Quote } from 'lucide-react';

interface Testimonial {
    name: string;
    role: string;
    content: string;
    photo: string;
}

interface TestimonialsProps {
    testimonials: Testimonial[];
}

export const Testimonials: React.FC<TestimonialsProps> = ({ testimonials }) => {
    return (
        <section id="testimonials" className="py-24 px-6 md:px-12 bg-[#0A0A0A] scroll-mt-20">
            <div className="max-w-[1440px] mx-auto">
                <div className="flex flex-col items-center text-center gap-6 mb-32">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#A1A1A1]">/ Feedback</span>
                    <h2 className="text-[clamp(2.5rem,7vw,7rem)] font-black tracking-tighter uppercase leading-none text-white whitespace-pre-wrap">Trusted by <br />Industry Leads</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {testimonials.map((testimonial, i) => (
                        <div 
                            key={i}
                            className="p-10 md:p-14 rounded-[40px] bg-white/5 border border-white/5 relative group hover:border-white/10 transition-all duration-500"
                        >
                            <Quote className="absolute top-10 right-10 text-white/5 w-20 h-20" />
                            <div className="flex flex-col gap-10">
                                <p className="text-2xl md:text-3xl font-bold tracking-tight text-white/90 leading-tight">
                                    "{testimonial.content}"
                                </p>
                                <div className="flex items-center gap-6">
                                    <div className="relative w-16 h-16 rounded-2xl overflow-hidden border border-white/10">
                                        <Image 
                                            src={testimonial.photo} 
                                            alt={testimonial.name}
                                            fill
                                            sizes="64px"
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-lg font-black uppercase tracking-tight text-white">{testimonial.name}</span>
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#A1A1A1]">{testimonial.role}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
