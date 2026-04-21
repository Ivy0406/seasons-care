export type GroupMember = {
  id: string;
  name: string;
  avatarSrc: string;
};

export type CareGroup = {
  id: string;
  name: string;
  members: GroupMember[];
  isSelected?: boolean;
};

const mockGroups: CareGroup[] = [
  {
    id: 'wang-family',
    name: '王爸爸的照護群組',
    isSelected: true,
    members: [
      {
        id: 'amy',
        name: 'Amy',
        avatarSrc:
          'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiqrpYjz-y8bMs_qvQFR_w4vW_HEUAsQwzgMSbzLMJFytcdMUrY4M25Jx7EjoGDbvSIRaagzEacgR2hIhCLy39aMqWGH9cR-MQ3LjZzljWWCoDjzgU2y7G9nisZk47dRYesEYrG9Bg79XhA/s400/nigaoe_nakajima_atsushi.png',
      },
      {
        id: 'ben',
        name: 'Ben',
        avatarSrc:
          'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEipUJt5ufuYdkpMS8MbIkWE_zDCxYe3inh3TTB7DVH37W_z8zPS_IU1-2J074kzv0wpHwLbe-pGVyxleTDTORHHUUWZmwkJJKxC4xIrwONn1eslfC_2_gzKACafQwFZjG1NelxBcpzZoTde/s400/nigaoe_masaoka_shiki.png',
      },
      {
        id: 'chloe',
        name: 'Chloe',
        avatarSrc:
          'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjl69uVfqLnrYRJTq45_yeYNwVdGPDOg6qFgbZz9pp7P83ki1MYzMreZG6YLR12gF89m6dpSppmJesyF4gNG_X6EWyLliOqcejs7ZFYZm-gy7WKvty5G0gaYp8egXBL3HfjrNZJUL2f9SXU/s400/nigaoe_tekla_badarzewska.png',
      },
      {
        id: 'david',
        name: 'David',
        avatarSrc:
          'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgoTl4DxRR5CVuFrHVzaA1D7FpTp_W0jmAQzf89GfkAYaAJL-CipobWEhm-QwSrw9BW01kTyx2tVHChs-3KjZqKCIkjfl7mivcChR4bhFe4Ek22AV7zsCv_0aV19_G-wCfZOS_NYsKTBO0/s400/13_Mussorgsky.png',
      },
    ],
  },
  {
    id: 'lin-family',
    name: '林媽媽照護群組',
    members: [
      {
        id: 'eason',
        name: 'Eason',
        avatarSrc:
          'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhN9mPkR31_QX9pM3o3xgg5Xagw4Wj2tfjZ7FQ5Ivmh7It9TgQ5V7LUMGfk7Cn8orLGjaP2T3ExZZj1aFhAobF0AoMZHZE0xU7YVix1e0m9C_DhTKwKJ0mLqo7b8mNfG3bC0L1Yh4N0aG8/s400/boy_smile3.png',
      },
      {
        id: 'fiona',
        name: 'Fiona',
        avatarSrc:
          'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhQvlS9VG8bE5Yh7bQ1D2J5E3rM9pNvqV7YKn0Ws7Yt5kFb0kF2zKq3Q9Nb4MvhcV3ZQv5Bz6FzP2QxjP6AoYtB2LiI5SxI0oNqGx6IuZ9wPev6paS0VYV5eDkqVpw3sCiGQxD2q9gk7I/s400/girl_smile3.png',
      },
    ],
  },
  {
    id: 'chen-home',
    name: '陳阿公晚班協作',
    members: [
      {
        id: 'gina',
        name: 'Gina',
        avatarSrc:
          'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiKxVGN4s9L1PqD2jk0T3k9bZ0_vL0Z9i2Yk1FJ0p0hA4YxGZ1W1D0p9K4bB4xN6o5v4c7m4L8J0bG5mQ4wK5T5R0Z4lL6yY0wI2Wj8xB6pS4cR9tS7dC3mR1pX2lF6dJ0gC3sD5q/s400/ojisan.png',
      },
    ],
  },
];

export default mockGroups;
