'use-client';

import { Link } from '@theme/components';
import { AccordionFooter } from '@theme/components/accordion-footer';
import { getWidgetData } from '@akinon/next/data/server';
import FooterSocial from '@theme/widgets/footer-social';
import { Image } from '@akinon/next/components';

type SideItem = {
  value: string;
  data_type: 'dropdown';
};

type TargetBlank = {
  value: string;
  data_type: 'dropdown';
};

type FooterMenuItem = [
  {
    // TODO: Refactor this from commerce_proxy
    kwargs: {
      data_type: 'nested';
      value: {
        is_side_column_item?: SideItem;
        is_target_blank: TargetBlank;
      };
    };
    value: {
      is_side_column_item?: string;
      is_target_blank: string;
      name: string;
      redirect_url: string;
    };
  }
];

type FooterMenuTitle = {
  value: string;
  kwargs: {
    value: string;
    data_type: string;
    url: string;
  };
};

type FooterMenuType = {
  first_column_title: FooterMenuTitle;
  first_column_image: FooterMenuTitle;
  first_column_items: FooterMenuItem;
  second_column_title: FooterMenuTitle;
  second_column_image: FooterMenuTitle;
  second_column_items: FooterMenuItem;
  third_column_title: FooterMenuTitle;
  third_column_image: FooterMenuTitle;
  third_column_items: FooterMenuItem;
  fourth_column_title: FooterMenuTitle;
  fourth_column_image: FooterMenuTitle;
  fifth_column_image: FooterMenuTitle;
  fifth_column_title: FooterMenuTitle;
  // third_column_items: FooterMenuItem;
};

