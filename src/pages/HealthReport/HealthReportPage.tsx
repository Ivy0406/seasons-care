import { useState } from 'react';

import FixedBottomButton from '@/components/common/FixedBottomButton';
import Modal from '@/components/common/Modal';
import { PageNavigationBar } from '@/components/common/NavigationBar';
import { RoundedButtonPro } from '@/components/common/RoundedButtons';
import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogPopup,
  AlertDialogPortal,
} from '@/components/ui/alert-dialog';
import AIAnalysisReport from '@/features/health/components/AIAnalysisReport';
import CreateDataCard from '@/features/health/components/CreateDataCard';
import WeeklyHealthTrend from '@/features/health/components/WeeklyHealthTrend';

type SubmitModalState = {
  open: boolean;
  variant: 'success' | 'error';
  title: string;
};

const REPORT_DATA = {
  patientName: '王爸爸',
  summary:
    '的健康狀況在過去 7 天內呈現正面趨勢。血壓已完全進入理想區間，體重管理效果顯著。',
  keyInsight: '血糖水平在飯後有輕微波動（+8%），主要集中在週三及週五。',
  actionSuggestion:
    '為維持穩定血糖，建議將澱粉攝取量減少 15%，並持續目前的低鈉飲食以保護已趨穩定的血壓指標。',
};

function HealthReportPage() {
  const [showCreateCard, setShowCreateCard] = useState(false);
  const [submitModal, setSubmitModal] = useState<SubmitModalState>({
    open: false,
    variant: 'success',
    title: '',
  });

  return (
    <main className="flex min-h-screen w-full flex-col bg-neutral-200 pb-20">
      <PageNavigationBar title="健康" />

      <section className="w-full bg-neutral-800 py-5 text-neutral-50">
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

      <FixedBottomButton label="新增" onClick={() => setShowCreateCard(true)} />

      <AlertDialog
        open={showCreateCard}
        onOpenChange={(open) => {
          if (!open) setShowCreateCard(false);
        }}
      >
        <AlertDialogPortal>
          <AlertDialogBackdrop />
          <AlertDialogPopup className="w-[calc(100vw-32px)] max-w-[560px] border-0 bg-transparent p-0 shadow-none">
            <CreateDataCard
              onClose={() => setShowCreateCard(false)}
              onSuccess={() => {
                setShowCreateCard(false);
                setSubmitModal({
                  open: true,
                  variant: 'success',
                  title: '健康數值新增成功',
                });
              }}
              onError={() =>
                setSubmitModal({
                  open: true,
                  variant: 'error',
                  title: '新增失敗，請稍後再試',
                })
              }
            />
          </AlertDialogPopup>
        </AlertDialogPortal>
      </AlertDialog>

      <Modal
        open={submitModal.open}
        variant={submitModal.variant}
        title={submitModal.title}
        statusLayout="icon-first"
        autoCloseMs={submitModal.variant === 'success' ? 1500 : undefined}
        onClose={() => setSubmitModal((prev) => ({ ...prev, open: false }))}
      />
    </main>
  );
}

export default HealthReportPage;
