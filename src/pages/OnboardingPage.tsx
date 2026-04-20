import { useState } from 'react';

import { useNavigate } from 'react-router';

import { RoundedButtonPrimary } from '@/components/common/RoundedButtons';
import onboardingSteps from '@/features/auth/constants/onboardingSteps';

const OnboardingPage = () => {
  const navigate = useNavigate();
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const minSwipeDistance = 50;

  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      navigate('/group-entrance');
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextStep();
    } else if (isRightSwipe) {
      prevStep();
    }
  };

  const { title, description, buttonText, image } =
    onboardingSteps[currentStep];

  return (
    <main className="w-full bg-neutral-100">
      <div
        className="mx-auto flex h-screen w-full max-w-200 flex-col items-center justify-end px-6 pb-18"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div className="mb-10 h-120 w-full overflow-hidden">
          <img
            src={image}
            alt={title}
            className="h-full w-full object-contain transition-opacity duration-300"
          />
        </div>

        <div className="flex h-26.5 w-full flex-col items-center gap-5 text-center">
          <h2 className="font-heading-lg text-neutral-900">{title}</h2>
          <p className="font-paragraph-md h-13 whitespace-pre-line text-neutral-600">
            {description}
          </p>
        </div>

        <div className="flex gap-2 py-5">
          {onboardingSteps.map((step) => (
            <button
              key={step.id}
              type="button"
              onClick={() => setCurrentStep(step.id)}
              aria-label={`Go to step ${step.id}`}
              className={`h-2 w-2 cursor-pointer rounded-full transition-all duration-300 ${
                step.id === currentStep ? 'bg-neutral-900' : 'bg-neutral-300'
              }`}
            />
          ))}
        </div>

        <div className="w-full">
          <RoundedButtonPrimary onClick={nextStep}>
            {buttonText}
          </RoundedButtonPrimary>
        </div>
      </div>
    </main>
  );
};

export default OnboardingPage;
