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

      var drugGroup = [];

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

          if (disease.indexOf(input) !== -1) {

            resultDiv.innerHTML += '<a href=# class="list-group-item">' + database.symptom[i].disease.toUpperCase() + '</a>';
            if (database.symptom[i].drugs) {
              var n = database.symptom[i].drugs.length;
              for (var j = 0; j < n; j++) {
                var drugType = database.symptom[i].drugs[j].type[0];
                var isDuplicate = false;

                for (let k = 0; k < drugGroup.length; k++) {
                  if (drugGroup[k] === drugType) {
                    isDuplicate = true;
                    break;
                  }
                }

                if (!isDuplicate) {
                  drugGroup.push(drugType);
                }

                console.log('New Array is: ' + drugGroup + ' ' + Array.isArray(drugGroup));

                //Design a dynamic card collection that shows the result in a systematic way.

                var result = '<div class="list-group">' +
                  '<a href="#" class="glass list-group-item list-group-item-action">' +
                  // '<p> Disease: ' + database.symptom[i].disease + '</p>' +
                  '<p> Drug name: ' + database.symptom[i].drugs[j].name + ' (' + database.symptom[i].drugs[j].generic + ')' + '</p>' +
                  '<p> Pediatric Dose: ' + database.symptom[i].drugs[j].pediatric_dose + '</p>' +
                  '</a>'

                resultDiv.innerHTML += result;
              }
            }
          }
          // Prevent scrolling up when list group is clicked.
          var listGroupItems = document.querySelectorAll(".list-group-item");

          // Attach a click event listener to each list-group item
          listGroupItems.forEach(function (item) {
            item.addEventListener("click", function (event) {
              // Prevent the default scrolling behavior
              event.preventDefault();

              // Add your custom logic here

              // For example, you can perform some action or toggle a class on the clicked item
              item.classList.toggle("active");
            });
          });
        }
      }
    })
    .catch(error => {
      console.log('Error fetching data:', error);
    });
}
