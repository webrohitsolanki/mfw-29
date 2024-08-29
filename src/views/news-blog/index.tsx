'use client';

import React, { useEffect, useState } from 'react';
import Style from './index.module.css';
import { Button, Image, LoaderSpinner } from '@akinon/next/components';
import { useRouter } from '@akinon/next/hooks';
import { ROUTES } from '@theme/routes';
import { useSearchParams } from 'next/dist/client/components/navigation';
import { Select } from '@theme/components';
import { P } from 'pino';

interface SelectItem {
  label: string;
  value: string;
  // Add other optional properties if needed
}

const NewsBlog = ({ data }) => {
  const [filterValue, setFilterValue] = useState('all_topics');

  const router = useRouter();
  const searchParams = useSearchParams();

  const HandleClick = (id) => {
    router.push(`/blog?id=${encodeURIComponent(id)}`);
  };
  const options: SelectItem[] = [
    { label: 'All Topics', value: 'all_topics' },
    { label: 'Blogs', value: 'blogs' }
    // Add more items as needed
  ];

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    setFilterValue(selectedValue);
  };

  const filteredNewsBlogs = data.attributes.news_blog.filter((item) => {
    if (filterValue === 'all_topics') {
      return true; // Show all topics
    } else if (filterValue === 'blogs') {
      // Filter for blogs only (adjust condition based on your data structure)
      return item.value.blog_type === 'Blog'; // Assuming 'type' indicates blog
    }
    return true;
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    // Simulating data fetch
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  if (isLoading) {
    return (
      <div className="main_container_header mb-5">
        <LoaderSpinner />
      </div>
    );
  }
  return (
    <div className="container-md container main_container_header">
      <div className="w-full mx-auto">
        <h1 className="text-5xl text-[#003744] my-10 w-full mx-auto text-center">
          News
        </h1>

        <div className="flex items-center mx-auto gap-5 w-full justify-center mb-10">
          <label className="text-2xl">Filter By: </label>
          <Select
            options={options}
            className="text-lg"
            onChange={handleFilterChange}
          />
        </div>
        {filteredNewsBlogs.map((item, index) => {
          return (
            <div key={index} className="border rounded lg:p-5 p-2 mb-5">
              <div className="flex lg:flex-row flex-col gap-3">
                <div className="lg:w-6/12 w-full">
                  <Image
                    src={item.kwargs.value.image.url}
                    unoptimized
                    className={`${Style.news_image}`}
                    width={100}
                    height={100}
                    alt=""
                  />
                </div>
                <div className={`${Style.news_vertical_line}`}>
                  <div className={`${Style.news_image_line}`}>
                    <Image
                      src="images/home/dress.png"
                      width={10}
                      height={10}
                      alt="Dress"
                    />
                  </div>
                </div>
                <div className="lg:w-6/12 w-full">
                  <h2 className="text-2xl font-semibold ">
                    {item.value.title}
                  </h2>
                  <h2 className={`${Style.news_text}text-base mt-3`}>
                    {item.value.text}
                  </h2>
                  <Image
                    src="/images/local/login-line-2.svg"
                    className={`${Style.line_news} mt-3`}
                    width={10}
                    height={10}
                    alt=""
                  />
                  <h3
                    className={`${Style.news_subtext}text-base mt-3 text-justify`}
                    dangerouslySetInnerHTML={{ __html: item.value.subtext }}
                  ></h3>
                  <div className="mt-6">
                    {/* Pass the URL you want to navigate to */}
                    <Button
                      className="pinkbtn"
                      onClick={() => HandleClick(item.value.id)}
                    >
                      READ MORE
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NewsBlog;
