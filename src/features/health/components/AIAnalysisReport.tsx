import { Sparkles } from 'lucide-react';

import { CardLabelSecondary } from '@/components/common/CardLabel';
import Loading from '@/components/common/Loading';
import { RoundedButtonNew } from '@/components/common/RoundedButtons';
import cn from '@/lib/utils';

type AIAnalysisReportProps = {
  patientName: string;
  summary: string;
  keyInsight: string;
  actionSuggestion: string;
  isLoading?: boolean;
  onViewHistory?: () => void;
  className?: string;
};
function AIAnalysisReport({
  patientName,
  summary,
  keyInsight,
  actionSuggestion,
  isLoading = false,
  onViewHistory,
  className,
}: AIAnalysisReportProps) {
  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <div className="flex items-center justify-between">
        <h2 className="font-heading-sm text-neutral-50">AI分析報告</h2>
        <RoundedButtonNew
          onClick={onViewHistory}
          className="font-label-md h-8.25 w-fit px-2"
        >
          查看過往紀錄
        </RoundedButtonNew>
      </div>

      <div className="flex flex-col gap-2 rounded-xl border-2 border-neutral-900 bg-neutral-50 p-3">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loading />
          </div>
        ) : (
          <>
            <div className="flex gap-3 pt-3 pb-5">
              <Sparkles
                size={20}
                className="mt-0.5 shrink-0 text-neutral-900"
              />
              <p className="font-paragraph-md text-neutral-900">
                <span className="font-label-md">{patientName}</span>
                {summary}
              </p>
            </div>
            <div className="flex flex-col gap-2 border-b-2 border-neutral-900 p-3">
              <CardLabelSecondary className="bg-neutral-800 text-neutral-50">
                關鍵數據洞察
              </CardLabelSecondary>
              <p className="font-paragraph-md text-neutral-900">{keyInsight}</p>
            </div>

            <div className="flex flex-col gap-2 p-3">
              <CardLabelSecondary className="bg-neutral-800 text-neutral-50">
                健康行動建議
              </CardLabelSecondary>
              <p className="font-paragraph-md text-neutral-900">
                {actionSuggestion}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default AIAnalysisReport;
