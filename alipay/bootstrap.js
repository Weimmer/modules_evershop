/**
 * Alipay Payment Extension Bootstrap
 */
const config = require('config');
const { debug } = require('@evershop/evershop/src/lib/log/logger');

module.exports = () => {
    // Set default configuration
    const alipayConfig = {
        status: 1,
        displayName: 'Alipay_Sandbox',
        appId: '2021000147697600',
        privateKey: 'MIIEpQIBAAKCAQEA2GYGxwRa4gioYtRyjNwK6opOrrTXCktZmifH9EFHQu6ZRrW6STcLr/OEQo3vo16H4ujBYsiAMvZXMgg+6r5Azqa6DUyOK6vJyYRQr6jSanP4DZf17TkLU/Al1PkNkjK+W2MhsjSKMkOoPAcMx51irT7t8TGYGlB+v7PtUrVvaCmd/+truNOZFf9sxqd741qquE+8L/sXXeXmX4EpVqqoDSvm0XFlQdacPxleIs7KLBrQi5e/4hHSRTHjmJwijJIgUBk8tOXoeusbNlAn6N7Lma3vMqvj4yS3idYxsNpN7XXILWRF1gwzE6+0QRjZKYFf2VpFWvvBoB3PpPZUZaSemQIDAQABAoIBAQCUc5GMsAkk7SmO+w1GYqG+enk10ut+rWhfn5DFmI6pdQODhaGxHmkPILCH89UErxHrcR9RhBimXWY99XgsE65j1e7mtrEFdoksjG/JwbfvvXTa5neYcLy7rZBWhTBxLgx2pw/zr6VqjA16eJ+kxOxvyy7yesJMsxHwsx9I0R0HR9nMXHiAoBVog9v/rCVTUrnHWJjTpTG+iJrgcxwFTKYfFKIKE1O3fz2cQcCaCKk60xs2GENh/UpHqjRE9QXDIZ+QXpv6m1iP3InROQ6qXlv297mBJUJyg0dEI1FoqhLz37m+deJlFlhE+kr59R7ipvRejrLT7Xn3P8gme7CaCGJdAoGBAPz/VTpA0cWQooL4M4t6DMRZ5EF1X0V5QSePc8TR1beMvmqvPOZDJQSaPb9aYtN1vSz6SEtZRJ+VT8RkQYJv311W8xM69slNDFagc/DF7LDHwu0E+qJlK9T1F2LPARB68JCU2gYCZRIIrj/LB140l1GlR6CTAAxFAwl3SruyT9hrAoGBANr3f1aGePI23OVpzbZBTCPLzn4jaHUEwweiSgJVZXVbf06CNfdhTFzJg6ixGl24nO8gesL68PGh6bfZs+BBR9Ez6TR28tJtcx4WFITgFH1JKkXQP42ZtDRSpSoitnfudxYulMF2xzrxid+2ogOR/fNRmheZQvhsGlPlkqOMn3YLAoGBAPNZrmLwAlakfoy3rOzWIv2i8Xk9Kryqm08wHs0MgSOij24SzOM3Zp38trQefryjnalrvKotXWKavjVLse+DKDih8AFpUAPkxp90itDnsHmCTC6sAWC/K+AVN79lGcL+XfLUGrp5BzrHesQFyDqHH536+uCrRPqITxmF0y6jn0WtAoGBAJJNA1vAhVbwqS7vPm8jucfBCLrm1Yg6IkUbfe+JNzzuYWUHQx+Cdw8X5Uv06PTtwI1VWjCkkhAgapRYdQLFG0MAODTBtQQ79MqJXjRZs9bx57i1p4DozaqX/Zrljp0bS54aiXGp9vu/HqvGzwErrk3AnABgeoqZUA32Ob/k2TZ5AoGANo6W9wrbF8XFPv3ss4gQjy6NFJA+yLyrII2loxMrebkKbTlGKHZJnSCFapE/Od/dSzBgkjV85lnb2n/UDqIOKwoCyCS15fXkwQPLRDFaQfU5Yt+Mkvvegb2LwgGQmHS5HsTMlYMRyq8rpnnBBBAM3qdEijSSqgW47s/UCbLHVFo=',
        publicKey: 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA2GYGxwRa4gioYtRyjNwK6opOrrTXCktZmifH9EFHQu6ZRrW6STcLr/OEQo3vo16H4ujBYsiAMvZXMgg+6r5Azqa6DUyOK6vJyYRQr6jSanP4DZf17TkLU/Al1PkNkjK+W2MhsjSKMkOoPAcMx51irT7t8TGYGlB+v7PtUrVvaCmd/+truNOZFf9sxqd741qquE+8L/sXXeXmX4EpVqqoDSvm0XFlQdacPxleIs7KLBrQi5e/4hHSRTHjmJwijJIgUBk8tOXoeusbNlAn6N7Lma3vMqvj4yS3idYxsNpN7XXILWRF1gwzE6+0QRjZKYFf2VpFWvvBoB3PpPZUZaSemQIDAQAB',
        gatewayUrl: 'https://openapi.alipay.com/gateway.do',
        sandbox: true
    };

    // Register configuration with EverShop
    config.util.setModuleDefaults('alipay', alipayConfig);

    debug('Alipay Payment Extension initialized successfully');
};