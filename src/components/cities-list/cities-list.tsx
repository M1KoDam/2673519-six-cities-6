import { cityChanged, useStoreDispatch } from '@store/index';
import { useStoreState } from '@store/hooks';
import { City } from '@types';
import { Cities } from '@consts';

export default function CitiesList(): JSX.Element {
  const dispatch = useStoreDispatch();
  const activeCity = useStoreState((state) => state.city);

  const handleCityChange = (city: City) => {
    dispatch(cityChanged(city));
  };

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
