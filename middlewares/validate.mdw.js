
//json validation
const Ajv = require("ajv")
//validate middleware
module.exports = function (schema) {
    return function (req, res, next) {
        const ajv = new Ajv({ allErrors: true })
        const validate = ajv.compile(schema)
        const isValid = validate(req.body)
        if (!isValid) {
            return res.status(400).json(validate.errors)
        }
        next() //pass middleware to next function
    }
}


