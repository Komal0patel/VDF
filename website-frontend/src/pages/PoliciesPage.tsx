// import { useEffect, useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { ChevronDown, Shield, FileText, Leaf } from 'lucide-react';
// import Header from '../components/Header';
// import { API_URL } from '../config';

// interface Policy {
//     id?: string;
//     _id?: string;
//     title: string;
//     slug: string;
//     content: string;
//     order: number;
//     is_active: boolean;
//     updated_at?: string;
// }

// function PolicyAccordion({ policy }: { policy: Policy }) {
//     const [open, setOpen] = useState(false);

//     return (
//         <motion.div
//             layout
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5 }}
//             className="border border-white/8 rounded-2xl overflow-hidden"
//         >
//             <button
//                 onClick={() => setOpen(!open)}
//                 className="w-full flex items-center justify-between px-8 py-6 text-left hover:bg-white/5 transition-all"
//             >
//                 <div className="flex items-center gap-4">
//                     <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center shrink-0">
//                         <Shield size={18} className="text-[var(--color-primary)]" />
//                     </div>
//                     <h2 className="text-lg font-bold text-white">{policy.title}</h2>
//                 </div>
//                 <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.3 }}>
//                     <ChevronDown size={20} className="text-slate-400" />
//                 </motion.div>
//             </button>

//             <AnimatePresence>
//                 {open && (
//                     <motion.div
//                         initial={{ height: 0, opacity: 0 }}
//                         animate={{ height: 'auto', opacity: 1 }}
//                         exit={{ height: 0, opacity: 0 }}
//                         transition={{ duration: 0.35, ease: 'easeInOut' }}
//                         className="overflow-hidden"
//                     >
//                         <div
//                             className="px-8 pb-8 pt-2 text-slate-300 leading-relaxed prose prose-invert prose-sm max-w-none
//                                 prose-h2:text-white prose-h2:font-bold prose-h2:text-base prose-h2:mt-6 prose-h2:mb-3
//                                 prose-p:text-slate-400 prose-p:mb-4
//                                 prose-li:text-slate-400
//                                 prose-a:text-[var(--color-primary)] prose-a:no-underline prose-a:hover:underline
//                                 prose-strong:text-white"
//                             dangerouslySetInnerHTML={{ __html: policy.content || '<p class="text-slate-500 italic">No content yet. Edit this policy in the admin panel.</p>' }}
//                         />
//                         {policy.updated_at && (
//                             <p className="px-8 pb-6 text-[10px] text-slate-600">
//                                 Last updated: {new Date(policy.updated_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
//                             </p>
//                         )}
//                     </motion.div>
//                 )}
//             </AnimatePresence>
//         </motion.div>
//     );
// }

// export default function PoliciesPage() {
//     const [policies, setPolicies] = useState<Policy[]>([]);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         fetch(`${API_URL}/policies/`)
//             .then(res => res.json())
//             .then(data => {
//                 if (Array.isArray(data)) {
//                     setPolicies(data.sort((a, b) => a.order - b.order));
//                 }
//                 setLoading(false);
//             })
//             .catch(() => setLoading(false));
//     }, []);

//     return (
//         <div className="min-h-screen bg-[#0a0d08] text-white">
//             <Header />

//             {/* Hero Banner */}
//             <div className="relative pt-32 pb-20 px-6 text-center overflow-hidden">
//                 <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-primary)]/5 via-transparent to-transparent pointer-events-none" />
//                 <motion.div
//                     initial={{ opacity: 0, y: 30 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.8 }}
//                     className="relative max-w-3xl mx-auto"
//                 >
//                     <div className="flex items-center justify-center gap-3 mb-6">
//                         <div className="h-px w-12 bg-[var(--color-primary)]" />
//                         <span className="text-[var(--color-primary)] text-xs font-bold uppercase tracking-[0.3em]">Trust & Transparency</span>
//                         <div className="h-px w-12 bg-[var(--color-primary)]" />
//                     </div>
//                     <h1 className="text-5xl md:text-7xl font-black text-white font-serif leading-tight mb-6">
//                         Our Policies
//                     </h1>
//                     <p className="text-slate-400 text-lg max-w-xl mx-auto">
//                         We believe in complete transparency. Read our policies to understand how we operate and protect you.
//                     </p>
//                 </motion.div>
//             </div>

