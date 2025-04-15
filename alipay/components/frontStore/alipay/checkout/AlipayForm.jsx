import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useCheckout } from '@components/common/context/checkout';
import { toast } from 'react-toastify';

export default function AlipayForm({ onPaymentMethodSelected }) {
    const [loading, setLoading] = useState(false);
    const { orderId, checkoutSuccessUrl } = useCheckout();

    const initiatePayment = async () => {
        if (!orderId) {
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('/api/alipay/payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ orderId })
            });

            const data = await response.json();

            if (data.success && data.paymentUrl) {
                // Redirect to Alipay payment page
                window.location.href = data.paymentUrl;
            } else {
                toast.error(data.message || 'Could not initiate payment');
                setLoading(false);
            }
        } catch (err) {
            console.error('Error initiating payment:', err);
            toast.error('There was an error processing your payment request');
            setLoading(false);
        }
    };

    return (
        <div className="alipay-form">
            <div className="text-center mt-3">
                <p className="mb-2">
                    You will be redirected to Alipay to complete your payment after placing the order.
                </p>
                {loading && (
                    <div className="loading flex justify-center">
                        <div className="spinner">
                            <div className="rect1"></div>
                            <div className="rect2"></div>
                            <div className="rect3"></div>
                            <div className="rect4"></div>
                            <div className="rect5"></div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

AlipayForm.propTypes = {
    onPaymentMethodSelected: PropTypes.func.isRequired
};