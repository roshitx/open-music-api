/* eslint-disable import/no-extraneous-dependencies */
const autoBind = require('auto-bind');
const config = require('../../utils/config');

class AlbumsHandler {
  constructor(service, storageService, validator) {
    this._service = service;
    this._storageService = storageService;
    this._validator = validator;

    autoBind(this);
  }

  async postAlbumHandler(request, h) {
    this._validator.validateAlbumPayload(request.payload);
    const { name, year } = request.payload;

    const albumId = await this._service.addAlbum({ name, year });

    const response = h.response({
      status: 'success',
      message: 'Album berhasil ditambahkan',
      data: {
        albumId,
      },
    });
    response.code(201);
    return response;
  }

  async getAlbumByIdHandler(request) {
    const { id } = request.params;
    const [album, songs] = await Promise.all([
      this._service.getAlbumById(id),
      this._service.getSongsInAlbum(id),
    ]);
    const albumWithSongs = { ...album, songs };

    return {
      status: 'success',
      data: {
        album: albumWithSongs,
      },
    };
  }

  async putAlbumByIdHandler(request) {
    this._validator.validateAlbumPayload(request.payload);
    const { name, year } = request.payload;
    const { id } = request.params;

    await this._service.editAlbumById(id, { name, year });

    return {
      status: 'success',
      message: 'Album berhasil diperbarui',
    };
  }

  async deleteAlbumByIdHandler(request) {
    const { id } = request.params;
    await this._service.deleteAlbumById(id);

    return {
      status: 'success',
      message: 'Album berhasil dihapus',
    };
  }

  async postUploadAlbumCoverHandler(request, h) {
    const { cover } = request.payload;
    const { id } = request.params;
    this._validator.validateImageHeaders(cover.hapi.headers);

    const filename = await this._storageService.writeFile(cover, cover.hapi);

    const coverUrl = `http://${config.app.host}:${config.app.port}/uploads/images/${filename}`;
    await this._service.addAlbumCover(coverUrl, id);

    const response = h.response({
      status: 'success',
      message: 'Sampul berhasil diunggah',
    });
    response.code(201);
    return response;
  }

  async postLikesAlbumHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const { id: albumId } = request.params;

    await this._service.verifyLikesAlbum(albumId, credentialId);
    await this._service.addLikesAlbum(albumId, credentialId);

    const response = h.response({
      status: 'success',
      message: 'Berhasil menyukai album!',
    });
    response.code(201);
    return response;
  }

  async deleteLikesAlbumHandler(request) {
    const { id: albumId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._service.deleteLikesAlbum(albumId, credentialId);
    return {
      status: 'success',
      message: 'Berhasil dislike album',
    };
  }

  async getLikesAlbumHandler(request, h) {
    const { id } = request.params;
    const { likes, source } = await this._service.getLikesAlbum(id);

    const response = h.response({
      status: 'success',
      data: {
        likes: parseInt(likes, 10),
      },
    });
    response.header('X-Data-Source', source);
    return response;
  }
}

module.exports = AlbumsHandler;
