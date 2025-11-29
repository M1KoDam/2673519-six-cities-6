import { Review } from '@types';

export const reviews: Review[] = [
  {
    id: '7c36bfe1-1328-4d5a-8498-eb625a45a07b',
    offerId: 'b34640ce-30a3-4811-9cbb-a1a95bcdaa46',
    date: new Date(2024, 5, 15).toISOString(),
    author: {
      name: 'Angelina',
      avatarUrl: 'https://14.design.htmlacademy.pro/static/host/avatar-angelina.jpg',
      isPro: true,
      email: 'angelina2001@gmail.com',
      token:''
    },
    rating: 5,
    comment: 'Wow! Amazing place to stay'
  },
  {
    id: 'fe33499f-7ee0-432e-ad1f-b91ff2c2e7d0',
    offerId: '17ea709a-ec05-4ac8-9dfe-026360c021db',
    date: new Date(2025, 3, 14).toISOString(),
    author: {
      name: 'Angelina',
      avatarUrl: 'https://14.design.htmlacademy.pro/static/avatar/7.jpg',
      isPro: true,
      email: 'angelina2001@gmail.com',
      token:''
    },
    rating: 2,
    comment: 'For that price... No thank you.'
  },
];
