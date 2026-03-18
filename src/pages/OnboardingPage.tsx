import { useState } from 'react';

import { useNavigate } from 'react-router';

import { RoundedButtonPrimary } from '@/components/ui/RoundedButtons';

const OnboardingPage = () => {
  const navigate = useNavigate();
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const minSwipeDistance = 50;

  type MockStep = {
    id: number;
    title: string;
    description: string;
    buttonText: string;
    image: string;
  };
  const mockSteps: MockStep[] = [
    {
      id: 0,
      title: '照護點滴，一目了然。',
      description: '數位化追蹤生理指標與用藥，\n精準掌握健康趨勢。',
      buttonText: '讚！',
      image:
        'https://img.ltn.com.tw/Upload/health/page/800/2022/07/13/phps6VEfF.jpg',
    },
    {
      id: 1,
      title: '趨勢報表，智慧生成。',
      description: 'AI 整合各類照護紀錄，\n產出關鍵指標統計報告。',
      buttonText: '好酷！',
      image:
        'https://blog.tpisoftware.com/wp-content/uploads/2023/02/%E6%96%B0%E8%81%9E%E7%A8%BF_%E7%A4%BE%E7%BE%A41920x1080px-%E8%A4%87%E6%9C%AC.jpg',
    },
    {
      id: 2,
      title: '多人照護，同步協作。',
      description: '共享行事曆與照護計畫，\n確保照護流程不中斷。',
      buttonText: '等不及要開始使用了！',
      image:
        'https://www.airltc.com/photos/new_shares/1100524-retirement-1.jpg',
    },
  ];

  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    if (currentStep < mockSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      navigate('/login');
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

  const { title, description, buttonText, image } = mockSteps[currentStep];

  return (
    <div
      className="flex h-screen w-full flex-col items-center justify-center bg-neutral-100 p-6"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div className="relative mt-15 mb-10 h-120 w-full overflow-hidden bg-neutral-200">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition-opacity duration-300"
        />
      </div>

      <div className="flex h-[106px] w-full flex-col items-center gap-4 text-center">
        <h2 className="font-heading-lg text-neutral-900">{title}</h2>
        <p className="font-paragraph-md h-13 whitespace-pre-line text-neutral-600">
          {description}
        </p>
      </div>

      <div className="mt-8 mb-auto flex gap-2">
        {mockSteps.map((step) => (
          <button
            key={step.id}
            type="button"
            onClick={() => setCurrentStep(step.id)}
            aria-label={`Go to step ${step.id + 1}`}
            className={`h-2 w-2 cursor-pointer rounded-full transition-all duration-300 ${
              step.id === currentStep ? 'bg-neutral-900' : 'bg-neutral-300'
            }`}
          />
        ))}
      </div>

      <div className="w-full pb-12">
        <RoundedButtonPrimary onClick={nextStep}>
          {buttonText}
        </RoundedButtonPrimary>
      </div>
    </div>
  );
};

export default OnboardingPage;
