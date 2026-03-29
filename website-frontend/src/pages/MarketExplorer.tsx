import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ArrowLeft, Loader2, Sparkles, ShoppingBag, FilterX } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';
import Header from '../components/Header';
import { useCart } from '../context/CartContext';
import { deduplicateBy, getCategoryImage } from '../utils/category_utils';

interface Category {
    id: string;
    _id: string;
    name: string;
    slug: string;
    parent_id: string | null;
    thumbnail_image_url?: string;
    banner_image_url?: string;
    banner_details?: {
        title?: string;
        subtitle?: string;
        description?: string;
    };
    subcategories?: Category[];
}

const MarketExplorer: React.FC = () => {
    const navigate = useNavigate();
    const { } = useCart();
    const [searchParams] = useSearchParams();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewLevel, setViewLevel] = useState<1 | 2>(1);
    const [selectedMain, setSelectedMain] = useState<Category | null>(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const { data } = await axios.get(`${API_URL}/categories/`);
            // The API returns all categories; we filter for Level 1 (parent=null)
            const mainCats = data.filter((cat: Category) => !cat.parent_id);
            setCategories(deduplicateBy(mainCats, 'name'));

            // Handle Deep Linking
            const mainId = searchParams.get('mainCategory');
            if (mainId) {
                const found = mainCats.find((c: Category) => c.id === mainId || c._id === mainId);
                if (found) {
                    setSelectedMain(found);
                    setViewLevel(2);
                }
            }
        } catch (err) {
            console.error("Failed to fetch categories", err);
        } finally {
            setLoading(false);
        }
    };

    const handleMainClick = (cat: Category) => {
        if (cat.subcategories && cat.subcategories.length > 0) {
            setSelectedMain(cat);
            setViewLevel(2);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            // No subcategories? Go straight to product list
            navigate(`/products?category=${cat.id}`);
        }
    };

    const handleBack = () => {
        setViewLevel(1);
        setSelectedMain(null);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center">
                <Loader2 className="animate-spin text-amber-500" size={48} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] font-sans pb-20">
            <Header />
            
            <main className="max-w-[1400px] mx-auto px-4 pt-32">
                {/* Header Section */}
                <div className="mb-12">
                    <div className="flex items-center gap-4 mb-4">
                        {viewLevel === 2 && (
                            <button 
                                onClick={handleBack}
                                className="p-2 hover:bg-[var(--color-panel)] rounded-full transition-colors border border-[var(--color-border)]"
                            >
                                <ArrowLeft size={20} />
                            </button>
                        )}
                        <h1 className="text-4xl md:text-6xl font-black font-serif italic tracking-tight">
                            {viewLevel === 1 ? 'Discovery Lobby' : selectedMain?.name}
                        </h1>
                    </div>
                    <p className="text-lg opacity-60 max-w-2xl">
                        {viewLevel === 1 
                            ? 'Our artisanal collections rooted in tradition, crafted for the modern wellness seeker.' 
                            : selectedMain?.banner_details?.description || 'Explore our refined collection of essentials.'}
                    </p>
                </div>

                <AnimatePresence mode="wait">
                    {viewLevel === 1 ? (
                        <motion.div 
                            key="level-1"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                        >
                            {/* "All Products" Card */}
                            <motion.div 
                                onClick={() => navigate('/products')}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="relative h-[400px] rounded-[40px] overflow-hidden cursor-pointer group shadow-2xl border border-[var(--color-border)]"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-amber-900 to-amber-600 opacity-90 group-hover:opacity-100 transition-opacity" />
                                <div className="absolute inset-0 flex flex-col justify-end p-10 z-10">
                                    <Sparkles className="text-white mb-4 animate-pulse" size={32} />
                                    <h2 className="text-4xl font-bold text-white mb-2 leading-tight">All Heritage<br/>Collections</h2>
                                    <div className="flex items-center gap-2 text-white/80 font-bold uppercase tracking-widest text-xs">
                                        Browse Everything <ChevronRight size={16} />
                                    </div>
                                </div>
                            </motion.div>

                            {categories.map((cat) => (
                                <motion.div 
                                    key={cat.id}
                                    onClick={() => handleMainClick(cat)}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="relative h-[400px] rounded-[40px] overflow-hidden cursor-pointer group shadow-lg border border-[var(--color-border)] bg-[var(--color-panel)]"
                                >
                                    <img 
                                        src={getCategoryImage(cat.name, cat.banner_image_url)} 
                                        alt={cat.name}
                                        className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-all duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                    
                                    <div className="absolute inset-0 flex flex-col justify-end p-10 z-10 text-white">
                                        <h2 className="text-3xl font-black mb-2 font-serif">{cat.name}</h2>
                                        <div className="flex items-center gap-2 text-white/60 font-bold uppercase tracking-widest text-xs">
                                            {cat.subcategories?.length || 0} Specialties <ChevronRight size={16} />
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="level-2"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            className="space-y-12"
                        >
                            {/* Hero Banner for Level 2 */}
                            <div className="relative h-[300px] rounded-[40px] overflow-hidden border border-[var(--color-border)] shadow-xl">
                                <img 
                                    src={selectedMain?.banner_image_url || ''} 
                                    className="absolute inset-0 w-full h-full object-cover"
                                    alt="banner"
                                />
                                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
                                <div className="absolute inset-0 flex flex-col justify-center p-12 text-white">
                                    <span className="uppercase tracking-[0.3em] font-bold text-amber-400 text-xs mb-4">Discovery Layer</span>
                                    <h2 className="text-5xl font-black mb-4 font-serif">{selectedMain?.banner_details?.title || selectedMain?.name}</h2>
                                    <p className="max-w-xl text-white/90 leading-relaxed font-medium">
                                        {selectedMain?.banner_details?.description}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {/* "Browse All in [Main]" option */}
                                <motion.div 
                                    onClick={() => navigate(`/products?category=${selectedMain?.id}`)}
                                    whileHover={{ y: -5 }}
                                    className="bg-[var(--color-panel)] rounded-3xl p-8 border border-[var(--color-border)] cursor-pointer group hover:bg-amber-500/10 transition-colors flex flex-col justify-between"
                                >
                                    <div>
                                        <ShoppingBag size={24} className="text-amber-500 mb-6" />
                                        <h3 className="text-xl font-bold leading-tight">Everything in {selectedMain?.name}</h3>
                                    </div>
                                    <ChevronRight size={20} className="text-[var(--color-text-dim)] group-hover:translate-x-2 transition-transform" />
                                </motion.div>

                                {selectedMain?.subcategories?.map((sub) => (
                                    <motion.div 
                                        key={sub.id}
                                        onClick={() => navigate(`/products?category=${sub.id}`)}
                                        whileHover={{ y: -5 }}
                                        className="bg-[var(--color-surface)] rounded-3xl p-6 border border-[var(--color-border)] cursor-pointer group shadow-sm hover:shadow-xl transition-all"
                                    >
                                        <div className="h-40 rounded-2xl bg-[var(--color-panel)] mb-6 overflow-hidden">
                                            <img 
                                                src={getCategoryImage(sub.name, sub.thumbnail_image_url)} 
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                                                alt={sub.name} 
                                            />
                                        </div>
                                        <h3 className="text-lg font-black leading-tight mb-2">{sub.name}</h3>
                                        <p className="text-xs text-[var(--color-text-dim)] line-clamp-2">
                                            Explore our curated list of {sub.name.toLowerCase()} products.
                                        </p>
                                    </motion.div>
                                ))}
                            </div>

                            <div className="flex justify-center pt-8">
                                <button 
                                    onClick={() => navigate('/products')}
                                    className="flex items-center gap-3 px-8 py-4 bg-[var(--color-panel)] rounded-full text-sm font-bold border border-[var(--color-border)] hover:bg-[var(--color-surface)] transition-all uppercase tracking-widest"
                                >
                                    <FilterX size={18} /> Clear Path & Show All Products
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

export default MarketExplorer;
