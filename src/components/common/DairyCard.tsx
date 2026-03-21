import { useEffect, useState } from 'react';

import { Check, EllipsisVertical } from 'lucide-react';

import { CheckBoxButton } from '@/components/common/CircleIButton';
import SingleAvatar from '@/components/common/SingleAvatar';
import cn from '@/lib/utils';

type CalendarDiaryCardParticipant = {
  id: string;
  name: string;
  src: string;
};

export type DairyCardItem = {
  id: string;
  title: string;
  description: string;
  time: string;
  participants: CalendarDiaryCardParticipant[];
  checked?: boolean;
};

type DairyCardProps = {
  item: DairyCardItem;
  className?: string;
};

function DairyCard({ item, className }: DairyCardProps) {
  const [isChecked, setIsChecked] = useState(item.checked ?? false);

  useEffect(() => {
    setIsChecked(item.checked ?? false);
  }, [item.checked]);

  return (
    <article
      className={cn(
        'flex w-full flex-col gap-5 border-l-2 border-neutral-900 bg-neutral-100 py-4 pr-4 pl-3 text-neutral-900',
        className,
      )}
    >
      <div className="flex w-full items-start justify-between">
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex items-center gap-2 text-neutral-900">
            <span
              className={cn(
                'size-1.5 rounded-full',
                isChecked ? 'bg-primary-default' : 'bg-neutral-800',
              )}
            />
            <p className="font-label-lg">{item.time}</p>
          </div>
          <div className="pl-4.5">
            <h2 className="font-heading-sm">{item.title}</h2>
            <p className="font-paragraph-sm mt-3 text-neutral-700">
              {item.description}
            </p>
          </div>
        </div>
        <button
          type="button"
          aria-label="更多選項"
          className="ml-7.75 inline-flex size-6 items-center justify-center rounded-full bg-transparent text-neutral-600"
        >
          <EllipsisVertical className="size-4" strokeWidth={2.5} />
        </button>
      </div>

      <div className="flex items-center justify-between gap-3 pl-4.5">
        <div className="flex items-center gap-2">
          {item.participants.map((participant) => (
            <SingleAvatar
              key={participant.id}
              src={participant.src}
              name={participant.name}
              className="size-7.5 ring-2"
            />
          ))}
        </div>
        <CheckBoxButton
          size="md"
          checked={isChecked}
          onCheckedChange={setIsChecked}
          aria-label={`標記${item.title}完成`}
          checkedClassName="bg-neutral-900 text-neutral-50  "
          uncheckedClassName="border-2 border-neutral-900 bg-neutral-50 text-neutral-900"
        >
          <Check />
        </CheckBoxButton>
      </div>
    </article>
  );
}

export default DairyCard;
