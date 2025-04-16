import React from 'react';
import PropTypes from 'prop-types';
import { Field } from '@components/common/form/Field';
import { Toggle } from '@components/common/form/fields/Toggle';
import { Card } from '@components/admin/cms/Card';

export default function AlipaySetting({ setting }) {
    return (
        <Card title="Alipay Payment">
            <Card.Session>
                <div className="grid grid-cols-3 gap-8">
                    <div className="col-span-1 items-center flex">
                        <h4>Enable?</h4>
                    </div>
                    <div className="col-span-2">
                        <Toggle name="alipayPaymentStatus" value={setting.alipayPaymentStatus} />
                    </div>
                </div>
            </Card.Session>
            <Card.Session>
                <div className="grid grid-cols-3 gap-8">
                    <div className="col-span-1 items-center flex">
                        <h4>Display Name</h4>
                    </div>
                    <div className="col-span-2">
                        <Field
                            type="text"
                            name="alipayDisplayName"
                            placeholder="Alipay (支付宝)"
                            value={setting.alipayDisplayName}
                        />
                    </div>
                </div>
            </Card.Session>
            <Card.Session>
                <div className="grid grid-cols-3 gap-8">
                    <div className="col-span-1 items-center flex">
                        <h4>App ID</h4>
                    </div>
                    <div className="col-span-2">
                        <Field
                            type="text"
                            name="alipayAppId"
                            placeholder="Enter your Alipay App ID"
                            value={setting.alipayAppId}
                        />
                    </div>
                </div>
            </Card.Session>
            <Card.Session>
                <div className="grid grid-cols-3 gap-8">
                    <div className="col-span-1 items-center flex">
                        <h4>Private Key</h4>
                    </div>
                    <div className="col-span-2">
                        <Field
                            type="textarea"
                            name="alipayPrivateKey"
                            placeholder="Enter your Private Key"
                            value={setting.alipayPrivateKey}
                        />
                    </div>
                </div>
            </Card.Session>
            <Card.Session>
                <div className="grid grid-cols-3 gap-8">
                    <div className="col-span-1 items-center flex">
                        <h4>Alipay Public Key</h4>
                    </div>
                    <div className="col-span-2">
                        <Field
                            type="textarea"
                            name="alipayPublicKey"
                            placeholder="Enter Alipay's Public Key"
                            value={setting.alipayPublicKey}
                        />
                    </div>
                </div>
            </Card.Session>
            <Card.Session>
                <div className="grid grid-cols-3 gap-8">
                    <div className="col-span-1 items-center flex">
                        <h4>Sandbox Mode</h4>
                    </div>
                    <div className="col-span-2">
                        <Toggle
                            name="alipaySandbox"
                            value={setting.alipaySandbox}
                            instruction="Enable for testing. Uses sandbox API endpoint."
                        />
                    </div>
                </div>
            </Card.Session>
        </Card>
    );
}

AlipaySetting.propTypes = {
    setting: PropTypes.shape({
        alipayPaymentStatus: PropTypes.number,
        alipayDisplayName: PropTypes.string,
        alipayAppId: PropTypes.string,
        alipayPrivateKey: PropTypes.string,
        alipayPublicKey: PropTypes.string,
        alipaySandbox: PropTypes.number
    })
};

AlipaySetting.defaultProps = {
    setting: {
        alipayPaymentStatus: 0,
        alipayDisplayName: 'Alipay (支付宝)',
        alipayAppId: '',
        alipayPrivateKey: '',
        alipayPublicKey: '',
        alipaySandbox: 0
    }
};

export const layout = {
    areaId: 'paymentSetting',
    sortOrder: 15
};

export const query = `
  query Query {
    setting {
      alipayPaymentStatus
      alipayDisplayName
      alipayAppId
      alipayPrivateKey
      alipayPublicKey
      alipaySandbox
    }
  }
`;