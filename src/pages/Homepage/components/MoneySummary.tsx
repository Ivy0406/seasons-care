import { useState } from 'react';

import {
  ArrowLeft,
  ArrowUpRight,
  ChevronDown,
  EllipsisVertical,
  Plus,
} from 'lucide-react';

import { CardLabelSecondary } from '@/components/common/CardLabel';
import {
  CircleButtonPrimary,
  CircleButtonSecondary,
} from '@/components/common/CircleIButton';
import SingleAvatar from '@/components/common/SingleAvatar';

type Recorder = {
  name: string;
  src: string;
};

type ExpenseItem = {
  id: string;
  name: string;
  amount: number;
  needSplit: boolean;
  recorder: Recorder;
};

const mockExpenses: ExpenseItem[] = [
  {
    id: 'expense-1',
    name: '回診費',
    amount: 1200,
    needSplit: true,
    recorder: {
      name: 'Amy',
      src: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiqrpYjz-y8bMs_qvQFR_w4vW_HEUAsQwzgMSbzLMJFytcdMUrY4M25Jx7EjoGDbvSIRaagzEacgR2hIhCLy39aMqWGH9cR-MQ3LjZzljWWCoDjzgU2y7G9nisZk47dRYesEYrG9Bg79XhA/s400/nigaoe_nakajima_atsushi.png',
    },
  },
  {
    id: 'expense-2',
    name: '回診費',
    amount: 1200,
    needSplit: true,
    recorder: {
      name: 'Ben',
      src: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEipUJt5ufuYdkpMS8MbIkWE_zDCxYe3inh3TTB7DVH37W_z8zPS_IU1-2J074kzv0wpHwLbe-pGVyxleTDTORHHUUWZmwkJJKxC4xIrwONn1eslfC_2_gzKACafQwFZjG1NelxBcpzZoTde/s400/nigaoe_masaoka_shiki.png',
    },
  },
  {
    id: 'expense-3',
    name: '藥費',
    amount: 450,
    needSplit: false,
    recorder: {
      name: 'Amy',
      src: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiqrpYjz-y8bMs_qvQFR_w4vW_HEUAsQwzgMSbzLMJFytcdMUrY4M25Jx7EjoGDbvSIRaagzEacgR2hIhCLy39aMqWGH9cR-MQ3LjZzljWWCoDjzgU2y7G9nisZk47dRYesEYrG9Bg79XhA/s400/nigaoe_nakajima_atsushi.png',
    },
  },
  {
    id: 'expense-4',
    name: '交通費',
    amount: 200,
    needSplit: true,
    recorder: {
      name: 'Chloe',
      src: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjl69uVfqLnrYRJTq45_yeYNwVdGPDOg6qFgbZz9pp7P83ki1MYzMreZG6YLR12gF89m6dpSppmJesyF4gNG_X6EWyLliOqcejs7ZFYZm-gy7WKvty5G0gaYp8egXBL3HfjrNZJUL2f9SXU/s400/nigaoe_tekla_badarzewska.png',
    },
  },
  {
    id: 'expense-5',
    name: '掛號費',
    amount: 150,
    needSplit: false,
    recorder: {
      name: 'Ben',
      src: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEipUJt5ufuYdkpMS8MbIkWE_zDCxYe3inh3TTB7DVH37W_z8zPS_IU1-2J074kzv0wpHwLbe-pGVyxleTDTORHHUUWZmwkJJKxC4xIrwONn1eslfC_2_gzKACafQwFZjG1NelxBcpzZoTde/s400/nigaoe_masaoka_shiki.png',
    },
  },
  {
    id: 'expense-6',
    name: '檢查費',
    amount: 800,
    needSplit: true,
    recorder: {
      name: 'David',
      src: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgoTl4DxRR5CVuFrHVzaA1D7FpTp_W0jmAQzf89GfkAYaAJL-CipobWEhm-QwSrw9BW01kTyx2tVHChs-3KjZqKCIkjfl7mivcChR4bhFe4Ek22AV7zsCv_0aV19_G-wCfZOS_NYsKTBO0/s400/13_Mussorgsky.png',
    },
  },
  {
    id: 'expense-7',
    name: '住院費',
    amount: 5000,
    needSplit: true,
    recorder: {
      name: 'Amy',
      src: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiqrpYjz-y8bMs_qvQFR_w4vW_HEUAsQwzgMSbzLMJFytcdMUrY4M25Jx7EjoGDbvSIRaagzEacgR2hIhCLy39aMqWGH9cR-MQ3LjZzljWWCoDjzgU2y7G9nisZk47dRYesEYrG9Bg79XhA/s400/nigaoe_nakajima_atsushi.png',
    },
  },
];

function ExpenseRow({ item }: { item: ExpenseItem }) {
  return (
    <div className="rounded-sm border-2 border-neutral-900 bg-neutral-50 p-4">
      <div className="flex items-center justify-between">
        <span className="font-label-lg text-neutral-900">{item.name}</span>
        <div className="flex items-center gap-2">
          {item.needSplit && <CardLabelSecondary>需分帳</CardLabelSecondary>}
          <button
            type="button"
            aria-label="更多選項"
            className="flex size-6 items-center justify-center text-neutral-600"
          >
            <EllipsisVertical className="size-4" strokeWidth={2.5} />
          </button>
        </div>
      </div>

      <div className="my-3 border-b border-neutral-900" />

      <div className="flex items-center justify-between">
        <span className="font-heading-sm text-neutral-900">
          $ {item.amount.toLocaleString()}
        </span>
        <SingleAvatar
          src={item.recorder.src}
          name={item.recorder.name}
          className="size-7"
        />
      </div>
    </div>
  );
}

type MoneySummaryProps = {
  onSwitchToDiary: () => void;
};

function MoneySummary({ onSwitchToDiary }: MoneySummaryProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const firstItems = mockExpenses.slice(0, 2);
  const remainingCount = mockExpenses.length - 2;

  return (
    <section className="pt-3">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="font-heading-md text-neutral-900">今日帳目</h2>
        <CircleButtonPrimary
          size="md"
          aria-label="切換回今日日誌"
          onClick={onSwitchToDiary}
          className="bg-neutral-50 text-neutral-900"
        >
          <ArrowLeft />
        </CircleButtonPrimary>
      </div>

      <div className="max-h-96 overflow-y-auto rounded-sm border-2 border-neutral-900 bg-neutral-100 px-5 pt-5 pb-3">
        <div className="mb-4 flex items-center justify-between">
          <CardLabelSecondary>今日帳目</CardLabelSecondary>
          <div className="flex items-center gap-3">
            <CircleButtonSecondary size="md" aria-label="跳轉帳目">
              <ArrowUpRight />
            </CircleButtonSecondary>
            <CircleButtonPrimary size="md" aria-label="新增帳目">
              <Plus />
            </CircleButtonPrimary>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {firstItems.map((item) => (
            <ExpenseRow key={item.id} item={item} />
          ))}

          {isExpanded &&
            mockExpenses
              .slice(2)
              .map((item) => <ExpenseRow key={item.id} item={item} />)}
        </div>

        {remainingCount > 0 && (
          <button
            type="button"
            className="font-label-md mt-3 flex w-full items-center justify-center gap-1 py-2 text-neutral-700"
            onClick={() => setIsExpanded((prev) => !prev)}
          >
            {isExpanded ? '收起' : `查看其他 ${remainingCount} 筆帳目`}
            <ChevronDown
              className={`size-5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
              strokeWidth={2}
            />
          </button>
        )}
      </div>
    </section>
  );
}

export default MoneySummary;
