/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const LikesTableTestHelper = {
  async addLikes({
    id = 'like-123',
    ownerId = 'user-123',
    commentId = 'comment-123',
    date = new Date().toISOString(),
  }) {
    const query = {
      text: 'INSERT INTO likes VALUES($1, $2, $3, $4)',
      values: [id, ownerId, commentId, date],
    };

    await pool.query(query);
  },

  async cleanTable() {
    await pool.query('DELETE FROM likes WHERE 1=1');
  },
};

module.exports = LikesTableTestHelper;
