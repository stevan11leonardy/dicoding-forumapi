/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const RepliesTableTestHelper = {
  async addReplies({
    id = 'comment-123',
    ownerId = 'user-123',
    commentId = 'comment-123',
    content = 'content',
    date = new Date().toISOString(),
    isDelete = false,
  }) {
    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5, $6)',
      values: [id, ownerId, commentId, content, date, isDelete],
    };

    await pool.query(query);
  },

  async findRepliesById(id) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM replies WHERE 1=1');
  },
};

module.exports = RepliesTableTestHelper;
