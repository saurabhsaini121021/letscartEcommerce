import React from 'react';
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Payment from './Payment'

const PUBLIC_KEY = 'pk_test_51JyZu7SIlGE4jSfw4oZ0SpKLUQLxlwTmnXxEUVMRkbuoTZ6meSanVEnT1lsdbCv0Uz8MLfyL5mTegZGFodR75IlL00BZanJ99T'

const stripeTestPromise = loadStripe(PUBLIC_KEY);
const StripePayment = () => {

    return (
        <Elements stripe={stripeTestPromise}>
            <Payment />
        </Elements>

    )
}

export default StripePayment
