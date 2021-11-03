const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const ReplyRepository = require('../../Domains/replies/ReplyRepository');

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async getRepliesByCommentId(commentId) {
    const query = {
      text: 'SELECT replies.id, date, content, username, is_delete FROM replies INNER JOIN users ON replies.owner_id = users.id where comment_id = $1 ORDER BY date ASC',
      values: [commentId],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }

  async checkAvailabilityReply(replyId) {
    const query = {
      text: 'SELECT id FROM replies where id = $1',
      values: [replyId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Balasan tidak tersedia');
    }
  }

  async checkOwnership(replyId, ownerId) {
    const query = {
      text: 'SELECT id, owner_id FROM replies where id = $1',
      values: [replyId],
    };

    const result = await this._pool.query(query);

    if (result.rows[0].owner_id !== ownerId) {
      throw new AuthorizationError('Anda dilarang mengakses resource ini');
    }
  }

  async addReply(newReply) {
    const { content, ownerId, commentId } = newReply;
    const id = `reply-${this._idGenerator()}`;
    const date = new Date().toISOString();

    const query = {
      text: 'INSERT INTO replies (id, owner_id, comment_id, content, is_delete) VALUES($1, $2, $3, $4, $5)',
      values: [id, ownerId, commentId, content, false],
    };

    await this._pool.query(query);

    return {
      id,
      content,
      owner: ownerId,
    };
  }

  async deleteReply(replyId) {
    const query = {
      text: 'UPDATE replies SET is_delete = true where id = $1',
      values: [replyId],
    };

    await this._pool.query(query);
  }
}

module.exports = ReplyRepositoryPostgres;
