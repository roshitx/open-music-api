/* eslint-disable import/no-extraneous-dependencies */
require('dotenv').config();

const Hapi = require('@hapi/hapi');
const albums = require('./api/albums');
const songs = require('./api/songs');
const ErrorsHandler = require('./exceptions/ErrorHandler');
const AlbumsService = require('./services/postgres/albumsService');
const SongsService = require('./services/postgres/songsService');
const AlbumsValidator = require('./validator/albums');
const SongsValidator = require('./validator/songs');

// Server configuration
const init = async () => {
  const albumsService = new AlbumsService();
  const songsService = new SongsService();
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  //   Register albums
  await server.register({
    plugin: albums,
    options: {
      service: albumsService,
      validator: AlbumsValidator,
    },
  });

  //   Register songs
  await server.register({
    plugin: songs,
    options: {
      service: songsService,
      validator: SongsValidator,
    },
  });

  //   onPreResponse event extensions for error handler (500)
  server.ext('onPreResponse', ErrorsHandler.errorHandler);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
