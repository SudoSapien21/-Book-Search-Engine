// import the graphql
// import gql from "graphql";
import {gql} from '@apollo/client';


export const GET_ME  = gql`
  {
    user {
      _id
      username
      email
      savedBooks {
        title
        bookId
        authors
        description
        image
        link
      }
    }
  }
`;