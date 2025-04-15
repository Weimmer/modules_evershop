const { getConfig } = require('@evershop/evershop/src/lib/util/getConfig');
const { getSetting } = require('@evershop/evershop/src/modules/setting/services/setting');

module.exports = {
    Setting: {
        alipayPaymentStatus: async (_, args, context) => {
            const alipayConfig = getConfig('alipay', {});
            if (alipayConfig.status !== undefined) {
                return alipayConfig.status;
            } else {
                return parseInt(await getSetting('alipayPaymentStatus', 0), 10);
            }
        },
        alipayDisplayName: async (_, args, context) => {
            const alipayConfig = getConfig('alipay', {});
            if (alipayConfig.displayName) {
                return alipayConfig.displayName;
            } else {
                return await getSetting('alipayDisplayName', 'Alipay (支付宝)');
            }
        },
        alipayAppId: async (_, args, context) => {
            const alipayConfig = getConfig('alipay', {});
            if (alipayConfig.appId) {
                return alipayConfig.appId;
            } else {
                return await getSetting('alipayAppId', '');
            }
        },
        alipayPrivateKey: async (_, args, context) => {
            const alipayConfig = getConfig('alipay', {});
            if (alipayConfig.privateKey) {
                return alipayConfig.privateKey;
            } else {
                return await getSetting('alipayPrivateKey', '');
            }
        },
        alipayPublicKey: async (_, args, context) => {
            const alipayConfig = getConfig('alipay', {});
            if (alipayConfig.publicKey) {
                return alipayConfig.publicKey;
            } else {
                return await getSetting('alipayPublicKey', '');
            }
        },
        alipaySandbox: async (_, args, context) => {
            const alipayConfig = getConfig('alipay', {});
            if (alipayConfig.sandbox !== undefined) {
                return alipayConfig.sandbox ? 1 : 0;
            } else {
                return parseInt(await getSetting('alipaySandbox', 0), 10);
            }
        }
    }
};