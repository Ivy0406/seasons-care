import { useNavigate } from 'react-router-dom';

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
    items: [{ label: '意見回饋' }, { label: '隱私權與免責聲明' }],
  },
  {
    title: '密碼',
    items: [{ label: '更改密碼' }],
  },
  {
    title: '帳號',
    items: [{ label: '刪除帳號', danger: true }],
  },
];

function SettingMenu() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-neutral-100">
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
                  className={danger ? '' : 'border-b-2 border-neutral-400 pb-2'}
                >
                  <button
                    className="w-full text-left"
                    onClick={() => path && navigate(path)}
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
  );
}

export default SettingMenu;
