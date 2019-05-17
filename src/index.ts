import { ApolloServer } from 'apollo-server'
import { HttpLink } from 'apollo-link-http'
import fetch from 'node-fetch'

import { ports } from "./constants";

const {
  introspectSchema,
  makeRemoteExecutableSchema,
  mergeSchemas
} = require("graphql-tools");

const booksLink = new HttpLink({ uri: "http://localhost:9000", fetch });
const tracksLink = new HttpLink({ uri: "http://localhost:9001", fetch });

async function startServer() {
  let booksSchema, tracksSchema;

  try {
    const booksRemoteSchema = await introspectSchema(booksLink);
    booksSchema = makeRemoteExecutableSchema({
      schema: booksRemoteSchema,
      link: booksLink
    });
  } catch (err) {
    console.error("Http error", err);
  }

  try {
    const tracksRemoteSchema = await introspectSchema(tracksLink);
    tracksSchema = makeRemoteExecutableSchema({
      schema: tracksRemoteSchema,
      link: tracksLink
    });
  } catch (err) {
    console.error("Http error", err);
  }

  const mergeSchemaOptions = {
    schemas: []
  };

  if (booksSchema) {
    mergeSchemaOptions.schemas.push(booksSchema);
  }

  if (tracksSchema) {
    mergeSchemaOptions.schemas.push(tracksSchema);
  }

  const schema = mergeSchemas(mergeSchemaOptions);
  const server = new ApolloServer({ schema });

  return await server.listen(ports.stitcher);
}

startServer().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
