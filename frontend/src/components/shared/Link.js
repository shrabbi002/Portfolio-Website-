'use client';

/**
 * Custom Link component that works with both regular Next.js
 * and static export. Uses standard <a> tags to avoid
 * Next.js internal useSearchParams() which breaks static export.
 */
export default function Link({ href, children, className, target, rel, onClick, title, ...props }) {
    const handleClick = (e) => {
        if (onClick) onClick(e);

        // For external links or target="_blank", let browser handle
        if (target === '_blank' || href?.startsWith('http') || href?.startsWith('mailto') || href?.startsWith('tel')) {
            return;
        }

        // For internal navigation, prevent default and use window.location
        // This avoids Next.js router which uses useSearchParams
        if (href && !e.defaultPrevented) {
            e.preventDefault();
            window.location.href = href;
        }
    };

    return (
        <a href={href} className={className} target={target} rel={rel} onClick={handleClick} title={title} {...props}>
            {children}
        </a>
    );
}
