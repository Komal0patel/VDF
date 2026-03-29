import React, { useState } from 'react';
import { Mail, Phone, Leaf } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const Footer: React.FC = () => {
    const { theme } = useTheme();
    
    // Default values if DB is not populated
    const defaultContact = {
        phones: [
            { label: "Vidyashree R (Call/Enquiry)", number: "+91 63610 87282" },
            { label: "PV Pradeep", number: "+91 90100 56902" }
        ],
        email: "videepthafoods1602@gmail.com",
        whatsapp_group: "https://chat.whatsapp.com/BiR3OzOymP9Lg5YnNEZrCR?mode=gi_t"
    };

    const contact = theme?.footer?.footer_contact && Object.keys(theme.footer.footer_contact).length > 0 
        ? theme.footer.footer_contact 
        : defaultContact;

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        message: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const { name, phone, email, message } = formData;
        const subject = encodeURIComponent(`New Enquiry from ${name}`);
        const body = encodeURIComponent(`Name: ${name}\nPhone: ${phone}\nEmail: ${email}\n\nMessage:\n${message}`);
        window.location.href = `mailto:${contact.email || defaultContact.email}?subject=${subject}&body=${body}`;
        setFormData({ name: '', phone: '', email: '', message: '' });
    };

    return (
        <footer id="contact" className="relative bg-[var(--color-primary)] py-20 px-6 border-t border-[var(--color-border)] overflow-hidden">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--color-accent)]/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 relative z-10">
                {/* Contact Info */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                >
                    <div className="flex items-center gap-3 mb-8">
                        <Leaf className="text-[var(--color-secondary)]" size={32} />
                        <h2 className="text-4xl md:text-5xl font-serif font-black text-white italic">Contact Us</h2>
                    </div>
                    
                    <div className="w-16 h-1 bg-[var(--color-accent)] mb-8" />
                    
                    <p className="text-slate-400 text-lg leading-relaxed mb-12 max-w-md">
                        Have questions about our ancient food processes, bulk orders, or sourcing? We'd love to hear from you.
                    </p>

                    <div className="space-y-8">
                        {(contact.phones || defaultContact.phones).map((p: any, idx: number) => (
                            <a key={idx} href={`tel:${p.number.replace(/\s+/g, '')}`} className="flex items-center gap-4 group">
                                <div className="bg-white/5 p-4 rounded-2xl group-hover:bg-[var(--color-secondary)]/20 transition-all duration-300">
                                    <Phone size={24} className="text-[var(--color-secondary)]" />
                                </div>
                                <div>
                                    <p className="text-[10px] text-white/50 uppercase tracking-widest mb-1">{p.label}</p>
                                    <p className="text-lg text-white font-bold group-hover:text-[var(--color-secondary)] transition-colors">{p.number}</p>
                                </div>
                            </a>
                        ))}

                        <a href={`mailto:${contact.email || defaultContact.email}`} className="flex items-center gap-4 group">
                            <div className="bg-white/5 p-4 rounded-2xl group-hover:bg-[var(--color-secondary)]/20 transition-all duration-300">
                                <Mail size={24} className="text-[var(--color-secondary)]" />
                            </div>
                            <div>
                                <p className="text-[10px] text-white/50 uppercase tracking-widest mb-1">Email</p>
                                <p className="text-lg text-white font-bold group-hover:text-[var(--color-secondary)] transition-colors">{contact.email || defaultContact.email}</p>
                            </div>
                        </a>

                        {(contact.whatsapp_group || defaultContact.whatsapp_group) && (
                            <a href={contact.whatsapp_group || defaultContact.whatsapp_group} target="_blank" rel="noreferrer" className="flex items-center gap-4 group">
                                <div className="bg-[#25D366]/10 p-4 rounded-2xl group-hover:bg-[#25D366]/20 transition-all duration-300">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="#25D366" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.94 3.659 1.437 5.634 1.437h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">WhatsApp Group</p>
                                    <p className="text-lg text-white font-bold group-hover:text-[#25D366] transition-colors">Join our Community</p>
                                </div>
                            </a>
                        )}
                    </div>
                </motion.div>

                {/* Enquiry Form */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-[2.5rem] shadow-2xl"
                >
                    <h3 className="text-2xl font-serif font-bold text-white mb-8">Send an Enquiry</h3>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-[var(--color-secondary)]">Your Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Ancient Soul"
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-[var(--color-secondary)] outline-none transition-all placeholder:text-white/20"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[var(--color-secondary)]">Phone Number</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="+91 00000 00000"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-[var(--color-secondary)] outline-none transition-all placeholder:text-white/20"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[var(--color-secondary)]">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="you@nature.com"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-[var(--color-secondary)] outline-none transition-all placeholder:text-white/20"
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-[var(--color-secondary)]">Your Message</label>
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                placeholder="How can we help you embrace purity?"
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-[var(--color-secondary)] outline-none transition-all placeholder:text-white/20 min-h-[150px]"
                                required
                            />
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            className="w-full bg-[var(--color-secondary)] text-white font-black uppercase tracking-widest py-5 rounded-2xl shadow-xl hover:brightness-110 transition-all border border-white/10"
                        >
                            Send Message
                        </motion.button>
                    </form>
                </motion.div>
            </div>

            {/* Bottom Credits */}
            <div className="max-w-7xl mx-auto mt-24 pt-12 border-t border-white/10 flex flex-col md:row items-center justify-center sm:justify-between gap-6 text-white/50 text-[10px] font-bold uppercase tracking-[0.2em]">
                <p>© 2026 {theme?.branding?.name || 'Videeptha Foods'}. Rooted in Nature.</p>
                <div className="flex gap-8">
                    <a href="/policies" className="hover:text-[var(--color-accent)] transition-colors">Privacy</a>
                    <a href="/policies" className="hover:text-[var(--color-accent)] transition-colors">Terms</a>
                    <a href="/policies" className="hover:text-[var(--color-accent)] transition-colors">Shipping</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
