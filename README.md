

## Integrate braintree payment gateway



### node endpoint implementation

<pre>
  app.get('/initializeBraintree', async (req, res) =>  {
        const gateway = braintree.connect({
            "environment": braintree.Environment.Sandbox,
            "merchantId": "YOUR MERCHANT ID",
            "publicKey": "YOUR PUBLIC KEY",
            "privateKey": "PRIVATE KEY"
        });
        let token = (await gateway.clientToken.generate({})).clientToken;
        res.send({data: token});
    });

    app.post('/confirmBraintree', async (req, res) =>  {
        const data = req.body;
        const gateway = braintree.connect({
            "environment": braintree.Environment.Sandbox,
            "merchantId": "MERCHANT ID",
            "publicKey": "PUBLIC KEY",
            "privateKey": "PRIVATE KEY"
        });
        let transactionResponse = await gateway.transaction.sale({
            amount: data.amount,
            paymentMethodNonce: data.nonce,
            options: {
                submitForSettlement: true
              }
        });
        
        console.log(transactionResponse);
        res.send({data: transactionResponse});
    });
</pre>

### client side integration
You will find the client side integration in this repository. (using react)

