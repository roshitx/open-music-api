// eslint-disable-next-line import/no-extraneous-dependencies
const Joi = require('joi');

const currentYear = new Date().getFullYear();
const SongPayloadSchema = Joi.object({
  title: Joi.string().required(),
  year: Joi.number().required().min(1900).max(currentYear),
  performer: Joi.string().required(),
  genre: Joi.string().required(),
  duration: Joi.number().nullable(),
  albumId: Joi.string(),
});

module.exports = { SongPayloadSchema };
