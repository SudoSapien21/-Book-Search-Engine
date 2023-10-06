// importing Authentication error from apollo servers to show the error message
// const { AuthenticationError } = require("apollo-server-errors");
// importing User from the modules
// // importing signToken from utils
// const { signToken } = require("../utils/auth");
const { User, Book} = require("../models");
const { AuthenticationError } = require('apollo-server-express');

// Define the query and mutation functionality to work with the Mongoose models.


const resolvers = {
  Query: {
    User: async () => {
      return User.find({});
    },
    Book: async (parent, { _id }) => {
      const params = _id ? { _id } : {};
      return Book.find(params);
    },
  },
  Mutation: {
    // Define your mutation resolvers here
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new AuthenticationError('No user found with this email address');
      }

      const correctPassword = await user.isCorrectPassword(password);

      if (!correctPassword) {
        throw new AuthenticationError('Incorrect password');
      }

      const token = signToken(user);

      return { token, user };
    },
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);

      return { token, user };
    },
    saveBook: async (parent, { input }, context) => {
      if (context.user) {
        const updatedUser = await User.findByIdAndUpdate(
          context.user._id,
          { $push: { savedBooks: input } },
          { new: true }
        );
        return updatedUser;
      }
      throw new AuthenticationError('You need to be logged in to save a book.');
    },
    removeBook: async (parent, { bookId }, context) => {
      if (context.user) {
        const updatedUser = await User.findByIdAndUpdate(
          context.user._id,
          { $pull: { savedBooks: { bookId } } },
          { new: true }
        );
        return updatedUser;
      }
      throw new AuthenticationError('You need to be logged in to remove a book.');
    },
  },
};

module.exports = resolvers;