import { RoundedButtonPro } from '@/components/common/RoundedButtons';
import AIAnalysisReport from '@/features/health/components/AIAnalysisReport';
import WeeklyHealthTrend from '@/features/health/components/WeeklyHealthTrend';

const REPORT_DATA = {
  patientName: '王爸爸',
  summary:
    '的健康狀況在過去 7 天內呈現正面趨勢。血壓已完全進入理想區間，體重管理效果顯著。',
  keyInsight: '血糖水平在飯後有輕微波動（+8%），主要集中在週三及週五。',
  actionSuggestion:
    '為維持穩定血糖，建議將澱粉攝取量減少 15%，並持續目前的低鈉飲食以保護已趨穩定的血壓指標。',
};

function HealthReportPage() {
  return (
    <main className="flex min-h-screen w-full flex-col bg-neutral-200 pb-10 text-neutral-900">
      <div className="mx-auto mt-14 flex w-full max-w-200 items-center px-6 py-3">
        <h1 className="font-heading-lg">近期報告</h1>
      </div>

      <section className="bg-primary-default w-full py-5">
        <div className="mx-auto w-full max-w-200 px-6">
          <AIAnalysisReport
            patientName={REPORT_DATA.patientName}
            summary={REPORT_DATA.summary}
            keyInsight={REPORT_DATA.keyInsight}
            actionSuggestion={REPORT_DATA.actionSuggestion}
          />
        </div>
      </section>

      <div className="mx-auto w-full max-w-200 px-6">
        <WeeklyHealthTrend />
      </div>

      <div className="mx-auto mt-6 w-full max-w-200 px-6">
        <RoundedButtonPro>輸出成完整PDF</RoundedButtonPro>
      </div>
    </main>
  );
}

export default HealthReportPage;
