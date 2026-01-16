import React from 'react';

interface VideoEmbedProps {
    url: string;
    title?: string;
    className?: string;
    preview?: boolean;
}

const getEmbedUrl = (url: string): string | null => {
    if (!url) return null;

    // YouTube & YouTube Shorts
    const youtubeMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([^#&?]*)/);
    if (youtubeMatch) {
        return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
    }

    // Vimeo
    const vimeoMatch = url.match(/(?:vimeo\.com\/)(\d+)/);
    if (vimeoMatch) {
        return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    }

    // Google Drive (Video only, requires public access)
    // Assuming the user provides a preview link or view link, we try to convert to preview/embed
    // https://drive.google.com/file/d/VIDEO_ID/view -> https://drive.google.com/file/d/VIDEO_ID/preview
    const driveMatch = url.match(/drive\.google\.com\/file\/d\/([^/]+)/);
    if (driveMatch) {
        return `https://drive.google.com/file/d/${driveMatch[1]}/preview`;
    }

    // Instagram
    // Instagram embeds are tricky and usually require their JS SDK or an iframe to their embed endpoint.
    // Simple iframe to /embed might work for public posts.
    // https://www.instagram.com/p/CODE/ -> https://www.instagram.com/p/CODE/embed
    // https://www.instagram.com/reel/CODE/ -> https://www.instagram.com/reel/CODE/embed
    const instagramMatch = url.match(/instagram\.com\/(?:p|reel)\/([^/?#&]+)/);
    if (instagramMatch) {
        return `https://www.instagram.com/p/${instagramMatch[1]}/embed`;
    }

    // Facebook - Moved to Smart Card fallback due to iframe restrictions
    // if (url.match(/facebook\.com|fb\.watch/)) { ... }

    // LinkedIn
    // Match 'urn:li:ugcPost:123' or 'activity-123' patterns and try to construct embed
    // Common format: https://www.linkedin.com/posts/username_slug-activity-123456789...
    // Embed format: https://www.linkedin.com/embed/feed/update/urn:li:share:ACTIVITY_ID or similar
    // Actually LinkedIn embeds are notoriously tricky to guess from public URLs without OEmbed.
    // We will try the generic embed endpoint if it matches an activity ID.
    // Supports 'activity-123' (from posts/slug) and 'activity:123' (from URNs)
    const linkedInMatch = url.match(/activity[-:]([0-9]+)/);
    if (linkedInMatch) {
        return `https://www.linkedin.com/embed/feed/update/urn:li:activity:${linkedInMatch[1]}`;
    }

    // TikTok
    // TikTok also requires an embed endpoint or SDK.
    // https://www.tiktok.com/@user/video/ID -> https://www.tiktok.com/embed/v2/ID?lang=en-US  (This is unofficial/undocumented often changes)
    // Converting to standard checking is hard without SDK. 
    // For now, let's treat unknown or basic URLs as potential direct iframes if they match known patterns, otherwise just return null or use a generic iframe if the user insists.
    // Given the brief, simpler embeds like YT/Vimeo are safest. 
    // For others, if we can't detect a clean embed URL, we might fallback or show a link.

    return null;
};

export const getVideoAspectRatio = (url: string): string => {
    // User requested "OK FOR ALL show it in default horizontal ratio"
    return 'aspect-video';
};

export const VideoEmbed: React.FC<VideoEmbedProps> = ({ url, title, className = '', preview = false }) => {
    const embedUrl = getEmbedUrl(url);
    const defaultAspect = getVideoAspectRatio(url);

    // If className already contains an aspect ratio, don't apply default
    const hasAspectClass = className.includes('aspect-');
    const aspectClass = hasAspectClass ? '' : defaultAspect;

    if (!embedUrl) {
        // Fallback: Custom link card for platforms we can't iframe (X, generic)
        const getPlatformInfo = (u: string) => {
            if (u.includes('twitter.com') || u.includes('x.com')) return { name: 'X (Twitter)', color: 'bg-black' };
            if (u.includes('linkedin.com')) return { name: 'LinkedIn', color: 'bg-[#0077b5]' };
            if (u.includes('facebook.com') || u.includes('fb.watch')) return { name: 'Facebook', color: 'bg-[#1877F2]' };
            return { name: 'External Link', color: 'bg-white/10' };
        };
        const platform = getPlatformInfo(url);

        return (
            <div className={`relative w-full h-full flex flex-col items-center justify-center bg-black/50 ${aspectClass} ${className}`}>
                <div className={`w-12 h-12 rounded-full ${platform.color} flex items-center justify-center mb-2 shadow-lg`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                        <polyline points="10 17 15 12 10 7" />
                        <line x1="15" x2="3" y1="12" y2="12" />
                    </svg>
                </div>
                <p className="text-white/90 font-medium z-10">View on {platform.name}</p>
                <p className="text-white/50 text-xs text-center px-4 mt-1 line-clamp-1 max-w-full z-10">{url}</p>

                {/* Click overlay for consistency in ProfilePreview if handled externally */}
                <a href={url} target="_blank" rel="noopener noreferrer" className="absolute inset-0 z-20" aria-label={`View on ${platform.name}`} />
            </div>
        );
    }

    const isInstagram = url.match(/instagram\.com\/(?:p|reel)\//);

    // Preview mode styles for Instagram to crop header/footer
    // Instagram embed header is ~48px-60px. We shift up to hide it.
    // User requested to crop even more, so we increase the negative margins and height extension.
    const iframeStyle: React.CSSProperties = (preview && isInstagram) ? {
        position: 'absolute',
        top: '-80px', // More aggressive top crop
        left: '50%',
        width: '100%',
        height: 'calc(100% + 200px)', // More aggressive bottom crop
        transform: 'translateX(-50%)', // Center width
        border: 0,
    } : {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        border: 0
    };

    return (
        <div className={`relative w-full overflow-hidden rounded-lg bg-black/50 ${aspectClass} ${className}`}>
            <iframe
                src={embedUrl}
                title={title || "Video player"}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className={!(preview && isInstagram) ? "absolute top-0 left-0 w-full h-full border-0" : ""}
                style={iframeStyle}
            />
        </div>
    );
};
