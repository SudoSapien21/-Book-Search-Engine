const express = require("express");
const favicon = require('express-favicon');
const path = require("path");
const db = require("./config/connection");
import { HttpLink, link } from '@apollo/client';

app.use(favicon(__dirname + '/public/favicon.png'));

// importing apollo server
const { ApolloServer } = require("apollo-server-express");

// importing authMiddleware
const { authMiddleware } = require("./utils/auth");

// requiring typedefs
const { typeDefs, resolvers } = require("./schemas");

const app = express();
const PORT = process.env.PORT || 3001;
// importing the servers middle ware
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
});

server.applyMiddleware({ app });

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));
}

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});


const link = new HttpLink({
  uri: "http://localhost:4000/graphql"
  // Additional options
});

server.start().then(res => {
  server.applyMiddleware({ app, path: '/' });
});

db.once("open", () => {
  app.listen({PORT}, () => {
    console.log(`API server running on port ${PORT}!`);
    console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
  });
});

