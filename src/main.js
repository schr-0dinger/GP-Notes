document.addEventListener("DOMContentLoaded", () => {
  // Event listener for search bar
  document.getElementById("searchbar").addEventListener("keyup", fetchData);
});
// Function to fetch data from JSON file
function fetchData() {
  fetch("src/data.json")
    .then((response) => response.json())
    .then((database) => {
      var input = document.getElementById("searchbar").value.toLowerCase();
      var resultDiv = document.getElementById("resultbox");
      resultDiv.innerHTML = ""; // Clear previous results

      var [drugGroup, drugName, drugList] = [[], [], []];

      for (var i = 0; i < database.symptom.length; i++) {
        if (database.symptom[i].disease !== undefined) {
          var disease = database.symptom[i].disease.toLowerCase();
        } else {
          console.log("Disease property not found or undefined.");
        }

        // Results are formatted here
        if (input === "" || input.length === 1) {
          resultDiv.innerHTML = "";
        } else {
          if (disease.indexOf(input) !== -1) {
            // true if the value of "input" is found in the "disease" array or string, and false if it is not found.
            if (database.symptom[i].drugs) {
              var n = database.symptom[i].drugs.length;
              var drugTypeAccordion = {}; // Object to store drug types and corresponding drug names

              for (var j = 0; j < n; j++) {
                var drugType = database.symptom[i].drugs[j].type[0];
                var drugName = database.symptom[i].drugs[j].generic;

                // Check if drug type already exists in the accordion object
                if (drugType in drugTypeAccordion) {
                  drugTypeAccordion[drugType].push(drugName);
                } else {
                  drugTypeAccordion[drugType] = [drugName];
                }
              }

              // Generate accordion HTML for each drug type
              var accordionHTML = "";
              for (var type in drugTypeAccordion) {
                var drugNames = drugTypeAccordion[type];

                var drugListHTML = drugNames
                  .map(function (drugName) {
                    return (
                      '<a href="#" class="format transparent list-group-item list-group-item-action">' +
                      "<p>" +
                      drugName +
                      "</p></a>"
                    );
                  })
                  .join("");

                accordionHTML += `
                  <div class="accordion-item glass">
                    <h2 class="accordion-header glass">
                      <button class="accordion-button glass" data-bs-toggle="collapse" data-bs-target="#collapse${type
                        .replace(/\s/g, "")
                        .replace(/\//g, "")}">
                        ${type}
                      </button>
                    </h2>
                    <div id="collapse${type
                      .replace(/\s/g, "")
                      .replace(
                        /\//g,
                        ""
                      )}" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
                      <div class="accordion-body">
                        <div class="list-group">
                          ${drugListHTML}
                        </div>
                      </div>
                    </div>
                  </div>
                `;

                // Insert the accordion HTML into the desired container element

                var result = `
                <div id="accordion${i}"> 
<div class="card glass format">
    <div class="card-header">
        <a id="resultbox" class="collapsed btn" data-bs-toggle="collapse" href="#${database.symptom[
          i
        ].disease
          .toLowerCase()
          .replace(/\s/g, "")
          .replace(/\//g, "")}Id">
        ${database.symptom[i].disease.toUpperCase()}
        </a>
    </div>
    <div id="${database.symptom[i].disease
      .toLowerCase()
      .replace(/\s/g, "")
      .replace(/\//g, "")}Id" class="collapse" data-bs-parent="#accordion">
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
                <div id="treatment" class="container format tab-pane active"><br>
                <ol>
                ${database.symptom[i].treatment
                  .map((item) => `<li>${item}</li>`)
                  .join("")}
              </ol>
                </div>
                <div id="drug" class="container glass tab-pane fade"><br>
                ${accordionHTML}
                </div>
                <div id="pediatricdose" class="container tab-pane fade"><br>
                    
                </div>
            </div>
        </div>
    </div>
</div>   
</div>    
`;
              }
            }

            resultDiv.innerHTML += result;
            // Initialize Bootstrap Collapse component
            var accordions = document.querySelectorAll(
              '[data-bs-toggle="collapse"]'
            );
            accordions.forEach(function (accordion) {
              new bootstrap.Collapse(accordion);
            });
          }
        }
      }
    })
    .catch((error) => {
      console.log("Error fetching data:", error);
    });
}
