const Joi = require('joi');

export const UserSchema = Joi.object({
    username: Joi.string().min(3).max(12).alphanum().required(),
    password: Joi.string().min(8).max(8).regex(/^[a-zA-Z]+$/).required(),
    class_id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(), // ObjectID to Class
    email: Joi.string().email().required(),
    firstname: Joi.string().min(3).max(20).regex(/^[a-zA-Z]+$/).required(),
    lastname: Joi.string().min(3).max(20).regex(/^[a-zA-Z]+$/).required(),
    role: Joi.string().required(),
    contact_info: Joi.object({
        phone: Joi.string(),
        adress: Joi.string(),
        city: Joi.string(),
    }),
  });

export const EquipmentSchema = Joi.object({
    _id: Joi.string().alphanum().min(5).max(20).required(), //serial number
    Type: Joi.string().max(20).required(),
    Model: Joi.string().max(20).required(),
    Specs: Joi.array(),
    BorrowStatus: Joi.object({
        currentStatus: Joi.string().valid('borrowed', 'available'),
        studentsborrowing: Joi.array()
    })
});
  
export const BorrowRequestSchema = Joi.object({
    EquipmentID: Joi.string().alphanum().min(5).max(20).required(),
    studentsborrowing: Joi.array(),
})
