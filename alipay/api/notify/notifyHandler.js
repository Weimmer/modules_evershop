const {
    insert,
    update,
    select,
    startTransaction,
    commit,
    rollback
} = require('@evershop/postgres-query-builder');
const { getConnection } = require('@evershop/evershop/src/lib/postgres/connection');
const { getConfig } = require('@evershop/evershop/src/lib/util/getConfig');
const { getSetting } = require('@evershop/evershop/src/modules/setting/services/setting');
const { debug, error, info } = require('@evershop/evershop/src/lib/log/logger');
const { emit } = require('@evershop/evershop/src/lib/event/emitter');
const AlipaySdk = require('alipay-sdk').default;
const { updatePaymentStatus } = require('@evershop/evershop/src/modules/oms/services/updatePaymentStatus');

// eslint-disable-next-line no-unused-vars
module.exports = async (request, response, delegate, next) => {
    debug('Received Alipay notification webhook');
    debug('Notification body:', request.body);

    const connection = await getConnection();
    try {
        await startTransaction(connection);
        info('Processing Alipay payment notification');

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

        debug('Loaded Alipay configuration for webhook verification');

        // Create Alipay SDK instance
        const alipaySdk = new AlipaySdk({
            appId,
            privateKey,
            alipayPublicKey: publicKey,
            gateway: sandbox ? 'https://openapi.alipaydev.com/gateway.do' : gatewayUrl
        });

        // Verify the notification from Alipay
        debug('Verifying notification signature');
        const isValid = alipaySdk.checkNotifySign(request.body);

        if (!isValid) {
            error('Invalid Alipay notification signature');
            await rollback(connection);
            response.status(400).send('fail');
            return;
        }

        debug('Notification signature verified successfully');

        // Process the notification
        const notification = request.body;

        // Check if the payment is successful
        if (notification.trade_status === 'TRADE_SUCCESS' || notification.trade_status === 'TRADE_FINISHED') {
            debug(`Payment successful with status: ${notification.trade_status}`);

            // Find the order by out_trade_no (our order number)
            const orderNumber = notification.out_trade_no;
            debug(`Looking up order number: ${orderNumber}`);

            const order = await select()
                .from('order')
                .where('order_number', '=', orderNumber)
                .load(connection);

            if (!order) {
                error(`Order not found for notification: ${orderNumber}`);
                await rollback(connection);
                response.send('fail');
                return;
            }

            info(`Processing successful payment for order #${order.order_number}`);

            // Update the order payment status
            debug('Updating order payment status to paid');
            await updatePaymentStatus(order.order_id, 'paid', connection);

            // Create payment transaction record
            debug('Creating payment transaction record');
            await insert('payment_transaction')
                .given({
                    amount: parseFloat(notification.total_amount) * 100, // Convert to cents
                    payment_transaction_order_id: order.order_id,
                    transaction_id: notification.trade_no,
                    transaction_type: 'online',
                    payment_action: 'Capture'
                })
                .execute(connection);

            // Add order activity log
            debug('Adding order activity log');
            await insert('order_activity')
                .given({
                    order_activity_order_id: order.order_id,
                    comment: `Payment completed via Alipay. Transaction ID: ${notification.trade_no}`
                })
                .execute(connection);

            // Emit order placed event
            debug('Emitting order_placed event');
            await emit('order_placed', { ...order });

            await commit(connection);
            info(`Payment completed for order #${order.order_number}`);

            // Send success response to Alipay
            response.send('success');
        } else {
            debug(`Payment not completed: ${notification.trade_status}`);
            response.send('success'); // Acknowledge receipt even for non-success statuses
        }
    } catch (err) {
        error(`Error processing Alipay notification: ${err.message}`);
        debug(err.stack);
        await rollback(connection);
        response.status(500).send('fail');
    }
};