import { useEffect, useState, useRef, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Leaf, ChevronRight, ArrowLeft, Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../components/Header';
import { API_URL } from '../config';
import { getCategoryImage } from '../utils/category_utils';

interface DbCategory {
    id: string;
    _id?: string;
    name: string;
    description: string;
    media_url?: string;
    parent_id?: string;
    subcategories?: any[];
}

interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    images: string[];
}

export default function CategoriesPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const parentId = searchParams.get('parent');

    const [categories, setCategories] = useState<DbCategory[]>([]);
    const [allCategories, setAllCategories] = useState<DbCategory[]>([]);
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [currentParent, setCurrentParent] = useState<DbCategory | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isHoveringSearch, setIsHoveringSearch] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const fetchAllData = async () => {
        setLoading(true);
        try {
            const [categoriesRes, productsRes] = await Promise.all([
                fetch(`${API_URL}/categories/`),
                fetch(`${API_URL}/products/`)
            ]);

            const categoriesData = await categoriesRes.json();
            const productsData = await productsRes.json();

            const activeCats = categoriesData.filter((c: any) => c.is_active !== false);
            setAllCategories(activeCats);
            setAllProducts(productsData.filter((p: any) => p.is_active));

            if (parentId) {
                const found = activeCats.find((c: any) => c.id === parentId || c._id === parentId);
                setCurrentParent(found || null);
                setCategories(activeCats.filter((c: any) => c.parent_id === parentId));
            } else {
                setCurrentParent(null);
                setCategories(activeCats.filter((c: any) => !c.parent_id || c.parent_id === 'null'));
            }
        } catch (err) {
            console.error('Data fetching error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllData();
        window.scrollTo(0, 0);
    }, [parentId]);

    useEffect(() => {
        if (isHoveringSearch && searchTerm.trim()) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isHoveringSearch, searchTerm]);

    const filteredResults = useMemo(() => {
        if (!searchTerm.trim()) return null;
        const term = searchTerm.toLowerCase();
        const matchedCategories = allCategories.filter(c => 
            (c.name?.toLowerCase() || '').includes(term) || 
            (c.description?.toLowerCase() || '').includes(term)
        );
        const matchedProducts = allProducts.filter(p => 
            (p.name?.toLowerCase() || '').includes(term) || 
            (p.description?.toLowerCase() || '').includes(term)
        );
        return { matchedCategories, matchedProducts };
    }, [searchTerm, allCategories, allProducts]);

    const handleCategoryClick = (category: DbCategory) => {
        if (category.subcategories && category.subcategories.length > 0) {
            navigate(`/categories?parent=${category.id}`);
        } else {
            navigate(`/products?category=${category.id}`);
        }
    };

    const resolveImageUrl = (url: string | undefined, name: string) => {
        return getCategoryImage(name, url);
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
        <div ref={containerRef} className="relative bg-[var(--color-bg)] text-[var(--color-text)] font-sans min-h-screen selection:bg-[var(--color-primary)] selection:text-white pb-32">
            <Header />

            <main className="relative z-10 pt-32 pb-20 px-6">
                <div className="max-w-6xl mx-auto">
                    {/* Search Bar - Universal Experience */}
                    <div className="mb-12 relative group">
                        <div className="flex items-center gap-4 bg-white border border-[var(--color-border)] rounded-[2.5rem] px-8 py-5 shadow-sm group-focus-within:shadow-xl group-focus-within:border-[var(--color-primary)] transition-all">
                            <Search className="text-[var(--color-text)]/40 group-focus-within:text-[var(--color-primary)] transition-colors" size={20} />
                            <input 
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search Categories, Products, or Subcategories..."
                                className="bg-transparent border-none outline-none flex-1 text-lg font-medium placeholder:text-[var(--color-text)]/30"
                            />
                            {searchTerm && (
                                <button onClick={() => setSearchTerm('')}>
                                    <X className="text-[var(--color-text)]/40 hover:text-[var(--color-secondary)] transition-colors" size={20} />
                                </button>
                            )}
                        </div>

                        {/* Search Status Indicator */}
                        {searchTerm && (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }} 
                                animate={{ opacity: 1, y: 0 }}
                                className="absolute -bottom-8 left-8 text-[10px] font-black uppercase tracking-widest text-[var(--color-primary)]"
                            >
                                Showing results for "{searchTerm}"
                            </motion.div>
                        )}

                        {/* Search Suggestions Dropdown */}
                        <AnimatePresence>
                            {searchTerm && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }} 
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    onMouseEnter={() => setIsHoveringSearch(true)}
                                    onMouseLeave={() => setIsHoveringSearch(false)}
                                    onTouchStart={() => setIsHoveringSearch(true)}
                                    onTouchEnd={() => setIsHoveringSearch(false)}
                                    className="absolute left-0 right-0 top-full mt-4 bg-white border border-[var(--color-border)] rounded-[2rem] shadow-[0_30px_90px_-20px_rgba(0,0,0,0.4)] overflow-hidden z-[999] pointer-events-auto"
                                >
                                    <div className="max-h-[320px] overflow-y-auto overscroll-contain bg-white touch-pan-y custom-scrollbar p-2">
                                        {filteredResults?.matchedCategories.length! > 0 && (
                                            <div className="p-4 bg-[var(--color-bg)]/30">
                                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--color-text)]/30 px-4 mb-2 block">Collections</span>
                                                {filteredResults?.matchedCategories.map((cat) => (
                                                    <button 
                                                        key={cat.id}
                                                        onClick={() => {
                                                            handleCategoryClick(cat);
                                                            setSearchTerm('');
                                                        }}
                                                        className="w-full flex items-center gap-4 p-3 rounded-2xl hover:bg-white hover:shadow-md transition-all group"
                                                    >
                                                        <div className="w-12 aspect-square rounded-xl overflow-hidden bg-[var(--color-panel)]">
                                                            <img src={resolveImageUrl(cat.media_url, cat.name)} className="w-full h-full object-cover group-hover:scale-110 transition-transform" alt={cat.name} />
                                                        </div>
                                                        <div className="flex-1 text-left">
                                                            <p className="font-serif font-black text-lg group-hover:text-[var(--color-primary)] transition-colors uppercase">{cat.name}</p>
                                                        </div>
                                                        <ChevronRight className="text-[var(--color-primary)] opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" size={18} />
                                                    </button>
                                                ))}
                                            </div>
                                        )}

                                        {filteredResults?.matchedProducts.length! > 0 && (
                                            <div className="p-4 border-t border-[var(--color-border)]">
                                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--color-text)]/30 px-4 mb-2 block">Harvests</span>
                                                {filteredResults?.matchedProducts.map((p) => (
                                                    <div 
                                                        key={p._id}
                                                        className="w-full flex items-center gap-4 p-3 rounded-2xl bg-[var(--color-bg)]/50 transition-all group"
                                                    >
                                                        <div className="w-12 aspect-square rounded-xl overflow-hidden bg-white border border-[var(--color-border)] p-1">
                                                            <img src={p.images?.[0] || 'https://via.placeholder.com/100'} className="w-full h-full object-contain group-hover:scale-110 transition-transform" alt={p.name} />
                                                        </div>
                                                        <div className="flex-1 text-left">
                                                            <p className="font-serif font-black text-lg group-hover:text-[var(--color-primary)] transition-colors">{p.name}</p>
                                                            <p className="text-[10px] text-[var(--color-text)]/40 font-bold uppercase tracking-widest">₹{p.price}</p>
                                                        </div>
                                                        <div className="text-[var(--color-text)]/20 font-black uppercase text-[8px] tracking-widest">Details Locked</div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {filteredResults?.matchedCategories.length === 0 && filteredResults?.matchedProducts.length === 0 && (
                                            <div className="p-12 text-center">
                                                <Search className="mx-auto text-[var(--color-text)]/10 mb-4" size={40} />
                                                <p className="text-sm font-bold text-[var(--color-text)]/40">No matching harvests or collections.</p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="bg-[var(--color-primary)] p-3 text-center">
                                        <p className="text-[10px] font-black text-white/70 uppercase tracking-[0.3em]">Videeptha Foods Native Search</p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

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
                        <h1 className="text-4xl md:text-6xl font-black text-[var(--color-text)] mb-6 font-serif uppercase">
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

                    {/* Alternating Zig-Zag Layout for Categories */}
                    <div className="flex flex-col gap-20 md:gap-24 w-full py-8">
                        {categories.map((category, index) => {
                            const isEven = index % 2 === 0;
                            return (
                                <motion.div
                                    key={category.id}
                                    initial={{ opacity: 0, x: isEven ? -30 : 30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true, margin: "-100px" }}
                                    transition={{ duration: 0.8, ease: "easeOut" }}
                                    className={`flex ${isEven ? 'flex-row' : 'flex-row-reverse'} items-center gap-4 md:gap-14 group`}
                                >
                                    <div 
                                        className="flex-1 w-full aspect-[4/5] md:aspect-[16/9] rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden shadow-xl bg-[var(--color-panel)] border border-[var(--color-border)] cursor-pointer"
                                        onClick={() => handleCategoryClick(category)}
                                    >
                                        <img
                                            src={resolveImageUrl(category.media_url, category.name)}
                                            alt={category.name}
                                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                        />
                                    </div>

                                    <div className={`flex-1 ${isEven ? 'text-left' : 'text-right'} flex flex-col ${isEven ? 'items-start' : 'items-end'}`}>
                                        <div className="flex items-center gap-2 mb-2 md:mb-4 opacity-40">
                                            {isEven && <span className="w-6 md:w-8 h-[1px] bg-[var(--color-text)]" />}
                                            <span className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.4em]">
                                                {category.subcategories && category.subcategories.length > 0 ? 'Collection' : 'Harvested'}
                                            </span>
                                            {!isEven && <span className="w-6 md:w-8 h-[1px] bg-[var(--color-text)]" />}
                                        </div>

                                        <h2 className="text-xl md:text-5xl font-black text-[var(--color-text)] mb-2 md:mb-6 font-serif uppercase tracking-tight group-hover:text-[var(--color-primary)] transition-colors line-clamp-2">
                                            {category.name}
                                        </h2>

                                        <p className="text-[10px] md:text-xl text-[var(--color-text)]/60 leading-relaxed mb-4 md:mb-8 max-w-lg line-clamp-3 md:line-clamp-none">
                                            {category.description || `Sourced sustainably and prepared slowly to coax out rich, complex profiles of ${category.name}.`}
                                        </p>

                                        <button 
                                            onClick={() => handleCategoryClick(category)}
                                            className="relative group/btn inline-flex flex-col items-start gap-1"
                                        >
                                            <span className="text-[8px] md:text-xs font-black uppercase tracking-[0.2em] text-[var(--color-text)] group-hover/btn:text-[var(--color-primary)] transition-colors">
                                                View Details
                                            </span>
                                            <span className="w-full h-[1px] md:h-[1.5px] bg-[var(--color-secondary)] group-hover/btn:w-[120%] transition-all origin-left" />
                                        </button>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    {categories.length === 0 && !searchTerm && (
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
