const { debug } = require('@evershop/evershop/src/lib/log/logger');
const { getConfig } = require('@evershop/evershop/src/lib/util/getConfig');
const { getSetting } = require('@evershop/evershop/src/modules/setting/services/setting');

// eslint-disable-next-line no-unused-vars
module.exports = async (request, response, delegate, next) => {
    try {
        debug('Alipay debug endpoint called');

        // Get Alipay configuration
        const alipayConfig = getConfig('alipay', {});

        // Get settings from database
        const dbStatus = await getSetting('alipayPaymentStatus', 'not set');
        const dbDisplayName = await getSetting('alipayDisplayName', 'not set');

        // Send diagnostic info
        response.json({
            success: true,
            message: 'Alipay extension debug info',
            configFromFile: {
                status: alipayConfig.status,
                displayName: alipayConfig.displayName,
                // Don't send sensitive info
                appIdConfigured: !!alipayConfig.appId,
                privateKeyConfigured: !!alipayConfig.privateKey,
                publicKeyConfigured: !!alipayConfig.publicKey,
                sandbox: alipayConfig.sandbox
            },
            settingsFromDatabase: {
                status: dbStatus,
                displayName: dbDisplayName
            }
        });
    } catch (e) {
        debug(`Error in Alipay debug endpoint: ${e.message}`);
        response.status(500).json({
            success: false,
            message: e.message
        });
    }
};