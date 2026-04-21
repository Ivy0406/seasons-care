import { format, parseISO } from 'date-fns';
import { Bell } from 'lucide-react';

import type { CareLogEntry } from '@/pages/CareLog/types';

type UpcomingImportantEntryNoticeProps = {
  entry: CareLogEntry;
};

function UpcomingImportantEntryNotice({
  entry,
}: UpcomingImportantEntryNoticeProps) {
  return (
    <div className="flex items-center gap-5 rounded-sm bg-neutral-800 px-4 py-3 text-neutral-100">
      <Bell className="size-8 shrink-0" />
      <div className="flex min-w-0 flex-col">
        <p className="font-label-md">即將到來的重要行程</p>
        <div className="flex items-center justify-center gap-1">
          <p className="font-label-md truncate">
            {format(parseISO(entry.startsAt), 'HH:mm')}
          </p>
          <p className="font-paragraph-md"> {entry.title}</p>
        </div>
      </div>
    </div>
  );
}

export default UpcomingImportantEntryNotice;
