const { ApolloServer } = require('apollo-server');
const { ApolloGateway } = require('@apollo/gateway');

const gateway = new ApolloGateway({
  serviceList: [
    {
      name: "core",
      url: "https://qh-core-practice-01.herokuapp.com"
    },
    {
        name: 'interviewQ',
        url: "https://qh-interviewq-practice-01.herokuapp.com",
    },
    {
        name: 'resumeQ',
        url: "https://qh-resumeq-practice-01.herokuapp.com"
    },
  ]
})
 
(async () => {
  const { schema, executor } = await gateway.load();

const server = new ApolloServer({
    schema, executor, introspection: true, playground: true
 })
  const PORT = process.env.PORT || 4000;
  server.listen(PORT, () => {console.log(`server is listening on ${PORT}`)})
})();