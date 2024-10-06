import React, { useState } from 'react';
import "./ExcerciseStyles.css"

const SearchExercises = () => {
  const [query, setQuery] = useState(''); // State to track the search input
  const [exercises, setExercises] = useState([]); // State to store fetched exercises
  const [selectedExercises, setSelectedExercises] = useState([]); // State to track selected exercises
  const [error, setError] = useState(null); // State to track errors

  const apiKey = process.env.REACT_APP_API_KEY;

  // Function to handle the search input change
  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  // Function to fetch exercises from API based on the muscle query
  const searchExercises = async () => {
    if (query.trim()) {
      try {
        console.log('apiKey', apiKey)
        console.log(process.env)
        const response = await fetch(`https://api.api-ninjas.com/v1/exercises?muscle=${query}`, {
          method: 'GET',
          headers: {
            'x-api-key': process.env.REACT_APP_API_KEY,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const result = await response.json();
        setExercises(result);
        setError(null); // Clear any previous errors
      } catch (error) {
        setError(error.message);
        setExercises([]); // Clear exercises on error
      }
    }
  };

  // Function to handle exercise selection
  const handleSelectExercise = (exercise) => {
    setSelectedExercises((prevSelected) => {
      if (prevSelected.includes(exercise)) {
        return prevSelected.filter((ex) => ex !== exercise);
      } else {
        return [...prevSelected, exercise];
      }
    });
  };

  // Function to save selected exercises to the backend
  const saveSelectedExercises = async () => {
    if (selectedExercises.length === 0) {
      return;
    }

    try {
      const response = await fetch('https://fitness-backend-production-d337.up.railway.app/api/exercise', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ //I managed to use the inputs that the API gives us using 
          name: selectedExercises[0].name, 
          type: selectedExercises[0].type, 
          muscle: selectedExercises[0].muscle, 
          equipment: selectedExercises[0].equipment, 
          difficulty: selectedExercises[0].difficulty, 
          instructions: selectedExercises[0].instructions, 
          exercises: selectedExercises, 
      }),
      });

      if (!response.ok) {
        throw new Error('Failed to save exercises');
      }

      const result = await response.json();
      console.log('Selected exercises saved:', result);
      alert('Exercises saved successfully!');
    } catch (error) {
      console.error('Error saving exercises:', error);
      alert('Failed to save exercises');
    }
  };

  return (
    <div className="exercise-container">
      <h1>Search Exercises by Muscle</h1>
      <input
        type="text"
        placeholder="Enter muscle group (e.g., biceps, triceps)..."
        value={query}
        onChange={handleInputChange}
        className="search-input"
      />
      <button onClick={searchExercises} className="search-button">Search</button>

      {/* Display error message if there's any */}
      {error && <p className="error-message">Error: {error}</p>}

      <div className="exercise-list">
        {exercises.length > 0 ? (
          exercises.map((exercise, index) => (
            <div key={index} className={`exercise-card ${selectedExercises.includes(exercise) ? 'selected' : ''}`}>
              <h3>{exercise.name}</h3>
              <p><strong>Type:</strong> {exercise.type}</p>
              <p><strong>Equipment:</strong> {exercise.equipment}</p>
              <p><strong>Muscle:</strong> {exercise.muscle}</p>
              <button 
                onClick={() => handleSelectExercise(exercise)} 
                className="select-button"
              >
                {selectedExercises.includes(exercise) ? 'Deselect' : 'Select'}
              </button>
            </div>
          ))
        ) : (
          !error && <p>No exercises found. Try searching for a muscle group.</p>
        )}
      </div>

      {selectedExercises.length > 0 && (
        <div className="selected-exercises">
          <h2>Selected Exercises</h2>
          <ul>
            {selectedExercises.map((exercise, index) => (
              <li key={index}>{exercise.name}</li>
            ))}
          </ul>
          <button onClick={saveSelectedExercises} className="save-button">Save Selected Exercises</button>
        </div>
      )}
    </div>
  );
};

export default SearchExercises;



