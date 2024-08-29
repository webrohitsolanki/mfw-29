import clsx from 'clsx';
import { GetCategoryResponse } from '@akinon/next/types';
// import Breadcrumb from '@theme/views/breadcrumb';
import { CategoryBanner } from '@theme/views/category/category-banner';
import ListPage from '@theme/views/category/category-info';
import HomeHeroSlider from '@theme/widgets/home/home-hero-slider';

export default async function Layout({
  data,
  children,
}: {
  data: GetCategoryResponse;
  children?: React.ReactNode;
}) {

  function generateBreadcrumbList(category) {
    // Base URL for the breadcrumb links
    const baseURL = '/';

    // Recursive function to build the breadcrumb path
    function buildBreadcrumbPath(category, level = 0) {
      // Create the breadcrumb object for the current category
      const breadcrumb = {
        label: category?.name,
        url: `${baseURL}${category?.absolute_url}`,
        level,
        pk: category?.uuid,
        sort_order: category?.sort_option,
        path: category?.path || '', // Assuming the path is included in the category object
        parent_pk: category?.parent ? category?.parent.uuid : null,
        parent: category?.parent ? category?.parent : null,
        generator_name: 'menu_item',
        extra_context: {
          attributes: {
            category_id: category?.pk
          },
          numchild: category?.numchild || 0 // Assuming numchild is included in the category object
        }
      };

      // If the category? has a parent, recursively build the breadcrumb path for the parent
      if (category?.parent) {
        return [
          ...buildBreadcrumbPath(category?.parent, level - 1),
          breadcrumb
        ];
      } else {
        return [breadcrumb];
      }
    }

    // Start building the breadcrumb path from the given category
    const breadcrumbList = buildBreadcrumbPath(category, 0);

    return breadcrumbList;
  }


  const defaultList = [{ url: '/list', label: 'List' }];
  const breadcrumbList = data?.category
    ? generateBreadcrumbList(data?.category)
    : defaultList;

  return (
    <div className='relative'>
      <HomeHeroSlider />
      <div
        className={clsx(
          data.category?.attributes?.category_banner
            ? 'relative w-full'
            : 'container px-4 mx-auto lg:px-0 lg:my-4'
        )}
      >
        {children}
        <div
          className={clsx(
            'my-4 lg:mt-7',
            data.category?.attributes?.category_banner &&
            'lg:absolute lg:inset-x-0 z-10 container lg:my-4 mx-auto'
          )}
        >
          {/* <Breadcrumb /> */}
        </div>
        <CategoryBanner {...data.category?.attributes?.category_banner} />
      </div>
      <ListPage data={data} />
    </div>
  );
}
