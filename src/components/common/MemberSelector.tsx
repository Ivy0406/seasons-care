import * as React from 'react';

import { Check, ChevronDownIcon } from 'lucide-react';

import SingleAvatar from '@/components/common/SingleAvatar';
import cn from '@/lib/utils';

interface Member {
  id: string;
  name: string;
  avatar: string;
}

const members: Member[] = [
  {
    id: 'me',
    name: '你',
    avatar:
      'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiqrpYjz-y8bMs_qvQFR_w4vW_HEUAsQwzgMSbzLMJFytcdMUrY4M25Jx7EjoGDbvSIRaagzEacgR2hIhCLy39aMqWGH9cR-MQ3LjZzljWWCoDjzgU2y7G9nisZk47dRYesEYrG9Bg79XhA/s400/nigaoe_nakajima_atsushi.png',
  },
  {
    id: 'rose',
    name: '葉玫瑰',
    avatar:
      'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEipUJt5ufuYdkpMS8MbIkWE_zDCxYe3inh3TTB7DVH37W_z8zPS_IU1-2J074kzv0wpHwLbe-pGVyxleTDTORHHUUWZmwkJJKxC4xIrwONn1eslfC_2_gzKACafQwFZjG1NelxBcpzZoTde/s400/nigaoe_masaoka_shiki.png',
  },
  {
    id: 'drug',
    name: '藥律',
    avatar:
      'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjl69uVfqLnrYRJTq45_yeYNwVdGPDOg6qFgbZz9pp7P83ki1MYzMreZG6YLR12gF89m6dpSppmJesyF4gNG_X6EWyLliOqcejs7ZFYZm-gy7WKvty5G0gaYp8egXBL3HfjrNZJUL2f9SXU/s400/nigaoe_tekla_badarzewska.png',
  },
  {
    id: 'zz',
    name: 'zz',
    avatar:
      'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgoTl4DxRR5CVuFrHVzaA1D7FpTp_W0jmAQzf89GfkAYaAJL-CipobWEhm-QwSrw9BW01kTyx2tVHChs-3KjZqKCIkjfl7mivcChR4bhFe4Ek22AV7zsCv_0aV19_G-wCfZOS_NYsKTBO0/s400/13_Mussorgsky.png',
  },
];

interface MemberSelectorProps {
  selectedIds?: string[];
  onSelectedChange?: (ids: string[]) => void;
  className?: string;
}

export function MemberSelector({
  selectedIds = [],
  onSelectedChange,
  className,
}: MemberSelectorProps) {
  const [open, setOpen] = React.useState(false);

  const toggleMember = (id: string) => {
    const newIds = selectedIds.includes(id)
      ? selectedIds.filter((mid) => mid !== id)
      : [...selectedIds, id];
    onSelectedChange?.(newIds);
  };

  const selectedLabels = members
    .filter((member) => selectedIds.includes(member.id))
    .map((member) => member.name)
    .join(', ');

  return (
    <div className={cn('relative inline-block', className)}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="font-paragraph-md flex items-center gap-1.5 rounded-lg border-none bg-transparent p-0 py-2 text-sm shadow-none transition-colors outline-none hover:bg-transparent focus-visible:ring-0"
      >
        <span>{selectedLabels || '全部成員'}</span>
        <ChevronDownIcon
          className="text-muted-foreground size-4 shrink-0 transition-transform duration-200"
          style={{
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        />
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            role="presentation"
            onClick={() => setOpen(false)}
            onKeyDown={(e) => {
              if (e.key === 'Escape' || e.key === 'Enter') setOpen(false);
            }}
          />
          <div className="ring-foreground/10 absolute top-full left-0 z-50 mt-1 min-w-52 overflow-hidden rounded-[4px] border-2 border-neutral-900 bg-neutral-200 shadow-md ring-1">
            <div className="flex flex-col">
              {members.map((member, index) => {
                const isSelected = selectedIds.includes(member.id);
                return (
                  <div key={member.id} className="w-full">
                    <button
                      type="button"
                      onClick={() => toggleMember(member.id)}
                      className={cn(
                        'font-paragraph-md flex w-full cursor-pointer items-center justify-between gap-2 px-3 py-2 text-left transition-colors outline-none',
                        isSelected && 'bg-neutral-300',
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <SingleAvatar
                          src={member.avatar}
                          name={member.name}
                          className="size-7 ring-1"
                        />
                        <span className="font-paragraph-md">{member.name}</span>
                      </div>
                      <div className="flex size-5 items-center justify-center">
                        {isSelected && (
                          <Check
                            className="size-3 stroke-neutral-600"
                            strokeWidth={4}
                          />
                        )}
                      </div>
                    </button>
                    {index < members.length - 1 && (
                      <div className="mx-0 h-px bg-neutral-400" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default MemberSelector;
