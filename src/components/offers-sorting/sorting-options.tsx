import { useCallback, useState, KeyboardEvent } from 'react';
import { SortType } from '@types';
import { useStoreDispatch, useStoreState } from '@store/hooks';
import { sortTypeChecked } from '@store/app-data/app-data';
import { getSortType } from '@store/app-data/selectors';

export default function SortingOptions(): JSX.Element {
  const dispatch = useStoreDispatch();
  const currentSortType = useStoreState(getSortType);
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = useCallback(() => setIsOpen((prev) => !prev), []);

  const handleOptionSelect = useCallback((sortType: SortType) => {
    dispatch(sortTypeChecked(sortType));
    setIsOpen(false);
  }, [dispatch]);

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLLIElement>, sortType: SortType) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleOptionSelect(sortType);
    }
  }, [handleOptionSelect]);

  return (
    <form className="places__sorting" action="#" method="get">
      <span className="places__sorting-caption">Sort by </span>
      <span
        className="places__sorting-type"
        tabIndex={0}
        onClick={toggleMenu}
        onKeyDown={(e) => e.key === 'Enter' && toggleMenu()}
      >
        {currentSortType}
        <svg className="places__sorting-arrow" width="7" height="4">
          <use xlinkHref="#icon-arrow-select"></use>
        </svg>
      </span>

      <ul className={`places__options places__options--custom ${isOpen ? 'places__options--opened' : ''}`}>
        {(Object.values(SortType) as SortType[]).map((sortType) => (
          <li
            key={sortType}
            className={`places__option ${currentSortType === sortType ? 'places__option--active' : ''}`}
            tabIndex={0}
            onClick={() => handleOptionSelect(sortType)}
            onKeyDown={(e) => handleKeyDown(e, sortType)}
          >
            {sortType}
          </li>
        ))}
      </ul>
    </form>
  );
}
