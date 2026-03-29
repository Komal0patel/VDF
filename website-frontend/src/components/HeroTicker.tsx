import React from 'react';
import { motion } from 'framer-motion';

interface HeroTickerProps {
    items: string[];
    height?: string;
    textColor?: string;
    bgColor?: string;
    speed?: number;
}

const HeroTicker: React.FC<HeroTickerProps> = ({ 
    items, 
    height = "py-3", 
    textColor = "text-white", 
    bgColor = "bg-[var(--color-primary)]",
    speed = 20
}) => {
    // Ensure we have enough items for the loop
    const displayItems = [...items, ...items, ...items, ...items];

    return (
        <div className={`relative w-full overflow-hidden ${bgColor} ${height} select-none border-b border-white/5`}>
            <motion.div
                className="flex whitespace-nowrap gap-16"
                animate={{
                    x: [0, -2000]
                }}
                transition={{
                    duration: speed,
                    repeat: Infinity,
                    ease: "linear"
                }}
            >
                {displayItems.map((item, index) => (
                    <div key={index} className="flex items-center gap-8">
                        <span className={`text-[9px] font-black uppercase tracking-[0.25em] ${textColor}`}>{item}</span>
                        <div className="w-1.5 h-1.5 rounded-full bg-current opacity-30" />
                    </div>
                ))}
            </motion.div>
        </div>
    );
};

export default HeroTicker;
