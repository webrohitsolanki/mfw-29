import React, { useEffect, useState } from 'react';
import Styled from 'styled-components';
import { ProductItem } from '@theme/views/product-item';
import { GetCategoryResponse } from '@akinon/next/types';
import { CarouselCore } from '@theme/components/carousel-core';

interface ListPageProps {
  data: GetCategoryResponse;
}

export default function FeatureMobileComponent(props: ListPageProps) {

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 4
    },
    tablet: {
      breakpoint: { max: 1023, min: 768 },
      items: 3
    },
    mobile: {
      breakpoint: { max: 767, min: 0 },
      items: 2
    }
  };


  const { data } = props;

  // const [currentPage, setCurrentPage] = useState(1);
  // const productsPerPage = 4;

  // // Calculate total number of pages
  // const totalPages = Math.ceil(data.products.length / productsPerPage);

  // // Calculate index of the first and last product of the current page
  // const indexOfLastProduct = currentPage * productsPerPage;
  // const indexOfFirstProduct = indexOfLastProduct - productsPerPage;

  // // Get the products for the current page
  // const currentProducts = data.products.slice(indexOfFirstProduct, indexOfLastProduct);

  return (
    <Wrapper className='w-full'>
        <CarouselCore
        arrows={true}
        infinite={true}
        // autoPlay={true}
        responsive={responsive}
        swipeable={true}
        >
        {data.products.map((product, index) => (
        <div className='w-[98%] mx-auto' key={product.pk}>
          <ProductItem
            product={product}
            width={0}
            height={0}
            index={index}
            />
        </div>
      ))}
          </CarouselCore>
      {/* Pagination buttons */}
      {/* <Pagination>
        <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
          Previous
        </button>
        <span>{currentPage}</span> / <span>{totalPages}</span>
        <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>
          Next
        </button>
      </Pagination> */}
    </Wrapper>
  );
}

const Wrapper = Styled.section`

`;

const Pagination = Styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;

  button {
    margin: 0 5px;
    cursor: pointer;
    padding: 5px 10px;
    border: 1px solid #ccc;
    background-color: #f9f9f9;
    color: #333;
    outline: none;

    &:hover {
      background-color: #e9e9e9;
    }

    &:disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }
  }
`;
