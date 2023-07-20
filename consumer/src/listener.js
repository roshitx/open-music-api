class Listener {
    constructor(playlistsService, MailSender) {
      this._playlistsService = playlistsService;
      this._mailSender = MailSender;
  
      this.listen = this.listen.bind(this);
    }
  
    async listen(message) {
      try {
        const { playlistId, targetEmail } = JSON.parse(
          message.content.toString(),
        );
  
        // query data yang diperlukan
        const playlist = await this._playlistsService.getPlaylists(playlistId);
        console.log('playlist:', playlist);
        const songs = await this._playlistsService.getSongs(playlistId);
        console.log('songs:', songs);

        // susun struktur json yang akan dikirim ke alamat email
        const exportedPlaylist = {
          playlist: {
            id: playlist.id,
            name: playlist.name,
            songs: songs.map((song) => ({
              id: song.id,
              title: song.title,
              performer: song.performer,
            })),
          },
        };
  
        const result = await this._mailSender.sendEmail(
          targetEmail,
          JSON.stringify(exportedPlaylist),
        );
        console.log(result);
      } catch (error) {
        console.error(error);
      }
    }
  }
  
  module.exports = Listener;
  