'use client';

import React from 'react';

function classNames(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

type PitchLoaderProps = {
  loading: boolean;
  icon: React.ReactNode; // same icon as header
  siteName: string;
  // exactly the same color class as the header icon, e.g. 'text-yellow-400'
  brandColorClass?: string;
  className?: string;
};

export default function PitchLoader({
  loading,
  icon,
  siteName,
  brandColorClass = 'text-yellow-400',
  className
}: PitchLoaderProps) {
  return (
    <div
      aria-live="polite"
      aria-busy={loading}
      role="status"
      className={classNames(
        'fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-500',
        loading ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        className
      )}
    >
      <div className="relative flex flex-col items-center gap-6">
        <div
          className={classNames(
            'relative grid place-items-center rounded-full size-32 sm:size-40',
            'bg-white/5 ring-1 ring-white/10',
            brandColorClass
          )}
        >
          <span
            aria-hidden="true"
            className={classNames(
              'absolute inset-0 rounded-full border-2',
              'border-current opacity-20 animate-[ping_2.2s_ease-out_infinite]'
            )}
          />
          <span
            aria-hidden="true"
            className={classNames(
              'absolute inset-0 rounded-full border-2',
              'border-current opacity-10 animate-[ping_2.8s_ease-out_infinite] [animation-delay:300ms]'
            )}
          />
          <span
            aria-hidden="true"
            className={classNames(
              'absolute inset-0 rounded-full border-2',
              'border-current opacity-5 animate-[ping_3.4s_ease-out_infinite] [animation-delay:600ms]'
            )}
          />

          <div className="animate-swell motion-safe:animate-swell [animation-duration:2600ms]">
            <div className="animate-breeze [animation-duration:3200ms]">
              <div className="animate-drift [animation-duration:2800ms]">
                <div className={classNames('text-current drop-shadow-[0_0_10px_rgba(0,0,0,0.25)]')}>
                  {icon}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <span
            className={classNames(
              'block text-3xl sm:text-4xl font-semibold tracking-wide',
              brandColorClass,
              'bg-gradient-to-r from-white/20 via-current to-white/20 bg-[length:200%_100%]',
              'bg-clip-text text-transparent animate-shimmer'
            )}
          >
            {siteName}
          </span>
          <span className="sr-only">{loading ? 'Loading' : 'Loaded'}</span>
        </div>
      </div>
    </div>
  );
}
