import { ApolloServer } from 'apollo-server'

const typeDefs = `
  enum PhotoCategory {
    SELFIE
    PORTRAIT
    ACTION
    LANDSCAPE
    GRAPHIC
  }

  type Photo {
    id: ID!
    url: String!
    name: String!
    description: String
    category: PhotoCategory!
  }

  input PostPhotoInput {
    name: String!
    category: PhotoCategory=PORTRAIT
    description: String
  }

  type Query {
    totalPhotos: Int!
    allPhotos: [Photo!]!
  }

  type Mutation {
    postPhoto(input: PostPhotoInput!): Photo!
  }
`

interface Photo {
  id: string
  name: string
  description?: string
  url?: string
}

interface PostPhotoInput {
  input: {
    name: string
    description?: string
  }
}

let _id = 0
const photos: Array<Photo> = []

const resolvers = {
  Query: {
    totalPhotos: (): number => photos.length,
    allPhotos: (): Array<Photo> => photos,
  },
  Mutation: {
    postPhoto(parent: string, args: PostPhotoInput): Photo {
      console.log(args)
      const newPhoto = {
        id: String(_id++),
        ...args.input,
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