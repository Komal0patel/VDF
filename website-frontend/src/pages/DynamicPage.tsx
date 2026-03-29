import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Leaf, ArrowLeft, X, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import Header from '../components/Header';
import SectionRenderer from '../components/SectionRenderer';
import type { Page, Story } from '../types';
import { API_URL } from '../config';

const styles = {
    page: {
        minHeight: '100vh',
        backgroundColor: '#0a0d08',
        color: '#f1f5f9',
        fontFamily: "'Outfit', sans-serif",
    },
    container: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 24px',
    },
    title: {
        fontSize: 'clamp(32px, 5vw, 56px)',
        fontWeight: 900,
        marginBottom: '60px',
        letterSpacing: '-0.03em',
        color: '#ffffff',
        textAlign: 'center' as const,
        fontFamily: "'Playfair Display', serif",
    },
    storyGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '48px',
        marginBottom: '100px',
    },
    storyCard: {
        background: 'rgba(255, 255, 255, 0.02)',
        backdropFilter: 'blur(10px)',
        borderRadius: '24px',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.5s cubic-bezier(0.23, 1, 0.32, 1)',
        position: 'relative' as const,
        display: 'flex',
        flexDirection: 'column' as const,
        outline: 'none',
    },
    cardImageContainer: {
        width: '100%',
        aspectRatio: '16/10',
        overflow: 'hidden',
        position: 'relative' as const,
    },
    cardImage: {
        width: '100%',
        height: '100%',
        objectFit: 'cover' as const,
        transition: 'transform 1.2s cubic-bezier(0.23, 1, 0.32, 1)',
    },
    cardContent: {
        padding: '32px',
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column' as const,
    },
    cardTitle: {
        fontSize: '24px',
        fontWeight: 800,
        color: '#ffffff',
        marginBottom: '16px',
        lineHeight: 1.3,
        fontFamily: "'Playfair Display', serif",
    },
    cardExcerpt: {
        fontSize: '16px',
        color: '#94a3b8',
        lineHeight: 1.7,
        marginBottom: '28px',
        display: '-webkit-box',
        WebkitLineClamp: 3,
        WebkitBoxOrient: 'vertical' as const,
        overflow: 'hidden',
        flexGrow: 1,
    },
    detailOverlay: {
        position: 'fixed' as const,
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: '#0a0d08',
        zIndex: 1000,
        overflowY: 'auto' as const,
    },
    detailHero: {
        width: '100%',
        height: '80vh',
        position: 'relative' as const,
        overflow: 'hidden',
    },
    detailHeroImage: {
        width: '100%',
        height: '100%',
        objectFit: 'cover' as const,
    },
    detailHeroOverlay: {
        position: 'absolute' as const,
        inset: 0,
        background: 'linear-gradient(to top, #0a0d08 0%, rgba(10, 13, 8, 0.4) 50%, transparent 100%)',
        display: 'flex',
        alignItems: 'flex-end',
        padding: '80px 24px',
    },
    detailCloseBtn: {
        position: 'fixed' as const,
        top: '32px',
        right: '32px',
        padding: '12px 24px',
        borderRadius: '100px',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        color: '#ffffff',
        cursor: 'pointer',
        zIndex: 1100,
        fontWeight: 700,
        fontSize: '14px',
        textTransform: 'uppercase' as const,
        letterSpacing: '1px',
        transition: 'all 0.3s ease',
    }
};

