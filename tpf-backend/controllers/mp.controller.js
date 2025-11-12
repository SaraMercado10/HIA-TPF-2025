class mpController{
    constructor(mpService){
        this.mpService = mpService;
    }

    async getPagoLink(req, res){
        try{
            const pago = await this.mpService.crearPago(req);

            return res.json(pago);
        }catch(error){
            console.log(error);
            return res.status(500).json({
                status : '0',
                msg : 'hubo un error.'
            })
        }
    }
}

module.exports = mpController;