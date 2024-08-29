// import { useAppDispatch, useAppSelector } from '@akinon/next/redux/hooks';
// import React, { useEffect, useMemo, useState } from 'react';
// import { toggleFacet } from '@theme/redux/reducers/category';
// import { useRouter } from '@akinon/next/hooks';
// import convertFacetSearchParams from '@theme/utils/convert-facet-search-params';
// import { usePathname } from 'next/navigation';
// import { WIDGET_TYPE } from '@theme/types';
// import { useSearchParams } from 'next/dist/client/components/navigation';

// const CategoryActiveFilters = () => {
//   const dispatch = useAppDispatch();
//   const pathname = usePathname();
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   const { facets, selectedFacets } = useAppSelector((state) => state.category);

//   // State for filtered facets
//   const [filteredFacets, setFilteredFacets] = useState([]);

//   // Effect to filter facets
//   const handleRemoveFilter = ({ facet, choice }) => {
//     dispatch(toggleFacet({ facet, choice }));
//   };

//   const url = useMemo(() => {
//     const facetSearchParams =
//       convertFacetSearchParams(selectedFacets).toString();

//     const urlSearchParams = new URLSearchParams(facetSearchParams);

//     const searchText = searchParams.get('search_text');
//     const page = searchParams.get('page');
//     const limit = searchParams.get('limit');
//     const page_size = searchParams.get('page_size');
//     const sorter = searchParams.get('sorter');
//     const layout = searchParams.get('layout');

//     searchText && urlSearchParams.set('search_text', searchText);
//     page && urlSearchParams.set('page', page);
//     limit && urlSearchParams.set('limit', limit);
//     page_size && urlSearchParams.set('page_size', page_size);
//     sorter && urlSearchParams.set('sorter', sorter);
//     layout && urlSearchParams.set('layout', layout);

//     return pathname + '?' + urlSearchParams.toString();
//   }, [pathname, selectedFacets, searchParams]);

//   useEffect(() => {
//     router.push(url,{scroll:false});
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [url]);

//   useEffect(() => {
//     const filtered = facets.filter(facet => !['in_stock', 'type', "tags", "variant_image", "vendor"].includes(facet.name));
//     setFilteredFacets(filtered);
//   }, [facets]);

//   return (
//     <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 mb-4">
//       {filteredFacets.map((facet) =>
//         facet.data.choices
//           .filter((choice) => choice.is_selected)
//           .map((choice) => (
//             ['in_stock', 'type', 'tags'].includes(facet.name) && (<div
//               className="flex justify-between text-xs text-black-800 py-3.5 px-4 border border-gray-400 hover:bg-gray-300 cursor-default items-center"
//               key={`${facet.key}-${choice.label}`}
//             >
//               <div>
//                 {facet.widget_type !== WIDGET_TYPE.category && (
//                   <span>{facet.name}: </span>
//                 )}
//                 <span>{choice.label}</span>
//               </div>
//               {facet.widget_type !== WIDGET_TYPE.category && (
//                 <div
//                   className="cursor-pointer ml-4"
//                   onClick={() => handleRemoveFilter({ facet, choice })}
//                 >
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     viewBox="0 0 13.5 13.5"
//                     width="1em"
//                     height="1em"
//                   >
//                     <path
//                       d="m.75 12.75 12-12m-12 0 12 12"
//                       style={{
//                         fill: 'none',
//                         stroke: '#000',
//                         strokeLinecap: 'round',
//                         strokeLinejoin: 'round',
//                         strokeWidth: '1.5px'
//                       }}
//                     />
//                   </svg>
//                 </div>
//               )}
//             </div>)
//           ))
//       )}
//     </div>
//   );
// };

// export default CategoryActiveFilters;

import { useAppDispatch, useAppSelector } from '@akinon/next/redux/hooks';
import React, { useEffect, useMemo } from 'react';
import { toggleFacet } from '@theme/redux/reducers/category';
import { useRouter } from '@akinon/next/hooks';
import convertFacetSearchParams from '@theme/utils/convert-facet-search-params';
import { usePathname } from 'next/navigation';
import { WIDGET_TYPE } from '@theme/types';
import { useSearchParams } from 'next/dist/client/components/navigation';
import { clearAllFacets } from '@theme/redux/reducers/category';
import { Button, Icon } from '@akinon/next/components';

const CategoryActiveFilters = () => {
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const { facets, selectedFacets } = useAppSelector((state) => state.category);

  const handleRemoveFilter = ({ facet, choice }) => {
    dispatch(toggleFacet({ facet, choice }));
  };

  const handleClearAllFilters = () => {
    dispatch(clearAllFacets()); // Dispatch the clearAllFacets action
  };

  const url = useMemo(() => {
    const facetSearchParams =
      convertFacetSearchParams(selectedFacets).toString();

    const urlSearchParams = new URLSearchParams(facetSearchParams);

    const searchText = searchParams.get('search_text');
    const page = searchParams.get('page');
    const limit = searchParams.get('limit');
    const page_size = searchParams.get('page_size');
    const sorter = searchParams.get('sorter');
    const layout = searchParams.get('layout');

    searchText && urlSearchParams.set('search_text', searchText);
    page && urlSearchParams.set('page', page);
    limit && urlSearchParams.set('limit', limit);
    page_size && urlSearchParams.set('page_size', page_size);
    sorter && urlSearchParams.set('sorter', sorter);
    layout && urlSearchParams.set('layout', layout);

    return pathname + '?' + urlSearchParams.toString();
  }, [pathname, selectedFacets, searchParams]);

  useEffect(() => {
    router.push(url, { scroll: false });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  const hasFilters = selectedFacets.length > 0;

  return (
    <>
      <div className="flex gap-2 w-fit mb-4 flex-wrap">
        {/* <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 mb-4"> */}
        {facets.map((facet) =>
          facet.data.choices
            .filter((choice) => choice.is_selected)
            .map((choice) => (
              <div
                className="flex text-xs text-black-800 py-3.5 px-4 border border-gray-400 hover:bg-gray-300 cursor-default items-center"
                key={`${facet.key}-${choice.label}`}
              >
                <div>
                  {facet.widget_type !== WIDGET_TYPE.category && (
                    <span className="capitalize">{facet.name}: </span>
                  )}
                  <span className="capitalize">{choice.label}</span>
                </div>
                {facet.widget_type !== WIDGET_TYPE.category && (
                  <div
                    className="cursor-pointer ml-4"
                    onClick={() => handleRemoveFilter({ facet, choice })}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 13.5 13.5"
                      width="1em"
                      height="1em"
                    >
                      <path
                        d="m.75 12.75 12-12m-12 0 12 12"
                        style={{
                          fill: 'none',
                          stroke: '#000',
                          strokeLinecap: 'round',
                          strokeLinejoin: 'round',
                          strokeWidth: '1.5px'
                        }}
                      />
                    </svg>
                  </div>
                )}
              </div>
            ))
        )}
        {/* {hasFilters && (
          <div className=''>
            <div
              className="text-xs  text-black-800 flex items-center gap-2 whitespace-nowrap py-3.5 px-4 border border-gray-400 hover:bg-gray-300 cursor-pointer"
              onClick={handleClearAllFilters}
            >
              <span>Clear All Filters</span>
              <span><Icon name='close' size={12} /></span>
            </div>
          </div>
        )} */}
      </div>
    </>
  );
};

export default CategoryActiveFilters;
