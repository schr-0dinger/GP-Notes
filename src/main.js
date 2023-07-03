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

      var [drugGroup, drugName, drugList] = [[], [], []];

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

            // resultDiv.innerHTML += '<a href=# class="list-group-item">' + database.symptom[i].disease.toUpperCase() + '</a>';
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
                drugName.push(database.symptom[i].drugs[j].generic);

                var uniqueDrugName = [...new Set(drugName)];

                var drugList = uniqueDrugName.map(function(drugfn) {
                  return '<div class="list-group"><a href="#" class="format transparent list-group-item list-group-item-action">' +
                    '<p>' + drugfn + '</p></a></div>';
                });
                            
              
                // console.log('New Array is: ' + drugGroup + ' ' + Array.isArray(drugGroup));

                //Design a dynamic card collection that shows the result in a systematic way.

                var result = `
                <div id="accordion"> 
<div class="card glass format">
    <div class="card-header">
        <a id="resultbox" class="collapsed btn" data-bs-toggle="collapse" href="#${database.symptom[i].disease.toLowerCase().replace(/\s/g, "").replace(/\//g, "")}Id">
        ${database.symptom[i].disease.toUpperCase()}
        </a>
    </div>
    <div id="${database.symptom[i].disease.toLowerCase().replace(/\s/g, "").replace(/\//g, "")}Id" class="collapse" data-bs-parent="#accordion">
        <div class="card-body">
            <ul class="nav nav-pills justify-content-evenly" role="tablist">
                <li class="nav-item">
                    <a class="nav-link active" data-bs-toggle="pill" href="#treatment">Treatment</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" data-bs-toggle="pill" href="#drug">Drugs</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" data-bs-toggle="pill" href="#pediatricdose">Pediatric dose</a>
                </li>
            </ul>
            <div class="tab-content">
                <div id="treatment" class="container tab-pane active"><br>
                    ${database.symptom[i].treatment}
                </div>
                <div id="drug" class="container tab-pane fade"><br>
                ${drugList.join('')}
                </div>
                <div id="pediatricdose" class="container tab-pane fade"><br>
                    ${database.symptom[i].drugs[j].pediatric_dose}
                </div>
            </div>
        </div>
    </div>
</div>   
</div>    
`;

              }
            }
            console.log('Unique drug array: ' + drugList + ' ' + Array.isArray(uniqueDrugName))
            resultDiv.innerHTML += result;
          }

        }
      }
    })
    .catch(error => {
      console.log('Error fetching data:', error);
    });
}
