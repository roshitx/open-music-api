const mappingSong = (song) => ({
  id: song.song_id,
  title: song.song_title,
  performer: song.performer,
});

const mappingPlaylist = (playlist) => ({
  id: playlist.id,
  name: playlist.name,
  username: playlist.username,
  songs: playlist.songs.map(mappingSong),
});

module.exports = {
  mappingSong,
  mappingPlaylist,
};
