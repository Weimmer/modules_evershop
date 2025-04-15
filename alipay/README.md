# Alipay Payment Extension for EverShop

This extension adds Alipay (支付宝) as a payment method to your EverShop store.

## Installation

1. Place this folder in the `extensions` directory of your EverShop installation
2. Install dependencies:
   ```
   cd extensions/alipay
   npm install
   ```
3. Configure the extension in your EverShop admin panel or through the configuration file

## Configuration

You need to set the following configuration in your `config/default.json` file:

```json
{
  "alipay": {
    "status": 1,
    "displayName": "Alipay (支付宝)",
    "appId": "YOUR_APP_ID",
    "privateKey": "YOUR_PRIVATE_KEY",
    "publicKey": "ALIPAY_PUBLIC_KEY",
    "gatewayUrl": "https://openapi.alipay.com/gateway.do",
    "sandbox": false
  }
}
```

For development, you can use the sandbox environment:

```json
{
  "alipay": {
    "status": 1,
    "displayName": "Alipay (支付宝) - Sandbox",
    "appId": "YOUR_SANDBOX_APP_ID",
    "privateKey": "YOUR_SANDBOX_PRIVATE_KEY",
    "publicKey": "ALIPAY_SANDBOX_PUBLIC_KEY",
    "gatewayUrl": "https://openapi.alipaydev.com/gateway.do",
    "sandbox": true
  }
}
```

## Support

For support, please contact badminton@feathfly.com.