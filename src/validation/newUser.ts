import Joi from 'joi'

const newUserSchema = Joi.object().keys({
  email: Joi.string().email().required(),
  invitedBy: Joi.string().required()
})

export default newUserSchema
