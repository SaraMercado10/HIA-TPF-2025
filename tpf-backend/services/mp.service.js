const axios = require("axios");

class mpService {
    async crearPago(req) {
      const url = "https://api.mercadopago.com/checkout/preferences";
  
      const body = {
        items: [
          {
            title: "Alquiler",
            quantity: 1,
            unit_price: req.body.monto,
            currency_id : "USD",
            description : "Pago cuota del Alquiler"
          }
        ],
        back_urls: {
          failure: "http://localhost:4200/alquiler-detalle/"+req.body.idAlquiler,
          pending: "/pending",
          success: "http://localhost:4200/alquiler-detalle/"+req.body.idAlquiler
        },
        payment_methods: {
          installments : 1
        }
      };
  
      const pago = await axios.post(url, body, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.ACCESS_TOKEN}`
        }
      });
  
      return pago.data;
    }
  }
  
  module.exports = mpService;