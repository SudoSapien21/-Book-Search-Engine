// server/schema/typeDefs.js

const { gql } = require('apollo-server-express');

// Define the GraphQL types
const typeDefs = gql`
  type Book {
    _id: ID
    authors: [String]
    description: String
    bookId: String
    image: String
    link: String
    title: String
  }

  type User {
    _id: ID
    username: String
    email: String
    password: String
    savedBooks: [Book]
    bookCount: Int
  }

  type Query {
    getUser(username: String!): User
    getBook(bookId: String!): Book
    # Add more queries for other GET requests here
  }

  type Mutation {
    createUser(username: String!, email: String!, password: String!): User
    saveBook(userId: ID!, book: BookInput!): User
    deleteBook(userId: ID!, bookId: String!): User
    loginUser(username: String!, password: String!): User
    # Add more mutations for other POST, PUT, or DELETE requests here
  }

  input BookInput {
    authors: [String]
    description: String
    bookId: String
    image: String
    link: String
    title: String
  }
`;

module.exports = typeDefs;
