import { Check } from 'lucide-react';

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
} from '@/components/ui/drawer';
import cn from '@/lib/utils';

type CareGroup = {
  id: string;
  name: string;
  memberCount: number;
};

type GroupSwitcherDrawerProps = {
  /** What triggers the drawer to open (e.g. a button, avatar, etc.) */
  trigger: React.ReactNode;
  groups: CareGroup[];
  activeGroupId: string;
  onSelectGroup: (id: string) => void;
  onJoinGroup?: () => void;
  onCreateGroup?: () => void;
};

function GroupSwitcherDrawer({
  trigger,
  groups,
  activeGroupId,
  onSelectGroup,
  onJoinGroup,
  onCreateGroup,
}: GroupSwitcherDrawerProps) {
  return (
    <Drawer>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>

      <DrawerContent
        className="rounded-t-3xl border-0 bg-[#F9FAF9] px-4 pb-8 pt-2"
        aria-describedby={undefined}
      >
        {/* Group list */}
        <div className="mt-6 flex flex-col gap-2">
          {groups.map((group) => {
            const isActive = group.id === activeGroupId;
            return (
              <DrawerClose asChild key={group.id}>
                <button
                  type="button"
                  onClick={() => onSelectGroup(group.id)}
                  className={cn(
                    'flex w-full items-center justify-between rounded-2xl px-4 py-3.5 transition-colors',
                    isActive ? 'bg-[#E5E7EB]' : 'bg-white active:bg-neutral-100',
                  )}
                >
                  {/* Left: name + member count */}
                  <div className="flex flex-col items-start gap-0.5">
                    <span className="text-base font-semibold text-neutral-900">
                      {group.name}
                    </span>
                    <span className="text-sm text-neutral-500">
                      {group.memberCount} 位成員
                    </span>
                  </div>

                  {/* Right: checkmark when active */}
                  {isActive && (
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-neutral-900">
                      <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />
                    </span>
                  )}
                </button>
              </DrawerClose>
            );
          })}
        </div>

        {/* Join another group */}
        <button
          type="button"
          onClick={onJoinGroup}
          className="mt-4 w-full py-2 text-center text-sm font-medium text-neutral-500 underline-offset-2 hover:underline active:text-neutral-700"
        >
          加入其他群組
        </button>

        {/* Create new group */}
        <button
          type="button"
          onClick={onCreateGroup}
          className="mt-3 w-full rounded-2xl border-2 border-neutral-900 bg-transparent py-3.5 text-base font-semibold text-neutral-900 transition-colors active:bg-neutral-100"
        >
          建立新群組
        </button>
      </DrawerContent>
    </Drawer>
  );
}

export default GroupSwitcherDrawer;
