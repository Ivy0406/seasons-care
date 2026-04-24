import type { ReactNode } from 'react';

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import cn from '@/lib/utils';

type BaseDrawerProps = {
  trigger?: ReactNode;
  open?: boolean;
  modal?: boolean;
  handleOnly?: boolean;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
  handleClassName?: string;
  onOpenChange?: (open: boolean) => void;
};
function BaseDrawer({
  trigger,
  open,
  modal,
  handleOnly,
  onOpenChange,
  children,
  footer,
  className,
  handleClassName,
}: BaseDrawerProps) {
  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      modal={modal}
      handleOnly={handleOnly}
    >
      {trigger && <DrawerTrigger asChild>{trigger}</DrawerTrigger>}

      <DrawerContent
        className={cn(
          'mx-auto w-full max-w-[800px] rounded-t-3xl border-0 bg-neutral-100 px-6 pb-7',
          className,
        )}
        handleClassName={handleClassName}
        aria-describedby={undefined}
      >
        <DrawerHeader className="sr-only">
          <DrawerTitle>Drawer Menu</DrawerTitle>
        </DrawerHeader>

        <div className="mt-5">{children}</div>
        {footer && <div className="mt-4">{footer}</div>}
      </DrawerContent>
    </Drawer>
  );
}

export default BaseDrawer;
