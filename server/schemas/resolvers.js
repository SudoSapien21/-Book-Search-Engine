const { User } = require('../models'); 

const resolvers = {
  Query: {
    getUser: async (parent, { username }) => {
      return await User.findOne({ username });
    },
    // Add resolver functions for other GET requests here
  },
  Mutation: {
    createUser: async (parent, args) => {
      const user = await User.create(args);
      return user;
    },
    // Add resolver functions for other POST, PUT, or DELETE requests here
  },
};

module.exports = resolvers;
