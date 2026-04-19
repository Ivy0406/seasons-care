import { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import Modal from '@/components/common/Modal';
import { NavigationSubheader } from '@/components/common/NavigationBar';

type SettingMenuItem = {
  label: string;
  path?: string;
  danger?: boolean;
};

type SettingMenuSection = {
  title: string;
  items: SettingMenuItem[];
};

const SETTING_MENU_SECTIONS: SettingMenuSection[] = [
  {
    title: '個人檔案',
    items: [{ label: '編輯個人資料', path: '/settings/profile' }],
  },
  {
    title: '幫助',
    items: [{ label: '意見回饋' }, { label: '隱私權與免責聲明', path: '/settings/privacy' }],
  },
  {
    title: '密碼',
    items: [{ label: '更改密碼', path: '/settings/change-password' }],
  },
  {
    title: '帳號',
    items: [{ label: '刪除帳號', danger: true }],
  },
];

function SettingMenu() {
  const navigate = useNavigate();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  return (
    <>
      <div className="w-full max-w-200 mx-auto min-h-screen bg-neutral-100">
        <NavigationSubheader
          layout="centered"
          title="設定"
          showChevron={false}
          onBackClick={() => navigate(-1)}
        />

        <div className="p-6">
          {SETTING_MENU_SECTIONS.map(({ title, items }) => (
            <section key={title} className="mb-6">
              <h2 className="font-heading-sm mb-4 text-neutral-900">{title}</h2>
              <ul className="flex flex-col gap-4">
                {items.map(({ label, path, danger }) => (
                  <li
                    key={label}
                    className={
                      danger ? '' : 'border-b-2 border-neutral-400 pb-2'
                    }
                  >
                    <button
                      className="w-full text-left"
                      onClick={() => {
                        if (danger) setIsDeleteModalOpen(true);
                        else if (path) navigate(path);
                      }}
                    >
                      <p
                        className={`font-label-md ${danger ? 'text-error' : 'text-neutral-900'}`}
                      >
                        {label}
                      </p>
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>

      <Modal
        open={isDeleteModalOpen}
        variant="confirm"
        title="確定要刪除帳號嗎？"
        description={
          '此動作無法復原。\n一旦刪除帳號，您所有的帳目項目與歷史日誌將會永久移除，且會將您自動退出所有群組。'
        }
        confirmText="刪除"
        cancelText="取消"
        titleClassName="font-heading-sm mb-2"
        descriptionClassName="font-paragraph-md w-65 whitespace-pre-line"
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => setIsDeleteModalOpen(false)}
      />
    </>
  );
}

export default SettingMenu;
