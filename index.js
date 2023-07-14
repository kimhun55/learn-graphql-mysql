const { ApolloServer, gql } = require('apollo-server')

  async function main() {
    // get the client
    const mysql = require('mysql2/promise');
    const connection = await mysql.createConnection({host:'localhost', user: 'root',password:'root', database: 'graphqtest'});

  


    const typeDefs = gql` 

    type Attraction {
        id: Int
        name: String
        detail: String
        coverimage: String
        latitude: Float
        longitude: Float
      } 
    type Query {
          attractions: [Attraction]
          attraction(id: Int!) : Attraction
      }
    `;


    const resolvers = {
          Query: {
            attractions: async() => {
              const [rows, fields] = await connection.execute('SELECT * FROM `attractions`');
              return rows
            },
             attraction : async (parent,{id}) => {
              const [rows, fields] = await connection.execute('SELECT * FROM `attractions` where id = ?',[id]);
              if(rows.length > 0){
              return rows[0]
              }else{
                return []
              }
            }
          },
          
    };

  const {
    ApolloServerPluginLandingPageLocalDefault
  } = require('apollo-server-core');
  
  // The ApolloServer constructor requires two parameters: your schema
  // definition and your set of resolvers.
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    csrfPrevention: true,
    cache: 'bounded',
    plugins: [
      ApolloServerPluginLandingPageLocalDefault({ embed: true }),
    ],
  });
  
  // The `listen` method launches a web server.
  server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
  });
  }//end main function 
  main()





