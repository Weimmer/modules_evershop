import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';

export default function AlipayForm({ orderId, orderPlaced }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Initiate payment when order is placed and we have an order ID
        if (orderPlaced && orderId && !loading) {
            initiatePayment();
        }
    }, [orderPlaced, orderId]);

    const initiatePayment = async () => {
        if (!orderId) {
            console.error('No order ID available');
            return;
        }

        console.log('Initiating Alipay payment for order:', orderId);
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/alipay/payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ orderId })
            });

            const data = await response.json();
            console.log('Alipay payment response:', data);

            if (data.success && data.paymentUrl) {
                console.log('Redirecting to Alipay payment page:', data.paymentUrl);
                window.location.href = data.paymentUrl;
            } else {
                console.error('Failed to initiate Alipay payment:', data.message);
                setError(data.message || 'Could not initiate payment');
                toast.error(data.message || 'Could not initiate payment');
                setLoading(false);
            }
        } catch (err) {
            console.error('Error initiating Alipay payment:', err);
            setError('There was an error processing your payment request');
            toast.error('There was an error processing your payment request');
            setLoading(false);
        }
    };

    return (
        <div className="alipay-form">
            <div className="text-center p-4 border border-divider rounded mt-3">
                {error && <div className="text-critical mb-4">{error}</div>}

                <p className="mb-4">
                    You will be redirected to Alipay.
                </p>

                {loading && (
                    <div className="flex justify-center mb-4">
                        <div className="spinner flex items-center">
                            <div className="spinner-loading"></div>
                            <span className="ml-2">Processing payment...</span>
                        </div>
                    </div>
                )}

                <div className="mt-2">
                    <img
                        src="/alipay_logo.svg"
                        alt="Alipay Logo"
                        className="mx-auto"
                        style={{ width: '80px', height: 'auto' }}
                    />
                </div>
            </div>
        </div>
    );
}

AlipayForm.propTypes = {
    orderId: PropTypes.string,
    orderPlaced: PropTypes.bool.isRequired
};