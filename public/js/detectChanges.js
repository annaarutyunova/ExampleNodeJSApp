// Get the form input element
const formInput = document.getElementById('account_email');

// Store the initial value
let initialValue = formInput.value;

// Add an event listener for input changes
formInput.addEventListener('input', () => {
  // Get the current value
  const currentValue = formInput.value;
  
  // Compare the current value with the initial value
  if (currentValue !== initialValue) {
    console.log('User made changes!');
    // Additional actions you want to perform when changes are detected
  } else {
    console.log('No changes detected.');
    // Additional actions you want to perform when no changes are detected
  }
});