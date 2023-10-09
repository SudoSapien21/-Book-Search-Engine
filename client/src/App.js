import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SearchBooks from "./pages/SearchBooks";
import SavedBooks from "./pages/SavedBooks";
import Navbar from "./components/Navbar";
// import ApolloProvider destructured  from apollo
import { ApolloProvider, ApolloClient, InMemoryCache  } from "@apollo/client";
import { loadErrorMessages, loadDevMessages } from "@apollo/client/dev";

if (process.env.MODE_ENV === 'developemnt') { 
  loadDevMessages();
  loadErrorMessages();

}


// assign in client to a new apollo client in high order function that takes request as a first are than a function then an operation set context with the trinary to check for the graphql uri
const client = new ApolloClient({
  request: operation => {
    const token = localStorage.getItem("id_token");

    operation.setContext({
      headers: {
        authorization: token ? `Bearer ${token}` : "",
      },
    });
  },
  uri: "/graphql",
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <>
          <Navbar />
          <Routes>
            <Route exact path="/" component={SearchBooks} />
            <Route exact path="/saved" component={SavedBooks} />
            <Route render={() => <h1 className="display-2">Wrong page!</h1>} />
          </Routes>
        </>
      </Router>
    </ApolloProvider>
  );
}

export default App;