export default function DynamicPage() {
    const { slug } = useParams();
    const [page, setPage] = useState<Page | null>(null);
    const [stories, setStories] = useState<Story[]>([]);
    const [selectedStory, setSelectedStory] = useState<Story | null>(null);
    const [loading, setLoading] = useState(true);

    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const scale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);
    const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);

    const isStoryPage = slug?.toLowerCase().trim() === 'story' || slug?.toLowerCase().trim() === 'our-village-story';

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [pagesRes, storyRes] = await Promise.all([
                    fetch(`${API_URL}/pages/`),
                    fetch(`${API_URL}/stories/`)
                ]);
                const pagesData = await pagesRes.json();
                const storiesData = await storyRes.json();

                const normalizedSlug = slug?.toLowerCase().trim();
                const foundPage = pagesData.find((p: Page) => p.slug?.toLowerCase().trim() === normalizedSlug);

                setPage(foundPage || null);
                setStories(storiesData.filter((s: Story) => s.is_active));
                setLoading(false);
            } catch (err) {
                console.error('Fetch error:', err);
                setLoading(false);
            }
        };
        fetchData();
    }, [slug]);

    useEffect(() => {
        if (selectedStory) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }, [selectedStory]);

    if (loading) {
        return (
            <div style={{ ...styles.page, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
                    <Leaf color="var(--color-primary)" size={64} />
                </motion.div>
            </div>
        );
    }

    if (!page) {
        return (
            <div style={{ ...styles.page, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '48px', fontWeight: 900, marginBottom: '24px' }}>Harvest Not Found</h1>
                    <Link to="/" style={{ color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 800 }}>Return to Kitchen</Link>
                </div>
            </div>
        );
    }

    return (
        <div ref={containerRef} style={{ ...styles.page, position: 'relative', overflow: 'hidden' }}>
            {/* Fixed Background with Parallax - Only for Story Page */}
            {isStoryPage && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden', pointerEvents: 'none' }}>
                    <motion.div style={{ scale, y: yBg, width: '100%', height: '100%' }}>
                        <div style={{ position: 'absolute', inset: 0, background: 'rgba(10, 13, 8, 0.85)', zIndex: 10 }} />
                        <img
                            src="/assets/stories-bg.jpg"
                            alt="Videeptha Foods"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(e) => e.currentTarget.src = 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=2670&auto=format&fit=crop'}
                        />
                    </motion.div>
                </div>
            )}

            <Header />

            <div style={{ paddingTop: '160px', position: 'relative', zIndex: 10 }}>
                {/* Dynamic Sections */}
                <div className="flex flex-col">
                    {page.sections.map((section: import('../types').Section) => (
                        <SectionRenderer key={section.id} section={section} />
                    ))}
                </div>

                {/* Our Story Logic (If applicable based on slug) */}
                {isStoryPage && (
                    <div style={styles.container}>
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            style={styles.title}
                        >
                            {page.name || "Our Village Stories"}
                        </motion.h1>

                        <div style={styles.storyGrid}>
                            {stories.map((story, idx) => (
                                <motion.div
                                    key={story._id}
                                    style={styles.storyCard}
                                    whileHover={{ y: -10, boxShadow: '0 30px 60px rgba(0,0,0,0.4)', borderColor: 'rgba(92, 141, 55, 0.3)' }}
                                    onClick={() => setSelectedStory(story)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            e.preventDefault();
                                            setSelectedStory(story);
                                        }
                                    }}
                                    className="story-card"
                                >
                                    <div style={styles.cardImageContainer}>
                                        <img
                                            src={story.thumbnailImage}
                                            alt={story.title}
                                            style={styles.cardImage}
                                            className="hover-zoom"
                                            loading="lazy"
                                        />
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0, rotate: -180 }}
                                            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                                            transition={{ delay: idx * 0.1, type: "spring", bounce: 0.5 }}
                                            style={{
                                                position: 'absolute', top: '24px', left: '24px',
                                                background: 'rgba(92, 141, 55, 0.9)',
                                                backdropFilter: 'blur(4px)',
                                                color: 'white', padding: '6px 16px',
                                                borderRadius: '50px', fontSize: '11px', fontWeight: 900,
                                                letterSpacing: '1.5px', textTransform: 'uppercase',
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                                            }}
                                        >
                                            VILLAGE STORY
                                        </motion.div>
                                    </div>
                                    <div style={styles.cardContent}>
                                        <h2 style={styles.cardTitle}>{story.title}</h2>
                                        <p style={styles.cardExcerpt}>{story.shortExcerpt}</p>
                                        <div style={{
                                            marginTop: 'auto',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            color: 'var(--color-primary)',
                                            fontWeight: 800,
                                            fontSize: '14px',
                                            textTransform: 'uppercase',
                                            letterSpacing: '1px'
                                        }}>
                                            Explore Story <ChevronRight size={18} />
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <AnimatePresence>
                {selectedStory && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                        style={styles.detailOverlay}
                    >
                        <motion.button
                            whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
                            whileTap={{ scale: 0.95 }}
                            style={styles.detailCloseBtn}
                            onClick={() => setSelectedStory(null)}
                        >
                            <X size={20} /> CLOSE
                        </motion.button>

                        <div style={styles.detailHero}>
                            <motion.img
                                initial={{ scale: 1.1 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                src={selectedStory.heroImage}
                                alt={selectedStory.title}
                                style={styles.detailHeroImage}
                            />
                            <div style={styles.detailHeroOverlay}>
                                <div style={{ width: '100%', padding: '0 48px' }}>
                                    <motion.div
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3, duration: 0.6 }}
                                    >
                                        {selectedStory.subtitle && (
                                            <span style={{
                                                color: 'var(--color-primary)',
                                                fontWeight: 900,
                                                textTransform: 'uppercase',
                                                letterSpacing: '4px',
                                                fontSize: '14px',
                                                marginBottom: '16px',
                                                display: 'block'
                                            }}>
                                                {selectedStory.subtitle}
                                            </span>
                                        )}
                                        <h1 style={{
                                            fontSize: 'clamp(40px, 8vw, 72px)',
                                            fontWeight: 900,
                                            color: '#ffffff',
                                            margin: 0,
                                            lineHeight: 1.1,
                                            fontFamily: "'Playfair Display', serif"
                                        }}>
                                            {selectedStory.title}
                                        </h1>
                                    </motion.div>
                                </div>
                            </div>
                        </div>

                        <div style={{ padding: '80px 48px' }}>
                            <div style={{ position: 'relative' }}>
                                {selectedStory.fullStoryContent.map((block: import('../types').StoryContent, idx: number) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, y: 40, scale: 0.95 }}
                                        whileInView={{ opacity: 1, y: 0, scale: 1 }}
                                        viewport={{ once: true, margin: "-100px" }}
                                        transition={{
                                            duration: 0.8,
                                            ease: [0.23, 1, 0.32, 1],
                                            delay: idx * 0.1
                                        }}
                                        style={{
                                            marginBottom: '40px',
                                        }}
                                    >
                                        {block.type === 'heading' && (
                                            <h2 style={{
                                                fontSize: '36px',
                                                fontWeight: 900,
                                                color: '#ffffff',
                                                marginBottom: '32px',
                                                fontFamily: "'Playfair Display', serif"
                                            }}>
                                                {block.content}
                                            </h2>
                                        )}

                                        {block.type === 'subheading' && (
                                            <h3 style={{
                                                fontSize: '24px',
                                                fontWeight: 700,
                                                color: 'var(--color-primary)',
                                                marginBottom: '20px',
                                                fontFamily: "'Outfit', sans-serif"
                                            }}>
                                                {block.content}
                                            </h3>
                                        )}

                                        {block.type === 'text' && (
                                            <div style={{
                                                fontSize: '20px',
                                                color: '#cbd5e1',
                                                lineHeight: 1.8,
                                                fontWeight: 400,
                                                whiteSpace: 'pre-wrap'
                                            }}>
                                                {block.content}
                                            </div>
                                        )}

                                        {(block.type === 'image' || block.type === 'video') && (
                                            <div style={{
                                                borderRadius: '20px',
                                                overflow: 'hidden',
                                                border: '1px solid rgba(255,255,255,0.05)',
                                                boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                                                margin: '20px 0'
                                            }}>
                                                {block.type === 'image' ? (
                                                    <img
                                                        src={block.url}
                                                        alt={block.caption || 'Story detail image'}
                                                        style={{ width: '100%', height: 'auto', display: 'block' }}
                                                        loading="lazy"
                                                    />
                                                ) : (
                                                    <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9' }}>
                                                        <iframe
                                                            src={block.url?.replace('watch?v=', 'embed/')}
                                                            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                            allowFullScreen
                                                        ></iframe>
                                                    </div>
                                                )}
                                                {block.caption && (
                                                    <div style={{
                                                        padding: '24px',
                                                        background: 'rgba(255,255,255,0.02)',
                                                        color: '#94a3b8',
                                                        fontStyle: 'italic',
                                                        fontSize: '15px',
                                                        fontWeight: 500,
                                                        textAlign: 'left',
                                                        borderTop: '1px solid rgba(255,255,255,0.05)'
                                                    }}>
                                                        — {block.caption}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </motion.div>
                                ))}
                                <div style={{ clear: 'both' }} />
                            </div>

                            <div style={{ marginTop: '100px', textAlign: 'left' }}>
                                <motion.button
                                    whileHover={{ scale: 1.05, y: -4 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setSelectedStory(null)}
                                    style={{
                                        padding: '24px 56px',
                                        borderRadius: '100px',
                                        background: 'var(--color-primary)',
                                        color: '#ffffff',
                                        fontWeight: 800,
                                        border: 'none',
                                        cursor: 'pointer',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '16px',
                                        fontSize: '16px',
                                        letterSpacing: '1px',
                                        textTransform: 'uppercase',
                                        boxShadow: '0 20px 40px rgba(92, 141, 55, 0.3)',
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    <ArrowLeft size={20} /> Return to Stories
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <footer style={{ padding: '80px 24px', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', position: 'relative', zIndex: 10 }}>
                <p style={{ color: '#475569', fontSize: '14px' }}>&copy; 2026 Videeptha Foods. Authenticity in every grain.</p>
            </footer>
        </div>
    );
}
