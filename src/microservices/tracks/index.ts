import { ApolloServer, PubSub, gql } from "apollo-server";
import { ports } from "../../constants";

const pubsub = new PubSub();

// This is a (sample) collection of books we'll be able to query
// the GraphQL server for.  A more complete example might fetch
// from an existing data source like a REST API or database.
const tracks = [
  {
    title: "214",
    artists: [
      {
        id: 1,
        name: "Rivermaya"
      }
    ]
  },
  {
    title: "Forevermore",
    artists: [
      {
        id: 2,
        name: "Side A"
      }
    ]
  },
  {
    title: "Before I let you go",
    artists: [
      {
        id: 3,
        name: "Freestyle"
      },
      {
        id: 2,
        name: "Side A"
      }
    ]
  }
];

// Type definitions define the "shape" of your data and specify
// which ways the data can be fetched from the GraphQL server.
const typeDefs = gql`
  type Tracks {
    title: String
    artists: [Artist]
  }

  type Artist {
    id: Int!
    name: String
  }

  type Query {
    tracks: [Tracks]
  }
`;

// Resolvers define the technique for fetching the types in the
// schema.  We'll retrieve books from the "books" array above.
const resolvers = {
  Query: {
    tracks: () => tracks
  }
};

// In the most basic sense, the ApolloServer can be started
// by passing type definitions (typeDefs) and the resolvers
// responsible for fetching the data for those types.
const server = new ApolloServer({ typeDefs, resolvers });

// This `listen` method launches a web-server.  Existing apps
// can utilize middleware options, which we'll discuss later.
server.listen(ports.tracks).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
