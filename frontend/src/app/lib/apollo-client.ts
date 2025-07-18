import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: 'http://localhost:3000/graphql', // your NestJS backend URL
  cache: new InMemoryCache(),
});

export default client;