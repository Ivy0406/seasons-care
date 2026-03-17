function Landing() {
  return (
    <div className="flex h-130 w-full flex-col items-center justify-center gap-15">
      <div className="flex flex-col items-center gap-3">
        <p className="font-heading-lg text-neutral-900">細心灌溉每一份日常</p>
        <p className="font-heading-lg text-neutral-900">讓陪伴緩緩紮根</p>
      </div>
      <div className="h-39 w-25">
        <img
          className="w-full object-cover"
          src="https://cdn.hikka.io/content/characters/pakkun-fe0824/4PC19q5uQm9vr2ot8KgEUw.jpg"
          alt="品牌主視覺"
        />
      </div>
    </div>
  );
}

export default Landing;
