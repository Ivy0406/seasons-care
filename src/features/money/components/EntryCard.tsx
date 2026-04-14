import { useState } from 'react';

import { EllipsisVertical } from 'lucide-react';

import getAvatarSrcByKey from '@/assets/images/avatars';
import {
  CardLabelPrimary,
  CardLabelSecondary,
} from '@/components/common/CardLabel';
import Modal from '@/components/common/Modal';
import SingleAvatar from '@/components/common/SingleAvatar';
import UpdateDeleteDrawer from '@/components/common/UpdateDeleteDrawer';
import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogPopup,
  AlertDialogPortal,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import useGetGroupMembers from '@/features/groups/hooks/useGetGroupMembers';
import useDeleteMoneyItem from '@/features/money/hooks/useDeleteMoneyItem';
import type { ExpenseItem } from '@/features/money/types';
import useCurrentGroupId from '@/hooks/useCurrentGroupID';

import ItemDetailsCard from './ItemDetailsCard';
import UpdateDataCard from './UpdateDataCard';

function EntryCard({ item }: { item: ExpenseItem }) {
  const { currentGroupId } = useCurrentGroupId();
  const { data: groupMembers = [] } = useGetGroupMembers(currentGroupId);
  const creator = groupMembers.find((m) => m.userId === item.createdBy);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showError, setShowError] = useState(false);

  const { isLoading: isDeleting, handleDeleteMoneyItem } = useDeleteMoneyItem();

  const handleDeleteClick = () => {
    setDialogOpen(false);
    setUpdateOpen(false);
    setConfirmOpen(true);
  };

  const handleEditClick = () => {
    setDialogOpen(false);
    setUpdateOpen(true);
  };

  const handleConfirmDelete = async () => {
    const result = await handleDeleteMoneyItem(item.id);
    if (result.success) {
      setConfirmOpen(false);
    } else {
      setConfirmOpen(false);
      setErrorMessage(result.message);
      setShowError(true);
    }
  };

  return (
    <>
      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogTrigger className="block w-full text-left">
          <div className="w-full rounded-sm border-2 border-neutral-900 bg-neutral-100 p-4">
            <div className="flex items-center justify-between border-b-2 border-neutral-900 pb-3">
              <span className="font-label-lg text-neutral-900">
                {item.title}
              </span>
              <div className="flex items-center gap-2">
                {item.splitStatus === 'settled' && (
                  <CardLabelPrimary>已分帳</CardLabelPrimary>
                )}
                {item.splitStatus === 'pending' && (
                  <CardLabelSecondary>需分帳</CardLabelSecondary>
                )}
                <button
                  type="button"
                  aria-label="更多選項"
                  className="flex size-6 items-center justify-center text-neutral-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDrawerOpen(true);
                  }}
                >
                  <EllipsisVertical className="size-4" strokeWidth={2.5} />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="font-label-lg text-neutral-900">
                $ {item.amount.toLocaleString()}
              </span>
              {creator && (
                <SingleAvatar
                  src={getAvatarSrcByKey(creator.avatarKey)}
                  name={creator.username}
                  className="size-7 ring-neutral-900"
                />
              )}
            </div>
          </div>
        </AlertDialogTrigger>

        <AlertDialogPortal>
          <AlertDialogBackdrop />
          <AlertDialogPopup className="border-0 bg-transparent">
              <ItemDetailsCard
              item={item}
              onDeleteClick={handleDeleteClick}
              onEditClick={handleEditClick}
            />
          </AlertDialogPopup>
        </AlertDialogPortal>
      </AlertDialog>

      <AlertDialog open={updateOpen} onOpenChange={setUpdateOpen}>
        <AlertDialogPortal>
          <AlertDialogBackdrop />
          <AlertDialogPopup className="border-0 bg-transparent">
            <UpdateDataCard
              item={item}
              onClose={() => setUpdateOpen(false)}
              onDeleteClick={handleDeleteClick}
            />
          </AlertDialogPopup>
        </AlertDialogPortal>
      </AlertDialog>

      <UpdateDeleteDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        editLabel="編輯帳目"
        deleteLabel="刪除帳目"
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
      />

      <Modal
        open={confirmOpen}
        variant="confirm"
        title="確定要刪除此帳目？"
        confirmText="刪除"
        cancelText="取消"
        isConfirmLoading={isDeleting}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
      />

      <Modal
        open={showError}
        variant="error"
        title="刪除失敗"
        description={errorMessage}
        onClose={() => setShowError(false)}
      />
    </>
  );
}

export default EntryCard;
