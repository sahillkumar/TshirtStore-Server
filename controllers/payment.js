const braintree = require("braintree");

const gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: "9g2qbd3cnwnd989h",
    publicKey: "v56q59fq7y3v8ysm",
    privateKey: "690ad54abba3a4ce14dba62afe3c74be"
  });

  

exports.getToken = (req,res)=>{
    gateway.clientToken.generate({}, (err, response) => {
        if(err){
            return res.status(400).send(err)
        }
        else{
            res.send(response)
        }
      });
}

exports.processPayment = (req,res)=>{

    const nonceFromTheClient = req.body.paymentMethodNonce
    const amountFromTheClient = req.body.amount
    gateway.transaction.sale({
        amount: amountFromTheClient,
        paymentMethodNonce: nonceFromTheClient,
        options: {
          submitForSettlement: true
        }
      }, (err, result) => {
          if(err){
              res.status(500).send(err)
          }else{
              res.json(result)
          }
      });
}