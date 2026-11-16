import { useState } from 'react';
import { Shield } from 'lucide-react';

interface MediaFrameProps {
  src: string;
  alt: string;
  caption?: string;
  aspectClass?: string;
  priority?: boolean;
}

export function MediaFrame({
  src,
  alt,
  caption,
  aspectClass = 'aspect-video',
  priority = false,
}: MediaFrameProps) {
  const [hasError, setHasError] = useState(false);

  return (
    <figure className="w-full">
      <div
        className={`relative w-full overflow-hidden rounded-lg border border-white/10 bg-[#141417] ${aspectClass}`}
      >
        {!hasError ? (
          <img
            src={src}
            alt={alt}
            loading={priority ? 'eager' : 'lazy'}
            referrerPolicy="no-referrer"
            onError={() => setHasError(true)}
            className="h-full w-full object-cover transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-[#18181D] via-[#121215] to-[#0B0B0D] p-6 text-center">
            <Shield className="h-8 w-8 text-[#C89B3C]/70" aria-hidden="true" />
            <p className="font-display text-sm text-[#EAE6DF]">{alt}</p>
          </div>
        )}
      </div>
      {caption && (
        <figcaption className="mt-2.5 text-xs leading-relaxed text-[#9C968B] italic">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
