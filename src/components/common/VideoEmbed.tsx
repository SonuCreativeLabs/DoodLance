import React from 'react';

interface VideoEmbedProps {
    url: string;
    title?: string;
    className?: string;
}

const getEmbedUrl = (url: string): string | null => {
    if (!url) return null;

    // YouTube
    const youtubeMatch = url.match(/(?:youtu\.be\/|youtube\.com\/watch\?v=|youtube\.com\/embed\/)([^#&?]*)/);
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

    // TikTok
    // TikTok also requires an embed endpoint or SDK.
    // https://www.tiktok.com/@user/video/ID -> https://www.tiktok.com/embed/v2/ID?lang=en-US  (This is unofficial/undocumented often changes)
    // Converting to standard checking is hard without SDK. 
    // For now, let's treat unknown or basic URLs as potential direct iframes if they match known patterns, otherwise just return null or use a generic iframe if the user insists.
    // Given the brief, simpler embeds like YT/Vimeo are safest. 
    // For others, if we can't detect a clean embed URL, we might fallback or show a link.

    return null;
};

export const VideoEmbed: React.FC<VideoEmbedProps> = ({ url, title, className = '' }) => {
    const embedUrl = getEmbedUrl(url);

    if (!embedUrl) {
        // Fallback: If we can't embed it, just show a link
        return (
            <div className={`p-4 bg-white/5 rounded-lg border border-white/10 ${className}`}>
                <p className="text-white/60 text-sm mb-2">Video available at:</p>
                <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-400 hover:text-purple-300 underline text-sm break-all"
                >
                    {url}
                </a>
            </div>
        );
    }

    return (
        <div className={`relative w-full overflow-hidden rounded-lg bg-black/50 aspect-video ${className}`}>
            <iframe
                src={embedUrl}
                title={title || "Video player"}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute top-0 left-0 w-full h-full border-0"
            />
        </div>
    );
};
