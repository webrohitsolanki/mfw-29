'use client';

import React, { useEffect, useState } from 'react';
import Style from './index.module.css';
import { Link, LoaderSpinner } from '@akinon/next/components';

export default function JoinMallForWoemanContent({ data }) {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulating data fetch
        setTimeout(() => {
            setIsLoading(false);
        }, 2000);
    }, []);

    if (isLoading) {
        return <div className='main_container_header mb-5'><LoaderSpinner /></div>;
    }
    return (
        <div className='my-10 container container_md main_container_header'>
            <h1 className={`mt-4 w-full text-center mb-5 text-2xl md-mt-0 ${Style.heading_main}`} data-testid="product-name">
                <i>Join Mall For Women</i>
            </h1>
            <h2>{data.attributes.first_column_title.value}</h2>
            <h2 className='my-2' dangerouslySetInnerHTML={{ __html: data.attributes.second_column_title.value }}></h2>
            <div className={`${Style.join_mall_for_women_table}`}>
                <table className={`mt-5 mb-2 text-center ${Style.table} `}>
                    <tbody>
                        <tr className={`my-2 text-center ${Style.tr} `}>
                            {data.attributes.first_column_table.map((item, i) => (
                                <th className={`${Style.th} `} key={i}><Link href={item?.value?.redirect_url}>{item?.value?.name}</Link></th>
                            ))}
                        </tr>
                        <tr className={`my-2 text-center ${Style.tr} `}>
                            {data.attributes.second_column_table.map((item, i) => (
                                <td className={`${Style.td} `} key={i}>{item?.value?.name}</td>
                            ))}
                        </tr>
                        <tr className={`my-2 text-center ${Style.tr} `}>
                            {data.attributes.third_column_table.map((item, i) => (
                                <td className={`${Style.td} `} key={i}>{item?.value?.name}</td>
                            ))}
                        </tr>
                        <tr className={`my-2 text-center ${Style.tr} `}>
                            {data.attributes.fourth_column_table.map((item, i) => (
                                <td className={`${Style.td} `} key={i}>{item?.value?.name}</td>
                            ))}
                        </tr>
                    </tbody>
                </table>
                <table className={`text-center border-0 ${Style.table_2} `}>
                    <tbody>
                        <tr>
                            {data.attributes.six_column_table.map((item, i) => (
                                <td className={`${Style.td_4_column}`} key={i}>
                                    {item?.value?.name === "$nbsp;" ? <h1></h1> :
                                        <Link href={item?.value?.redirect_url}>
                                            {item?.value?.name}
                                        </Link>
                                    }
                                </td>
                            ))}
                        </tr>
                    </tbody>
                </table>
                <table className={`text-center border-0 ${Style.table_2} `}>
                    <tbody>
                        <tr>
                            {data.attributes.fifth_column_table.map((item, i) => (
                                <td className={`${Style.td_4_column}`} key={i}>
                                    {item?.value?.name === "$nbsp;" ? <h1></h1> :
                                        <Link href={item?.value?.redirect_url}>
                                            {item?.value?.name}
                                        </Link>
                                    }
                                </td>
                            ))}
                        </tr>
                    </tbody>
                </table>
            </div>
            <h2 className='my-2'><b>{data.attributes.third_column_title.value}</b></h2>
            <div className='my-2'>
                {data.attributes.third_column_items.map((item, i) => (
                    <h3 className='py-2' key={i}>{item?.value?.name}</h3>
                ))}
            </div>
        </div >
    );
}
