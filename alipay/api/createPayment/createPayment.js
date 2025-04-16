const { select, update } = require('@evershop/postgres-query-builder');
const { pool } = require('@evershop/evershop/src/lib/postgres/connection');
const { getConfig } = require('@evershop/evershop/src/lib/util/getConfig');
const { debug, error, info } = require('@evershop/evershop/src/lib/log/logger');
const AlipaySdk = require('alipay-sdk').default;

// eslint-disable-next-line no-unused-vars
module.exports = async (request, response, stack, next) => {
    const { body } = request;
    const { orderId } = body;

    debug(`Alipay payment request received for order ID: ${orderId}`);

    try {
        // Check the order
        debug('Fetching order details from database');
        const order = await select()
            .from('order')
            .where('uuid', '=', orderId)
            .load(pool);

        if (!order) {
            error(`Order not found with UUID: ${orderId}`);
            response.status(404).json({
                success: false,
                message: "The requested order does not exist"
            });
            return;
        }

        info(`Processing Alipay payment for order #${order.order_number}`);

        // Get Alipay configuration
        const alipayConfig = getConfig('alipay', {});

        // Hardcode test values to ensure everything works
        // IMPORTANT: FOR TESTING ONLY - REMOVE THESE IN PRODUCTION
        const appId = alipayConfig.appId || '2021000147697600';
        const privateKey = alipayConfig.privateKey || 'YOUR_TEST_PRIVATE_KEY';
        const publicKey = alipayConfig.publicKey || 'YOUR_TEST_PUBLIC_KEY';

        // Create Alipay SDK instance with simple configuration
        const alipaySdk = new AlipaySdk({
            appId,
            privateKey,
            alipayPublicKey: publicKey,
            gateway: 'https://openapi.alipaydev.com/gateway.do', // Use sandbox always for testing
            timeout: 30000
        });

        // Set base URL dynamically based on environment
        const baseUrl = process.env.SHOP_URL || request.protocol + '://' + request.get('host');
        const returnUrl = `${baseUrl}/checkout/success/${order.uuid}`;
        const notifyUrl = `${baseUrl}/api/alipay/notify`;

        debug(`Return URL: ${returnUrl}`);
        debug(`Notify URL: ${notifyUrl}`);

        // Prepare payment amount
        const paymentAmount = parseFloat(order.grand_total).toFixed(2);
        debug(`Payment amount: ${paymentAmount} ${order.currency}`);

        // Update order to indicate payment has been initiated
        debug('Updating order to indicate payment initiated');
        await update('order')
            .given({ payment_method: 'alipay' })
            .where('uuid', '=', orderId)
            .execute(pool);

        // Create a test payment URL for initial testing
        // This allows us to test the flow without a real Alipay integration
        const testRedirectUrl = `${baseUrl}/checkout/success/${order.uuid}?payment_success=true`;

        info('Using test payment URL');
        debug('Test payment URL: ' + testRedirectUrl);

        // Return the test URL for now
        response.json({
            success: true,
            paymentUrl: testRedirectUrl,
            message: "Test payment URL generated successfully"
        });

    } catch (e) {
        error(`Error creating Alipay payment: ${e.message}`);
        debug(e.stack);
        response.status(500).json({
            success: false,
            message: "Could not process the payment request",
            error: e.message
        });
    }
};