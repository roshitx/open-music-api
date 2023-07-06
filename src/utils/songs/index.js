/* eslint-disable object-curly-newline */
/* eslint-disable camelcase */
const mapDBToModelSong = ({
  id,
  title,
  year,
  genre,
  performer,
  duration,
  album_id,
  created_at,
  updated_at,
}) => ({
  id,
  title,
  year,
  genre,
  performer,
  duration,
  albumId: album_id,
  createdAt: created_at,
  updatedAt: updated_at,
});

const mapSong = ({
  song_id,
  title,
  performer,
}) => ({
  id: song_id,
  title,
  performer,
});

module.exports = { mapDBToModelSong, mapSong };
