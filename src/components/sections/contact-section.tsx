'use client';

import type { FC } from 'react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Send,
    Github,
    Linkedin,
    Youtube,
    Twitter,
    Mail,
    Check,
} from 'lucide-react';
import Link from 'next/link';
import Script from 'next/script';
import { AnimatedSection } from '@/components/ui/animated-section';

const socialLinks = [
    { name: 'YouTube', icon: Youtube, url: 'https://www.youtube.com/@ai-drago' },
    { name: 'X (Twitter)', icon: Twitter, url: 'https://twitter.com/krishujeniya' },
    { name: 'Telegram', icon: Send, url: 'https://t.me/krishujeniya' },
    { name: 'LinkedIn', icon: Linkedin, url: 'https://www.linkedin.com/in/krishujeniya' },
    { name: 'GitHub', icon: Github, url: 'https://github.com/krishujeniya' },
];

export const ContactSection: FC = () => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [focusedField, setFocusedField] = useState<string | null>(null);
    const [formSent, setFormSent] = useState(false);

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) return;
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) return;

        const subject = encodeURIComponent(`Portfolio Inquiry from ${formData.name}`);
        const body = encodeURIComponent(
            `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
        );
        const mailtoLink = `mailto:ukideashare0021@gmail.com?subject=${subject}&body=${body}`;

        window.location.href = mailtoLink;
        setFormSent(true);
        setFormData({ name: '', email: '', message: '' });

        // Reset success state after 3s
        setTimeout(() => setFormSent(false), 3000);
    };

    const isFieldActive = (field: string) =>
        focusedField === field || formData[field as keyof typeof formData].length > 0;

    return (
        <>
            <AnimatedSection id="contact" className="container mx-auto px-4">
                <h2 className="section-title">
                    <span className="section-title-accent">/</span> Let&apos;s Connect
                </h2>
                <p className="section-subtitle">
                    Have a project in mind? Let&apos;s build something remarkable together.
                </p>

                <div className="contact-layout">
                    {/* Contact Form */}
                    <motion.form
                        className="contact-form"
                        onSubmit={handleFormSubmit}
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    >
                        {/* Name field */}
                        <div className={`form-field ${isFieldActive('name') ? 'active' : ''}`}>
                            <label htmlFor="contact-name" className="form-label">
                                Your Name
                            </label>
                            <input
                                id="contact-name"
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                onFocus={() => setFocusedField('name')}
                                onBlur={() => setFocusedField(null)}
                                className="form-input"
                                required
                            />
                            <div className="form-field-border" />
                        </div>

                        {/* Email field */}
                        <div className={`form-field ${isFieldActive('email') ? 'active' : ''}`}>
                            <label htmlFor="contact-email" className="form-label">
                                Your Email
                            </label>
                            <input
                                id="contact-email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                onFocus={() => setFocusedField('email')}
                                onBlur={() => setFocusedField(null)}
                                className="form-input"
                                required
                            />
                            <div className="form-field-border" />
                        </div>

                        {/* Message field */}
                        <div className={`form-field ${isFieldActive('message') ? 'active' : ''}`}>
                            <label htmlFor="contact-message" className="form-label">
                                Tell me about your project
                            </label>
                            <textarea
                                id="contact-message"
                                rows={4}
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                onFocus={() => setFocusedField('message')}
                                onBlur={() => setFocusedField(null)}
                                className="form-input form-textarea"
                                required
                            />
                            <div className="form-field-border" />
                        </div>

                        <button
                            type="submit"
                            className={`btn-primary magnetic-btn form-submit-btn ${formSent ? 'form-submit-success' : ''}`}
                            disabled={formSent}
                        >
                            {formSent ? (
                                <>
                                    <Check className="w-4 h-4" />
                                    <span>Email Client Opened!</span>
                                </>
                            ) : (
                                <>
                                    <span>Send Message</span>
                                    <Send className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </motion.form>

                    {/* Info side */}
                    <motion.div
                        className="contact-info"
                        initial={{ opacity: 0, x: 40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <div className="contact-info-block">
                            <h3 className="contact-info-title">Get in Touch</h3>
                            <p className="contact-info-text">
                                Ready to discuss your AI project or need an MLOps consultation?
                                Reach out via email or connect on social media.
                            </p>
                            <Link
                                href="mailto:ukideashare0021@gmail.com"
                                className="contact-email-link"
                            >
                                <Mail className="w-5 h-5" />
                                <span>ukideashare0021@gmail.com</span>
                            </Link>
                        </div>

                        {/* Contra Hire Me Button */}
                        <div className="contra-button-wrapper" style={{ marginTop: '1.5rem' }}>
                            <div
                                className="contra-hire-me-button"
                                data-analyticsuserid="6a3d79a0-be8d-49aa-af6b-9f647644d9ed"
                                data-theme="dark"
                                data-username="krishujeniya"
                            />
                            <Script
                                src="https://contra.com/static/embed/sdk.js"
                                strategy="lazyOnload"
                            />
                        </div>

                        <div className="contact-socials">
                            <p className="contact-socials-label">Find me on</p>
                            <div className="contact-socials-grid">
                                {socialLinks.map((link) => (
                                    <Link
                                        key={link.name}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={link.name}
                                        className="social-icon-btn magnetic-btn"
                                    >
                                        <link.icon className="w-5 h-5" />
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Footer */}
                <div className="footer-bar">
                    <p className="footer-text">
                        Proudly building open-source AI tools since 2022.
                    </p>
                    <p className="footer-copyright" suppressHydrationWarning>
                        © {new Date().getFullYear()} Krish Ujeniya. All Rights Reserved.
                    </p>
                </div>
            </AnimatedSection>
        </>
    );
};
