type Measurement = number | '--';

type HealthData = {
  time: string;
  summary: { content: string };
  bloodPressure: { systolic: Measurement; diastolic: Measurement };
  temperature: Measurement;
  bloodOxygen: Measurement;
  weight: Measurement;
  bloodSugar: {
    morning: Measurement;
    noon: Measurement;
    night: Measurement;
  };
};

const mockHealthData: HealthData = {
  time: '10:00',
  summary: {
    content:
      '下午已完成血壓測量，數值偏高，建議傍晚減少咖啡因攝取。今日復健進度已達成 80%，再加油一點點！',
  },
  bloodPressure: { systolic: 142, diastolic: 92 },
  temperature: 36.5,
  bloodOxygen: 98,
  weight: 70.1,
  bloodSugar: {
    morning: 155,
    noon: 155,
    night: '--',
  },
};

export default function useHealth() {
  return mockHealthData;
}
