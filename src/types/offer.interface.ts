import { City } from './city.type.js';
import { User } from './user.interface.js';
import { Location } from './location.type.js';

export interface Offer {
    id: string;
    title: string;
    type: string;
    price: number;
    city: City;
    location: Location;
    isFavorite?: boolean;
    isPremium?: boolean;
    rating: number;
    previewImage?: string;
    preview?: string;
    description?: string;
    bedrooms?: number;
    maxAdults?: number;
    goods?: string[];
    host?: User;
    images?: string[];
}
