/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.alterColumn('threads', 'date', {
    type: 'TIMESTAMP',
    notNull: true,
    default: pgm.func('current_timestamp'),
  });

  pgm.alterColumn('comments', 'date', {
    type: 'TIMESTAMP',
    notNull: true,
    default: pgm.func('current_timestamp'),
  });

  pgm.alterColumn('replies', 'date', {
    type: 'TIMESTAMP',
    notNull: true,
    default: pgm.func('current_timestamp'),
  });

  pgm.alterColumn('likes', 'date', {
    type: 'TIMESTAMP',
    notNull: true,
    default: pgm.func('current_timestamp'),
  });
};

exports.down = (pgm) => {
  pgm.alterColumn('likes', 'date', {
    type: 'TIMESTAMP',
    notNull: true,
  });

  pgm.alterColumn('replies', 'date', {
    type: 'TIMESTAMP',
    notNull: true,
  });

  pgm.alterColumn('comments', 'date', {
    type: 'TIMESTAMP',
    notNull: true,
  });

  pgm.alterColumn('threads', 'date', {
    type: 'TIMESTAMP',
    notNull: true,
  });
};
