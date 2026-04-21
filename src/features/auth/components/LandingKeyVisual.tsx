import BrandMark from '@/components/common/BrandMark';

function Landing() {
  return (
    <div className="flex h-fit w-full flex-col items-center justify-center gap-15">
      <div className="flex w-fit flex-col items-center gap-3">
        <p className="font-heading-lg text-neutral-900">細心灌溉每一份日常</p>
        <p className="font-heading-lg text-neutral-900">讓陪伴緩緩紮根</p>
      </div>
      <BrandMark
        detailClassName="text-primary-default"
        className="h-full max-h-[89px] w-full max-w-[161px]"
      />
    </div>
  );
}

export default Landing;
