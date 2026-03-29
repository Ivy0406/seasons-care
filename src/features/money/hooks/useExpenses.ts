import type { ExpenseItem } from '@/features/money/components/EntryCard';

const mockExpenses: ExpenseItem[] = [
  {
    id: 'expense-1',
    name: '回診費',
    amount: 1200,
    needSplit: true,
    isSplit: false,
    recorder: {
      name: 'Amy',
      src: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiqrpYjz-y8bMs_qvQFR_w4vW_HEUAsQwzgMSbzLMJFytcdMUrY4M25Jx7EjoGDbvSIRaagzEacgR2hIhCLy39aMqWGH9cR-MQ3LjZzljWWCoDjzgU2y7G9nisZk47dRYesEYrG9Bg79XhA/s400/nigaoe_nakajima_atsushi.png',
    },
  },
  {
    id: 'expense-2',
    name: '回診費',
    amount: 1200,
    needSplit: true,
    isSplit: true,
    recorder: {
      name: 'Ben',
      src: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEipUJt5ufuYdkpMS8MbIkWE_zDCxYe3inh3TTB7DVH37W_z8zPS_IU1-2J074kzv0wpHwLbe-pGVyxleTDTORHHUUWZmwkJJKxC4xIrwONn1eslfC_2_gzKACafQwFZjG1NelxBcpzZoTde/s400/nigaoe_masaoka_shiki.png',
    },
  },
  {
    id: 'expense-3',
    name: '藥費',
    amount: 450,
    needSplit: false,
    isSplit: false,
    recorder: {
      name: 'Amy',
      src: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiqrpYjz-y8bMs_qvQFR_w4vW_HEUAsQwzgMSbzLMJFytcdMUrY4M25Jx7EjoGDbvSIRaagzEacgR2hIhCLy39aMqWGH9cR-MQ3LjZzljWWCoDjzgU2y7G9nisZk47dRYesEYrG9Bg79XhA/s400/nigaoe_nakajima_atsushi.png',
    },
  },
  {
    id: 'expense-4',
    name: '交通費',
    amount: 200,
    needSplit: true,
    isSplit: false,
    recorder: {
      name: 'Chloe',
      src: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjl69uVfqLnrYRJTq45_yeYNwVdGPDOg6qFgbZz9pp7P83ki1MYzMreZG6YLR12gF89m6dpSppmJesyF4gNG_X6EWyLliOqcejs7ZFYZm-gy7WKvty5G0gaYp8egXBL3HfjrNZJUL2f9SXU/s400/nigaoe_tekla_badarzewska.png',
    },
  },
  {
    id: 'expense-5',
    name: '掛號費',
    amount: 150,
    needSplit: false,
    isSplit: false,
    recorder: {
      name: 'Ben',
      src: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEipUJt5ufuYdkpMS8MbIkWE_zDCxYe3inh3TTB7DVH37W_z8zPS_IU1-2J074kzv0wpHwLbe-pGVyxleTDTORHHUUWZmwkJJKxC4xIrwONn1eslfC_2_gzKACafQwFZjG1NelxBcpzZoTde/s400/nigaoe_masaoka_shiki.png',
    },
  },
  {
    id: 'expense-6',
    name: '檢查費',
    amount: 800,
    needSplit: true,
    isSplit: true,
    recorder: {
      name: 'David',
      src: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgoTl4DxRR5CVuFrHVzaA1D7FpTp_W0jmAQzf89GfkAYaAJL-CipobWEhm-QwSrw9BW01kTyx2tVHChs-3KjZqKCIkjfl7mivcChR4bhFe4Ek22AV7zsCv_0aV19_G-wCfZOS_NYsKTBO0/s400/13_Mussorgsky.png',
    },
  },
  {
    id: 'expense-7',
    name: '住院費',
    amount: 5000,
    needSplit: true,
    isSplit: false,
    recorder: {
      name: 'Amy',
      src: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiqrpYjz-y8bMs_qvQFR_w4vW_HEUAsQwzgMSbzLMJFytcdMUrY4M25Jx7EjoGDbvSIRaagzEacgR2hIhCLy39aMqWGH9cR-MQ3LjZzljWWCoDjzgU2y7G9nisZk47dRYesEYrG9Bg79XhA/s400/nigaoe_nakajima_atsushi.png',
    },
  },
];

const useExpenses = () => {
  return { expenses: mockExpenses };
};

export default useExpenses;
