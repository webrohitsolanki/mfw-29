'use client'

// import { useState } from 'react';

const port = process.env.PORT || 3000;
const environment = process.env.ENVIRONMENT || 'sandbox';
const client_id = process.env.CLIENT_ID || 'Ac7Bi-VsbU6Ogw8DOevnobPLSrEVkaUjePYxLdbTJEuAE0a1zpf417D9v3V35MNxFIXsvAly81kOkV9J';
const client_secret = process.env.CLIENT_SECRET || 'EHAsr8K_PQoTFXWLWqHlFZM_fS4Dkq1WUWhb-gpgNc4It-YwG7z7ECIySa4sq8cCeT4h3mjs-xXyon74';
const endpoint_url = environment === 'sandbox' ? 'https://api-m.sandbox.paypal.com' : 'https://api-m.paypal.com';
import { Image } from '@akinon/next/components';
import { useGetBasketQuery } from '@akinon/next/data/client/basket';


export default function PayPalButton() {
    // const [amount, setAmount] = useState<number>(100.00);f
    const { data: basket, isLoading, isSuccess } = useGetBasketQuery();


    async function get_access_token() {
        const auth = `${client_id}:${client_secret}`

        const data = 'grant_type=client_credentials'
        return fetch(endpoint_url + '/v1/oauth2/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${Buffer.from(auth).toString('base64')}`
            },
            body: data
        })
            .then(res => res.json())
            .then(json => {

                return json.access_token;
            })

    }

    // async function get_access_token() {
    //     try {
    //         const response = await fetch("https://api-m.sandbox.paypal.com/v1/oauth2/token", {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //         });

    //         if (!response.ok) {
    //             throw new Error('Failed to fetch access token');
    //         }

    //         const json = await response.json();
    //         return json.access_token;
    //     } catch (error) {
    //         console.error('Error fetching access token:', error.message);
    //         // Handle error or return default value
    //         return null;
    //     }
    // }



    const handlePaypal = async () => {

        try {
            const body = JSON.stringify({
                intent: 'capture',
                price: '100.00'
            });

            const bodyObject = JSON.parse(body);
            const intent = 'capture';
            const price = basket.total_amount



            // const response = await fetch('/api/paypal/createOrder', {

            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify(bodyObject)
            // });
            // const responseData = await response.json();

            // if (response.ok) {
            //     window.location.href = `${responseData.links[1].href}`
            // } else {
            //     console.error("Error creating PayPal order: ", responseData);
            // }

            await get_access_token()
                .then(access_token => {
                    const order_data_json = {
                        'intent': intent.toUpperCase(),
                        'purchase_units': [{
                            'amount': {
                                'currency_code': 'USD',
                                'value': `${price}`
                            }
                        }],
                        payment_source: {
                            paypal: {
                                experience_context: {
                                    // return_url: "http://localhost:3000/order-successfull",
                                    return_url: "http://localhost:3000/order-successfull",
                                    cancel_url: "https://74c3f8ed9ff54860ace14bc09ecf0f2c.lb.akinoncloud.com/orders/checkout"
                                }
                            }
                        }
                    }
                    const data = JSON.stringify(order_data_json)

                    fetch(endpoint_url + '/v2/checkout/orders', { //https://developer.paypal.com/docs/api/orders/v2/#orders_create
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${access_token}`
                        },
                        body: data
                    })
                        .then(res => res.json())
                        .then(json => {
                            
                            return json
                            // res.json(json);
                            // return new Response(JSON.stringify({ response: json }), {
                            //     status: 200,
                            //     headers: { 'Content-Type': 'application/json' },
                            //   });
                        }).then(json => window.location.href = json.links[1].href)
                })
        } catch (error) {
            console.error("Error creating PayPal order: ", error);
        }

    };


    return (
        <>
            <button name="paypal" onClick={handlePaypal}><Image src='/images/local/paypal-button.svg' className='pdp_paypal_image' width={10} height={10} alt='PayPal' />
            </button>
        </>
    );
}