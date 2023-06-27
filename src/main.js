document.addEventListener('DOMContentLoaded', function () {
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

        // Results are formatted here
        if (input === '' || input.length === 1) {
          resultDiv.innerHTML = '';
        }
        else {

          if (disease.includes(input)) {
            resultDiv.innerHTML += '<a href=# class="list-group-item">' + database.symptom[i].disease.toUpperCase() + '</a>';
            if (database.symptom[i].drugs) {
              var n = database.symptom[i].drugs.length
              for (var j = 0; j < n; j++) {
                var result = '<div class="list-group">' +
                  '<a href="#" class="glass list-group-item list-group-item-action">' +
                  // '<p> Disease: ' + database.symptom[i].disease + '</p>' +
                  '<p> Drug name: ' + database.symptom[i].drugs[j].name +'('+database.symptom[i].drugs[j].generic+')'+ '</p>' +
                  '<p> Pediatric Dose: ' + database.symptom[i].drugs[j].pediatric_dose + '</p>' +
                  '</a>'

                resultDiv.innerHTML += result;
              }
            }
          }
        }
      }
    })
    .catch(error => {
      console.log('Error fetching data:', error);
    });
}
