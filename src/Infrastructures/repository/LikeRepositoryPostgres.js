const LikeRepository = require('../../Domains/likes/LikeRepository');

class LikeRepositoryPostgres extends LikeRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async checkHasLiked(commentId, ownerId) {
    const query = {
      text: 'SELECT id FROM likes where comment_id = $1 and owner_id = $2',
      values: [commentId, ownerId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      return false;
    }

    return true;
  }

  async addLike(newLike) {
    const { ownerId, commentId } = newLike;
    const id = `like-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO likes VALUES($1, $2, $3)',
      values: [id, ownerId, commentId],
    };

    await this._pool.query(query);
  }

  async deleteLike(commentId, ownerId) {
    const query = {
      text: 'DELETE FROM likes WHERE comment_id = $1 AND owner_id = $2',
      values: [commentId, ownerId],
    };

    await this._pool.query(query);
  }

  async getLikesByCommentId(commentId) {
    const query = {
      text: 'SELECT id FROM likes WHERE comment_id = $1',
      values: [commentId],
    };

    const result = await this._pool.query(query);
    return result.rowCount;
  }
}

module.exports = LikeRepositoryPostgres;
