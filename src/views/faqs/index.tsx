import React from 'react';
import Style from './index.module.css';


const FAQS = () => {

    return (
        <div className="container-md container">
            <div className='w-8/12 mx-auto '>
                <h1 className='text-5xl color=[#003744] my-10 w-ful mx-auto text-center'>FAQs</h1>
                <div>
                    <h2 className="privacy_sub_header my-4">1. How long are shipping times?</h2>
                    <p>Our suppliers typically ship items within ten (10) days of receiving an order.  From that point, it will take ten (10) to twenty (20) days for items to arrive.  As soon as your product ships, we will inform you via email and provide updates accordingly.
                    </p>
                </div>
                <div className='mt-3'>
                    <h2 className="privacy_sub_header my-4">2. What your return policy?</h2>
                    <p>We have a seven (7) day return policy, which means you have 7 days after receiving your item to request a return.
                        To be eligible for a return, your item must be in the same condition that you received it, unworn or unused, with tags, and in its original packaging. You’ll also need the receipt or proof of purchase.
                    </p>
                    <p>To start a return, you can contact us at sales@mallforwomen.com. If your return is accepted, we’ll send you a return shipping label, as well as instructions on how and where to send your package. Items sent back to us without first requesting a return will not be accepted.
                    </p>
                    <p>You can always contact us for any return question at sales@mallforwomen.com.
                    </p>
                </div>
                <div className='mt-3'>
                    <h2 className="privacy_sub_header my-4">3. Can I cancel my order?
                    </h2>
                    <p>Cancellations are possible if you do not receive your package within the time frame specified on each individual product.</p>
                    <p> You must send an email cancellation request, which will be reviewed.  We will accept the request, reject the request, or asks you for further details before making a decision.  If an agreement is reached and the order is canceled, then the transaction is canceled and you will receive a full refund.</p>
                </div>
                <div className='mt-3 mb-5'>
                    <h2 className="privacy_sub_header my-4">4. What happens if I receive the wrong item?</h2>
                    <p>If there is an issue with your order, like being the wrong size, color, defective, or otherwise not exactly what you wanted, then simply notify us at sales@mallforwomen.com with your dispute within seven (7) days of receiving the package.  </p>

                </div>
                <div className='mt-3 mb-5'>
                    <h2 className="privacy_sub_header my-4">5. Do you offer exchanges?</h2>
                    <p>We do not offer exchanges; however, if for any reason you did not get the exact product you purchased, you have seven (7) days following the delivery of your order to inform us at sales@mallforwomen.com.  We will review your concern and refer you to our return policy.</p>
                </div>

            </div>
        </div>
    );
};

export default FAQS;
