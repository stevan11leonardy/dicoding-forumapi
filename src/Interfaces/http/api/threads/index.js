const routes = require('./routes');
const ThreadHandler = require('./handler');

module.exports = {
  name: 'threads',
  register: async (server, { container }) => {
    const threadsHandler = new ThreadHandler(container);
    server.route(routes(threadsHandler));
  },
};
