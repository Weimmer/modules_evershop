import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useCheckout } from '@components/common/context/checkout';
import AlipayForm from '@components/frontStore/alipay/checkout/AlipayForm';
import AlipayLogo from '@components/frontStore/alipay/AlipayLogo';

export default function AlipayMethod({ setting }) {
    const checkout = useCheckout();
    const { paymentMethods, setPaymentMethods, orderPlaced } = checkout;

    // Get the selected payment method
    const selectedPaymentMethod = paymentMethods
        ? paymentMethods.find((paymentMethod) => paymentMethod.selected)
        : undefined;

    // Initiate payment when order is placed
    useEffect(() => {
        if (orderPlaced && selectedPaymentMethod?.code === 'alipay') {
            // The AlipayForm component will handle the payment initiation
            const formElement = document.getElementById('alipay-payment-form');
            if (formElement) {
                formElement.dispatchEvent(new Event('submit', { cancelable: true }));
            }
        }
    }, [orderPlaced, selectedPaymentMethod]);

    const handlePaymentMethodSelected = () => {
        // This function is called when the payment method is selected
        // We do nothing here as we'll handle payment in the form component
    };

    return (
        <div>
            <div className="flex justify-start items-center gap-1">
                {(!selectedPaymentMethod ||
                    selectedPaymentMethod.code !== 'alipay') && (
                        <a
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
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
                <div className="payment-logo flex justify-center items-center">
                    <span className="font-semibold">{setting.alipayDisplayName || 'Alipay (支付宝)'}</span>
                </div>
            </div>
            <div>
                {selectedPaymentMethod && selectedPaymentMethod.code === 'alipay' && (
                    <div className="payment-form">
                        <AlipayForm onPaymentMethodSelected={handlePaymentMethodSelected} />
                    </div>
                )}
            </div>
        </div>
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