const { debug } = require('@evershop/evershop/src/lib/log/logger');
const { getConfig } = require('@evershop/evershop/src/lib/util/getConfig');

// eslint-disable-next-line no-unused-vars
module.exports = async (request, response, delegate, next) => {
    debug('Alipay test endpoint called');

    // Get Alipay configuration
    const alipayConfig = getConfig('alipay', {});

    // Send diagnostic info
    response.json({
        success: true,
        message: 'Alipay extension is working',
        config: {
            status: alipayConfig.status,
            displayName: alipayConfig.displayName,
            appIdConfigured: Boolean(alipayConfig.appId),
            sandbox: alipayConfig.sandbox
        }
    });
};