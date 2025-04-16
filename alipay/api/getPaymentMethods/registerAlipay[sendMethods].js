const { getConfig } = require('@evershop/evershop/src/lib/util/getConfig');
const { getSetting } = require('@evershop/evershop/src/modules/setting/services/setting');
const { debug } = require('@evershop/evershop/src/lib/log/logger');

// eslint-disable-next-line no-unused-vars
module.exports = async (request, response) => {
    // IMPORTANT: Always return the payment method to ensure it appears
    debug('Registering Alipay payment method');

    // Get display name from config or settings
    const alipayConfig = getConfig('alipay', {});
    const displayName = alipayConfig.displayName || await getSetting('alipayDisplayName', 'Alipay (支付宝)');

    debug('Returning Alipay payment method with name:', displayName);

    // Return the payment method configuration
    return {
        methodCode: 'alipay',
        methodName: displayName
    };
};