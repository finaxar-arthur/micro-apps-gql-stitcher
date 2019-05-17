const { ApolloServer } = require("apollo-server");
const { HttpLink } = require("apollo-link-http");
const fetch = require("node-fetch");
const {
  introspectSchema,
  makeRemoteExecutableSchema,
  mergeSchemas
} = require("graphql-tools");

const { microservicePorts } = require("../constants");

const booksLink = new HttpLink({ uri: "http://localhost:9000", fetch });
const tracksLink = new HttpLink({ uri: "http://localhost:9001", fetch });

async function startServer() {
  const booksRemoteSchema = await introspectSchema(booksLink);
  const booksSchema = makeRemoteExecutableSchema({
    schema: booksRemoteSchema,
    link: booksLink
  });

  const tracksRemoteSchema = await introspectSchema(tracksLink);
  const tracksSchema = makeRemoteExecutableSchema({
    schema: tracksRemoteSchema,
    link: tracksLink
  });

  const schema = mergeSchemas({
    schemas: [booksSchema, tracksSchema]
  });

  const server = new ApolloServer({ schema });

  return await server.listen(microservicePorts.stitcher);
}

startServer().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});

export {};
