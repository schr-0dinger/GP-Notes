document.addEventListener('DOMContentLoaded', function() {
  // Event listener for search bar
  document.getElementById('searchbar').addEventListener('keyup', fetchData);
});

// Function to fetch data from JSON file
function fetchData() {
  fetch('src/data.json') 
    .then(response => response.json())
    .then(database => {

        var input = document.getElementById('searchbar').value.toLowerCase();
        var resultDiv = document.getElementById('resultbox');
        resultDiv.innerHTML = ''; // Clear previous results
    
        for (var i = 0; i < database.symptom.length; i++) {
          if (database.symptom[i].disease !== undefined) {
            var disease = database.symptom[i].disease.toLowerCase();
            console.log(disease);
          } else {
            console.log("Disease property not found or undefined.");
          }
            if(input === '' || input.length === 1){
              resultDiv.innerHTML = '';
            }
            else{
    
            if (disease.includes(input)) {
                // Format the result as you wish
                var result = '<p> Disease: '     + database.symptom[i].disease + '</p>' +
                             '<p> Drug: ' + database.symptom[i].drugs[0].name + '</p>';
                                // ' Treatment: ' + database.symptom[i].treatment + 
                              
                resultDiv.innerHTML += result;
            }
          }
        }
    })
    .catch(error => {
      console.log('Error fetching data:', error);
    });
}
