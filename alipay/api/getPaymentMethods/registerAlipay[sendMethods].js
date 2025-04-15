const { getConfig } = require('@evershop/evershop/src/lib/util/getConfig');
const { getSetting } = require('@evershop/evershop/src/modules/setting/services/setting');

// eslint-disable-next-line no-unused-vars
module.exports = async (request, response) => {
    // Check if Alipay is enabled
    const alipayConfig = getConfig('alipay', {});
    let alipayStatus;

    if (alipayConfig.status !== undefined) {
        alipayStatus = alipayConfig.status;
    } else {
        alipayStatus = await getSetting('alipayPaymentStatus', 0);
    }

    if (parseInt(alipayStatus, 10) === 1) {
        // Payment method is enabled, return its configuration
        return {
            methodCode: 'alipay',
            methodName: alipayConfig.displayName
        };
    } else {
        return null;
    }
};