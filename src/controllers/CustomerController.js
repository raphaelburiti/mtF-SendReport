const Customer = require('../models/Customer')

module.exports = {
    async indexById(req, res) {
        const { id_customer } = req.body
        const customers = await Customer.find({

            $and: [
                { id_customer: { $eq: id_customer } },
            ],
        })

        return res.json(customers);

    },

    async store(req, res) {

        const {
            id_customer,
            name_customer, 
            address
        } = req.body

        const customer = await Customer.create({
            id_customer, 
            name_customer, 
            address
        })

        return res.json({'msg: ' : 'Customer created sucsses'});

    }

};