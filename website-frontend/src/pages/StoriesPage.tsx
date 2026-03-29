import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { API_URL } from '../config';

export default function StoriesPage() {
    const fadeUpVariant: any = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
    };

    const defaultPinned = [
        {
            name: "Vidya",
            content: "<p class=\"mb-4\">Our elders taught us how to live and eat. I realised sooner, hope you do as well.</p><p class=\"mb-4\">As a food lover, my question was big, but small enough to understand.</p><p class=\"mb-4 text-xl font-bold text-[var(--color-primary)]\">Why can't a marriage between tasty & healthy happen?</p><p class=\"mb-4\">I grew up eating millets and then from the past two years, I was working hard on how to reach everyone with this marriage alliance, which universally can be celebrated.</p><p class=\"mb-4\">Walk just a step ahead and join hands against Diabetes, weaker immune system & fat-related problems, and many more.</p>",
            signature: "Vidya Shree"
        },
        {
            name: "Pradeep",
            content: "<p class=\"mb-4\">When initially I refused to incorporate millets in my daily life,</p><p class=\"mb-4\">My partner shared with me a simple but huge knowledge — <strong class=\"text-[var(--color-primary)]\">what millets are</strong>.</p><p class=\"mb-4\">Then now I'm replacing well with our products from the past few years.</p><p class=\"mb-4 text-xl font-bold text-[var(--color-primary)]\">As the changes must start from our own house.</p><p class=\"mb-4\">My step towards reality, healthy, fit and gut-friendly life has started.</p><p class=\"mb-4\">Do you? Let us know.</p>",
            signature: "P V Pradeep"
        }
    ];

    const defaultCustomers = [
        { name: "Pradeep", text: "For Deepavali, I wanted sweets my parents could enjoy without worrying about BP and sugar levels. I ordered millet sweets and halwa here, and the taste surprised everyone at home. Healthy, traditional, and truly satisfying." },
        { name: "Selvi", text: "As a mother, I'm always searching for healthier options for my kids. When my daughter’s school, Prarthana Public School, suggested healthier snacks, I tried the health mix and laddu kit from here. Now it has become part of our daily routine." },
        { name: "Nirmala", text: "Being a foodie in my 40s, I wanted food that keeps my taste buds happy without harming my health. A friend introduced me to these millet snacks and breakfast mixes. Now I enjoy my food guilt-free every day." },
        { name: "Shivakumar", text: "After turning 50, my doctor asked me to change my diet. I started looking for healthier alternatives and discovered these millet foods. The taste reminded me of homemade village food while taking care of my health." },
        { name: "Shivaraj", text: "I came across their page on social media while searching for healthy snacks. Later a friend also recommended them, so I decided to try their millet pancakes and sweets. It felt like finding the perfect balance between health and taste." },
        { name: "Karthick", text: "Living in the city made me miss the traditional snacks from my village. When I tried these millet laddus and murukku, it felt nostalgic. Healthy food that brings back childhood memories is truly special." },
        { name: "Nirosha", text: "As someone who monitors sugar levels carefully, I always hesitate to eat sweets. But these millet-based sweets gave me the confidence to enjoy a little sweetness again. Finally, desserts that care for health too." },
        { name: "Suguna", text: "Cooking every day became difficult with my busy schedule. The millet instant mixes here helped me prepare healthy breakfasts quickly. My family now starts the day with something nutritious." },
        { name: "Lakshmi", text: "I was looking for healthy snacks for my children’s evening hunger. The millet cookies and laddus became their favorite instantly. I feel happy giving them snacks that are both tasty and nutritious." },
        { name: "Ramesh", text: "My father has BP issues and loves traditional sweets. These millet sweets allowed him to enjoy his favorite flavors without worry. It made our family celebrations sweeter." },
        { name: "Meena", text: "I always believed healthy food means compromising taste. But after trying these millet chocolates and snacks, my opinion completely changed. Health can actually be delicious." },
        { name: "Suresh", text: "Working long hours means I often depend on instant food. The millet breakfast mixes here are quick to make and surprisingly filling. It feels like homemade food even on busy mornings." },
        { name: "Kavitha", text: "As a mother, my biggest concern is my family’s health. These millet laddus and health mixes gave me a natural way to add nutrition to our meals. Even my picky kids enjoy them." },
        { name: "Rajesh", text: "I was trying to reduce refined sugar and unhealthy snacks. These millet snacks helped me switch to better eating habits without missing taste. It’s a small change that made a big difference." },
        { name: "Anitha", text: "Festival seasons usually mean too many sugary sweets. This time I tried millet sweets for our family gathering. Everyone loved the taste and appreciated the healthy twist." },
        { name: "Dinesh", text: "My grandmother always spoke about the benefits of millets. When I tried these millet foods, it reminded me of her traditional recipes. It feels like bringing back old wisdom into modern life." },
        { name: "Rekha", text: "As someone trying to maintain fitness, snacks were always my weakness. These millet cookies and laddus became my perfect guilt-free treat. Healthy snacking finally feels possible." },
        { name: "Mohan", text: "Traveling for work made it difficult to eat healthy. These millet snacks became my go-to food during long journeys. Nutritious and easy to carry." },
        { name: "Priya", text: "My kids love chocolates, but I worry about sugar. The millet chocolates here gave me a healthier option without taking away their happiness. A win for both kids and parents." },
        { name: "Arun", text: "I was searching for something light yet filling for breakfast. The millet pancake mix here turned out to be perfect. Healthy mornings started becoming a habit." },
        { name: "Gayathri", text: "I wanted to introduce millets to my family but didn’t know how. These ready mixes made the transition easy and tasty. Now millets are part of our daily meals." },
        { name: "Manjunath", text: "My doctor suggested adding more fiber and natural foods to my diet. These millet snacks helped me follow that advice without feeling restricted. Healthier eating became enjoyable." },
        { name: "Shobha", text: "Evenings with tea always needed a good snack. The millet murukku and cookies became our family favorite. Crunchy, tasty, and healthier than usual snacks." },
        { name: "Vijay", text: "I missed the taste of homemade village sweets. When I tried these millet laddus and halwa, the flavors felt authentic and comforting. It’s like tasting tradition again." },
        { name: "Deepa", text: "I always look for foods that nourish both body and mind. These millet foods felt natural, wholesome, and satisfying. Sometimes the healthiest choices are also the most delicious." }
    ];

    const defaultCatering = [
        { name: "Karthick", type: "Office Event Catering", text: "For our office wellness event, we wanted food that was both healthy and affordable. We chose their millet-based catering menu with breakfast items, laddus, and snacks. Everyone appreciated the taste and the unique healthy concept." },
        { name: "Nirosha", type: "Birthday Function", text: "For my daughter’s birthday, I wanted something different from regular junk food. Their millet snacks, sweets, and mini pancakes were perfect for kids and elders. It was healthy, tasty, and also budget-friendly for our small celebration." },
        { name: "Suguna", type: "Family Function", text: "During our family gathering, we decided to try millet-based catering instead of the usual oily dishes. The food felt light, nutritious, and still very delicious. Many relatives asked us where we ordered it from." },
        { name: "Manjunath", type: "School Program", text: "For a school health awareness program, we arranged millet snacks and sweets through their catering service. The food was simple, nutritious, and within our budget. It was a great way to introduce children to healthier eating." }
    ];

    const [pinnedStories, setPinnedStories] = useState(defaultPinned);
    const [customerStories, setCustomerStories] = useState(defaultCustomers);
    const [cateringStories, setCateringStories] = useState(defaultCatering);

    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchDynamicStories = async () => {
            try {
                const res = await fetch(`${API_URL}/stories/`);
                if (res.ok) {
                    const data = await res.json();
                    
                    const pinned = data.find((d: any) => d.title === "Pinned Stories" && d.is_active !== false);
                    if (pinned && Array.isArray(pinned.fullStoryContent) && pinned.fullStoryContent.length > 0) {
                        setPinnedStories(pinned.fullStoryContent);
                    }

                    const customers = data.find((d: any) => d.title === "Customer Experiences" && d.is_active !== false);
                    if (customers && Array.isArray(customers.fullStoryContent) && customers.fullStoryContent.length > 0) {
                        setCustomerStories(customers.fullStoryContent);
                    }

                    const catering = data.find((d: any) => d.title === "Catering Stories" && d.is_active !== false);
                    if (catering && Array.isArray(catering.fullStoryContent) && catering.fullStoryContent.length > 0) {
                        setCateringStories(catering.fullStoryContent);
                    }
                }
            } catch (err) {
                console.error("Failed to load DB stories, falling back to defaults.", err);
            }
        };
        fetchDynamicStories();
    }, []);

    // Map logic for background order alternating cleanly between existing site CSS variables.
    const backgroundOrder = ['bg-[var(--color-bg)]', 'bg-white', 'bg-[var(--color-panel)]', 'bg-[var(--color-primary)]'];

    return (
        <div className="min-h-screen bg-[var(--color-bg)] font-sans text-[var(--color-text)] selection:bg-[var(--color-primary)] selection:text-white">
            <Header />

            {/* Header Section */}
            <main className="pt-32 pb-16 px-6 text-center max-w-7xl mx-auto">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-5xl md:text-7xl font-black text-[var(--color-primary)] mb-6 font-serif tracking-tight"
                >
                    Millet Food Stories
                </motion.h1>
                <div className="w-20 h-1 bg-[var(--color-secondary)] mx-auto mb-8 rounded-full"></div>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className="text-[var(--color-text)]/80 text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed italic font-serif"
                >
                    "Finding tasty & healthy food isn't harder anymore."
                </motion.p>
            </main>

            {/* Pinned Stories (Vidya & Pradeep) */}
            {pinnedStories.map((story, index) => (
                <section key={story.name} className={`${index % 2 === 0 ? 'bg-[var(--color-panel)]' : 'bg-transparent'} py-24 px-6`}>
                    <div className="max-w-4xl mx-auto">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeUpVariant}
                            className="text-center"
                        >
                            <h2 className="text-4xl md:text-5xl font-serif text-[var(--color-text)] font-black mb-10">{story.name}</h2>
                            <div className="text-lg md:text-xl text-[var(--color-text)]/80 leading-relaxed mb-8">
                                <div dangerouslySetInnerHTML={{ __html: (story as any).content || '' }} />
                            </div>
                            <p className="text-xl md:text-2xl font-black text-[var(--color-secondary)] italic">— {story.signature}</p>
                        </motion.div>
                    </div>
                </section>
            ))}

            {/* Customer Stories Grid */}
            <section className="bg-[var(--color-bg)] py-24 px-6 border-t border-[var(--color-border)]">
                <div className="max-w-7xl mx-auto">
                    <motion.h2 
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeUpVariant}
                        className="text-4xl md:text-5xl font-black text-center mb-16 text-[var(--color-primary)] font-serif"
                    >
                        Customer Experiences
                    </motion.h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {customerStories.map((story, idx) => {
                            const bgClass = backgroundOrder[idx % 4];
                            const isDark = bgClass === 'bg-[var(--color-primary)]';
                            
                            return (
                                <motion.div
                                    key={idx}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true, margin: "-50px" }}
                                    variants={{
                                        hidden: { opacity: 0, scale: 0.9, y: 30 },
                                        visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5, delay: (idx % 3) * 0.1 } } as any
                                    }}
                                    className={`${bgClass} p-8 rounded-[2rem] border ${isDark ? 'border-transparent' : 'border-[var(--color-border)]'} shadow-xl flex flex-col justify-between hover:-translate-y-2 transition-transform duration-300`}
                                >
                                    <p className={`text-lg leading-relaxed mb-8 font-medium italic ${isDark ? 'text-white/90' : 'text-[var(--color-text)]/80'}`}>
                                        "{story.text}"
                                    </p>
                                    <div>
                                        <div className={`w-10 h-1 rounded-full mb-4 ${isDark ? 'bg-white/30' : 'bg-[var(--color-secondary)]'}`}></div>
                                        <h4 className={`text-xl font-black tracking-wider uppercase ${isDark ? 'text-white' : 'text-[var(--color-text)]'}`}>{story.name}</h4>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Catering Stories Section */}
            <section className="bg-[var(--color-panel)] py-32 px-6">
                <div className="max-w-7xl mx-auto">
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-black text-[var(--color-text)] font-serif mb-6">Celebrating Healthy Occasions</h2>
                        <p className="text-[var(--color-text)]/70 text-xl max-w-3xl mx-auto leading-relaxed">
                            From office gatherings to family celebrations, our millet-catering brings wholesomeness to every event.
                        </p>
                    </motion.div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                        {cateringStories.map((story, idx) => (
                            <motion.div
                                key={idx}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={fadeUpVariant}
                                className="bg-white p-10 md:p-12 rounded-[2.5rem] border border-[var(--color-border)] shadow-2xl hover:border-[var(--color-primary)]/50 transition-colors"
                            >
                                <h3 className="text-[var(--color-primary)] text-2xl font-black font-serif mb-4">{story.type}</h3>
                                <p className="text-[var(--color-text)]/80 text-lg leading-relaxed mb-8 italic">
                                    "{story.text}"
                                </p>
                                <div className="flex items-center gap-4">
                                    <div className="w-3 h-3 rounded-full bg-[var(--color-secondary)] shadow-lg shadow-[var(--color-secondary)]/50"></div>
                                    <span className="text-lg font-bold text-[var(--color-text)]">{story.name}</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final Footer Quote */}
            <section className="bg-[var(--color-bg)] py-24 px-6 text-center border-t border-[var(--color-border)]">
                <div className="max-w-4xl mx-auto">
                    <p className="text-2xl md:text-3xl font-serif text-[var(--color-primary)] font-black leading-relaxed italic mb-8">
                        "Sometimes the healthiest choices are also the most delicious."
                    </p>
                    <div className="w-16 h-1 bg-[var(--color-secondary)] mx-auto rounded-full"></div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
