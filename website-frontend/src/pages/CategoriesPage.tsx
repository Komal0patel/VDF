import { useEffect, useState, useRef } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Leaf, ChevronRight, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../components/Header';
import { API_URL } from '../config';

interface DbCategory {
    id: string;
    _id?: string;
    name: string;
    description: string;
    media_url?: string;
    subcategories?: any[];
}

export default function CategoriesPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const parentId = searchParams.get('parent');

    const [categories, setCategories] = useState<DbCategory[]>([]);
    const [currentParent, setCurrentParent] = useState<DbCategory | null>(null);
    const [loading, setLoading] = useState(true);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchCategories = async () => {
            setLoading(true);
            try {
                // Fetch categories for the current parent
                const url = parentId
                    ? `${API_URL}/categories/?parent=${parentId}`
                    : `${API_URL}/categories/?parent=null`;

                const res = await fetch(url);
                if (res.ok) {
                    const data = await res.json();
                    setCategories(data.filter((c: any) => c.is_active !== false));
                }

                // If we have a parentId, fetch the parent details to show a title/back button
                if (parentId) {
                    const parentRes = await fetch(`${API_URL}/categories/`);
                    if (parentRes.ok) {
                        const allCats = await parentRes.json();
                        const found = allCats.find((c: any) => c.id === parentId || c._id === parentId);
                        setCurrentParent(found || null);
                    }
                } else {
                    setCurrentParent(null);
                }
            } catch (err) {
                console.error('Categories fetching error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
        window.scrollTo(0, 0);
    }, [parentId]);

    const handleCategoryClick = (category: DbCategory) => {
        if (category.subcategories && category.subcategories.length > 0) {
            navigate(`/categories?parent=${category.id}`);
        } else {
            navigate(`/products?category=${category.id}`);
        }
    };

    const resolveImageUrl = (url: string | undefined) => {
        if (!url) return 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80';
        if (url.startsWith('data:') || url.startsWith('http') || url.startsWith('/')) return url;
        return url;
    };

    if (loading) {
        return (
            <div className="h-screen w-full bg-[var(--color-bg)] flex items-center justify-center">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
                    <Leaf className="text-[var(--color-primary)]" size={64} />
                </motion.div>
            </div>
        );
    }

    return (
        <div ref={containerRef} className="relative bg-[var(--color-bg)] text-[var(--color-text)] font-sans min-h-screen selection:bg-[var(--color-primary)] selection:text-white">
            <Header />

            <main className="relative z-10 pt-32 pb-20 px-6">
                <div className="max-w-7xl mx-auto">
                    {/* Breadcrumbs / Back button */}
                    <AnimatePresence>
                        {parentId && (
                            <motion.button
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                onClick={() => navigate(-1)}
                                className="mb-8 flex items-center gap-2 text-[var(--color-text)]/60 hover:text-[var(--color-primary)] font-black uppercase tracking-widest text-[10px] transition-colors"
                            >
                                <ArrowLeft size={14} />
                                Back to {currentParent?.parent_id ? 'Subcategories' : 'Main Collections'}
                            </motion.button>
                        )}
                    </AnimatePresence>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-16"
                    >
                        <h1 className="text-5xl md:text-7xl font-black text-[var(--color-text)] mb-6 font-serif">
                            {currentParent ? (
                                <>Explore <span className="italic text-[var(--color-primary)]">{currentParent.name}</span></>
                            ) : (
                                <>Our <span className="italic text-[var(--color-primary)]">Collections</span></>
                            )}
                        </h1>
                        <p className="text-lg text-[var(--color-text)]/70 max-w-2xl mx-auto">
                            {currentParent?.description || (parentId ? 'Detailed sub-categories for your selection.' : 'Select a category below to explore our specific harvests.')}
                        </p>
                    </motion.div>

                    {/* Grid Layout for Categories */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full py-12">
                        {categories.map((category, index) => {
                            return (
                                <motion.div
                                    key={category.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="group cursor-pointer"
                                    onClick={() => handleCategoryClick(category)}
                                >
                                    <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl bg-[var(--color-panel)] border border-[var(--color-border)] mb-6">
                                        <img
                                            src={resolveImageUrl(category.media_url)}
                                            alt={category.name}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                                        <div className="absolute bottom-0 left-0 p-8 w-full">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="w-8 h-[1px] bg-[var(--color-primary)] group-hover:w-12 transition-all" />
                                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--color-primary)]">
                                                    {category.subcategories && category.subcategories.length > 0 ? 'Explore Subcategories' : 'View Products'}
                                                </span>
                                            </div>
                                            <h2 className="text-3xl font-serif text-white font-black leading-tight drop-shadow-lg">
                                                {category.name}
                                            </h2>
                                        </div>
                                    </div>

                                    <div className="px-4">
                                        <p className="text-[var(--color-text)]/60 text-sm leading-relaxed line-clamp-2 mb-4">
                                            {category.description || `High-quality ${category.name} guaranteed fresh from our farms.`}
                                        </p>
                                        <div className="flex items-center gap-2 text-[var(--color-primary)] font-black uppercase tracking-widest text-[10px] opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0">
                                            Discover Now <ChevronRight size={14} />
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    {categories.length === 0 && (
                        <div className="text-center py-20">
                            <Leaf className="mx-auto text-[var(--color-text)]/10 mb-4" size={48} />
                            <p className="text-xl text-[var(--color-text)]/40">No items found in this collection.</p>
                            {parentId && (
                                <button onClick={() => navigate(-1)} className="mt-4 text-[var(--color-primary)] font-black uppercase text-[10px] tracking-widest">Go Back</button>
                            )}
                        </div>
                    )}
                </div>
            </main>

            <footer className="relative z-10 w-full border-t border-[var(--color-border)] bg-[var(--color-bg)] py-16 text-center">
                <div className="flex flex-col items-center gap-4">
                    <Leaf className="text-[var(--color-primary)]" size={40} />
                    <h2 className="text-2xl font-serif text-[var(--color-text)] italic">Videeptha Foods</h2>
                    <p className="text-[var(--color-text)]/60 font-light">© 2026 Videeptha Foods. Rooted in Nature.</p>
                </div>
            </footer>
        </div>
    );
}
