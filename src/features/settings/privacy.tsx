import { PRIVACY_CONTENT } from '@/constants/privacy';

function Privacy() {
  return (
    <div className="flex flex-col gap-4 p-6">
      {PRIVACY_CONTENT.map((paragraph) => (
        <p key={paragraph} className="font-paragraph-md text-neutral-900">
          {paragraph}
        </p>
      ))}
    </div>
  );
}

export default Privacy;
