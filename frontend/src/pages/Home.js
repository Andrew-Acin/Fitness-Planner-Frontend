import React from 'react';
import { Link } from 'react-router-dom';
// import Navbar from '../components/Navbar';
// import SearchExcersises from '../components/SearchExcersises';
// import './Home.css';  // Import the CSS file

function Home() {
  // Retrieve the first name from local storage
  const isLoggedIn = !!localStorage.getItem('token'); // Check if the user is logged in
  const firstName = localStorage.getItem('first_name'); // Retrieve the user's first name

  const handleLogout = () => {
    localStorage.removeItem('firstName');
    localStorage.removeItem('token');
    // Optionally redirect to the home page or login page
    window.location.href = '/';
  };

  return ( 
    <div>
      {/* <Navbar/>
      <SearchExcersises/> */}

      {/* Conditional rendering for welcome message */}
      <h1>{isLoggedIn ? `Welcome ${firstName}` : 'Welcome to the Fitness Planner App'}</h1>

      <p>Please choose an option below:</p>

      {/* Conditional rendering for buttons */}
      {isLoggedIn ? (
        <button onClick={handleLogout}>Logout</button> // Show logout button if logged in
      ) : (
        <>
          <Link to="/login">
            <button>Login</button>
          </Link>
          <Link to="/signup">
            <button>Sign Up</button>
          </Link>
        </>
      )}
    </div>
  );
}

export default Home;
