document.addEventListener('DOMContentLoaded', function() {
    // Event listener for search bar
    document.getElementById('searchbar').addEventListener('keyup', fetchData);
  });
  
  // Function to fetch data from JSON file
  function fetchData() {
    fetch('src/data.json')  // Replace 'data.json' with the actual path to your JSON file
      .then(response => response.json())
      .then(data => {
        const searchQuery = document.getElementById('searchbar').value.toLowerCase();
        
        // Filtering the data based on the search query
        const filteredData = data.antibiotic.filter(item => item.dose.toLowerCase().includes(searchQuery));
        
        // Displaying the filtered data
        const resultContainer = document.getElementById('result');
        resultContainer.innerHTML = '';
  
        filteredData.forEach(item => {
          const listItem = document.createElement('li');
          listItem.textContent = item.dose;
          resultContainer.appendChild(listItem);
        });
      })
      .catch(error => {
        console.log('Error fetching data:', error);
      });
  }
  