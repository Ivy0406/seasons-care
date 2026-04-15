import { useState } from 'react';

import FixedBottomButton from '@/components/common/FixedBottomButton';
import Modal from '@/components/common/Modal';
import { PageNavigationBar } from '@/components/common/NavigationBar';
import { RoundedButtonPro } from '@/components/common/RoundedButtons';
import SideMenu from '@/components/common/SideMenu';
import UpgradeCTADrawer from '@/components/common/UpgradeCTADrawer';
import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogPopup,
  AlertDialogPortal,
} from '@/components/ui/alert-dialog';
import useGetGroups from '@/features/groups/hooks/useGetGroups';
import AIAnalysisReport from '@/features/health/components/AIAnalysisReport';
import CreateDataCard from '@/features/health/components/CreateDataCard';
import HealthSummaryCarousel from '@/features/health/components/HealthSummaryCarousel';
import WeeklyHealthTrend from '@/features/health/components/WeeklyHealthTrend';
import useGetWeeklyInsight from '@/features/health/hooks/useGetWeeklyInsight';
import RecordingDrawer from '@/features/voice/components/RecordingDrawer';
import useCurrentGroupId from '@/hooks/useCurrentGroupID';

type SubmitModalState = {
  open: boolean;
  variant: 'success' | 'error';
  title: string;
};

function HealthReportPage() {
  const { data: weeklyInsight } = useGetWeeklyInsight();
  const { currentGroupId } = useCurrentGroupId();
  const { data: groups } = useGetGroups();
  const patientName =
    groups?.find((g) => g.id === currentGroupId)?.recipientName ?? '';
  const [showCreateCard, setShowCreateCard] = useState(false);
  const [showRecordingDrawer, setShowRecordingDrawer] = useState(false);
  const [showUpgradeCTA, setShowUpgradeCTA] = useState(false);
  const [submitModal, setSubmitModal] = useState<SubmitModalState>({
    open: false,
    variant: 'success',
    title: '',
  });
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-200 flex-col bg-neutral-200 pb-20">
      <PageNavigationBar
        title="健康"
        className="px-6"
        onMenuClick={() => setIsSideMenuOpen(true)}
      />

      <section className="w-full bg-neutral-800 py-5 text-neutral-50">
        <div className="mx-auto w-full max-w-200 px-6">
          <AIAnalysisReport
            patientName={patientName}
            summary={weeklyInsight?.overallSummary ?? ''}
            keyInsight={weeklyInsight?.keyInsight ?? ''}
            actionSuggestion={weeklyInsight?.actionSuggestion ?? ''}
            onViewHistory={() => setShowUpgradeCTA(true)}
          />
        </div>
      </section>
      <section>
        <HealthSummaryCarousel />
      </section>
      <div className="mx-auto w-full max-w-200 px-6">
        <WeeklyHealthTrend />
      </div>

      <div className="mx-auto mt-6 w-full max-w-200 px-6">
        <RoundedButtonPro onClick={() => setShowUpgradeCTA(true)}>
          輸出成完整PDF
        </RoundedButtonPro>
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
          <AlertDialogPopup className="w-[calc(100vw-32px)] max-w-140 border-0 bg-transparent p-0 shadow-none">
            <CreateDataCard
              onClose={() => setShowCreateCard(false)}
              onVoiceInput={() => {
                setShowCreateCard(false);
                setShowRecordingDrawer(true);
              }}
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

      <UpgradeCTADrawer
        open={showUpgradeCTA}
        onOpenChange={setShowUpgradeCTA}
      />

      <RecordingDrawer
        open={showRecordingDrawer}
        onOpenChange={setShowRecordingDrawer}
        onFinish={() => setShowRecordingDrawer(false)}
      />

      <Modal
        open={submitModal.open}
        variant={submitModal.variant}
        title={submitModal.title}
        statusLayout="icon-first"
        autoCloseMs={submitModal.variant === 'success' ? 1500 : undefined}
        onClose={() => setSubmitModal((prev) => ({ ...prev, open: false }))}
      />
      <SideMenu open={isSideMenuOpen} onOpenChange={setIsSideMenuOpen} />
    </main>
  );
}

export default HealthReportPage;
