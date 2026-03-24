import type { DairyCardItem } from '@/components/common/DairyCard';

export type CareLogEntry = DairyCardItem;

export type CareLogFilterValue = 'all' | 'notStarted' | 'started' | 'completed';

const mockCareLogEntries: CareLogEntry[] = [
  {
    id: 'diary-1',
    startsAt: '2026-03-04T09:30:00+08:00',
    status: 'completed',
    isImportant: true,
    title: '早上量血壓',
    description: '早餐後血壓偏高，已提醒下午持續觀察並補充水分。',
    participants: [
      {
        id: 'amy',
        name: 'Amy',
        src: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiqrpYjz-y8bMs_qvQFR_w4vW_HEUAsQwzgMSbzLMJFytcdMUrY4M25Jx7EjoGDbvSIRaagzEacgR2hIhCLy39aMqWGH9cR-MQ3LjZzljWWCoDjzgU2y7G9nisZk47dRYesEYrG9Bg79XhA/s400/nigaoe_nakajima_atsushi.png',
      },
      {
        id: 'ben',
        name: 'Ben',
        src: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEipUJt5ufuYdkpMS8MbIkWE_zDCxYe3inh3TTB7DVH37W_z8zPS_IU1-2J074kzv0wpHwLbe-pGVyxleTDTORHHUUWZmwkJJKxC4xIrwONn1eslfC_2_gzKACafQwFZjG1NelxBcpzZoTde/s400/nigaoe_masaoka_shiki.png',
      },
    ],
  },
  {
    id: 'diary-2',
    startsAt: '2026-03-05T14:00:00+08:00',
    status: 'pending',
    isImportant: false,
    title: '回診追蹤',
    description: '今天下午兩點到心臟內科門診，需攜帶最近一週用藥紀錄。',
    participants: [
      {
        id: 'ben',
        name: 'Ben',
        src: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEipUJt5ufuYdkpMS8MbIkWE_zDCxYe3inh3TTB7DVH37W_z8zPS_IU1-2J074kzv0wpHwLbe-pGVyxleTDTORHHUUWZmwkJJKxC4xIrwONn1eslfC_2_gzKACafQwFZjG1NelxBcpzZoTde/s400/nigaoe_masaoka_shiki.png',
      },
      {
        id: 'chloe',
        name: 'Chloe',
        src: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjl69uVfqLnrYRJTq45_yeYNwVdGPDOg6qFgbZz9pp7P83ki1MYzMreZG6YLR12gF89m6dpSppmJesyF4gNG_X6EWyLliOqcejs7ZFYZm-gy7WKvty5G0gaYp8egXBL3HfjrNZJUL2f9SXU/s400/nigaoe_tekla_badarzewska.png',
      },
      {
        id: 'david',
        name: 'David',
        src: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgoTl4DxRR5CVuFrHVzaA1D7FpTp_W0jmAQzf89GfkAYaAJL-CipobWEhm-QwSrw9BW01kTyx2tVHChs-3KjZqKCIkjfl7mivcChR4bhFe4Ek22AV7zsCv_0aV19_G-wCfZOS_NYsKTBO0/s400/13_Mussorgsky.png',
      },
    ],
  },
  {
    id: 'diary-3',
    startsAt: '2026-03-05T20:00:00+08:00',
    status: 'completed',
    isImportant: true,
    title: '夜間服藥確認',
    description: '已完成飯後藥物服用，今晚精神狀況穩定，無明顯不適。',
    participants: [
      {
        id: 'amy',
        name: 'Amy',
        src: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiqrpYjz-y8bMs_qvQFR_w4vW_HEUAsQwzgMSbzLMJFytcdMUrY4M25Jx7EjoGDbvSIRaagzEacgR2hIhCLy39aMqWGH9cR-MQ3LjZzljWWCoDjzgU2y7G9nisZk47dRYesEYrG9Bg79XhA/s400/nigaoe_nakajima_atsushi.png',
      },
      {
        id: 'david',
        name: 'David',
        src: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgoTl4DxRR5CVuFrHVzaA1D7FpTp_W0jmAQzf89GfkAYaAJL-CipobWEhm-QwSrw9BW01kTyx2tVHChs-3KjZqKCIkjfl7mivcChR4bhFe4Ek22AV7zsCv_0aV19_G-wCfZOS_NYsKTBO0/s400/13_Mussorgsky.png',
      },
    ],
  },
  {
    id: 'diary-4',
    startsAt: '2026-03-12T09:20:00+08:00',
    status: 'completed',
    isImportant: false,
    title: '血壓量測',
    description: '早上血壓量測正常，已同步到照護記錄。',
    participants: [
      {
        id: 'chloe',
        name: 'Chloe',
        src: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjl69uVfqLnrYRJTq45_yeYNwVdGPDOg6qFgbZz9pp7P83ki1MYzMreZG6YLR12gF89m6dpSppmJesyF4gNG_X6EWyLliOqcejs7ZFYZm-gy7WKvty5G0gaYp8egXBL3HfjrNZJUL2f9SXU/s400/nigaoe_tekla_badarzewska.png',
      },
    ],
  },
  {
    id: 'diary-6',
    startsAt: '2026-03-24T23:30:00+08:00',
    status: 'pending',
    isImportant: true,
    title: '睡前用藥提醒',
    description: '預計睡前再次確認今晚藥物與飲水狀況。',
    participants: [
      {
        id: 'amy',
        name: 'Amy',
        src: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiqrpYjz-y8bMs_qvQFR_w4vW_HEUAsQwzgMSbzLMJFytcdMUrY4M25Jx7EjoGDbvSIRaagzEacgR2hIhCLy39aMqWGH9cR-MQ3LjZzljWWCoDjzgU2y7G9nisZk47dRYesEYrG9Bg79XhA/s400/nigaoe_nakajima_atsushi.png',
      },
      {
        id: 'david',
        name: 'David',
        src: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgoTl4DxRR5CVuFrHVzaA1D7FpTp_W0jmAQzf89GfkAYaAJL-CipobWEhm-QwSrw9BW01kTyx2tVHChs-3KjZqKCIkjfl7mivcChR4bhFe4Ek22AV7zsCv_0aV19_G-wCfZOS_NYsKTBO0/s400/13_Mussorgsky.png',
      },
    ],
  },
  {
    id: 'diary-7',
    startsAt: '2026-03-24T08:10:00+08:00',
    status: 'pending',
    isImportant: false,
    title: '早餐用藥確認',
    description: '早餐後已提醒確認上午藥物與飲水狀況。',
    participants: [
      {
        id: 'amy',
        name: 'Amy',
        src: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiqrpYjz-y8bMs_qvQFR_w4vW_HEUAsQwzgMSbzLMJFytcdMUrY4M25Jx7EjoGDbvSIRaagzEacgR2hIhCLy39aMqWGH9cR-MQ3LjZzljWWCoDjzgU2y7G9nisZk47dRYesEYrG9Bg79XhA/s400/nigaoe_nakajima_atsushi.png',
      },
      {
        id: 'ben',
        name: 'Ben',
        src: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEipUJt5ufuYdkpMS8MbIkWE_zDCxYe3inh3TTB7DVH37W_z8zPS_IU1-2J074kzv0wpHwLbe-pGVyxleTDTORHHUUWZmwkJJKxC4xIrwONn1eslfC_2_gzKACafQwFZjG1NelxBcpzZoTde/s400/nigaoe_masaoka_shiki.png',
      },
    ],
  },
  {
    id: 'diary-8',
    startsAt: '2026-03-24T13:40:00+08:00',
    status: 'pending',
    isImportant: true,
    title: '午休後血氧量測',
    description: '午休後安排量測血氧與心率，觀察下午精神狀況。',
    participants: [
      {
        id: 'chloe',
        name: 'Chloe',
        src: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjl69uVfqLnrYRJTq45_yeYNwVdGPDOg6qFgbZz9pp7P83ki1MYzMreZG6YLR12gF89m6dpSppmJesyF4gNG_X6EWyLliOqcejs7ZFYZm-gy7WKvty5G0gaYp8egXBL3HfjrNZJUL2f9SXU/s400/nigaoe_tekla_badarzewska.png',
      },
    ],
  },
  {
    id: 'diary-9',
    startsAt: '2026-03-24T18:15:00+08:00',
    status: 'completed',
    isImportant: false,
    title: '晚餐前散步',
    description: '晚餐前完成 15 分鐘散步，步態穩定、無明顯不適。',
    participants: [
      {
        id: 'david',
        name: 'David',
        src: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgoTl4DxRR5CVuFrHVzaA1D7FpTp_W0jmAQzf89GfkAYaAJL-CipobWEhm-QwSrw9BW01kTyx2tVHChs-3KjZqKCIkjfl7mivcChR4bhFe4Ek22AV7zsCv_0aV19_G-wCfZOS_NYsKTBO0/s400/13_Mussorgsky.png',
      },
      {
        id: 'amy',
        name: 'Amy',
        src: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiqrpYjz-y8bMs_qvQFR_w4vW_HEUAsQwzgMSbzLMJFytcdMUrY4M25Jx7EjoGDbvSIRaagzEacgR2hIhCLy39aMqWGH9cR-MQ3LjZzljWWCoDjzgU2y7G9nisZk47dRYesEYrG9Bg79XhA/s400/nigaoe_nakajima_atsushi.png',
      },
    ],
  },
  {
    id: 'diary-5',
    startsAt: '2026-03-24T09:20:00+08:00',
    status: 'completed',
    isImportant: true,
    title: '血壓量測',
    description:
      '早上血壓量測正常，已同步到照護記錄。 早上血壓量測正常，已同步到照護記錄。早上血壓量測正常，已同步到照護記錄。',
    participants: [
      {
        id: 'chloe',
        name: 'Chloe',
        src: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjl69uVfqLnrYRJTq45_yeYNwVdGPDOg6qFgbZz9pp7P83ki1MYzMreZG6YLR12gF89m6dpSppmJesyF4gNG_X6EWyLliOqcejs7ZFYZm-gy7WKvty5G0gaYp8egXBL3HfjrNZJUL2f9SXU/s400/nigaoe_tekla_badarzewska.png',
      },
      {
        id: 'chloe-2',
        name: 'Chloesdfsdsdfsdfds',
        src: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjl69uVfqLnrYRJTq45_yeYNwVdGPDOg6qFgbZz9pp7P83ki1MYzMreZG6YLR12gF89m6dpSppmJesyF4gNG_X6EWyLliOqcejs7ZFYZm-gy7WKvty5G0gaYp8egXBL3HfjrNZJUL2f9SXU/s400/nigaoe_tekla_badarzewska.png',
      },
      {
        id: 'chloe-3',
        name: 'Chloesdfsdf',
        src: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjl69uVfqLnrYRJTq45_yeYNwVdGPDOg6qFgbZz9pp7P83ki1MYzMreZG6YLR12gF89m6dpSppmJesyF4gNG_X6EWyLliOqcejs7ZFYZm-gy7WKvty5G0gaYp8egXBL3HfjrNZJUL2f9SXU/s400/nigaoe_tekla_badarzewska.png',
      },
      {
        id: 'chloe-4',
        name: 'Chloe',
        src: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjl69uVfqLnrYRJTq45_yeYNwVdGPDOg6qFgbZz9pp7P83ki1MYzMreZG6YLR12gF89m6dpSppmJesyF4gNG_X6EWyLliOqcejs7ZFYZm-gy7WKvty5G0gaYp8egXBL3HfjrNZJUL2f9SXU/s400/nigaoe_tekla_badarzewska.png',
      },
    ],
  },
];

export default mockCareLogEntries;
