const { ApolloServer, PubSub, gql } = require("apollo-server");
const { microservicePorts } = require("../../constants");

const pubsub = new PubSub();

const books = [
  {
    title: "Harry Potter and the Chamber of Secrets",
    authors: [
      {
        id: 1,
        name: "J.K. Rowling"
      }
    ]
  },
  {
    title: "Jurassic Park",
    authors: [
      {
        id: 2,
        name: "Michael Crichton"
      }
    ]
  },
  {
    title: "Good Omens",
    authors: [
      {
        id: 3,
        name: "Terry Pratchett"
      },
      {
        id: 4,
        name: "Neil Gaiman"
      }
    ]
  }
];

// Type definitions define the "shape" of your data and specify
// which ways the data can be fetched from the GraphQL server.
const typeDefs = gql`
  # Comments in GraphQL are defined with the hash (#) symbol.

  # This "Book" type can be used in other type declarations.
  type Book {
    title: String
    authors: [Author]
  }

  type Author {
    id: Int!
    name: String
  }

  # The "Query" type is the root of all GraphQL queries.
  # (A "Mutation" type will be covered later on.)
  type Query {
    books: [Book]
  }
`;

// Resolvers define the technique for fetching the types in the
// schema.  We'll retrieve books from the "books" array above.
const resolvers = {
  Query: {
    books: () => books
  }
};

// In the most basic sense, the ApolloServer can be started
// by passing type definitions (typeDefs) and the resolvers
// responsible for fetching the data for those types.
const server = new ApolloServer({ typeDefs, resolvers });

// This `listen` method launches a web-server.  Existing apps
// can utilize middleware options, which we'll discuss later.
server.listen(microservicePorts.books).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});

export {};
