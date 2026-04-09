type OnboardingStep = {
  id: number;
  title: string;
  description: string;
  buttonText: string;
  image: string;
};

const onboardingSteps: OnboardingStep[] = [
  {
    id: 0,
    title: '趨勢報表，智慧生成',
    description: 'AI 整合各類照護紀錄，\n產出關鍵指標統計報告。',
    buttonText: '讚！',
    image:
      'https://res.cloudinary.com/dyothufps/image/upload/onboarding1_2x_pefqjn.webp',
  },
  {
    id: 1,
    title: '多人照護，同步協作。',
    description: '即時同步健康日誌與行程，\n共感步調，守護日常。',
    buttonText: '好酷！',
    image:
      'https://res.cloudinary.com/dyothufps/image/upload/v1774934773/onboarding2_2x_kispup.webp',
  },
  {
    id: 2,
    title: '透明開支，輕鬆分帳。',
    description: '數位追蹤醫療雜支，\n一鍵搞定尷尬的家庭分帳。',
    buttonText: '等不及要開始使用了！',
    image:
      'https://res.cloudinary.com/dyothufps/image/upload/v1774934772/onboarding3_2x_el71ud.webp',
  },
];

export default onboardingSteps;
