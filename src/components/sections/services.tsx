'use client';

import React from 'react';

interface ServiceItem {
    title: string;
    description: string;
    icon: any;
    features: string[];
}

interface ServicesProps {
    services: ServiceItem[];
}

export const Services: React.FC<ServicesProps> = ({ services }) => {
    return (
        <section id="services" className="py-32 px-6 md:px-12 bg-[#FAFAFA] text-black rounded-[40px] md:rounded-[80px] scroll-mt-20 relative z-20 shadow-[0_-20px_50px_rgba(0,0,0,0.05)]">
            <div className="max-w-[1440px] mx-auto">
                <div className="flex flex-col items-start gap-4 mb-24">
                    <span className="text-[11px] font-black uppercase tracking-[0.4em] text-[#A1A1A1]">/ Expertise</span>
                    <h2 className="text-[clamp(3rem,8vw,8rem)] font-black tracking-tighter uppercase leading-none">Core <br /><span className="text-[#A1A1A1]">Services</span></h2>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {services.map((service, i) => (
                        <div 
                            key={i}
                            className="group p-10 rounded-[40px] border border-black/5 bg-white hover:bg-black hover:text-white transition-all duration-700 hover:shadow-[0_30px_60px_rgba(0,0,0,0.1)] relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-black/[0.02] group-hover:bg-white/5 rounded-bl-full transition-colors" />
                            
                            <div className="w-16 h-16 flex items-center justify-center bg-black text-white rounded-2xl mb-8 group-hover:bg-white group-hover:text-black transition-all duration-500 group-hover:scale-110 shadow-lg">
                                <service.icon size={32} />
                            </div>
                            <h3 className="text-3xl font-black uppercase tracking-tight mb-4 relative z-10">{service.title}</h3>
                            <p className="text-lg text-[#525252] leading-relaxed mb-10 relative z-10 group-hover:text-white/80 transition-colors">{service.description}</p>
                            <ul className="space-y-4 relative z-10">
                                {service.features.map((feature, fi) => (
                                    <li key={fi} className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-black/80 group-hover:text-white/90 transition-colors">
                                        <div className="w-1.5 h-1.5 rounded-full bg-current group-hover:scale-125 transition-transform" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
