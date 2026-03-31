import cn from '@/lib/utils';

type BrandMarkProps = {
  className?: string;
  detailClassName?: string;
  primaryColor?: string;
  detailColor?: string;
};

function BrandMark({
  className,
  detailClassName,
  primaryColor,
  detailColor,
}: BrandMarkProps) {
  return (
    <svg
      viewBox="0 0 60 33"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('h-8.25 w-auto text-neutral-800', className)}
      style={primaryColor ? { color: primaryColor } : undefined}
      aria-hidden="true"
    >
      <g clipPath="url(#brand-mark-clip)">
        <path
          d="M30.4102 0C23.3461 8.98034e-05 17.2634 3.60253 14.5197 8.78287C13.8611 10.0264 12.6782 10.9543 11.2913 11.1922C5.26324 12.2258 0.821289 15.7744 0.821289 19.9941C0.82144 25.0238 7.13255 29.1016 14.918 29.1016C15.7328 29.1016 16.5314 29.0567 17.3083 28.9707C19.5157 28.7264 22.2663 30.2149 24.2226 31.2664C25.8267 32.1286 28.0228 32.6602 30.4453 32.6602C32.8824 32.6602 35.0907 32.1222 36.6976 31.2508C38.6347 30.2003 41.3399 28.731 43.5304 28.9716C44.3018 29.0564 45.0946 29.1006 45.9033 29.1006C53.6886 29.1005 59.9998 25.0237 60 19.9941C60 15.7747 55.5583 12.2262 49.5309 11.1923C48.1441 10.9544 46.9612 10.0264 46.3026 8.78293C43.5587 3.60235 37.4745 0 30.4102 0Z"
          fill="currentColor"
        />
        <g
          className={cn('text-neutral-50', detailClassName)}
          style={detailColor ? { color: detailColor } : undefined}
        >
          <path
            d="M29.0397 16.7488C29.0397 15.978 29.6646 15.3531 30.4354 15.3531C31.2063 15.3531 31.8312 15.978 31.8312 16.7488V23.0296C31.8312 23.8005 31.2063 24.4254 30.4354 24.4254C29.6646 24.4254 29.0397 23.8005 29.0397 23.0296V16.7488Z"
            fill="currentColor"
          />
          <path
            d="M36.7163 19.3781C37.1017 18.7105 37.9554 18.4818 38.6229 18.8672C39.2905 19.2526 39.5192 20.1063 39.1338 20.7738L37.7381 23.1913C37.3526 23.8589 36.499 24.0876 35.8315 23.7022C35.1639 23.3168 34.9352 22.4632 35.3206 21.7956L36.7163 19.3781Z"
            fill="currentColor"
          />
          <path
            d="M21.7372 20.7937C21.3518 20.1261 21.5805 19.2725 22.248 18.8871C22.9156 18.5017 23.7692 18.7304 24.1547 19.398L25.5504 21.8154C25.9358 22.483 25.7071 23.3366 25.0395 23.722C24.3719 24.1075 23.5183 23.8787 23.1329 23.2112L21.7372 20.7937Z"
            fill="currentColor"
          />
        </g>
      </g>
      <defs>
        <clipPath id="brand-mark-clip">
          <rect width="60" height="33" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

export default BrandMark;
