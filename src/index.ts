import { ApolloServer } from 'apollo-server'

const typeDefs = `
  type Photo {
    id: ID!
    url: String!
    name: String!
    description: String
  }

  type Query {
    totalPhotos: Int!
    allPhotos: [Photo!]!
  }

  type Mutation {
    postPhoto(name: String! description: String): Photo!
  }
`

interface Photo {
  id: string
  name: string
  description?: string
  url: string
}

interface PostPhoto {
  name: string
  description?: string
}

let _id = 0
const photos: Array<Photo> = []

const resolvers = {
  Query: {
    totalPhotos: (): number => photos.length,
    allPhotos: (): Array<Photo> => photos,
  },
  Mutation: {
    postPhoto(parent: string, args: PostPhoto): Photo {
      const newPhoto = {
        id: String(_id++),
        ...args,
      }
      photos.push(newPhoto)
      return newPhoto
    },
  },
  Photo: {
    url: (parent: Photo): string => `http://yoursite.com/img/${parent.id}`,
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

server
  .listen()
  .then(({ url }) => console.log(`GraphQL Service running on ${url}`))

// query totalPhotos {
//   totalPhotos
// }
// mutation newPhoto($name: String!, $description: String) {
//   postPhoto(name: $name, description: $description) {
//     id
//     name
//     description
//     url
//   }
// }
