import * as React from 'react';

import { Dialog as DialogPrimitive } from '@base-ui/react/dialog';

import cn from '@/lib/utils';

// 最外層根元件
function AlertDialog({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root {...props} />;
}
const AlertDialogTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Trigger ref={ref} className={cn(className)} {...props} />
));
AlertDialogTrigger.displayName = 'AlertDialogTrigger';
// 將畫面固定在最上層
function AlertDialogPortal({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal {...props} />;
}
// 遮罩
const AlertDialogBackdrop = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Backdrop>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Backdrop
    ref={ref}
    className={cn(
      'fixed inset-0 z-50 bg-black/25 transition-opacity duration-400 data-ending-style:opacity-0 data-starting-style:opacity-0',
      className,
    )}
    {...props}
  />
));
AlertDialogBackdrop.displayName = 'AlertDialogBackdrop';
// 元件本體
const AlertDialogPopup = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Popup>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Popup
    ref={ref}
    className={cn(
      'fixed top-1/2 left-1/2 z-80 w-[calc(100vw-48px)] max-w-92.25 -translate-x-1/2 -translate-y-1/2 rounded-sm border-2 border-neutral-900 bg-neutral-50 transition-transform duration-400 data-ending-style:translate-y-[calc(-50%+8px)] data-ending-style:opacity-0 data-starting-style:translate-y-[calc(-50%+8px)]',
      className,
    )}
    {...props}
  />
));
AlertDialogPopup.displayName = 'AlertDialogPopup';
// 標題
const AlertDialogTitle = React.forwardRef<
  HTMLHeadingElement,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn('text-center text-neutral-900', className)}
    {...props}
  />
));
AlertDialogTitle.displayName = 'AlertDialogTitle';
// 描述
const AlertDialogDescription = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn('text-center text-neutral-800', className)}
    {...props}
  />
));
AlertDialogDescription.displayName = 'AlertDialogDescription';

const AlertDialogClose = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Close>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Close ref={ref} className={cn(className)} {...props} />
));
AlertDialogClose.displayName = 'AlertDialogClose';

export {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogClose,
  AlertDialogDescription,
  AlertDialogPopup,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
};
