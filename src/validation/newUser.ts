import Joi from 'joi'

const newUserSchema = Joi.object().keys({
  email: Joi.string().email().required()
})

export default newUserSchema
