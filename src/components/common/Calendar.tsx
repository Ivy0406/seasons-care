import type { ComponentProps } from 'react';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { type MonthCaptionProps, UI, useDayPicker } from 'react-day-picker';

import SingleAvatar from '@/components/common/SingleAvatar';
import UserGroup from '@/components/common/UserGroup';
import BaseCalendar from '@/components/ui/calendar';
import cn from '@/lib/utils';

type CalendarProps = ComponentProps<typeof BaseCalendar>;

const calendarGroupMembers = [
  {
    src: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiqrpYjz-y8bMs_qvQFR_w4vW_HEUAsQwzgMSbzLMJFytcdMUrY4M25Jx7EjoGDbvSIRaagzEacgR2hIhCLy39aMqWGH9cR-MQ3LjZzljWWCoDjzgU2y7G9nisZk47dRYesEYrG9Bg79XhA/s400/nigaoe_nakajima_atsushi.png',
    name: 'Amy',
  },
  {
    src: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEipUJt5ufuYdkpMS8MbIkWE_zDCxYe3inh3TTB7DVH37W_z8zPS_IU1-2J074kzv0wpHwLbe-pGVyxleTDTORHHUUWZmwkJJKxC4xIrwONn1eslfC_2_gzKACafQwFZjG1NelxBcpzZoTde/s400/nigaoe_masaoka_shiki.png',
    name: 'Ben',
  },
  {
    src: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjl69uVfqLnrYRJTq45_yeYNwVdGPDOg6qFgbZz9pp7P83ki1MYzMreZG6YLR12gF89m6dpSppmJesyF4gNG_X6EWyLliOqcejs7ZFYZm-gy7WKvty5G0gaYp8egXBL3HfjrNZJUL2f9SXU/s400/nigaoe_tekla_badarzewska.png',
    name: 'Chloe',
  },
  {
    src: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgoTl4DxRR5CVuFrHVzaA1D7FpTp_W0jmAQzf89GfkAYaAJL-CipobWEhm-QwSrw9BW01kTyx2tVHChs-3KjZqKCIkjfl7mivcChR4bhFe4Ek22AV7zsCv_0aV19_G-wCfZOS_NYsKTBO0/s400/13_Mussorgsky.png',
    name: 'David',
  },
];

function CalendarMonthCaption({
  calendarMonth,
  className,
  displayIndex,
  children,
  ...props
}: MonthCaptionProps) {
  const { classNames, goToMonth, labels, months, nextMonth, previousMonth } =
    useDayPicker();

  const showPreviousButton = displayIndex === 0;
  const showNextButton = displayIndex === months.length - 1;
  const captionLabel =
    children ??
    `${calendarMonth.date.getFullYear()}.${String(calendarMonth.date.getMonth() + 1).padStart(2, '0')}`;
  const avatarSlot = (
    <UserGroup showArrow={false}>
      {calendarGroupMembers.map((member) => (
        <SingleAvatar
          key={member.name}
          src={member.src}
          name={member.name}
          className="size-7 bg-neutral-300 ring-1 ring-neutral-800"
        />
      ))}
    </UserGroup>
  );

  return (
    <div
      className={cn(
        className,
        'grid w-full grid-cols-[max-content_1fr_max-content] items-center justify-stretch text-neutral-900',
      )}
      {...props}
    >
      <div className="invisible">{avatarSlot}</div>

      <div className="col-start-2 justify-self-center">
        <div className="flex items-center justify-center gap-1">
          {showPreviousButton ? (
            <button
              type="button"
              aria-label={labels.labelPrevious(previousMonth)}
              disabled={!previousMonth}
              onClick={() => {
                if (previousMonth) goToMonth(previousMonth);
              }}
              className={classNames[UI.PreviousMonthButton]}
            >
              <ChevronLeft className="size-2" strokeWidth={5} />
            </button>
          ) : (
            <span className="size-4" aria-hidden="true" />
          )}

          <div className={classNames[UI.CaptionLabel]}>{captionLabel}</div>

          {showNextButton ? (
            <button
              type="button"
              aria-label={labels.labelNext(nextMonth)}
              disabled={!nextMonth}
              onClick={() => {
                if (nextMonth) goToMonth(nextMonth);
              }}
              className={classNames[UI.NextMonthButton]}
            >
              <ChevronRight className="size-2" strokeWidth={5} />
            </button>
          ) : (
            <span className="size-4" aria-hidden="true" />
          )}
        </div>
      </div>

      <div className="col-start-3 justify-self-end">{avatarSlot}</div>
    </div>
  );
}

function Calendar({ components, ...props }: CalendarProps) {
  return (
    <BaseCalendar
      components={{
        MonthCaption: CalendarMonthCaption,
        ...components,
      }}
      {...props}
    />
  );
}

export default Calendar;
