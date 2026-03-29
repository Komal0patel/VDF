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
    'millet': 'https://images.unsplash.com/photo-1586201327693-866199f14162?auto=format&fit=crop&q=80',
    'spice': 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80',
    'oil': 'https://images.unsplash.com/photo-1474979266404-7eaacbad93c5?auto=format&fit=crop&q=80',
    'pickle': 'https://images.unsplash.com/photo-1601000938259-9e92002320b2?auto=format&fit=crop&q=80',
    'honey': 'https://images.unsplash.com/photo-1589927986089-35812388d1f4?auto=format&fit=crop&q=80',
    'jaggery': 'https://images.unsplash.com/photo-1589927986089-35812388d1f4?auto=format&fit=crop&q=80',
    'rice': 'https://images.unsplash.com/photo-1586201327693-866199f14162?auto=format&fit=crop&q=80',
    'flour': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80',
    'grain': 'https://images.unsplash.com/photo-1586201327693-866199f14162?auto=format&fit=crop&q=80',
    'snack': 'https://images.unsplash.com/photo-1599490659213-e2b9527ec0c7?auto=format&fit=crop&q=80',
    'sweet': 'https://images.unsplash.com/photo-1582231373663-36812102aa5d?auto=format&fit=crop&q=80',
    'dal': 'https://images.unsplash.com/photo-1547841022-b558accc7ef8?auto=format&fit=crop&q=80',
    'pulse': 'https://images.unsplash.com/photo-1547841022-b558accc7ef8?auto=format&fit=crop&q=80',
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
