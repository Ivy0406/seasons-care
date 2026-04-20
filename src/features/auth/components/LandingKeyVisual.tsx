import LandingIcon from '@/assets/icons/landing-icon.svg?react';

function LandingKeyVisual() {
  return (
    <div className="flex h-fit max-h-71 w-full flex-col items-center justify-between">
      <div className="flex flex-col items-center justify-center">
        <LandingIcon />
      </div>
      <div className="flex w-fit flex-col items-center gap-7">
        <h1 className="font-display-md text-neutral-800">蒔歲</h1>
        <div className="flex w-fit flex-col items-center gap-1">
          <p className="font-heading-sm text-neutral-900">細心灌溉每一份日常</p>
          <p className="font-heading-sm text-neutral-900">讓陪伴緩緩紮根</p>
        </div>
      </div>
      <div />
    </div>
  );
}

export default LandingKeyVisual;
