const autoBind = require('auto-bind');

class PlaylistsHandler {
  constructor(songsService, collaborationsService, service, validator) {
    this._songsService = songsService;
    this._collaborationsService = collaborationsService;
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async postPlaylistHandler(request) {
    this._validator.validate.PostPlaylistPayload(request.payload);
    const { name } = request.payload;
    const { id: credentialId } = request.auth.credentials;

    const playlistId = await this._service.addPlaylist
  }
}
