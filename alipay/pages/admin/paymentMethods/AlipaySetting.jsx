import React from 'react';
import { Field } from '@components/common/form/Field';
import { Card } from '@components/admin/cms/Card';

export default function AlipaySetting() {
    // Since we're not getting these values from GraphQL yet, 
    // we'll use default values or empty strings

    return (
        <Card
            title="Alipay (支付宝) Payment"
            subdued
        >
            <Card.Session>
                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <Field
                            id="alipayPaymentStatus"
                            type="toggle"
                            name="alipayPaymentStatus"
                            label="Enable Alipay Payment"
                            value={0}
                        />
                    </div>
                </div>
            </Card.Session>
            <Card.Session title="General settings">
                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <Field
                            id="alipayDisplayName"
                            type="text"
                            name="alipayDisplayName"
                            label="Display Name"
                            placeholder="Alipay (支付宝)"
                            value=""
                            instruction="This will be displayed on the checkout page"
                        />
                    </div>
                    <div>
                        <Field
                            id="alipaySandbox"
                            type="toggle"
                            name="alipaySandbox"
                            label="Sandbox Mode"
                            value={0}
                            instruction="Enable for testing purposes"
                        />
                    </div>
                </div>
            </Card.Session>
            <Card.Session title="Alipay API Credentials">
                <div className="grid grid-cols-1 gap-2">
                    <div>
                        <Field
                            id="alipayAppId"
                            type="text"
                            name="alipayAppId"
                            label="App ID"
                            placeholder="Enter your Alipay App ID"
                            value=""
                            instruction="Get this from your Alipay Developer Account"
                        />
                    </div>
                    <div>
                        <Field
                            id="alipayPrivateKey"
                            type="textarea"
                            name="alipayPrivateKey"
                            label="Private Key"
                            placeholder="Enter your Private Key"
                            value=""
                            instruction="RSA private key - Start with -----BEGIN RSA PRIVATE KEY-----"
                        />
                    </div>
                    <div>
                        <Field
                            id="alipayPublicKey"
                            type="textarea"
                            name="alipayPublicKey"
                            label="Alipay Public Key"
                            placeholder="Enter Alipay's Public Key"
                            value=""
                            instruction="Alipay public key for verifying responses"
                        />
                    </div>
                </div>
            </Card.Session>
        </Card>
    );
}

export const layout = {
    areaId: 'paymentMethodSetting',
    sortOrder: 15
};