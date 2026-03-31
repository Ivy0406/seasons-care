import { Link } from 'react-router-dom';

import { ChevronRight } from 'lucide-react';

import BrandMark from '@/components/common/BrandMark';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import useLogout from '@/features/auth/hooks/useLogout';

type SideMenuProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type SideMenuItem = {
  name: string;
  path: string;
};

const SIDE_MENU_ITEMS: SideMenuItem[] = [
  { name: '總覽', path: '/homepage' },
  { name: '日誌', path: '/calendar-page' },
  { name: '帳目', path: '/money' },
  { name: '報告', path: '/health-report' },
  { name: '設定', path: '/settings' },
];

function SideMenu({ open, onOpenChange }: SideMenuProps) {
  const handleLogout = useLogout();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="bg-neutral-800 text-neutral-100 data-[side=right]:w-7/8 data-[side=right]:gap-7 data-[side=right]:rounded-l-xl data-[side=right]:border-0 data-[side=right]:px-2 data-[side=right]:sm:max-w-none">
        <SheetHeader className="pt-16.75 pb-0">
          <SheetTitle className="h-12 w-15 text-center">
            <BrandMark
              className="text-primary-default h-8.25 w-auto"
              detailClassName="text-neutral-800"
            />
          </SheetTitle>
        </SheetHeader>
        <div className="grid flex-1 auto-rows-min gap-6 px-4">
          <ul>
            {SIDE_MENU_ITEMS.map(({ name, path }) => (
              <li
                key={name}
                className="flex h-17 justify-between border-b-2 border-neutral-100"
              >
                <Link
                  to={path}
                  className="font-label-lg flex h-full w-full items-center justify-between text-neutral-100"
                >
                  {name}
                  <Button
                    variant="default"
                    className="h-7 w-7 rounded-full border-2 border-neutral-900 bg-neutral-100"
                  >
                    <ChevronRight />
                  </Button>
                </Link>
              </li>
            ))}
          </ul>
          <button onClick={handleLogout} className="w-fit pr-3">
            <p className="text-error font-label-lg">登出</p>
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default SideMenu;