export default async function FooterMenu() {
  const data = await getWidgetData<FooterMenuType>({ slug: 'footer-menu-new' });
  return (
    <div className="flex-1 relative">
      <div className="justify-between text-xs md:flex md:px-6 md:py-4 footer_menu_mobile">
        <div>
          <div
            className="mb-2 font-medium lg:text-xl lg:pt-0 text-xm footer_color"
            data-testid="footer-categories"
          >
            <div className="flex gap-2 lgpt-0 md:pt-0 pt-2 footer_color">
              {/* <div className='w-[20px] lg:mt-2'><img src={data?.attributes?.first_column_image?.kwargs.url} className='footer_menu_image' alt="" /></div> */}
              {/* <Image src={data?.attributes?.first_column_image?.kwargs.url} width={10} height={10} alt='' /> */}
              <div>
                <span className="footer_menu_text_content text-xm lg:text-lg flex items-center gap-2">
                  <div className="size-[20px]">
                    <img
                      src={data?.attributes?.first_column_image?.kwargs.url}
                      className="footer_menu_image"
                      alt=""
                    />
                  </div>
                  {data?.attributes?.first_column_title?.value}
                </span>
                <div className="flex mt-4">
                  <ul className="lg:mr-8 xl:mr-16">
                    {data?.attributes?.first_column_items?.map((item, i) => (
                      <li
                        className="mb-2 text-xm lg:text-lg footer_hove_tag whitespace-nowrap hover:text-white"
                        key={i}
                      >
                        <Link
                          href={item?.value?.redirect_url || '#'}
                          target={
                            item?.value?.is_target_blank === 'true'
                              ? '_blank'
                              : '_self'
                          }
                        >
                          {item?.value?.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="mb-3 flex gap-2">
            {/* <div className='w-[40px] lg:mt-1'>
              <span><img src={data?.attributes?.second_column_image?.kwargs.url} className='footer_menu_image' alt="" /></span>
            </div> */}
            <div>
              <span className="footer_menu_text_content text-xm lg:text-lg flex items-center gap-2">
                <div className="size-[20px]">
                  <img
                    src={data?.attributes?.second_column_image?.kwargs.url}
                    className="footer_menu_image"
                    alt=""
                  />
                </div>
                {data?.attributes?.second_column_title?.value}
              </span>
              <div>
                <ul className="lg:mr-8 mr-4 mt-4">
                  {data?.attributes?.second_column_items?.map((item, i) => (
                    <li
                      className="mb-2 text-xm lg:text-lg footer_hove_tag"
                      key={i}
                    >
                      <div
                      // href={item?.value?.redirect_url || '#'}
                      // target={
                      //   item?.value?.is_target_blank === 'true'
                      //     ? '_blank'
                      //     : '_self'
                      // }
                      >
                        <span
                          dangerouslySetInnerHTML={{
                            __html: item?.value?.name || ''
                          }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div>
            <div className="flex gap-2 footer_menu_fourth_mobile">
              <span className="lg:mt-1">
                <img
                  src={data?.attributes?.fourth_column_image?.kwargs.url}
                  className="footer_menu_image"
                  alt=""
                />
              </span>
              {/* <Image src={data?.attributes?.first_column_image?.kwargs.url} width={10} height={10} alt='' /> */}

              <span className="footer_menu_text_content text-xm lg:text-lg">
                {data?.attributes?.fourth_column_title?.value}
              </span>
            </div>
          </div>
        </div>

        <div>
          <div>
            <div className="mb-3 flex gap-2 ">
              {/* <div className='w-[30px] lg:mt-1'><img src={data?.attributes?.third_column_image?.kwargs.url} className='footer_menu_image' alt="" /></div> */}
              <div>
                <span className="footer_menu_text_content text-xm lg:text-lg flex items-center gap-2">
                  <div className="size-[20px]">
                    <img
                      src={data?.attributes?.third_column_image?.kwargs.url}
                      className="footer_menu_image"
                      alt=""
                    />
                  </div>

                  {data?.attributes?.third_column_title?.value}
                </span>
                <div>
                  <ul className="lg:mr-8 xl:mr-16 mt-4">
                    {data?.attributes?.third_column_items?.map((item, i) => (
                      <li
                        className="mb-2 text-xm lg:text-lg footer_hove_tag"
                        key={i}
                      >
                        <div
                        // href={item?.value?.redirect_url || '#'}
                        // target={
                        //   item?.value?.is_target_blank === 'true'
                        //     ? '_blank'
                        //     : '_self'
                        // }
                        >
                          <span
                            dangerouslySetInnerHTML={{
                              __html: item?.value?.name || ''
                            }}
                          />
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div
              className="mb-3 font-medium lg:text-xl text-xm mt-5"
              data-testid="footer-customer-care"
            >
              <div className="flex gap-2">
                {/* <div className='w-[20px] lg:mt-1'><img src={data?.attributes?.fifth_column_image?.kwargs.url} className='footer_menu_image' alt="" /></div> */}
                {/* <Image src={data?.attributes?.first_column_image?.kwargs.url} width={10} height={10} alt='' /> */}

                <div>
                  <span className="footer_menu_text_content text-xm lg:text-lg flex items-center gap-2">
                    <div className="size-[20px]">
                      <img
                        src={data?.attributes?.third_column_image?.kwargs.url}
                        className="footer_menu_image"
                        alt=""
                      />
                    </div>

                    {data?.attributes?.fifth_column_title?.value}
                  </span>
                  <span>
                    <FooterSocial />
                  </span>
                </div>
              </div>
              <div></div>
            </div>
          </div>

          <div>
            <div
              className="mb-3 footer_menu_fourth font-medium lg:text-xl text-sm mt-4"
              data-testid="footer-customer-care"
            >
              <div className="flex gap-1 lg:items-center">
                <span>
                  <img
                    src={data?.attributes?.fourth_column_image?.kwargs.url}
                    className="footer_menu_image "
                    alt=""
                  />
                </span>
                {/* <Image src={data?.attributes?.first_column_image?.kwargs.url} width={10} height={10} alt='' /> */}

                <span className="footer_menu_text_content text-m lg:text-lg">
                  {data?.attributes?.fourth_column_title?.value}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <div>
        <AccordionFooter
          title={data?.attributes?.first_column_title?.value}
          titleClassName="text-xs font-medium"
        >
          <div>
            <ul className="text-xs px-4">

              {/* {data?.attributes?.first_column_items
                ?.filter(
                  (category) => {

                    return category?.value?.is_side_column_item === 'True'
                  }
                ).map((item, index) => {
                  return (
                    <li className="mb-2" key={index}>

                      <Link
                        href={item?.value?.redirect_url || '#'}
                        target={
                          item?.value?.is_target_blank === 'true'
                            ? '_blank'
                            : '_self'
                        }
                      >
                        {item?.value?.name}
                      </Link>
                    </li>
                  )
                }) */}
      {/* {data?.attributes?.first_column_items?.map((item, i) => (
                <li className="mb-2" key={i}>
                  <Link
                    href={item?.value?.redirect_url || '#'}
                    target={
                      item?.value?.is_target_blank === 'true'
                        ? '_blank'
                        : '_self'
                    }
                  >
                    {item?.value?.name}
                  </Link>
                </li>
              ))} */}
      {/* } */}
      {/* </ul> */}
    </div>
    //   </AccordionFooter>

    //   <AccordionFooter
    //     title={data?.attributes?.second_column_title?.value}
    //     titleClassName="text-xs font-medium"
    //   >
    //     <div>
    //       <ul className="text-xs px-4">
    //         {data?.attributes?.second_column_items?.map((item, i) => (
    //           <li className="mb-2" key={i}>
    //             <Link
    //               href={item?.value?.redirect_url || '#'}
    //               target={
    //                 item?.value?.is_target_blank === 'true'
    //                   ? '_blank'
    //                   : '_self'
    //               }
    //             >
    //               {item?.value?.name}
    //             </Link>
    //           </li>
    //         ))}
    //       </ul>

    //     </div>
    //   </AccordionFooter>

    //   <AccordionFooter
    //     className="last:mb-0"
    //     title={data?.attributes?.third_column_title?.value}
    //     titleClassName="text-x;l font-medium"
    //   >
    //     <div>
    //       <ul className="text-xs px-4">
    //         {data?.attributes?.third_column_items?.map((item, i) => (
    //           <li className="mb-2" key={i}>
    //             <Link
    //               href={item.value.redirect_url || '#'}
    //               target={
    //                 item.value.is_target_blank === 'true' ? '_blank' : '_self'
    //               }
    //             >
    //               {item.value.name}
    //             </Link>
    //           </li>
    //         ))}
    //       </ul>
    //     </div>

    //   </AccordionFooter>

    //   <AccordionFooter
    //     className="last:mb-0"
    //     title={data?.attributes?.fourth_column_title?.value}
    //     titleClassName="text-xs font-medium"
    //   >
    //     <div>
    //       <ul className="text-xs px-4">
    //         {data?.attributes?.third_column_items?.map((item, i) => (
    //           <li className="mb-2" key={i}>
    //             <Link
    //               href={item.value.redirect_url || '#'}
    //               target={
    //                 item.value.is_target_blank === 'true' ? '_blank' : '_self'
    //               }
    //             >
    //               {item.value.name}
    //             </Link>
    //           </li>
    //         ))}
    //       </ul>
    //     </div>
    //   </AccordionFooter>
    // </div> */}
    // </div>
  );
}

// export default async function FooterMenu() {
//   const data = await getWidgetData<FooterMenuType>({ slug: 'footer-menu-new' });

//   return (
//     <div className="flex-1">
//       <div className="hidden justify-between text-xs md:flex md:px-6 md:py-4">
//         <div>
//           <div className="mb-4 font-medium" data-testid="footer-categories">
//             {data?.attributes?.first_column_title?.value}
//           </div>
//           } */}
//           <div className="flex">
//            {/* <ul className="lg:mr-8">
//               {data?.attributes?.first_column_items
//                 ?.filter(
//                   (category) => category?.value?.is_side_column_item === 'True'
//                 )
//                 .map((item, i) => (
//                   <li className="mb-2" key={i}>
//                     <Link
//                       href={item?.value?.redirect_url || '#'}
//                       target={
//                         item?.value?.is_target_blank === 'true'
//                           ? '_blank'
//                           : '_self'
//                       }
//                       data-testid={`footer-categories-${item?.value?.name?.toLocaleLowerCase()}`}
//                     >
//                       {item?.value?.name}
//                     </Link>
//                   </li>
//                 ))}
//             </ul> */}
//             <ul className="lg:mr-8 xl:mr-16">
//               {data?.attributes?.first_column_items?.map((item, i) => (
//                 <li className="mb-2" key={i}>
//                   <Link
//                     href={item?.value?.redirect_url || '#'}
//                     target={
//                       item?.value?.is_target_blank === 'true'
//                         ? '_blank'
//                         : '_self'
//                     }
//                   >
//                     {item?.value?.name}
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </div>

//         <div>
//           <div className="mb-4 font-medium" data-testid="footer-my-account">
//             {data?.attributes?.second_column_title?.value}
//           </div>

//           <div>
//             <ul className="mr-8">
//               {data?.attributes?.second_column_items?.map((item, i) => (
//                 <li className="mb-2" key={i}>
//                   <Link
//                     href={item?.value?.redirect_url || '#'}
//                     target={
//                       item?.value?.is_target_blank === 'true'
//                         ? '_blank'
//                         : '_self'
//                     }
//                   >
//                     <p dangerouslySetInnerHTML={{ __html: item?.value?.name }}></p>
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//             {/* <ul>  {data?.attributes?.fourth_column_items?.map((item, i) => (
//                 <li className="mb-2" key={i}>
//                   <Link
//                     href={item?.value?.redirect_url || '#'}
//                     target={
//                       item?.value?.is_target_blank === 'true'
//                         ? '_blank'
//                         : '_self'
//                     }
//                   >
//                     <p dangerouslySetInnerHTML={{ __html: item?.value?.name }}></p>
//                   </Link>
//                 </li>
//               ))}</ul> */}
//           </div>
//         </div>

//         <div>
//           <div className="mb-4 font-medium" data-testid="footer-customer-care">
//             {data?.attributes?.third_column_title?.value}
//           </div>

//           <div>
//             <ul className="lg:mr-8 xl:mr-16">
//               {data?.attributes?.third_column_items?.map((item, i) => (
//                 <li className="mb-2" key={i}>
//                   <Link
//                     href={item?.value?.redirect_url || '#'}
//                     target={
//                       item?.value?.is_target_blank === 'true'
//                         ? '_blank'
//                         : '_self'
//                     }
//                   >
//                     <p dangerouslySetInnerHTML={{ __html: item?.value?.name }}></p>
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </div>

//         <div>
//           <div className="mb-4 font-medium" data-testid="footer-customer-care">
//             {data?.attributes?.fourth_column_title?.value}
//           </div>
//           {/*
//           <div>
//             <ul className="lg:mr-8 xl:mr-16">
//               {data?.attributes?.third_column_items?.map((item, i) => (
//                 <li className="mb-2" key={i}>
//                   <Link
//                     href={item?.value?.redirect_url || '#'}
//                     target={
//                       item?.value?.is_target_blank === 'true'
//                         ? '_blank'
//                         : '_self'
//                     }
//                   >
//                     <p dangerouslySetInnerHTML={{ __html: item?.value?.name }}></p>
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//           </div> */}
//         </div>

//       </div>
//       <div className="block md:hidden">
//         <AccordionFooter
//           title={data?.attributes?.first_column_title?.value}
//           titleClassName="text-xs font-medium"
//         >
//           <div>

//             <ul className="text-xs px-4">
//               {data?.attributes?.first_column_items
//                 ?.filter(
//                   (category) => {

//                     return category?.value?.is_side_column_item === 'True'
//                   }
//                 ).map((item, index) => {
//                   return (
//                     <li className="mb-2" key={index}>

//                       <Link
//                         href={item?.value?.redirect_url || '#'}
//                         target={
//                           item?.value?.is_target_blank === 'true'
//                             ? '_blank'
//                             : '_self'
//                         }
//                       >
//                         {item?.value?.name}

//                       </Link>
//                     </li>
//                   )
//                 })
//               }
//             </ul>
//           </div>
//         </AccordionFooter>

//         <Accordion
//           title={data?.attributes?.second_column_title?.value}
//           titleClassName="text-xs font-medium"
//         >
//           <div>
//             <ul className="text-xs px-4">
//               {data?.attributes?.second_column_items?.map((item, i) => (
//                 <li className="mb-2" key={i}>
//                   <Link
//                     href={item?.value?.redirect_url || '#'}
//                     target={
//                       item?.value?.is_target_blank === 'true'
//                         ? '_blank'
//                         : '_self'
//                     }
//                   >
//                     {item?.value?.name}
//                   </Link>
//                 </li>
//               ))}
//             </ul>

//           </div>
//         </Accordion>

//         <Accordion
//           className="last:mb-0"
//           title={data?.attributes?.third_column_title?.value}
//           titleClassName="text-xs font-medium"
//         >
//           <div>
//             <ul className="text-xs px-4">
//               {data?.attributes?.third_column_items?.map((item, i) => (
//                 <li className="mb-2" key={i}>
//                   <Link
//                     href={item.value.redirect_url || '#'}
//                     target={
//                       item.value.is_target_blank === 'true' ? '_blank' : '_self'
//                     }
//                   >
//                     {item.value.name}
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </Accordion>

//         <Accordion
//           className="last:mb-0"
//           title={data?.attributes?.fourth_column_title?.value}
//           titleClassName="text-xs font-medium"
//         >
//           {/* <div>
//             <ul className="text-xs px-4">
//               {data?.attributes?.third_column_items?.map((item, i) => (
//                 <li className="mb-2" key={i}>
//                   <Link
//                     href={item.value.redirect_url || '#'}
//                     target={
//                       item.value.is_target_blank === 'true' ? '_blank' : '_self'
//                     }
//                   >
//                     {item.value.name}
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//           </div> */}
//         </Accordion>

//       </div>
//     </div>
//   );
// }
