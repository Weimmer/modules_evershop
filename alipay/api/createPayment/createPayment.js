const { select } = require('@evershop/postgres-query-builder');
const { pool } = require('@evershop/evershop/src/lib/postgres/connection');
const { getConfig } = require('@evershop/evershop/src/lib/util/getConfig');
const { getSetting } = require('@evershop/evershop/src/modules/setting/services/setting');
const { debug, error } = require('@evershop/evershop/src/lib/log/logger');
const AlipaySdk = require('alipay-sdk').default;

// eslint-disable-next-line no-unused-vars
module.exports = async (request, response, stack, next) => {
    const { body } = request;

    debug(`Alipay payment request received for order ID: ${body.orderId}`);

    try {
        // Check the order
        const order = await select()
            .from('order')
            .where('uuid', '=', body.orderId)
            .load(pool);

        if (!order) {
            error(`Order not found with UUID: ${body.orderId}`);
            response.status(404).json({
                success: false,
                message: "The requested order does not exist"
            });
            return;
        }

        debug(`Order found: #${order.order_number}, total: ${order.grand_total} ${order.currency}`);

        // Get Alipay configuration
        const alipayConfig = getConfig('alipay', {});

        // Prepare configuration values
        let appId = alipayConfig.appId;
        let privateKey = alipayConfig.privateKey;
        let publicKey = alipayConfig.publicKey;
        let gatewayUrl = alipayConfig.gatewayUrl || 'https://openapi.alipay.com/gateway.do';
        let sandbox = alipayConfig.sandbox || false;

        // Check if config is in settings instead
        if (!appId) {
            appId = await getSetting('alipayAppId', '');
        }
        if (!privateKey) {
            privateKey = await getSetting('alipayPrivateKey', '');
        }
        if (!publicKey) {
            publicKey = await getSetting('alipayPublicKey', '');
        }

        debug(`Alipay config: App ID: ${appId ? (appId.substring(0, 4) + '...') : 'not set'}, Sandbox: ${sandbox}`);

        // Validate required configuration
        if (!appId || !privateKey || !publicKey) {
            error('Alipay configuration is incomplete');
            response.status(500).json({
                success: false,
                message: "Payment method not properly configured"
            });
            return;
        }

        // Create Alipay SDK instance
        debug('Creating Alipay SDK instance');
        const alipaySdk = new AlipaySdk({
            appId,
            privateKey,
            alipayPublicKey: publicKey,
            gateway: sandbox ? 'https://openapi.alipaydev.com/gateway.do' : gatewayUrl,
            timeout: 30000
        });

        // Get the return URL (success page)
        const baseUrl = process.env.SHOP_URL || 'http://localhost:3000';
        const returnUrl = `${baseUrl}/checkout/success/${order.uuid}`;
        const notifyUrl = `${baseUrl}/api/alipay/notify`;

        debug(`Return URL: ${returnUrl}`);
        debug(`Notify URL: ${notifyUrl}`);

        // Prepare payment amount (ensure it's a valid decimal)
        const paymentAmount = parseFloat(order.grand_total).toFixed(2);
        debug(`Payment amount: ${paymentAmount} ${order.currency}`);

        // Create payment request
        debug('Creating Alipay payment request');
        const result = await alipaySdk.pageExec('alipay.trade.page.pay', {
            method: 'GET',
            bizContent: {
                outTradeNo: order.order_number,
                productCode: 'FAST_INSTANT_TRADE_PAY',
                totalAmount: paymentAmount,
                subject: `Order #${order.order_number}`,
                body: `Payment for order #${order.order_number} at FEATHFLY`,
            },
            returnUrl,
            notifyUrl
        });

        debug('Alipay payment URL generated:', result);

        // Return the payment URL to redirect the customer to
        response.json({
            success: true,
            paymentUrl: result,
            message: "Alipay payment URL generated successfully"
        });

    } catch (e) {
        error(`Error creating Alipay payment: ${e.message}`, e);
        response.status(500).json({
            success: false,
            message: "Could not process the payment request",
            error: e.message
        });
    }
};