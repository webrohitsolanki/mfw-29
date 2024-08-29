import React from 'react';
import Style from './index.module.css';


const RefundPolicy = () => {

    return (
        <div className="container-md container main_container_header">
            <div className='w-8/12 mx-auto'>
                <h1 className='text-5xl color=[#003744] my-5 w-ful mx-auto text-center'>Refund policy</h1>
                <div>
                    <h2 className={`${Style.privacy_sub_header}`}>Returns</h2>
                    <p className={`${Style.header_subtext}`}>We have a 30-day return policy, which means you have 30 days after receiving your item to request a return.</p>
                    <p className={`${Style.header_subtext} mt-3`}>To be eligible for a return, your item must be in the same condition that you received it, unworn or unused, with tags, and in its original packaging. You’ll also need the receipt or proof of purchase.</p>
                    <p className={`${Style.header_subtext} mt-3`}>To start a return, you can contact us at https://account.mallforwomen.com if your return is accepted, we’ll send you a return shipping label, as well as instructions on how and where to send your package.
                    </p>
                    <p className={`${Style.header_subtext} mt-3`}>You can always contact us for any return questions at info@mallforwomen.com.</p>
                </div>
                <div className='mt-3'>
                    <h2 className={`${Style.privacy_sub_header}`}>Exceptions / non-returnable items</h2>
                    <p className={`${Style.header_subtext}`}>Certain types of items cannot be returned, like perishable goods (such as food, flowers, or plants), custom products (such as special orders or personalized items), and personal care goods (such as beauty products). Please get in touch if you have questions or concerns about your specific item.</p>
                    <p className={`${Style.header_subtext} mt-3`}>Unfortunately, we cannot accept returns on sale items or gift cards.</p>
                </div>
                <div className='mt-3'>
                    <h2 className={`${Style.privacy_sub_header}`}>Exchanges</h2>
                    <p className={`${Style.header_subtext}`}>The fastest way to ensure you get what you want is to return the item you have, and once the return is accepted, make a separate purchase for the new item.</p>
                </div>
                <div className='mt-3 mb-5'>
                    <h2 className={`${Style.privacy_sub_header}`}>Refunds</h2>
                    <p className={`${Style.header_subtext}`}>We will notify you once we’ve received and inspected your return, and let you know if the refund was approved or not. If approved, you’ll be automatically refunded on your original payment method. Please remember it can take some time for your bank or credit card company to process the refund</p>
                </div>
            </div>
        </div>
    );
};

export default RefundPolicy;
