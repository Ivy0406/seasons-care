import { Children, isValidElement, type ReactNode } from 'react';

import cn from '@/lib/utils';

type DataFormCardProps = {
  title: string;
  children?: ReactNode;
  className?: string;
  toneClassName?: string;
  contentClassName?: string;
};

type DataFormCardSlotProps = {
  children?: ReactNode;
};
function DataFormCardContent({ children }: DataFormCardSlotProps) {
  return children;
}

function DataFormCardFooter({ children }: DataFormCardSlotProps) {
  return children;
}

type DataFormCardComponent = ((props: DataFormCardProps) => ReactNode) & {
  Content: typeof DataFormCardContent;
  Footer: typeof DataFormCardFooter;
};

const DataFormCard: DataFormCardComponent = Object.assign(
  function DataFormCard({
    title,
    children,
    className,
    toneClassName,
    contentClassName,
  }: DataFormCardProps) {
    let content: ReactNode = null;
    let footer: ReactNode = null;

    Children.forEach(children, (child) => {
      if (!isValidElement<DataFormCardSlotProps>(child)) return;

      if (child.type === DataFormCardContent) {
        content = child.props.children;
      }

      if (child.type === DataFormCardFooter) {
        footer = child.props.children;
      }
    });

    return (
      <section className="w-full">
        <div className="">
          <div className="relative top-0.5 z-10 inline-flex overflow-hidden rounded-t-[8px] rounded-b-none border-x-2 border-t-2 border-neutral-900">
            <div
              className={cn(
                'font-heading-sm flex w-54.25 items-start bg-neutral-200 pt-3 pb-1.5 pl-6 text-xl text-neutral-800',
                toneClassName,
              )}
            >
              {title}
            </div>
          </div>
        </div>

        <div
          className={cn(
            '-mt-[0.5px] rounded-tr-[8px] rounded-br-[8px] rounded-bl-[8px] border-2 border-neutral-900 bg-neutral-200 p-3',
            toneClassName,
            className,
          )}
        >
          <div
            className={cn(
              'rounded-[8px] border-2 border-neutral-900 bg-neutral-50 px-4 py-5',
              contentClassName,
            )}
          >
            {content}
          </div>

          {footer && <div className="mt-4">{footer}</div>}
        </div>
      </section>
    );
  },
  {
    Content: DataFormCardContent,
    Footer: DataFormCardFooter,
  },
);

export default DataFormCard;
