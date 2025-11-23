import { cityChanged, useStoreDispatch } from '@store/index';
import { City } from '@types';

type CitiesProps = {
  cities: {
    city: City;
    id: number;
  }[];
  activeCity: City;
};

export default function CitiesList({ cities, activeCity }: CitiesProps): JSX.Element {
  const dispatch = useStoreDispatch();

  const handleCityChange = (city: City) => {
    dispatch(cityChanged(city));
  };

  return (
    <ul className="locations__list tabs__list">
      {cities.map((cityInfo) => (
        <li
          key={cityInfo.id}
          className="locations__item"
          onClick={() => handleCityChange(cityInfo.city)}
        >
          <a
            className={`locations__item-link tabs__item ${
              cityInfo.city.name === activeCity.name ? 'tabs__item--active' : ''
            }`}
            href="#"
          >
            <span>{cityInfo.city.name}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
