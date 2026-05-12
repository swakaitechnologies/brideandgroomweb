"use client";

import { useEffect, useRef } from 'react';

interface AdSenseContainerProps {
    client?: string;
    slot: string;
    format?: 'auto' | 'fluid' | 'rectangle';
    responsive?: 'true' | 'false';
    className?: string;
    label?: string;
}

const AdSenseContainer = ({
    client = "ca-pub-4900041868891655", // Bride&Groom Publisher ID
    slot,
    format = 'auto',
    responsive = 'true',
    className = "",
    label = "Advertisement"
}: AdSenseContainerProps) => {
    const adRef = useRef<HTMLModElement>(null);

    useEffect(() => {
        try {
            // @ts-expect-error - adsbygoogle is injected by external script
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (err) {
            console.error("AdSense Error:", err);
        }
    }, [slot]);

    return (
        <div className={`adsense-wrapper my-6 overflow-hidden ${className}`}>
            {label && (
                <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-medium text-black  tracking-[0.2em]">
                        {label}
                    </span>
                    <span className="text-[10px] font-medium text-secondary hover:text-primary transition-colors cursor-help flex items-center gap-1 group">
                        AdChoices
                        <div className="w-2 h-2 rounded-full border border-secondary group-hover:bg-secondary transition-colors" />
                    </span>
                </div>
            )}
            <div
                className="bg-muted/5 rounded-2xl border border-border/50 flex items-center justify-center relative overflow-hidden min-h-[100px]"
                style={{ minHeight: format === 'fluid' ? '250px' : '100px' }}
            >
                <ins
                    ref={adRef}
                    className="adsbygoogle"
                    style={{ display: 'block' }}
                    data-ad-client={client}
                    data-ad-slot={slot}
                    data-ad-format={format}
                    data-full-width-responsive={responsive}
                />
                {/* Placeholder for development/empty state */}
                <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                    <span className="text-4xl font-medium italic tracking-tighter">Bride&Groom Ads</span>
                </div>
            </div>
        </div>
    );
};

export default AdSenseContainer;





