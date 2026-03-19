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
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
  onOpenChange?: (open: boolean) => void;
};
function BaseDrawer({
  trigger,
  open,
  onOpenChange,
  children,
  footer,
  className,
}: BaseDrawerProps) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange} shouldScaleBackground>
      {trigger && <DrawerTrigger asChild>{trigger}</DrawerTrigger>}

      <DrawerContent
        className={cn(
          'rounded-t-3xl border-0 bg-neutral-100 px-6 pb-7',
          className,
        )}
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
