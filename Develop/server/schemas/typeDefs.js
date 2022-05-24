const { gql } = require("apollo-server-express");

const typeDefs = gql`
input BookInput {
    authors: [String]
    description: String!
    bookId: String!
    image: String
    link: String
    title: String!
}
type Query {
    me: User
}

type Auth {
    token: ID!
    user: User
}

type User { 
    _id: ID!
    username: String!
    email: String
    bookCount: Int
    savedBooks: [Book]
}

input BookInput {
    authors: [String]
    description: String
    title: String
    bookId: String
    image: String
}

type Book { 
    bookId: ID!
    authors: [String]
    description: String
    title: String!
    image: String
    link: String
}

type Query {
    user: User
}

type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String! email: String!, password: String!): Auth
    saveBook(bookData: BookInput!): User
    removeBook(bookId: ID!): User
  }
`;

module.exports = typeDefs;