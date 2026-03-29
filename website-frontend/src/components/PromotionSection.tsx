import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Tag } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { Promotion } from '../types';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface PromotionSectionProps {
    promotions: Promotion[];
}

const PromotionSection = ({ promotions }: PromotionSectionProps) => {
    if (!promotions || promotions.length === 0) return null;

    return (
        <section className="w-full py-20 px-6 max-w-7xl mx-auto space-y-12">
            {promotions.map((promo, index) => (
                <motion.div
                    key={promo._id || promo.id}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.2 }}
                    viewport={{ once: true }}
                    className="w-full aspect-[21/9] md:aspect-[24/7] rounded-[2.5rem] overflow-hidden relative group border border-[var(--color-border)] shadow-2xl"
                >
                    {/* Background Layer */}
                    <div className="absolute inset-0 z-0">
                        {promo.background_type === 'image' && promo.background_image ? (
                            <motion.img
                                initial={{ scale: 1.1 }}
                                whileInView={{ scale: 1 }}
                                transition={{ duration: 1.5 }}
                                src={promo.background_image}
                                alt=""
                                className="w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 transition-all duration-700"
                            />
                        ) : promo.background_type === 'video' && promo.background_video ? (
                            <video
                                src={promo.background_video}
                                className="w-full h-full object-cover opacity-60"
                                muted loop autoPlay playsInline
                            />
                        ) : (
                            <div
                                className="w-full h-full"
                                style={{
                                    background: promo.background_type === 'gradient' ?
                                        `${promo.background_gradient?.type}-gradient(${promo.background_gradient?.angle}, ${promo.background_gradient?.stops.join(', ')})` :
                                        promo.background_color,
                                    opacity: promo.background_type === 'color' ? 1 : 0.6
                                }}
                            />
                        )}
                    </div>

                    {/* Gradient Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent z-10" />

                    {/* Content Layer */}
                    <div className="relative z-20 h-full flex flex-col justify-center px-8 md:px-20 max-w-4xl">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 + (index * 0.1) }}
                            viewport={{ once: true }}
                            className="space-y-4 md:space-y-6"
                        >
                            {promo.subtitle && (
                                <span
                                    className={cn(
                                        "font-black uppercase tracking-[0.4em] block",
                                        promo.subtitle_size || "text-xs"
                                    )}
                                    style={{ fontFamily: promo.subtitle_font || 'Outfit', color: promo.subtitle_color || '#4ade80' }}
                                >
                                    {promo.subtitle}
                                </span>
                            )}
                            <h2
                                className={cn(
                                    "font-black leading-[0.9] uppercase drop-shadow-2xl",
                                    promo.title_size === '6xl' ? 'text-4xl md:text-7xl' : (promo.title_size || 'text-4xl md:text-7xl')
                                )}
                                style={{ fontFamily: promo.title_font || 'Playfair Display', color: promo.title_color || '#ffffff' }}
                            >
                                {promo.title}
                            </h2>
                            {promo.description && (
                                <p className="text-sm md:text-lg text-[var(--color-text)]/80 font-light max-w-md line-clamp-2 md:line-clamp-none">
                                    {promo.description}
                                </p>
                            )}
                            <div className="pt-4 flex items-center gap-4">
                                <Link
                                    to={promo.ctaLink}
                                    className="inline-flex items-center gap-3 px-8 md:px-10 py-3 md:py-4 bg-white text-black rounded-full font-black uppercase tracking-widest text-[10px] md:text-xs hover:bg-primary-500 hover:text-[var(--color-text)] transition-all shadow-xl hover:scale-105 active:scale-95"
                                >
                                    {promo.ctaText} <ArrowRight size={16} />
                                </Link>
                                {promo.coupon_code && (
                                    <div className="hidden md:flex px-6 py-3 bg-[var(--color-panel)] backdrop-blur-xl rounded-full border border-[var(--color-border)] text-[10px] font-black text-[var(--color-text)] uppercase tracking-widest animate-pulse">
                                        Use Code: {promo.coupon_code}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>

                    {/* Corner Tag Polish */}
                    <div className="absolute top-10 right-10 z-20 hidden md:block opacity-20 group-hover:opacity-40 transition-opacity duration-700">
                        <Tag size={120} className="text-[var(--color-text)] -rotate-12 transition-transform duration-700 group-hover:rotate-0" />
                    </div>
                </motion.div>
            ))}
        </section>
    );
};

export default PromotionSection;
