'use client';

import React, { useState } from 'react';
import { Check } from 'lucide-react';

interface ContactProps {
    // any props needed
}

export const Contact: React.FC<ContactProps> = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSent, setIsSent] = useState(false);
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [selectedServices, setSelectedServices] = useState<string[]>([]);
    const [selectedStages, setSelectedStages] = useState<string[]>([]);

    const services = [
        'Full Product Design',
        'MVP Development',
        'UI/UX Audit',
        'Visual Identity',
        'Web Development',
        'Mobile App Design'
    ];

    const stages = [
        'Idea Stage',
        'Pre-seed / Seed',
        'Series A+',
        'Existing Product',
        'Refactoring'
    ];

    const toggleService = (service: string) => {
        setSelectedServices(prev => 
            prev.includes(service) ? prev.filter(s => s !== service) : [...prev, service]
        );
    };

    const toggleStage = (stage: string) => {
        setSelectedStages(prev => 
            prev.includes(stage) ? prev.filter(s => s !== stage) : [...prev, stage]
        );
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isSent || isSubmitting) return;
        
        const form = e.currentTarget;
        const formData = new FormData(form);

        const honeypot = formData.get('honeypot') as string;
        const name = (formData.get('name') as string || '').trim();
        const email = (formData.get('email') as string || '').trim();
        const company = (formData.get('company') as string || 'Not provided').trim();
        const role = formData.get('role') as string || 'Not provided';
        const techStack = (formData.get('techStack') as string || 'Not provided').trim();
        const budget = formData.get('budget') as string || 'Not selected';
        const timeline = formData.get('timeline') as string || 'Not selected';
        const discoverySource = formData.get('discoverySource') as string || 'Not provided';
        const preferredContactMethod = formData.get('contactMethod') as string || 'Not provided';
        const message = (formData.get('message') as string || '').trim();

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!name || !email || !message || !role || !budget || !timeline || !discoverySource || !preferredContactMethod) {
            setErrorMessage('Please fill in all required fields.');
            setIsError(true);
            setTimeout(() => setIsError(false), 5000);
            return;
        }

        if (!emailRegex.test(email)) {
            setErrorMessage('Please enter a valid email address.');
            setIsError(true);
            setTimeout(() => setIsError(false), 5000);
            return;
        }

        setIsSubmitting(true);
        setIsError(false);

        const API_URL = process.env.NEXT_PUBLIC_VERCEL_API_URL || 'https://krishujeniya-backend.vercel.app/api/webDATA';

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    email,
                    company,
                    role,
                    services: selectedServices,
                    stage: selectedStages,
                    techStack,
                    budget,
                    timeline,
                    discoverySource,
                    preferredContactMethod,
                    message,
                    honeypot: honeypot || ""
                }),
            });

            if (response.ok) {
                setIsSent(true);
                form.reset();
                setSelectedServices([]);
                setSelectedStages([]);
                setTimeout(() => setIsSent(false), 5000);
            } else {
                if (response.status === 403) {
                    throw new Error('Unauthorized source. Please submit from the official site.');
                } else if (response.status === 500) {
                    throw new Error('Internal Server Error. Please try again later.');
                } else {
                    throw new Error('Failed to send inquiry.');
                }
            }
        } catch (error: any) {
            console.error('Submission error:', error);
            setErrorMessage(error.message || 'Failed to send — email directly.');
            setIsError(true);
            setTimeout(() => setIsError(false), 5000);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section id="contact" className="py-24 px-6 md:px-12 bg-white text-black rounded-[40px] md:rounded-[80px] mb-20 relative z-10 scroll-mt-20">
            <div className="max-w-[1440px] mx-auto">
                <div className="grid lg:grid-cols-12 gap-20">
                    <div className="lg:col-span-6 flex flex-col gap-10">
                        <div className="flex flex-col gap-4">
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#999999]">/ Inquiry</span>
                            <h2 className="text-[clamp(3rem,8vw,8rem)] font-black tracking-tighter uppercase leading-[0.85]">Let&apos;s Build <br />Something <br /><span className="text-[#A1A1A1]">That Works</span></h2>
                        </div>
                        <p className="text-xl text-black/60 leading-relaxed max-w-sm">
                            Got a project in mind? Tell me what you&apos;re working on and I&apos;ll get back within 24 hours with honest thoughts on fit, scope, and timeline.
                        </p>
                        <div className="flex flex-col gap-4 mt-8">
                            <a href="mailto:ukideashare0021@gmail.com" className="text-lg sm:text-2xl font-black tracking-tight hover:opacity-50 transition-opacity underline decoration-4 decoration-[#A1A1A1] underline-offset-8 uppercase break-all">ukideashare0021@gmail.com</a>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#999999]">Based in India · Working Worldwide</span>
                        </div>
                    </div>

                    <div className="lg:col-span-6">
                        <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
                            {/* Honeypot field - hidden from users */}
                            <div className="hidden" aria-hidden="true">
                                <input type="text" name="honeypot" tabIndex={-1} autoComplete="off" />
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-4">Full Name*</label>
                                    <input 
                                        type="text" 
                                        id="name"
                                        name="name" 
                                        placeholder="ALEX JOHNSON" 
                                        required 
                                        className="bg-[#F5F5F5] border-none rounded-2xl px-6 py-4 text-sm font-bold placeholder:text-black/20 focus:ring-2 focus:ring-black/5 transition-all outline-none"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-4">Email Address*</label>
                                    <input 
                                        type="email" 
                                        id="email"
                                        name="email" 
                                        placeholder="ALEX@COMPANY.COM" 
                                        required 
                                        className="bg-[#F5F5F5] border-none rounded-2xl px-6 py-4 text-sm font-bold placeholder:text-black/20 focus:ring-2 focus:ring-black/5 transition-all outline-none"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="company" className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-4">Company Name</label>
                                    <input 
                                        type="text" 
                                        id="company"
                                        name="company" 
                                        placeholder="YOUR ORGANIZATION" 
                                        className="bg-[#F5F5F5] border-none rounded-2xl px-6 py-4 text-sm font-bold placeholder:text-black/20 focus:ring-2 focus:ring-black/5 transition-all outline-none"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="role" className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-4">Your Role*</label>
                                    <select 
                                        id="role"
                                        name="role" 
                                        required
                                        defaultValue=""
                                        className="bg-[#F5F5F5] border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-black/5 transition-all outline-none appearance-none cursor-pointer"
                                    >
                                        <option value="" disabled>SELECT YOUR ROLE</option>
                                        <option value="Founder/CEO">FOUNDER / CEO</option>
                                        <option value="Product Manager">PRODUCT MANAGER</option>
                                        <option value="CTO/Engineering Lead">CTO / ENG LEAD</option>
                                        <option value="Marketing/Growth">MARKETING / GROWTH</option>
                                        <option value="Other">OTHER</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex flex-col gap-4">
                                <span className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-4">Services Needed*</span>
                                <div className="flex flex-wrap gap-2">
                                    {services.map((service) => (
                                        <button
                                            key={service}
                                            type="button"
                                            onClick={() => toggleService(service)}
                                            className={`px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300 border ${
                                                selectedServices.includes(service)
                                                ? 'bg-black text-white border-black'
                                                : 'bg-transparent text-black/40 border-black/10 hover:border-black/30'
                                            }`}
                                        >
                                            {service}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex flex-col gap-4">
                                <span className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-4">Project Stage*</span>
                                <div className="flex flex-wrap gap-2">
                                    {stages.map((stage) => (
                                        <button
                                            key={stage}
                                            type="button"
                                            onClick={() => toggleStage(stage)}
                                            className={`px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300 border ${
                                                selectedStages.includes(stage)
                                                ? 'bg-black text-white border-black'
                                                : 'bg-transparent text-black/40 border-black/10 hover:border-black/30'
                                            }`}
                                        >
                                            {stage}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="budget" className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-4">Budget Range*</label>
                                    <select 
                                        id="budget"
                                        name="budget" 
                                        required 
                                        defaultValue=""
                                        className="bg-[#F5F5F5] border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-black/5 transition-all outline-none appearance-none cursor-pointer"
                                    >
                                        <option value="" disabled>SELECT BUDGET</option>
                                        <option value="< $5k">UNDER $5,000</option>
                                        <option value="$5k - $15k">$5,000 — $15,000</option>
                                        <option value="$15k - $30k">$15,000 — $30,000</option>
                                        <option value="$30k+">$30,000+</option>
                                    </select>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="timeline" className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-4">Target Timeline*</label>
                                    <select 
                                        id="timeline"
                                        name="timeline" 
                                        required 
                                        defaultValue=""
                                        className="bg-[#F5F5F5] border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-black/5 transition-all outline-none appearance-none cursor-pointer"
                                    >
                                        <option value="" disabled>WHEN DO WE START?</option>
                                        <option value="ASAP">ASAP / URGENT</option>
                                        <option value="1-2 Months">IN 1-2 MONTHS</option>
                                        <option value="3+ Months">IN 3+ MONTHS</option>
                                        <option value="Just Exploring">JUST BROWSING</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label htmlFor="techStack" className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-4">Current/Preferred Tech Stack</label>
                                <input 
                                    type="text" 
                                    id="techStack"
                                    name="techStack" 
                                    placeholder="E.G. NEXT.JS, REACT NATIVE, SUPABASE" 
                                    className="bg-[#F5F5F5] border-none rounded-2xl px-6 py-4 text-sm font-bold placeholder:text-black/20 focus:ring-2 focus:ring-black/5 transition-all outline-none"
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label htmlFor="message" className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-4">Project Brief*</label>
                                <textarea 
                                    id="message"
                                    name="message" 
                                    rows={6} 
                                    placeholder="DESCRIBE YOUR PROJECT GOALS AND CHALLENGES..." 
                                    required 
                                    className="bg-[#F5F5F5] border-none rounded-2xl px-8 py-6 text-sm font-bold placeholder:text-black/20 focus:ring-2 focus:ring-black/5 transition-all outline-none resize-none"
                                ></textarea>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="discoverySource" className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-4">How did you find me?*</label>
                                    <select 
                                        id="discoverySource"
                                        name="discoverySource" 
                                        required 
                                        defaultValue=""
                                        className="bg-[#F5F5F5] border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-black/5 transition-all outline-none appearance-none cursor-pointer"
                                    >
                                        <option value="" disabled>SELECT SOURCE</option>
                                        <option value="LinkedIn">LINKEDIN</option>
                                        <option value="Twitter/X">TWITTER / X</option>
                                        <option value="GitHub">GITHUB</option>
                                        <option value="Referral">REFERRAL</option>
                                        <option value="Google Search">GOOGLE SEARCH</option>
                                        <option value="Other">OTHER</option>
                                    </select>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="contactMethod" className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-4">Best way to reach you?*</label>
                                    <select 
                                        id="contactMethod"
                                        name="contactMethod" 
                                        required 
                                        defaultValue=""
                                        className="bg-[#F5F5F5] border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-black/5 transition-all outline-none appearance-none cursor-pointer"
                                    >
                                        <option value="" disabled>PREFERED METHOD</option>
                                        <option value="Email">EMAIL</option>
                                        <option value="LinkedIn DM">LINKEDIN DM</option>
                                        <option value="Twitter DM">TWITTER DM</option>
                                        <option value="WhatsApp">WHATSAPP / CALL</option>
                                    </select>
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                disabled={isSubmitting || isSent}
                                className={`group flex items-center justify-center gap-4 px-12 py-6 rounded-full text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-500 ${
                                    isSent 
                                    ? 'bg-green-500 text-white' 
                                    : 'bg-black text-white hover:bg-black/80'
                                } disabled:opacity-50 h-20 w-full md:w-auto md:self-start`}
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center gap-3">
                                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        PROCESSING...
                                    </span>
                                ) : isSent ? (
                                    <span className="flex items-center gap-3">
                                        <Check size={18} />
                                        INQUIRY SENT
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-3">
                                        SEND INQUIRY
                                        <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                                    </span>
                                )}
                            </button>

                            {isError && (
                                <p className="text-red-500 text-[10px] font-black uppercase tracking-widest mt-2 animate-bounce">
                                    {errorMessage}
                                </p>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};
