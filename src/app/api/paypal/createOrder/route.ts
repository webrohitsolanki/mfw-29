// pages/api/paypal/createOrder.ts
// import { NextApiRequest, NextApiResponse } from 'next';
// import { config } from 'dotenv';
import fetch from 'node-fetch';

// config();

const client_id: string = process.env.CLIENT_ID!;
const client_secret: string = process.env.CLIENT_SECRET!;
const environment: string = process.env.ENVIRONMENT || 'sandbox';
const endpoint_url: string = environment === 'sandbox' ? 'https://api-m.sandbox.paypal.com' : 'https://api-m.paypal.com';


async function getAccessToken(): Promise<string> {
    const auth = `${client_id}:${client_secret}`;
    const data = 'grant_type=client_credentials';

    const response = await fetch(`${endpoint_url}/v1/oauth2/token`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${Buffer.from(auth).toString('base64')}`
        },
        body: data
    });

    const json = await response.json();

    return json.access_token;
}

export async function POST(req, res): Promise<void> {
    if (req.method === 'POST') {
        try {
            const {intent, price} = req.body;
            const access_token = await getAccessToken();
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
                            return_url: "http://localhost:5173/success",
                            cancel_url: "https://example.com/cancelUrl"
                        }
                    }
                }
            };
            const data = JSON.stringify(order_data_json);

            const order_response = await fetch(endpoint_url + '/v2/checkout/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access_token}`
                },
                body: data
            });

            const order_json = await order_response.json();
            res.status(200).json(order_json);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}