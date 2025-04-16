import React from 'react';
import PropTypes from 'prop-types';
import { useCheckout, useCheckoutDispatch } from '@components/common/context/checkout';

// Create an inline logo component
function AlipayLogo({ width = 40 }) {
    return (
        <div style={{ width: `${width}px` }}>
            <img
                src="/alipay_logo.svg"
                alt="Alipay"
                style={{ width: '150%', height: 'auto' }}
            />
        </div>
    );
}

// Create an inline form component
function AlipayForm({ orderId, orderPlaced }) {
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);

    React.useEffect(() => {
        if (orderPlaced && orderId) {
            setLoading(true);
            // Simplified payment initiation
            console.log("Processing Alipay payment for order:", orderId);

            // Simulate redirect
            setTimeout(() => {
                window.location.href = `/checkout/success/${orderId}`;
            }, 2000);
        }
    }, [orderPlaced, orderId]);

    return (
        <div className="p-4 border border-divider rounded mt-3">
            {error && <div className="text-critical mb-2">{error}</div>}
            <p>You will be redirected to Alipay after placing your order.</p>
            {loading && (
                <div className="flex justify-center mt-3">
                    <div className="spinner"></div>
                </div>
            )}
        </div>
    );
}

export default function AlipayMethod({ setting }) {
    const checkout = useCheckout();
    const { placeOrder } = useCheckoutDispatch();
    const { paymentMethods, setPaymentMethods, orderPlaced, orderId, steps } = checkout;

    // Get the selected payment method
    const selectedPaymentMethod = paymentMethods
        ? paymentMethods.find((paymentMethod) => paymentMethod.selected)
        : undefined;

    // Log payment methods for debugging
    React.useEffect(() => {
        console.log("Payment methods:", paymentMethods);
    }, [paymentMethods]);

    // Automatically place order when all steps are completed
    React.useEffect(() => {
        const selectedPaymentMethod = paymentMethods.find(
            (paymentMethod) => paymentMethod.selected
        );
        if (
            steps.every((step) => step.isCompleted) &&
            selectedPaymentMethod?.code === 'alipay'
        ) {
            console.log('All steps completed, placing order with Alipay payment');
            placeOrder();
        }
    }, [steps]);

    return (
        <div>
            <div className="flex justify-start items-center gap-2">
                {(!selectedPaymentMethod ||
                    selectedPaymentMethod.code !== 'alipay') && (
                        <a
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                console.log('Alipay payment method selected');
                                setPaymentMethods((previous) =>
                                    previous.map((paymentMethod) => {
                                        if (paymentMethod.code === 'alipay') {
                                            return {
                                                ...paymentMethod,
                                                selected: true
                                            };
                                        } else {
                                            return {
                                                ...paymentMethod,
                                                selected: false
                                            };
                                        }
                                    })
                                );
                            }}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="feather feather-circle"
                            >
                                <circle cx="12" cy="12" r="10" />
                            </svg>
                        </a>
                    )}
                {selectedPaymentMethod && selectedPaymentMethod.code === 'alipay' && (
                    <div>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#2c6ecb"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="feather feather-check-circle"
                        >
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                            <polyline points="22 4 12 14.01 9 11.01" />
                        </svg>
                    </div>
                )}
                <div className="flex gap-2 items-center">
                    <AlipayLogo width={40} />
                    <span className="font-semibold">
                        {setting.alipayDisplayName || 'Alipay (支付宝)'}
                    </span>
                </div>
            </div>
            <div>
                {selectedPaymentMethod && selectedPaymentMethod.code === 'alipay' && (
                    <div className="payment-form mt-4">
                        <AlipayForm 
                            orderId={orderId} 
                            orderPlaced={orderPlaced}
                        />
                    </div>
                )}
            </div>
        </div >
    );
}

AlipayMethod.propTypes = {
    setting: PropTypes.shape({
        alipayDisplayName: PropTypes.string
    }).isRequired
};

export const layout = {
    areaId: 'checkoutPaymentMethodalipay',
    sortOrder: 20
};

export const query = `
  query Query {
    setting {
      alipayDisplayName
    }
  }
`;