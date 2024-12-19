// API URL for fetching exercises from the external API (Wger API)
const API_URL = "https://wger.de/api/v2/exercise/?language=2 "; // Fetch exercises
const workoutTypeSelect = document.getElementById("workout-type"); // Dropdown for workout type selection
const workoutForm = document.getElementById("workout-form"); // Form for adding new workouts
const workoutsContainer = document.getElementById("workouts"); // Container to display workouts

// Arrays to store the exercises fetched from the API and the user-added workouts
let allExercises = []; // Store exercises fetched from the API
let userWorkouts = []; // Store user-added workouts

// Fetch exercises from the API and display them
function fetchExercises() {
  // Fetch data from the Wger API
  fetch(API_URL)
    .then((response) => response.json()) // Convert response to JSON
    .then((data) => {
      // Filter the exercises based on specific categories (e.g., 8, 10, 12)
      const filteredExercises = data.results.filter((exercise) =>
        [8, 10, 12].includes(exercise.category)
      );
      allExercises = filteredExercises; // Store all filtered exercises
      displayExercises(filteredExercises); // Display the filtered exercises
    })
    .catch((error) => {
      console.error("Error fetching exercises:", error); // Log any errors encountered during fetch
    });
}

// Display exercises in the list
function displayExercises(exercises) {
  workoutsContainer.innerHTML = ""; // Clear the list before displaying new exercises
  exercises.forEach(exercise => {
    
    // Create a list item for each exercise
    const li = document.createElement("li");
    li.className = "exercise-item"; // Assign a class for styling
    li.innerHTML = `<h3>${exercise.name}</h3>`; // Display the exercise name
    workoutsContainer.appendChild(li); // Add the exercise item to the container
  });
}

// Filter exercises based on the selected workout type
function filterExercises() {
  const selectedType = workoutTypeSelect.value.toLowerCase(); // Get the selected workout type
  
  // Filter exercises based on the workout type selected (e.g., muscle training, abs)
  const filteredExercises = allExercises.filter(exercise =>
    !selectedType || exercise.name.toLowerCase().includes(selectedType)
  );
  
  // If no exercises match the filter, show a message
  if (filteredExercises.length === 0) {
    workoutsContainer.innerHTML = "<p>No exercises match the selected filters.</p>";
  } else {
    displayExercises(filteredExercises); // Display filtered exercises
  }
}

// Add a new workout
workoutForm.addEventListener("submit", event => {
  event.preventDefault(); // Prevent the form from submitting and reloading the page
  
  // Get the values entered by the user
  const workoutName = document.getElementById("workout-name").value;
  const workoutDuration = document.getElementById("workout-duration").value;
  const workoutDifficulty = document.getElementById("workout-difficulty").value;
  const workoutDate = document.getElementById("date").value;

  // Create a new workout object with the entered data
  const newWorkout = {
    name: workoutName,
    duration: workoutDuration,
    difficulty: workoutDifficulty,
    date: workoutDate,
  };

  // Add the new workout to the userWorkouts array
  userWorkouts.push(newWorkout);
  displayUserWorkouts(); // Update the display with the new list of workouts
  workoutForm.reset(); // Clear the form inputs
});

// Display the user's workouts
function displayUserWorkouts() {
  const userWorkoutList = document.getElementById("workouts"); // Get the workouts container
  userWorkoutList.innerHTML = ""; // Clear the list before displaying new workouts
  
  // Iterate over each user workout and create a list item
  userWorkouts.forEach((workout, index) => {
    const workoutItem = document.createElement("li");
    workoutItem.innerHTML = `
      <strong>${workout.name}</strong> - ${workout.duration} min - ${workout.difficulty} 
      <em>${workout.date}</em>
      <button onclick="removeWorkout(${index})">Remove</button> <!-- Button to remove the workout -->
    `;
    userWorkoutList.appendChild(workoutItem); // Add the workout item to the list
  });
}

// Remove a workout from the list
function removeWorkout(index) {
  userWorkouts.splice(index, 1); // Remove the workout at the specified index
  displayUserWorkouts(); // Update the display after removal
}

// Reset filters when the "Reset Filters" button is clicked
const resetFiltersButton = document.getElementById("reset-filters");

resetFiltersButton.addEventListener("click", () => {
  workoutTypeSelect.value = ""; // Reset the workout type filter to the default value (All)
  filterExercises(); // Reapply the filter with no workout type selected, showing all exercises
});

// Event listener for filtering exercises when the workout type is changed
workoutTypeSelect.addEventListener("change", filterExercises);

// Initial fetch of exercises when the page loads
fetchExercises();
