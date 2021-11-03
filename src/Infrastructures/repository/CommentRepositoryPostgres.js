const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const CommentRepository = require('../../Domains/comments/CommentRepository');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async getCommentsByThreadId(threadId) {
    const query = {
      text: 'SELECT comments.id, date, content, username, is_delete FROM comments INNER JOIN users ON comments.owner_id = users.id where thread_id = $1 ORDER BY date ASC',
      values: [threadId],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }

  async checkAvailabilityComment(commentId) {
    const query = {
      text: 'SELECT id FROM comments where id = $1',
      values: [commentId],
    };

    const result = await this._pool.query(query);

    if (result.rowCount === 0) {
      throw new NotFoundError('Komentar tidak tersedia');
    }
  }

  async checkOwnership(commentId, ownerId) {
    const query = {
      text: 'SELECT id, owner_id FROM comments where id = $1',
      values: [commentId],
    };

    const result = await this._pool.query(query);

    if (result.rows[0].owner_id !== ownerId) {
      throw new AuthorizationError('Anda dilarang mengakses resource ini');
    }
  }

  async addComment(newComment) {
    const { content, ownerId, threadId } = newComment;
    const id = `comment-${this._idGenerator()}`;
    const date = new Date().toISOString();

    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6)',
      values: [id, ownerId, threadId, content, date, false],
    };

    await this._pool.query(query);

    return {
      id,
      content,
      owner: ownerId,
    };
  }

  async deleteComment(commentId) {
    const query = {
      text: 'UPDATE comments SET is_delete = true where id = $1',
      values: [commentId],
    };

    await this._pool.query(query);
  }
}

module.exports = CommentRepositoryPostgres;
