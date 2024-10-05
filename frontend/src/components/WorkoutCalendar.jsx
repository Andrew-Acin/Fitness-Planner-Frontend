import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar'; // npm install react-calendar if you haven't already
import axios from 'axios';

const WorkoutCalendar = () => {
  const [query, setQuery] = useState(''); // State for search input
  const [exercises, setExercises] = useState([]); // State for fetched exercises
  const [selectedExercises, setSelectedExercises] = useState([]); // State for selected exercises
  const [workouts, setWorkouts] = useState([]); // State to store workouts for calendar
  const [newWorkout, setNewWorkout] = useState({ name: '', scheduled_time: '' }); // State for new workout form
  const [error, setError] = useState(null); // Error state

  const apiKey = process.env.REACT_APP_API_KEY; // Get API key from environment variables

  useEffect(() => {
    // Fetch existing workouts from the server
    const fetchWorkouts = async () => {
      try {
        const response = await axios.get('https://fitness-backend-production-d337.up.railway.app/api/workouts');
        setWorkouts(response.data);
      } catch (error) {
        console.error('Failed to fetch workouts:', error);
      }
    };
    fetchWorkouts();
  }, []);

  const handleInputChange = (e) => setQuery(e.target.value);

  const searchExercises = async () => {
    if (query.trim()) {
      try {
        const response = await fetch(`https://api.api-ninjas.com/v1/exercises?muscle=${query}`, {
          method: 'GET',
          headers: { 'X-Api-Key': apiKey, 'Content-Type': 'application/json' },
        });

        if (!response.ok) throw new Error(`Error: ${response.statusText}`);

        const result = await response.json();
        setExercises(result);
        setError(null);
      } catch (error) {
        setError(error.message);
        setExercises([]);
      }
    }
  };

  const handleSelectExercise = (exercise) => {
    setSelectedExercises((prevSelected) =>
      prevSelected.includes(exercise) ? prevSelected.filter((ex) => ex !== exercise) : [...prevSelected, exercise]
    );
  };

  const handleAddWorkout = async (e) => {
    e.preventDefault();
    try {
      const newWorkoutData = { ...newWorkout, exercises: selectedExercises };

      console.log('Data being sent to the backend:', newWorkoutData);

      await axios.post('https://fitness-backend-production-d337.up.railway.app/api/workouts', newWorkoutData);
      alert('Workout added successfully');
      setNewWorkout({ name: '', scheduled_time: '' });
      setSelectedExercises([]);
      setWorkouts([...workouts, newWorkoutData]);
    } catch (error) {
      console.error('Error saving workout:', error);
      alert('Failed to save workout');
    }
  };



  return (
    <div className="workout-calendar-container">
      <h1>Workout Calendar</h1>

      {/* Calendar Component */}
      <Calendar
        value={new Date()}
        tileContent={({ date }) => {
          const workout = workouts.find((w) => new Date(w.scheduled_time).toDateString() === date.toDateString());
          return workout ? <p>{workout.name}</p> : null;
        }}
      />

      {/* Form to Add New Workout */}
      <form onSubmit={handleAddWorkout} className="workout-form">
        <h2>Add a New Workout</h2>
        <input
          type="text"
          placeholder="Workout Name"
          value={newWorkout.name}
          onChange={(e) => setNewWorkout({ ...newWorkout, name: e.target.value })}
          required
        />
        <input
          type="datetime-local"
          value={newWorkout.scheduled_time}
          onChange={(e) => setNewWorkout({ ...newWorkout, scheduled_time: e.target.value })}
          required
        />
        <button type="submit">Schedule Workout</button>
      </form>

      {/* Exercise Search */}
      <div className="exercise-container">
        <h2>Search for Exercises</h2>
        <input
          type="text"
          placeholder="Enter muscle group (e.g., biceps, triceps)..."
          value={query}
          onChange={handleInputChange}
          className="search-input"
        />
        <button onClick={searchExercises} className="search-button">Search</button>
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
      </div>

      {/* Selected Exercises */}
      {selectedExercises.length > 0 && (
        <div className="selected-exercises">
          <h2>Selected Exercises</h2>
          <ul>
            {selectedExercises.map((exercise, index) => (
              <li key={index}>{exercise.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default WorkoutCalendar;
