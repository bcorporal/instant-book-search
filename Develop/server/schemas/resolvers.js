const { AuthenticationError } = require('apollo-server-express');
const { User, Book } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    user: async (parent, args, context) => {
      if (context.user) {
        return await User.findOne({ _id: context.user._id})
        .select("-_v -password")
        .populate("savedBooks");
      }
      throw new AuthenticationError('Not Logged In')
    },
},

  Mutation: {
    createUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);
      return { token, user };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email: email });

      if (!user) {
        throw new AuthenticationError('No user found');
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const token = signToken(user);

      return { token, user };
    },
    saveBook: async (parent, args, context) => {
        const input = args.input;
      if (context.user) {
        return await User.findOneAndUpdate(
            { _id: context.user._id },
            { $addToSet: { savedBooks: { ...input } } },
            { new: true }
        );
      }
      throw new AuthenticationError('You must be logged in');
    },

    removeBook: async (parent, args, context) => {
        const bookId = args.bookId;
        console.log(bookId)
        if (context.user) {
            return await User.findOneAndUpdate(
              { _id: context.user._id },
              { $pull: { savedBooks: { bookId: bookId } } },
              { new: true }
            )
          }
          throw new AuthenticationError('You need to be logged in!');
        }
      },
    };

module.exports = resolvers;
