// eslint-disable-next-line import/no-extraneous-dependencies
const Joi = require('joi');

const SongPayloadSchema = Joi.object({
  title: Joi.string().required(),
  year: Joi.number().required(),
  performer: Joi.string().required(),
  genre: Joi.string().required(),
  duration: Joi.number().required(),
});

module.exports = { SongPayloadSchema };
