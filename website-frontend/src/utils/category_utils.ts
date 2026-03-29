export const deduplicateBy = (arr: any[], key: string) => {
    const seen = new Set();
    return arr.filter(item => {
        const val = item[key];
        if (seen.has(val)) {
            return false;
        }
        seen.add(val);
        return true;
    });
};

const CATEGORY_IMAGES: Record<string, string> = {
    'millet': '/assets/categories/millet_rice_collection_hero_17747455897.png',
    'rice': '/assets/categories/millet_rice_collection_hero_1774757455897.png',
    'spice': '/assets/categories/masala_spices_collection_hero_1774757490910.png',
    'masala': '/assets/categories/masala_spices_collection_hero_1774757490910.png',
    'oil': '/assets/categories/oils_collection_hero_1774757551576.png',
    'pickle': '/assets/categories/pickles_jar_hero_1774757530659.png',
    'honey': '/assets/categories/natural_sweeteners_hero_1774757913510.png',
    'jaggery': '/assets/categories/natural_sweeteners_hero_1774757913510.png',
    'sweetener': '/assets/categories/natural_sweeteners_hero_1774757913510.png',
    'sugar': '/assets/categories/natural_sweeteners_hero_1774757913510.png',
    'flour': '/assets/categories/roti_flour_collection_hero_1774757472898.png',
    'roti': '/assets/categories/roti_flour_hero_v2_1774757947067.png',
    'breakfast': '/assets/categories/breakfast_collection_hero_1774757381802.png',
    'chutney': '/assets/categories/chutney_podi_collection_hero_1774757399256.png',
    'podi': '/assets/categories/chutney_podi_collection_hero_1774757399256.png',
    'sweet': '/assets/categories/sweets_savory_collection_hero_1774757418927.png',
    'savory': '/assets/categories/sweets_savory_collection_hero_1774757418927.png',
    'snacks': '/assets/categories/sweets_savory_collection_hero_1774757418927.png',
    'spreads': '/assets/categories/spreads_mayonnaise_collection_hero_1774757436728.png',
    'mayonnaise': '/assets/categories/spreads_mayonnaise_collection_hero_1774757436728.png',
    'tea': '/assets/categories/herbal_tea_collection_hero_1774757508045.png',
    'energy': '/assets/categories/soup_ganji_hero_1774757930273.png',
    'soup': '/assets/categories/soup_ganji_hero_1774757930273.png',
    'ganji': '/assets/categories/soup_ganji_hero_1774757930273.png',
    'pasta': '/assets/categories/pasta_noodles_collection_hero_1774757897086.png',
    'noodle': '/assets/categories/pasta_noodles_collection_hero_1774757897086.png',
    'baby': '/assets/categories/baby_food_porridge_hero_1774757965317.png',
    'kid': '/assets/categories/baby_food_porridge_hero_1774757965317.png',
    'women': '/assets/categories/women_health_wellness_hero_1774757984956.png',
    'wellness': '/assets/categories/women_health_wellness_hero_1774757984956.png',
    'body': '/assets/categories/women_health_wellness_hero_1774757984956.png',
    'relax': '/assets/categories/women_health_wellness_hero_1774757984956.png',
    'pocket': '/assets/categories/candies_chocolates_hero_1774757565736.png',
    'candy': '/assets/categories/candies_chocolates_hero_1774757565736.png',
    'chocolate': '/assets/categories/candies_chocolates_hero_1774757565736.png',
    'diabetic': '/assets/categories/natural_sweeteners_hero_1774757913510.png',
    'db friendly': '/assets/categories/natural_sweeteners_hero_1774757913510.png',
    'gut': '/assets/categories/natural_sweeteners_hero_1774757913510.png',
};

const DEFAULT_IMAGES = [
    'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1506484334402-40ff2269c4f1?auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1488459711615-de64ef5993f7?auto=format&fit=crop&q=80',
];

export const getCategoryImage = (name: string, currentUrl?: string) => {
    if (currentUrl && currentUrl.length > 10) return currentUrl;
    
    const lowerName = name.toLowerCase();
    for (const [key, url] of Object.entries(CATEGORY_IMAGES)) {
        if (lowerName.includes(key)) {
            return url;
        }
    }

    // Default based on hash to keep it consistent for the same category name
    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return DEFAULT_IMAGES[hash % DEFAULT_IMAGES.length];
};
