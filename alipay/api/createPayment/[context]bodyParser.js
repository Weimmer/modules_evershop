const { parse } = require('@evershop/evershop/src/lib/express/bodyParser');
const { validate } = require('@evershop/evershop/src/lib/util/validate');

// Define the body schema for validation
const bodySchema = {
    type: 'object',
    properties: {
        orderId: {
            type: 'string',
            pattern: '^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89aAbB][a-f0-9]{3}-[a-f0-9]{12}$' // UUID v4 pattern
        }
    },
    required: ['orderId'],
    additionalProperties: false
};

// eslint-disable-next-line no-unused-vars
module.exports = async (request, response, delegate, next) => {
    // Parse the body
    await parse(request, response);

    // Validate the request body
    const result = validate(bodySchema, request.body);
    if (result !== true) {
        response.status(400).json({
            success: false,
            message: result.message || 'Invalid request body'
        });
        return;
    }

    next();
};