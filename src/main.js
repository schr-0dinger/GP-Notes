document.addEventListener('DOMContentLoaded', () => {
  // Event listener for search bar
  document.getElementById('searchbar').addEventListener('keyup', fetchData);
});

// Function to fetch data from JSON file
function fetchData() {
  fetch('src/data.json')
    .then(response => response.json())
    .then(database => {
      const input = document.getElementById('searchbar').value.toLowerCase();
      const resultDiv = document.getElementById('resultbox');
      resultDiv.innerHTML = ''; // Clear previous results

      database.symptom.forEach(symptom => {
        if (symptom.disease) {
          const disease = symptom.disease.toLowerCase();

          // Results are formatted here
          if (input === '' || input.length === 1) {
            resultDiv.innerHTML = '';
          } else {
            if (disease.includes(input)) {
              const drugList = symptom.drugs
                ? symptom.drugs
                  .map(drug => drug.generic)
                  .filter((drug, index, array) => array.indexOf(drug) === index)
                  .map(
                    drugfn => `
                        <div class="list-group">
                          <a href="#" class="format transparent list-group-item list-group-item-action">
                            <p>${drugfn}</p>
                          </a>
                        </div>
                      `
                  )
                  .join('')
                : '';

              const result = `
                <div id="accordion"> 
                  <div class="card glass format">
                    <div class="card-header">
                      <a id="resultbox" class="collapsed btn" data-bs-toggle="collapse" href="#${disease.replace(/\s/g, '').replace(/\//g, '')}Id">
                        ${symptom.disease.toUpperCase()}
                      </a>
                    </div>
                    <div id="${disease.replace(/\s/g, '').replace(/\//g, '')}Id" class="collapse" data-bs-parent="#accordion">
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
                            ${symptom.treatment}
                          </div>
                          <div id="drug" class="container tab-pane fade"><br>
                            ${drugList}
                          </div>
                          <div id="pediatricdose" class="container tab-pane fade"><br>
                            ${symptom.drugs && symptom.drugs[0].pediatric_dose}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              `;

              resultDiv.innerHTML += result;

              // Prevent scrolling when list-group-item is clicked
              document.querySelectorAll('.list-group-item').forEach(item => {
                item.addEventListener('click', event => {
                  event.preventDefault();
                });
              });

            }
          }
        } else {
          console.log('Disease property not found or undefined.');
        }
      });
    })
    .catch(error => {
      console.log('Error fetching data:', error);
    });

}