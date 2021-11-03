const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const ThreadRepository = require('../../Domains/threads/ThreadRepository');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async getThreadById(threadId) {
    const query = {
      text: 'SELECT threads.id, title, body, date, username FROM threads INNER JOIN users ON threads.owner_id = users.id where threads.id = $1',
      values: [threadId],
    };

    const result = await this._pool.query(query);

    return result.rows[0];
  }

  async checkAvailabilityThread(threadId) {
    const query = {
      text: 'SELECT id FROM threads where id = $1',
      values: [threadId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('thread tidak tersedia');
    }
  }

  async addThread(newThread) {
    const { title, body, ownerId } = newThread;
    const id = `thread-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4)',
      values: [id, ownerId, title, body],
    };

    await this._pool.query(query);

    return {
      id,
      title,
      owner: ownerId,
    };
  }
}

module.exports = ThreadRepositoryPostgres;
