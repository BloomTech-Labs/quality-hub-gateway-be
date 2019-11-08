const { ApolloServer } = require('apollo-server');
const { ApolloGateway, RemoteGraphQLDataSource } = require('@apollo/gateway');

class AuthenticatedDataSource extends RemoteGraphQLDataSource {
  willSendRequest({ request, context}) {
    request.http.headers.set('Authorization', context.auth);
  }
}

const gateway = new ApolloGateway({
  serviceList: [
    {
      name: 'core',
      url: 'https://quality-hub-core-staging.herokuapp.com',
    },
    {
      name: 'interviewQ',
      url: 'https://qh-interviewq-practice-01.herokuapp.com',
    },
    {
      name: 'resumeQ',
      url: 'https://qh-resumeq-practice-01.herokuapp.com',
    },
  ],
  buildService({name, url}) {
    return new AuthenticatedDataSource({url})
  }
});

(async () => {
  const { schema, executor } = await gateway.load();

  const server = new ApolloServer({
    schema,
    executor,
    introspection: true,
    playground: true,
    context: ({req}) => {
      return {auth: req.headers.authorization}
    }
  });

  const PORT = process.env.PORT || 4000;

  server.listen(PORT, () => {
    console.log(`server is listening on ${PORT}`);
  });
})();
