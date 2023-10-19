import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SearchBooks from './pages/SearchBooks';
import SavedBooks from './pages/SavedBooks';
import Navbar from './components/Navbar';
import { ApolloProvider, ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';


const client = new ApolloClient({
  link: new HttpLink({
    uri: '/graphql',
    headers: {
      'custom-header': 'custom-value'  // Do you really need this?
    }
  }),
  cache: new InMemoryCache(),
});


function App() {
  return (
    <ApolloProvider client={client}> {/* Provide the Apollo Client */}
      <Router>
        <>
          <Navbar />
          <Routes>
            <Route path='/' element={<SearchBooks />} />
            <Route path='/saved' element={<SavedBooks />} />
            <Route path='*' element={<h1 className='display-2'>Wrong page!</h1>} />
          </Routes>
        </>
      </Router>
    </ApolloProvider>
  );
}

export default App;