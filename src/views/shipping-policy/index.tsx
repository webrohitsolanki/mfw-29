import React from 'react';
import Style from './index.module.css';


const ShippingPolicy = () => {

    return (
        <div className="container-md container main_container_header">
            <div className='w-8/12 mx-auto'>
                <div className='mb-5'>
                    <h1 className='text-5xl color=[#003744] my-10 w-ful mx-auto text-center'>Shipping policy</h1>
                    <p className={`${Style.header_subtext} mt-3`}>We work with suppliers around the world to source high-quality products.  Our suppliers typically ship items within ten (10) days from receiving an order.  From that point, it will take approximately twenty (20) to thirty (30) days for items to arrive. Check the estimated delivery times listed in each product description for more information.</p>
                    <p className={`${Style.header_subtext} mt-3`}>As soon as your product ships, we will inform you via email and provide updates accordingly.  Express shipping is available on request.  Please contact us and we will be pleased to assist you.</p>
                </div>
            </div>
        </div>
    );
};

export default ShippingPolicy;
    