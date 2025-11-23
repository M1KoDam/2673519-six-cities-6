import { Offer } from '@types';

export const offers: Offer[] = [
  {
    id: 'b34640ce-30a3-4811-9cbb-a1a95bcdaa46',
    title: 'Apartment at Amsterdam',
    type: 'Apartment',
    price: 330,
    city: {
      name: 'Amsterdam',
      location: {
        latitude: 52.3909553943508,
        longitude: 4.85309666406198,
        zoom: 16
      }
    },
    isFavorite: true,
    isPremium: true,
    rating: 3.9,
    preview: 'img/amsterdam@2x.jpg',
    description: 'Good neighbors here!',
    bedrooms: 4,
    maxAdults: 5,
    goods: [
      'Baby seat',
      'Air conditioning',
      'Kitchen',
      'Breakfast',
      'Fridge',
      'Coffee machine',
      'Cable TV',
    ],
    author: {
      name: 'Angelina',
      avatarUrl: 'https://14.design.htmlacademy.pro/static/host/avatar-angelina.jpg',
      isPro: true,
      email: 'angelina2001@gmail.com',
      token:''
    },
    images: [
      'https://14.design.htmlacademy.pro/static/hotel/20.jpg',
      'https://14.design.htmlacademy.pro/static/hotel/9.jpg'
    ]
  },
  {
    id: '17ea709a-ec05-4ac8-9dfe-026360c021db',
    title: 'Luxury Downtown Loft',
    type: 'Apartment',
    price: 210,
    city: {
      name: 'Amsterdam',
      location: {
        latitude: 52.3609553943508,
        longitude: 4.85309666406198,
        zoom: 16
      }
    },
    isFavorite: false,
    isPremium: false,
    rating: 1.9,
    preview: 'img/apartment-02.jpg',
    description: 'Stylish industrial loft in city center, panoramic views, fully equipped.',
    bedrooms: 6,
    maxAdults: 666,
    goods: [
      'Baby seat',
      'Heating',
      'Washing machine',
      'Laptop friendly workspace'
    ],
    author: {
      name: 'Angelina',
      avatarUrl: 'https://14.design.htmlacademy.pro/static/host/avatar-angelina.jpg',
      isPro: true,
      email: 'angelina2001@gmail.com',
      token:''
    },
    images: [
      'https://14.design.htmlacademy.pro/static/hotel/13.jpg',
      'https://14.design.htmlacademy.pro/static/hotel/6.jpg'
    ]
  },
  {
    id: '7901d551-154e-411b-ab82-068b27e4c11a',
    title: 'Small room',
    type: 'Room',
    price: 90,
    city: {
      name: 'Paris',
      location: {
        latitude: 48.85661,
        longitude: 2.351499,
        zoom: 16
      }
    },
    isFavorite: true,
    isPremium: false,
    rating: 4.3,
    preview: 'img/room-small.jpg',
    description: 'Bright ground-floor unit, private patio, quiet neighborhood, near metro.',
    bedrooms: 5,
    maxAdults: 5,
    goods: [
      'Washer',
      'Air conditioning',
      'Kitchen',
      'Breakfast',
      'Fridge',
      'Dishwasher',
    ],
    author: {
      name: 'Angelina',
      avatarUrl: 'https://14.design.htmlacademy.pro/static/host/avatar-angelina.jpg',
      isPro: true,
      email: 'angelina2001@gmail.com',
      token:''
    },
    images: [
      'https://14.design.htmlacademy.pro/static/hotel/11.jpg',
      'https://14.design.htmlacademy.pro/static/hotel/4.jpg'
    ]
  },
  {
    id: 'c6f97764-f401-491d-acf7-19b8b60b0b77',
    title: 'Minimalist Designer Home',
    type: 'Apartment',
    price: 250,
    city: {
      name: 'Amsterdam',
      location: {
        latitude: 52.3809553943508,
        longitude: 4.939309666406198,
        zoom: 16
      }
    },
    isFavorite: true,
    isPremium: true,
    rating: 4.8,
    preview: 'img/apartment-01.jpg',
    description: 'Clean Scandinavian design, smart home features, peaceful and functional.',
    bedrooms: 5,
    maxAdults: 14,
    goods: [
      'Kitchen',
      'Breakfast',
      'Fridge',
      'Coffee machine',
      'Cable TV',
      'Heating',
    ],
    author: {
      name: 'Angelina',
      avatarUrl: 'https://14.design.htmlacademy.pro/static/host/avatar-angelina.jpg',
      isPro: true,
      email: 'angelina2001@gmail.com',
      token:''
    },
    images: [
      'https://14.design.htmlacademy.pro/static/hotel/14.jpg',
      'https://14.design.htmlacademy.pro/static/hotel/2.jpg'
    ]
  },
];
