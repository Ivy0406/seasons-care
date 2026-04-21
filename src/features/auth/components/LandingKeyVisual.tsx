function Landing() {
  return (
    <div className="flex h-130 w-full flex-col items-center justify-center gap-15">
      <div className="flex flex-col items-center gap-3">
        <p className="font-heading-lg text-neutral-900">細心灌溉每一份日常</p>
        <p className="font-heading-lg text-neutral-900">讓陪伴緩緩紮根</p>
      </div>
      <div className="h-40 w-30">
        <img
          className="w-full object-cover object-center"
          src="https://res.cloudinary.com/dyothufps/image/upload/v1774850087/%E5%89%8D%E5%B0%8E1_ejw28k.webp"
          alt="品牌主視覺"
        />
      </div>
    </div>
  );
}

export default Landing;
