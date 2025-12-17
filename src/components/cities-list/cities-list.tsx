import { useCallback } from 'react';
import { useStoreDispatch, useStoreState } from '@store/hooks';
import { cityChanged } from '@store/app-data/app-data';
import { getCity } from '@store/app-data/selectors';
import { City } from '@types';
import { Cities } from '@consts';

export default function CitiesList(): JSX.Element {
  const dispatch = useStoreDispatch();
  const activeCity = useStoreState(getCity);

  const handleCityChange = useCallback((city: City) => {
    dispatch(cityChanged(city));
  }, [dispatch]);

  return (
    <ul className="locations__list tabs__list">
      {Cities.map((cityInfo) => (
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
