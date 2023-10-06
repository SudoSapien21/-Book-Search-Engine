// import Auth from "../utils/auth";
// import { removeBookId, saveBookIds } from "../utils/localStorage";
// import { ALL_MINE } from "../utils/queries";
// import { REMOVE_BOOK } from "../utils/mutations";
// import { useQuery, useMutation } from "@apollo/client";

import {
  Container,
  Card,
  Button,
  Row,
  Col
} from 'react-bootstrap';


import { useQuery, useMutation } from '@apollo/client'; // Import the useQuery and useMutation Hooks
import { GET_ME } from '../utils/queries'; // Import the GET_ME query
import { REMOVE_BOOK } from '../utils/mutations'; // Import the REMOVE_BOOK mutation
import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage'

const SavedBooks = () => {
  const { loading, data } = useQuery(GET_ME); // Execute the GET_ME query
  const userData = data?.me || {}; 

  // use this to determine if `useEffect()` hook needs to run again
  const userDataLength = Object.keys(userData).length;

  useQuery(() => {
    const getUserData = async () => {
      try {
        const token = Auth.loggedIn() ? Auth.getToken() : null;
  
        if (!token) {
          return false;
        }
  
        const response = await GET_ME(token);
  
        if (!response.ok) {
          throw new Error('something went wrong!');
        }
  
        const user = await response.json();
          data(user);
      } catch (err) {
        console.error(err);
      }
    };
    getUserData();
  }, [userDataLength]);

  // create function that accepts the book's mongo _id value as param and deletes the book from the database
  const [removeBookMutation] = useMutation(REMOVE_BOOK);
  
  const handleDeleteBook = async (bookId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      const { data } = await removeBookMutation({
        variables: { bookId },
        context: { headers: { authorization: `Bearer ${token}` } },
      });
      

      const updatedUser = data.removeBook;         
      removeBookId(bookId);
      data(updatedUser);
      // setUserData (updatedUser);
    } catch (err) {
      console.error(err);
    }
  };

  // if data isn't here yet, say so
  if (loading) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <div fluid className="text-light bg-dark p-5">
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </div>
      <Container>
        <h2 className='pt-5'>
          {loading.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${loading.savedBooks.length === 1 ? 'book' : 'books'}:`
            : 'You have no saved books!'}
        </h2>
        <Row>
          {loading.savedBooks.map((book) => {
            return (
              <Col md="4">
                <Card key={book.bookId} border='dark'>
                  {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' /> : null}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className='small'>Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                    <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
                      Delete this Book!
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
};

export default SavedBooks;
