import Joi from 'joi'

const middleware = (schema: Joi.Schema) => {
  return (req: any, res: any, next: any) => {
    const validationResult = schema.validate(req.body)

    if (validationResult.error) {
      res.status(400).send({
        success: false,
        message: validationResult.error.message
      })
    } else {
      next()
    }
  }
}

export default middleware
