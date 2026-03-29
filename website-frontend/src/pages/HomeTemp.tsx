import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Volume2, VolumeX, Sprout, Sun, Droplet, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function HomeTemp() {
    // Media States
    const [isVideoMuted, setIsVideoMuted] = useState(true);
    const heroVideoRef = useRef<HTMLVideoElement>(null);
    const philosophyVideoRef = useRef<HTMLVideoElement>(null);
    
    const toggleAudio = () => {
        if (heroVideoRef.current) {
            heroVideoRef.current.muted = !heroVideoRef.current.muted;
            setIsVideoMuted(heroVideoRef.current.muted);
        }
    };

    const handlePhilosophyVideoHover = (isHovering: boolean) => {
        if (philosophyVideoRef.current) {
            philosophyVideoRef.current.muted = !isHovering;
        }
    };

    // Animation Variants
    const fadeUpVariant: any = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
    };
    const staggerVariants: any = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2, delayChildren: 0.3 }
        }
    };
    const flyInLeftVariant: any = {
        hidden: { opacity: 0, x: -100 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } }
    };
    const flyInRightVariant: any = {
        hidden: { opacity: 0, x: 100 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } }
    };
    const scaleVariant: any = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: "easeOut" } }
    };

    return (
        <div 
            className="bg-[var(--color-bg)] text-[var(--color-text)] overflow-x-hidden"
            style={{
                '--color-primary': '#60693A',      // Green Leaves
                '--color-secondary': '#C46428',    // Tangerine
                '--color-accent': '#5167A2',       // Morning Glory
                '--color-bg': '#ffffff',           // White
                '--color-background': '#ffffff',
                '--color-surface': '#f8f6f0',      // Very light Creamy Sugar
                '--color-text': '#2E3118',         // Dark Green
                '--color-text-dim': '#4b5028',
                '--color-border': 'color-mix(in srgb, #2E3118 15%, transparent)',
                '--color-panel': 'color-mix(in srgb, #2E3118 5%, transparent)',
            } as React.CSSProperties}
        >
            <Header />

            {/* Main Hero */}
            <section className="relative min-h-[100svh] overflow-hidden flex items-center justify-center pt-20">
                {/* Background Video using user uploaded video5.mp4 */}
                <video
                    ref={heroVideoRef}
                    autoPlay
                    muted={isVideoMuted}
                    loop
                    playsInline
                    className="absolute top-0 left-0 w-full h-full object-cover z-0"
                    poster="/assets/bg-village.png"
                    style={{ filter: 'brightness(0.7) contrast(1.1) sepia(0.1)' }}
                >
                    <source src="/assets/video5.mp4" type="video/mp4" />
                </video>
                <div 
                    className="absolute top-0 left-0 w-full h-full z-0" 
                    style={{ background: 'linear-gradient(to bottom, rgba(0,0,0, 0.4) 0%, var(--color-bg) 100%)', opacity: 0.8 }} 
                />
                
                {/* Flying Birds Animation Background */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none opacity-60">
                    {[...Array(5)].map((_, i) => (
                        <motion.div
                            key={i}
                            initial={{ x: '-10%', y: `${20 + i * 15}%` }}
                            animate={{ x: '110%', y: `${10 + i * 10}%` }}
                            transition={{
                                duration: 15 + i * 5,
                                repeat: Infinity,
                                ease: "linear",
                                delay: i * 2,
                            }}
                            className="absolute text-[var(--color-text)]"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2.87277 13.9114C4.30159 13.0645 6.00936 12.5 7.82843 12.5C9.64749 12.5 11.3553 13.0645 12.7841 13.9114C14.2129 13.0645 15.9207 12.5 17.7398 12.5C19.5588 12.5 21.2666 13.0645 22.6954 13.9114" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    className="relative z-10 text-center px-4"
                    initial="hidden"
                    animate="visible"
                    variants={staggerVariants}
                >
                    <motion.div variants={fadeUpVariant} className="relative inline-block mb-10">
                        {/* Sweeping Leaf Animation Wrapper */}
                        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-visible">
                            <motion.div 
                                animate={{ rotate: [0, 10, 0], x: [0, 20, 0] }} 
                                transition={{ repeat: Infinity, duration: 3 }}
                                className="w-10 h-10 text-[var(--color-primary)] opacity-80"
                            >
                                <svg viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z" />
                                </svg>
                            </motion.div>
                        </div>

                        <h2 className="font-serif text-5xl md:text-7xl lg:text-[5rem] font-black uppercase tracking-[6px] mb-3 drop-shadow-2xl text-[var(--color-primary)]">
                            VIDEEPTHA FOODS
                        </h2>
                        <div className="text-xl md:text-2xl text-[var(--color-text)] tracking-[2px] uppercase opacity-90 drop-shadow-md whitespace-nowrap font-medium">
                            svastam prakrtham - snehitam
                        </div>
                    </motion.div>

                    <motion.p variants={fadeUpVariant} className="text-xl md:text-2xl max-w-[850px] mx-auto mb-12 leading-relaxed font-medium text-[var(--color-text)] drop-shadow-md">
                        Grow stronger - live healthier.<br />
                        We do bring you a powerhouse in small packets for a better today tomorrow...
                    </motion.p>

                    <motion.div variants={fadeUpVariant} className="flex gap-4 justify-center items-center flex-wrap">
                        <Link to="/products">
                            <motion.div 
                                whileHover={{ scale: 1.05, x: 10 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-8 py-4 bg-[var(--color-primary)] text-[var(--color-bg)] rounded-full font-bold tracking-widest uppercase text-sm shadow-xl"
                            >
                                The Taste of Truth
                            </motion.div>
                        </Link>
                    </motion.div>
                </motion.div>

                {/* Floating Mute/Unmute Icon for Hero Video */}
                <button
                    onClick={toggleAudio}
                    className="absolute bottom-10 right-10 z-50 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-full w-14 h-14 flex items-center justify-center cursor-pointer shadow-2xl text-[var(--color-text)] backdrop-blur-md hover:bg-[var(--color-panel)] transition-colors"
                    aria-label={isVideoMuted ? 'Unmute Video' : 'Mute Video'}
                >
                    {isVideoMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                </button>
            </section>

            {/* Philosophy Section */}
            <section id="philosophy" className="py-24 px-6 bg-[var(--color-surface)]">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={flyInLeftVariant}
                    >
                        <h3 className="text-[var(--color-primary)] uppercase tracking-widest font-black mb-4">Our Promise</h3>
                        <h2 className="font-serif text-4xl md:text-5xl font-black mb-8 text-[var(--color-text)]">Food Made With <span className="text-[var(--color-secondary)]">Love & Purity</span></h2>
                        
                        <p className="text-lg text-[var(--color-text)]/80 leading-relaxed mb-6">
                            Ancient Indian culture views food (Anna) not just as physical fuel, but as a divine manifestation (Brahman) directly linked to the health of the body, mind, and the spirit. The lifestyle was based on Sattva (purity), moderation, and living in harmony with nature.
                        </p>
                        
                        <p className="text-lg text-[var(--color-text)]/80 leading-relaxed">
                            At Videeptha , we look backwards to move forward. Our approach is grounded in Ayurvedic principles and ancient village wisdom. We meticulously research every raw material, working directly with soil-conscious farmers, and have worked meticulously on each and every recipe to bring better health and authentic taste to you and your family.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1 }}
                        className="bg-white rounded-[2rem] border border-[var(--color-border)] shadow-xl overflow-hidden"
                    >
                        <div className="p-8 pb-6">
                            <h3 className="font-serif text-center text-[var(--color-primary)] text-2xl mb-4 leading-relaxed font-bold">
                                अन्नं ब्रह्म रसो विष्णुः, भोक्ता देवो महेश्वरः।<br />
                                एवम् ज्ञात्वा तु यो भुङ्क्ते, अन्नदोषो न लिप्यते॥
                            </h3>
                            <p className="text-center italic mb-4 text-[var(--color-text)]/70">
                                "Food is Brahma, its taste is Vishnu, and the consumer is Shiva. Knowing this, the one who eats is not tainted by any impurities of the food."
                            </p>
                            <div className="w-12 h-[2px] bg-[var(--color-secondary)] mx-auto mb-4"></div>
                            <p className="text-center text-sm font-bold text-[var(--color-primary)] uppercase tracking-widest">— Bhojan Mantra (Common Mealtime Prayer)</p>
                        </div>
                        {/* Video 4 (Chanting/Mantra) - Muted by default, unmuting on hover */}
                        <div className="w-full border-t-2 border-[var(--color-border)]">
                            <video
                                ref={philosophyVideoRef}
                                autoPlay
                                loop
                                muted
                                playsInline
                                controls
                                onMouseEnter={() => handlePhilosophyVideoHover(true)}
                                onMouseLeave={() => handlePhilosophyVideoHover(false)}
                                className="w-full h-auto block max-h-[400px] object-cover"
                            >
                                <source src="/assets/video4.mp4" type="video/mp4" />
                            </video>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* About Us Section */}
            <section id="about-us" className="py-24 px-6 bg-white text-[var(--color-text)]">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={staggerVariants}
                        className="flex flex-col gap-10 text-center"
                    >
                        <motion.div variants={fadeUpVariant}>
                            <h2 className="text-5xl md:text-6xl text-[var(--color-primary)] mb-8 font-serif font-black">About Us</h2>

                            <p className="text-2xl text-[var(--color-text)]/90 leading-relaxed mb-6">
                                We, <strong className="text-[var(--color-secondary)] text-3xl font-black">Vidya – Pradeep</strong>, want to bring a unique blend of foods & a small healthy revolution in every kitchen.
                            </p>

                            <p className="text-2xl md:text-3xl text-[var(--color-secondary)] italic font-bold mb-12">
                                "Finding tasty & healthy food isn’t harder anymore."
                            </p>

                            <div className="bg-[#FFFFFF] p-10 md:p-14 rounded-[2.5rem] shadow-2xl border border-[var(--color-border)]">
                                <h3 className="text-4xl text-[#3b2416] mb-6 font-serif font-black">Food!!!!!</h3>
                                <p className="text-xl md:text-2xl text-[#1a1a1a]/80 leading-relaxed mb-8">
                                    A beautiful unsaid, unspoken, unsung expression.<br />
                                    But valued, celebrated, cherished, loved – enjoyed emotion.<br />
                                    My karma questioned me to a journey of finding the essence of my life.<br />
                                    And service is the only thing I can do to satisfy my soul.<br />
                                    And food is one such positive karma towards society.
                                </p>

                                <p className="text-2xl font-bold text-[var(--color-primary)] italic mb-6">
                                    "Fasten, speed up, get indulged in love of real food."
                                </p>

                                <p className="text-xl font-bold text-[var(--color-primary)] uppercase tracking-widest">— Love Vidya</p>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Sanskrit Quote Break */}
            <section className="py-32 px-6 bg-[var(--color-primary)] text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10" />
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={staggerVariants}
                    className="max-w-4xl mx-auto relative z-10"
                >
                    <motion.div variants={scaleVariant} className="text-4xl md:text-5xl mb-6 text-[var(--color-bg)] font-serif font-bold">
                        अहं वैश्वानरो भूत्वा प्राणिनां देहमाश्रितः।
                    </motion.div>
                    <motion.div variants={scaleVariant} className="text-xl md:text-2xl text-[var(--color-bg)]/80 italic font-medium">
                        "The Divine digests food in four ways within living beings." <br /> — Bhagavad Gita (15.14)
                    </motion.div>
                    <motion.p variants={flyInRightVariant} className="mt-10 text-lg md:text-xl text-[var(--color-bg)]/90 max-w-2xl mx-auto leading-relaxed">
                        Ancient Indian medicine emphasizes that the body is nourished by the "fire" of digestion. At Videeptha Foods, we honor this fire by preparing foods that are easy to digest, unpolished, and naturally potent.
                    </motion.p>
                </motion.div>
            </section>

            {/* Our Nature - Scrolling Grid / Marquee fallback */}
            <section id="our-nature" className="py-24 bg-[var(--color-surface)] overflow-hidden">
                <motion.h2
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeUpVariant}
                    className="text-[var(--color-text)] text-4xl md:text-5xl font-black mb-16 text-center font-serif"
                >
                    Our Nature
                </motion.h2>

                <div className="relative z-10 w-full overflow-hidden">
                    <motion.div 
                        animate={{ x: [0, -1000] }} 
                        transition={{ repeat: Infinity, ease: "linear", duration: 10 }}
                        className="flex gap-6 px-6 w-max"
                    >
                        {/* Repeat items for endless scroll */}
                        {[1, 2, 3].map((set) => (
                            <React.Fragment key={set}>
                                <div className="w-[320px] bg-white border border-[var(--color-border)] p-8 rounded-3xl shrink-0 hover:border-[var(--color-primary)] transition-colors shadow-sm hover:shadow-md">
                                    <Sprout size={48} className="text-[var(--color-accent)] mb-6" />
                                    <h3 className="text-2xl font-black mb-4 text-[var(--color-text)]">Unpolished Grains</h3>
                                    <p className="text-[var(--color-text-dim)] leading-relaxed">Polishing strips away vital nutrients. Our millets retain their bran layer, providing maximum dietary fiber and slow-release energy.</p>
                                </div>
                                <div className="w-[320px] bg-white border border-[var(--color-border)] p-8 rounded-3xl shrink-0 hover:border-[var(--color-secondary)] transition-colors shadow-sm hover:shadow-md">
                                    <Sun size={48} className="text-[var(--color-secondary)] mb-6" />
                                    <h3 className="text-2xl font-black mb-4 text-[var(--color-text)]">Zero Refined Sugar</h3>
                                    <p className="text-[var(--color-text-dim)] leading-relaxed">We believe sweetness should come from nature, not factories. We use only pure, unrefined jaggery and raw honey.</p>
                                </div>
                                <div className="w-[320px] bg-white border border-[var(--color-border)] p-8 rounded-3xl shrink-0 hover:border-[var(--color-primary)] transition-colors shadow-sm hover:shadow-md">
                                    <ShieldCheck size={48} className="text-[var(--color-primary)] mb-6" />
                                    <h3 className="text-2xl font-black mb-4 text-[var(--color-text)]">Direct Sourcing</h3>
                                    <p className="text-[var(--color-text-dim)] leading-relaxed">We trace every ingredient back to the earth. By working directly with village farmers, we ensure fair trade and untampered crop quality.</p>
                                </div>
                                <div className="w-[320px] bg-white border border-[var(--color-border)] p-8 rounded-3xl shrink-0 hover:border-[var(--color-accent)] transition-colors shadow-sm hover:shadow-md">
                                    <Droplet size={48} className="text-[var(--color-accent)] mb-6" />
                                    <h3 className="text-2xl font-black mb-4 text-[var(--color-text)]">Honest Processing</h3>
                                    <p className="text-[var(--color-text-dim)] leading-relaxed">From wooden-churned (Chekku) cold-pressed oils to stone-ground flours, we preserve delicate antioxidants heat would destroy.</p>
                                </div>
                                <div className="w-[320px] bg-white border border-[var(--color-border)] p-8 rounded-3xl shrink-0 hover:border-[var(--color-primary)] transition-colors shadow-sm hover:shadow-md">
                                    <Leaf size={48} className="text-[var(--color-primary)] mb-6" />
                                    <h3 className="text-2xl font-black mb-4 text-[var(--color-text)]">Sattvic Mindset</h3>
                                    <p className="text-[var(--color-text-dim)] leading-relaxed">Food is spiritual fuel. Every recipe is meticulously tested to ensure it brings balance, health, and clean energy to your family.</p>
                                </div>
                            </React.Fragment>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Explore All Products Banner */}
            <section className="bg-[var(--color-bg)] overflow-hidden border-t border-[var(--color-border)]">
                <div className="grid grid-cols-1 md:grid-cols-2 relative z-10 w-full min-h-[400px]">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative w-full h-64 md:h-full block overflow-hidden"
                    >
                        <img
                            src="/assets/background.png"
                            alt="Videeptha Foods Products Range"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-transparent to-[var(--color-bg)]/80 pointer-events-none" />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="p-12 md:p-20 flex flex-col justify-center border-l-0 md:border-l border-[var(--color-border)] z-10 bg-[var(--color-bg)]"
                    >
                        <h3 className="text-4xl md:text-5xl font-serif font-black text-[var(--color-primary)] mb-6 leading-tight">Discover Our Entire Range</h3>
                        <p className="text-[var(--color-text)]/80 text-xl font-medium mb-10 leading-relaxed">Explore over 600+ authentic, untouched products from the heart of our villages.</p>
                        <Link to="/products">
                            <motion.div 
                                whileHover={{ scale: 1.05, x: 15 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-8 py-4 bg-[var(--color-secondary)] text-[var(--color-bg)] rounded-full font-black uppercase tracking-widest text-sm flex items-center justify-center self-start shadow-xl w-max"
                            >
                                WAY TO YOUR GRANDMA KITCHEN
                            </motion.div>
                        </Link>
                    </motion.div>
                </div>
            </section>
            
            <Footer />
        </div>
    );
}
