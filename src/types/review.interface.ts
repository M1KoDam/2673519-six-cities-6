import { User } from './user.interface';

export interface Review {
  id: string;
  offerId?: string;
  date: string;
  user: User;
  rating: number;
  comment: string;
}
