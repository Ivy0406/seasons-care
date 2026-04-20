import LandingIcon from '@/assets/icons/landing-icon.svg?react';

function LandingKeyVisual() {
  return (
    <div className="flex h-fit w-full flex-col items-center justify-between">
      <div className="flex flex-col items-center justify-center">
        <LandingIcon />
        <h1 className="font-display-md text-neutral-800">蒔歲</h1>
      </div>
      <div className="flex w-fit flex-col items-center gap-3">
        <p className="font-heading-sm text-neutral-900">細心灌溉每一份日常</p>
        <p className="font-heading-sm text-neutral-900">讓陪伴緩緩紮根</p>
      </div>
      <div />
    </div>
  );
}

export default LandingKeyVisual;
