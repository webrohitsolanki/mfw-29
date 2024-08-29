'use client';

import { WIDGET_TYPE } from '@theme/types';
import clsx from 'clsx';
import { Accordion, Button, Checkbox, Icon, Radio } from '@theme/components';
import { SizeFilter } from './size-filter';
import { useLocalization } from '@akinon/next/hooks';
import { Facet, FacetChoice } from '@akinon/next/types';
import { useAppDispatch, useAppSelector } from '@akinon/next/redux/hooks';
import {
  resetSelectedFacets,
  toggleFacet
} from '@theme/redux/reducers/category';
import CategoryActiveFilters from '@theme/views/category/category-active-filters';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';

const COMPONENT_TYPES = {
  [WIDGET_TYPE.category]: Checkbox,
  [WIDGET_TYPE.multiselect]: Checkbox
};

interface Props {
  isMenuOpen: boolean;
  setIsMenuOpen: (isMenuOpen: boolean) => void;
}

export const Filters = (props: Props) => {
  const facets = useAppSelector((state) => state.category.facets);
  const dispatch = useAppDispatch();
  const { t } = useLocalization();
  const { isMenuOpen, setIsMenuOpen } = props;
  const [filteredFacets, setFilteredFacets] = useState([]);
  const searchParams = useSearchParams();
  const isCategoryId = searchParams.get('category_ids');

  const handleSelectFilter = ({
    facet,
    choice
  }: {
    facet: Facet;
    choice: FacetChoice;
  }) => {
    dispatch(
      toggleFacet({
        facet,
        choice
      })
    );
  };

  const haveFilter = useMemo(() => {
    return (
      facets.filter(
        (facet) =>
          facet.data.choices.filter((choice) => choice.is_selected).length > 0
      ).length > 0
    );
  }, [facets]);

  const handleResetFilter = () => {
    dispatch(resetSelectedFacets());
  };

  useEffect(() => {
    // const filtered = facets.filter(
    //   (facet) =>
    //     !['in_stock', 'type', 'tags', 'variant_image', 'vendor'].includes(
    //       facet.name
    //     )
    // );
    const allowedFacetsWhenNoCategoryId = [
      'color',
      'price',
      'category_ids',
      'Size-key'
    ];

    const filtered = facets.filter((facet) => {
      if (!isCategoryId) {
        // When no category ID, only include the allowed facets
        return allowedFacetsWhenNoCategoryId.includes(facet.key);
      }
      // Otherwise, exclude these specific facets if needed
      return !['in_stock', 'type', 'tags', 'variant_image', 'vendor'].includes(
        facet.name
      );
    });

    setFilteredFacets(filtered);
  }, [facets]);

  // useEffect(() => {
  //   const filtered = facets.filter(
  //     (facet) =>
  //       !['in_stock', 'type', 'tags', 'variant_image', 'vendor'].includes(
  //         facet.name
  //       )
  //   );

  //   setFilteredFacets(filtered);
  // }, [facets]);

  const handleRemoveFilter = ({ facet, choice }) => {
    dispatch(toggleFacet({ facet, choice }));
  };
  // const handleResetFilter = () => {
  //   dispatch(resetSelectedFacets());
  // };

  return (
    <div
      className={clsx(
        'w-9/10 fixed left-0 top-0 bottom-0 bg-white z-20 p-6 transition-all ease-in duration-300 lg:static lg:block lg:mr-16 lg:text-sm lg:p-0 ',
        isMenuOpen
          ? 'flex flex-col opacity-100 overflow-auto'
          : 'opacity-0 invisible absolute -translate-x-full lg:opacity-100 lg:visible lg:translate-x-0'
      )}
    >
      <div className="uppercase font-semibold  border-t-[1.5px] border-[#E987B4] py-[9px] text-[12px] mb-[30px] border-b-[1.5px] flex justify-between items-center">
        <h2 className="text-red">filters</h2>
        <h2
          className="text-[9px] underline font-thin cursor-pointer"
          onClick={handleResetFilter}
        >
          Clear Filter
        </h2>
      </div>
      <div className="lg:hidden block">
        <div className="flex justify-end mb-2">
          <Icon name="close" size={16} onClick={() => setIsMenuOpen(false)} />
        </div>
      </div>
      <div className="flex justify-between items-center mb-6 lg:hidden">
        <h3 className="text-2xl">{t('category.filters.title')}</h3>
        <h2
          className="text-[12px] underline font-thin cursor-pointer"
          onClick={handleResetFilter}
        >
          Clear Filter
        </h2>
      </div>
      {/* <div className="flex justify-between items-center mb-6 lg:hidden">
        <span className="text-sm">1 {t('category.filters.results')}</span>
        <span>{t('category.filters.ready_to_wear')}</span>
      </div> */}

      {filteredFacets.map((facet) => {
        let Component = null;

        const choices = [...facet.data.choices];

        if (facet.key === 'integration_SizeId') {
          Component = SizeFilter;

          const order = ['xs', 's', 'm', 'l', 'xl'];
          choices.sort((a, b) => {
            return (
              order.indexOf(a.label.toLowerCase()) -
              order.indexOf(b.label.toLowerCase())
            );
          });
        } else {
          Component =
            COMPONENT_TYPES[facet.widget_type] ||
            COMPONENT_TYPES[WIDGET_TYPE.category];
          // choices.sort((a, b) => a.label.localeCompare(b.label));
        }

        return (
          <Accordion
            key={facet.key}
            title={facet.name.toLowerCase()}
            isCollapse={choices.some((choice) => choice.is_selected)}
            dataTestId={`filter-${facet.name}`}
          >
            <div
              className={clsx(
                'flex gap-4 max-h-[250px] h-full overflow-y-auto',
                facet.key === 'integration_SizeId' ? 'flex-row' : 'flex-col'
              )}
            >
              {choices.map((choice, index) => (
                <>
                  {choice.label !== 'NotInUse' && (
                    <Component // TODO: This dynamic component can be a hook or higher order component so it props can be standardized
                      key={choice.label}
                      data={choice}
                      name={facet.key}
                      onChange={() => {
                        if (facet.key !== 'integration_SizeId') {
                          handleSelectFilter({ facet, choice });
                        }
                      }}
                      onClick={() => {
                        if (facet.key === 'integration_SizeId') {
                          handleSelectFilter({ facet, choice });
                        }
                      }}
                      checked={choice.is_selected}
                      data-testid={`${choice.label.trim()}`}
                    >
                      <span className="capitalize">
                        {choice.label}
                      </span>
                      ({/* <div className=''> */}
                      <span
                      // data-testid={`filter-count-${facet.name.toLowerCase()}-${index}`}
                      >
                        {choice.quantity}
                      </span>
                      {/* <span>
                      {choice.is_selected === true ? <Icon name='chevron-end' /> : ''}

                    </span> */}
                      {/* </div> */})
                    </Component>
                  )}
                </>
              ))}
            </div>
          </Accordion>
        );
      })}
      <div className="lg:hidden">
        <CategoryActiveFilters />
      </div>
      {/* {haveFilter && (
        <div className="lg:hidden">
          <Button
            onClick={handleResetFilter}
            appearance="outlined"
            className="w-full mt-4 lg:hidden"
          >
            {t('category.filters.clear_all')}
          </Button>
        </div>
      )} */}
    </div>
  );
};