//             {/* Policies List */}
//             <div className="max-w-3xl mx-auto px-6 pb-24 space-y-4">
//                 {loading ? (
//                     Array.from({ length: 4 }).map((_, i) => (
//                         <div key={i} className="h-20 bg-white/5 rounded-2xl animate-pulse" />
//                     ))
//                 ) : policies.length === 0 ? (
//                     <div className="text-center py-20">
//                         <FileText size={48} className="text-slate-700 mx-auto mb-4" />
//                         <p className="text-slate-500">Policies are being updated. Please check back soon.</p>
//                     </div>
//                 ) : (
//                     policies.map(policy => (
//                         <PolicyAccordion key={policy.id || policy._id || policy.slug} policy={policy} />
//                     ))
//                 )}
//             </div>

//             {/* Village Footer Note */}
//             <div className="border-t border-white/5 py-10 text-center">
//                 <div className="flex items-center justify-center gap-2 mb-2">
//                     <Leaf size={16} className="text-[var(--color-primary)]" />
//                     <span className="text-slate-500 text-sm">Videeptha Foods</span>
//                 </div>
//                 <p className="text-[11px] text-slate-700">
//                     Questions? <a href="mailto:hello@videeptha.com" className="text-[var(--color-primary)] hover:underline">hello@videeptha.com</a>
//                 </p>
//             </div>
//         </div>
//     );
// }
import { useEffect, useState } from "react";
import Header from "../components/Header";
import { API_URL } from "../config";

interface Policy {
    _id?: string;
    id?: string;
    title: string;
    slug: string;
    content: string;
    order: number;
    updated_at?: string;
}

export default function PoliciesPage() {
    const [policies, setPolicies] = useState<Policy[]>([]);
    const [activePolicy, setActivePolicy] = useState<Policy | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${API_URL}/policies/`)
            .then((res) => res.json())
            .then((data) => {
                const sorted = data.sort((a: Policy, b: Policy) => a.order - b.order);
                setPolicies(sorted);
                setActivePolicy(sorted[0]);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    return (
        <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
            <Header />

            <div className="pt-32 max-w-7xl mx-auto px-6 pb-24 grid md:grid-cols-[280px_1fr] gap-10">

                {/* LEFT MENU */}
                <div className="border border-[var(--color-border)] rounded-2xl p-4 h-fit sticky top-32 bg-[var(--color-surface)] shadow-lg">
                    <h2 className="text-xs uppercase tracking-widest text-[var(--color-primary)] mb-4 font-bold">
                        Policies
                    </h2>

                    {policies.map((p) => (
                        <button
                            key={p.slug}
                            onClick={() => setActivePolicy(p)}
                            className={`w-full text-left px-4 py-3 rounded-lg mb-2 text-sm transition-all
              ${activePolicy?.slug === p.slug
                                    ? "bg-[var(--color-primary)] text-white font-semibold shadow-md"
                                    : "hover:bg-black/5 text-[var(--color-text-dim)]"
                                }`}
                        >
                            {p.title}
                        </button>
                    ))}
                </div>

                {/* RIGHT CONTENT */}
                <div className="border border-[var(--color-border)] rounded-2xl p-10 bg-white shadow-xl">

                    {loading ? (
                        <div className="animate-pulse h-20 bg-black/5 rounded-xl"></div>
                    ) : activePolicy ? (
                        <>
                            <h1 className="text-3xl font-serif mb-6 text-[var(--color-primary)]">{activePolicy.title}</h1>

                            <div
                                className="prose max-w-none
                prose-h2:text-[var(--color-primary)] prose-h2:font-serif prose-h2:font-bold prose-h2:text-xl
                prose-p:text-[var(--color-text)] prose-p:leading-relaxed
                prose-li:text-[var(--color-text)] 
                prose-strong:text-black prose-strong:font-bold
                [&_*]:!text-[var(--color-text-dim)] [&_h2]:!text-[var(--color-primary)] [&_h3]:!text-[var(--color-primary)] [&_h3]:!font-serif"
                                dangerouslySetInnerHTML={{ __html: activePolicy.content }}
                            />

                            {activePolicy.updated_at && (
                                <p className="text-xs text-[var(--color-muted)] mt-10">
                                    Last updated:{" "}
                                    {new Date(activePolicy.updated_at).toLocaleDateString()}
                                </p>
                            )}
                        </>
                    ) : (
                        <p>No policy found.</p>
                    )}
                </div>
            </div>
        </div>
    );
}