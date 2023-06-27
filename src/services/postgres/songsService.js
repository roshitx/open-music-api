/* eslint-disable object-curly-newline */
/* eslint-disable no-underscore-dangle */
const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const { mapDBToModelSong } = require('../../utils/songs');
const NotFoundError = require('../../exceptions/NotFoundError');

class SongsService {
  constructor() {
    this._pool = new Pool();
  }

  // Add song function
  async addSong({ title, year, performer, genre, duration, albumId }) {
    const id = `song-${nanoid(16)}`;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id',
      values: [
        id,
        title,
        year,
        performer,
        genre,
        duration,
        albumId,
        createdAt,
        updatedAt,
      ],
    };
    const result = await this._pool.query(query);
    if (!result.rows[0].id) {
      throw new InvariantError('Lagu gagal ditambahkan');
    }
    return result.rows[0].id;
  }

  // Get all songs & query parameter
  async getSongs(title, performer) {
    let query = {
      text: 'SELECT id, title, performer FROM songs',
    };

    if (title !== undefined) {
      query = {
        text: 'SELECT id, title, performer FROM songs WHERE LOWER(title) LIKE $1',
        values: [`%${title}%`],
      };
    }

    if (performer !== undefined) {
      query = {
        text: 'SELECT id, title, performer FROM songs WHERE LOWER(performer) LIKE $1',
        values: [`%${performer}%`],
      };
    }

    const filteredSongs = await this._pool.query(query);

    return filteredSongs.rows.map(mapDBToModelSong);
  }

  // Get spesific song by id
  async getSongById(id) {
    const query = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Lagu tidak ditemukan');
    }

    return result.rows.map(mapDBToModelSong)[0];
  }

  // Update spesific song
  async editSongById(id, { title, year, performer, genre, duration, albumId }) {
    const updatedAt = new Date().toISOString();
    const query = {
      text: 'UPDATE songs SET title = $1, year = $2, genre = $3, performer = $4, duration = $5, "albumId" = $6, updated_at = $7 WHERE id = $8 RETURNING id',
      values: [title, year, genre, performer, duration, albumId, updatedAt, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui lagu. Id tidak ditemukan');
    }
  }

  // Delete spesific song
  async deleteSongById(id) {
    const query = {
      text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal menghapus lagu. Id tidak ditemukan');
    }
  }
}

module.exports = SongsService;
