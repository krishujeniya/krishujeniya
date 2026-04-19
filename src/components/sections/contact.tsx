'use client';

import React, { useState } from 'react';
import { Sparkles, ChevronRight } from 'lucide-react';

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

        // HONEYPOT: If bot fills this, we silent-success or simply ignore.
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

        // Robust Client-side Validation
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
                            {/* Honeypot: visually hidden, filled only by bots */}
                            <input 
                                type="text" 
                                name="honeypot" 
                                style={{ display: 'none' }} 
                                tabIndex={-1} 
                                autoComplete="off" 
                                aria-hidden="true" 
                            />

                            {/* Group 1: About You */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div className="flex flex-col gap-3">
                                    <label htmlFor="form-name" className="text-[10px] font-black uppercase tracking-[0.2em] text-[#999999]">Name</label>
                                    <input id="form-name" name="name" type="text" placeholder="YOUR NAME" required className="w-full bg-transparent border-0 border-b border-[#E0E0E0] py-4 text-sm font-black uppercase tracking-[0.2em] focus:ring-0 focus:border-black transition-all placeholder:text-[#999999]/30 outline-none" />
                                </div>
                                <div className="flex flex-col gap-3">
                                    <label htmlFor="form-email" className="text-[10px] font-black uppercase tracking-[0.2em] text-[#999999]">Email</label>
                                    <input id="form-email" name="email" type="email" placeholder="YOUR EMAIL" required className="w-full bg-transparent border-0 border-b border-[#E0E0E0] py-4 text-sm font-black uppercase tracking-[0.2em] focus:ring-0 focus:border-black transition-all placeholder:text-[#999999]/30 outline-none" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div className="flex flex-col gap-3">
                                    <label htmlFor="form-company" className="text-[10px] font-black uppercase tracking-[0.2em] text-[#999999]">Company / Organization</label>
                                    <input id="form-company" name="company" type="text" placeholder="COMPANY NAME" className="w-full bg-transparent border-0 border-b border-[#E0E0E0] py-4 text-sm font-black uppercase tracking-[0.2em] focus:ring-0 focus:border-black transition-all placeholder:text-[#999999]/30 outline-none" />
                                </div>
                                <div className="flex flex-col gap-3">
                                    <label htmlFor="form-role" className="text-[10px] font-black uppercase tracking-[0.2em] text-[#999999]">Your Role</label>
                                    <div className="relative">
                                        <select id="form-role" name="role" required className="w-full bg-transparent border-0 border-b border-[#E0E0E0] py-4 text-sm font-black uppercase tracking-[0.2em] focus:ring-0 focus:border-black transition-all appearance-none cursor-pointer outline-none">
                                            <option value="" disabled selected>SELECT YOUR ROLE</option>
                                            {["Founder / Co-founder", "CTO / VP Engineering", "Engineering Lead / Manager", "Product Manager", "Data / ML Team Lead", "Individual / Freelancer", "Other"].map(role => (
                                                <option key={role} value={role}>{role.toUpperCase()}</option>
                                            ))}
                                        </select>
                                        <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none">
                                            <ChevronRight size={14} className="rotate-90 text-[#999999]/50" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Group 2: Project Info */}
                            <div className="flex flex-col gap-4">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#999999]">Service Interested In</label>
                                <div className="flex flex-wrap gap-2">
                                    {["Enterprise RAG", "Agentic AI", "MLOps Architecture", "ML Consulting", "Not Sure Yet"].map(service => (
                                        <button
                                            key={service}
                                            type="button"
                                            onClick={() => toggleService(service)}
                                            className={`text-[9px] font-black uppercase tracking-[0.1em] px-4 py-2 rounded-full border transition-all ${
                                                selectedServices.includes(service)
                                                ? 'bg-black text-white border-black'
                                                : 'bg-black/5 text-[#A1A1A1] border-transparent hover:border-black/20'
                                            }`}
                                        >
                                            {service}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex flex-col gap-4">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#999999]">Project Stage</label>
                                <div className="flex flex-wrap gap-2">
                                    {["Greenfield Build", "Improve Existing System", "Proof of Concept", "Just Exploring"].map(stage => (
                                        <button
                                            key={stage}
                                            type="button"
                                            onClick={() => toggleStage(stage)}
                                            className={`text-[9px] font-black uppercase tracking-[0.1em] px-4 py-2 rounded-full border transition-all ${
                                                selectedStages.includes(stage)
                                                ? 'bg-black text-white border-black'
                                                : 'bg-black/5 text-[#A1A1A1] border-transparent hover:border-black/20'
                                            }`}
                                        >
                                            {stage}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex flex-col gap-3">
                                <label htmlFor="form-tech-stack" className="text-[10px] font-black uppercase tracking-[0.2em] text-[#999999]">Current Tech Stack</label>
                                <input id="form-tech-stack" name="techStack" type="text" placeholder="e.g. Python, AWS, Pinecone, LangChain..." className="w-full bg-transparent border-0 border-b border-[#E0E0E0] py-4 text-sm font-black uppercase tracking-[0.2em] focus:ring-0 focus:border-black transition-all placeholder:text-[#999999]/30 outline-none" />
                                <span className="text-[9px] font-medium text-[#A1A1A1] mt-1">Helps estimate integration complexity before we talk.</span>
                            </div>

                            {/* Group 3: Scope & Logistics */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div className="flex flex-col gap-3">
                                    <label htmlFor="form-budget" className="text-[10px] font-black uppercase tracking-[0.2em] text-[#999999]">Budget Range</label>
                                    <div className="relative">
                                        <select id="form-budget" name="budget" required className="w-full bg-transparent border-0 border-b border-[#E0E0E0] py-4 text-sm font-black uppercase tracking-[0.2em] focus:ring-0 focus:border-black transition-all appearance-none cursor-pointer outline-none">
                                            <option value="" disabled selected>SELECT BUDGET</option>
                                            {["Under $5,000", "$5,000–$15,000", "$15,000–$30,000", "$30,000+", "Let's Discuss"].map(budget => (
                                                <option key={budget} value={budget}>{budget.toUpperCase()}</option>
                                            ))}
                                        </select>
                                        <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none">
                                            <ChevronRight size={14} className="rotate-90 text-[#999999]/50" />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-3">
                                    <label htmlFor="form-timeline" className="text-[10px] font-black uppercase tracking-[0.2em] text-[#999999]">Desired Timeline</label>
                                    <div className="relative">
                                        <select id="form-timeline" name="timeline" required className="w-full bg-transparent border-0 border-b border-[#E0E0E0] py-4 text-sm font-black uppercase tracking-[0.2em] focus:ring-0 focus:border-black transition-all appearance-none cursor-pointer outline-none">
                                            <option value="" disabled selected>SELECT TIMELINE</option>
                                            {["ASAP (within 2 weeks)", "1–3 months", "3–6 months", "Flexible", "No hard deadline"].map(timeline => (
                                                <option key={timeline} value={timeline}>{timeline.toUpperCase()}</option>
                                            ))}
                                        </select>
                                        <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none">
                                            <ChevronRight size={14} className="rotate-90 text-[#999999]/50" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div className="flex flex-col gap-3">
                                    <label htmlFor="form-source" className="text-[10px] font-black uppercase tracking-[0.2em] text-[#999999]">How Did You Find Me</label>
                                    <div className="relative">
                                        <select id="form-source" name="discoverySource" required className="w-full bg-transparent border-0 border-b border-[#E0E0E0] py-4 text-sm font-black uppercase tracking-[0.2em] focus:ring-0 focus:border-black transition-all appearance-none cursor-pointer outline-none">
                                            <option value="" disabled selected>SELECT SOURCE</option>
                                            {["LinkedIn", "GitHub", "Google Search", "Hugging Face", "Personal Referral", "Medium", "Other"].map(source => (
                                                <option key={source} value={source}>{source.toUpperCase()}</option>
                                            ))}
                                        </select>
                                        <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none">
                                            <ChevronRight size={14} className="rotate-90 text-[#999999]/50" />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-3">
                                    <label htmlFor="form-contact-method" className="text-[10px] font-black uppercase tracking-[0.2em] text-[#999999]">Preferred Contact Method</label>
                                    <div className="relative">
                                        <select id="form-contact-method" name="contactMethod" required className="w-full bg-transparent border-0 border-b border-[#E0E0E0] py-4 text-sm font-black uppercase tracking-[0.2em] focus:ring-0 focus:border-black transition-all appearance-none cursor-pointer outline-none">
                                            <option value="" disabled selected>SELECT METHOD</option>
                                            {["Email", "Schedule a Call", "WhatsApp", "No Preference"].map(method => (
                                                <option key={method} value={method}>{method.toUpperCase()}</option>
                                            ))}
                                        </select>
                                        <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none">
                                            <ChevronRight size={14} className="rotate-90 text-[#999999]/50" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3">
                                <label htmlFor="form-message" className="text-[10px] font-black uppercase tracking-[0.2em] text-[#999999]">Project Details</label>
                                <textarea id="form-message" name="message" rows={4} placeholder="TELL ME ABOUT YOUR PROJECT" required className="w-full bg-transparent border-0 border-b border-[#E0E0E0] py-4 text-sm font-black uppercase tracking-[0.2em] focus:ring-0 focus:border-black transition-all placeholder:text-[#999999]/30 resize-none outline-none" />
                            </div>

                            {isSent ? (
                                <div className="w-full flex items-center justify-center gap-4 bg-green-500/10 text-green-500 py-8 rounded-full text-sm font-black uppercase tracking-[0.3em] border border-green-500/20 mt-8 animate-[fadeScaleIn_0.4s_ease_forwards]">
                                    Inquiry Sent! <Sparkles size={18} aria-hidden="true" />
                                </div>
                            ) : (
                                <>
                                    <button 
                                        type="submit"
                                        disabled={isSubmitting}
                                        aria-label="Send inquiry via webhook"
                                        className="w-full flex items-center justify-center gap-4 bg-black text-white py-8 rounded-full text-sm font-black uppercase tracking-[0.3em] hover:bg-black/80 hover:scale-[0.98] transition-all duration-500 mt-8 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isSubmitting ? 'Sending…' : 'SEND INQUIRY'} <ChevronRight size={18} aria-hidden="true" />
                                    </button>
                                    {isError && (
                                        <div role="alert" className="w-full flex items-center justify-center gap-3 bg-red-500/10 text-red-400 py-4 rounded-full text-[11px] font-black uppercase tracking-[0.2em] border border-red-500/20 mt-4 animate-[fadeScaleIn_0.4s_ease_forwards]">
                                            {errorMessage}
                                        </div>
                                    )}
                                </>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};
