// Types shared across components

export interface BlockContent {
    heading?: string;
    body?: string;
    url?: string;
    thumbnail?: string;
    muted?: boolean;
    loop?: boolean;
    autoPlay?: boolean;
    alt?: string;
    caption?: string;
    text?: string;
    link?: string;
    linkType?: 'internal' | 'external';
    alignment?: 'left' | 'center' | 'right';
}

export interface BlockStyles {
    textAlign?: 'left' | 'center' | 'right';
    color?: string;
    fontSize?: string;
    backgroundColor?: string;
}

export interface BlockAnimations {
    type?: 'fade' | 'slide-up' | 'slide-down' | 'zoom' | 'bounce' | 'none';
    delay?: number;
    duration?: number;
}

export interface BlockVisibility {
    mobile?: boolean;
    tablet?: boolean;
    desktop?: boolean;
}

export interface Block {
    id: string;
    type: 'text' | 'image' | 'video' | 'button' | 'product_list';
    content: BlockContent;
    styles: BlockStyles;
    animations: BlockAnimations;
    visibility: BlockVisibility;
}

export interface SectionStyles {
    backgroundColor?: string;
    padding?: string;
    backgroundImage?: string;
}

export interface Section {
    id: string;
    layout: 'boxed' | 'full' | 'split';
    background_type?: 'color' | 'image' | 'video' | 'gradient' | 'animation';
    background_video?: {
        url: string;
        muted: boolean;
        loop: boolean;
        opacity: number;
    };
    background_gradient?: {
        type: 'linear' | 'radial';
        angle: string;
        stops: string[];
    };
    background_animation?: {
        type: 'none' | 'mesh' | 'fluid' | 'particles';
        intensity: 'low' | 'medium' | 'high';
    };
    styles: SectionStyles;
    blocks: Block[];
}

export interface Page {
    _id?: string;
    id?: string;
    name: string;
    slug: string;
    is_active: boolean;
    sections: Section[];
    layout?: string;
}

export interface StoryContent {
    type: 'text' | 'image' | 'video' | 'heading' | 'subheading';
    content?: string;
    url?: string;
    caption?: string;
}

export interface Hero {
    _id?: string;
    title: string;
    subtitle: string;
    description: string;
    backgroundImage: string;
    videoUrl?: string; // Optional video background
    ctaText: string;
    ctaLink: string;
    secondaryCtaText: string;
    secondaryCtaLink: string;
}

export interface Story {
    _id: string;
    title: string;
    subtitle: string;
    thumbnailImage: string;
    heroImage: string;
    shortExcerpt: string;
    fullStoryContent: StoryContent[];
    is_active: boolean;
}

export interface Promotion {
    _id?: string;
    id?: string;
    title: string;
    subtitle?: string;
    description?: string;
    ctaText: string;
    ctaLink: string;

    // Typography
    title_font?: string;
    title_size?: string;
    title_color?: string;
    subtitle_font?: string;
    subtitle_size?: string;
    subtitle_color?: string;

    // Targeting
    target_type?: 'all' | 'category' | 'product';
    target_ids?: string[];
    coupon_code?: string;

    background_type: 'color' | 'image' | 'video' | 'gradient';
    background_image?: string;
    background_video?: string;
    background_color?: string;
    background_gradient?: {
        type: 'linear' | 'radial';
        angle: string;
        stops: string[];
    };
    is_active: boolean;
    order: number;
}
