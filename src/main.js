document.addEventListener("DOMContentLoaded", () => {
  // Event listener for search bar
  document.getElementById("searchbar").addEventListener("keyup", fetchData);

  const generatedButtons = document.querySelectorAll(
    ".accordion-item .list-group .btn"
  );
  const pediatricDoseBtn = document.getElementById("pediatricDoseBtn");

  generatedButtons.forEach((button) => {
    button.addEventListener("click", () => {
      pediatricDoseBtn.classList.remove("disabled"); // Enabled pediatric dose btn when drug name is clicked
    });
  });

  // Function to fetch data from JSON file
  function fetchData() {
    fetch("src/data.json")
      .then((response) => response.json())
      .then((database) => { // Fetch database
        var input = document.getElementById("searchbar").value.toLowerCase(); // Assign search input
        var resultDiv = document.getElementById("resultbox"); // Get HTML result box access
        resultDiv.innerHTML = ""; // Clear previous results

        for (var i = 0; i < database.symptom.length; i++) { // Iter through the whole database
          var disease = database.symptom[i].disease?.toLowerCase(); // Use optional chaining to handle undefined disease property

          // Results are formatted here
          if (input === "" || input.length === 1) { // Display results only if search input has more than 1 character
            resultDiv.innerHTML = "";
          } else {
            if (disease && disease.indexOf(input) !== -1) { // Check if disease is present in the 'i'th iteration of database
              if (database.symptom[i].drugs) {
                var drugTypeAccordion = {}; // Object to store drug types and corresponding drug names

                database.symptom[i].drugs.forEach((drug) => {
                  var drugType = drug.type[0]; // Get the drug type for the drug in the 'i'th iteration
                  var drugName = drug.generic; // Get the drug name in the 'i'th iteration

                  // Check if drug type already exists in the accordion object
                  if (drugType in drugTypeAccordion) {
                    // drugTypeAccordion is an array storing all the drug types -> Opens up to show drugs belonging to same type
                    // If drugType is not already present in drugTypeAccordion, add to that array
                    drugTypeAccordion[drugType].push(drugName); 
                  } else {
                    drugTypeAccordion[drugType] = [drugName];
                  }
                });

                // Generate accordion HTML for each drug type
                // This accordion HTML is added to the result box
                var accordionHTML = "";
                for (var type in drugTypeAccordion) { // Iters through the array drugTypeAccordion
                  var drugNames = drugTypeAccordion[type]; // Each element of the array is assigned to the variable on each iteration

                  var drugListHTML = drugNames // Drug names belonging to the same class are stored in the corresponding drugTypeAccordion
                    .map(function (drugName) {
                      if (drugName && typeof drugName === "string") {
                        const formatDrugName = drugName // Formatting the drugname so that special characters are not involved
                          .toLowerCase()
                          .replace(/[\s\/\(\)\&\+\'\"\`\:\;\<\>]/g, "")
                          .toString();
                        // Each drug name buttons are assigned a generated id based on their formatted drugName
                        return `<button type="button" id="${formatDrugName}Id"
                    class="btn btn-primary transparent white list-group-item text-start format" onclick="pedDose('${drugName}', )">${drugName}</button>`;
                      }
                    })
                    .join("");
                  /* Each accordion is generated to the number of drug types (without repetition, so that drugs belonging to the same class can be grouped together)  */
                  accordionHTML += `
                  <div class="accordion-item transparent white">
                    <div class="accordion-header">
                      <button class="accordion-button transparent white" data-bs-toggle="collapse" data-bs-target="#collapse${type.replace(
                        /[\s\/\(\)\&\+\'\"\<\>\`]/g,
                        ""
                      )}"><i class="fa-solid fa-pills fa-2xs"></i> &#160;${
                    type[0].toUpperCase() + type.substring(1)
                  }</button>
                    </div>
                    <div id="collapse${type.replace(
                      /[\s\/\(\)\&\+\'\"\<\>\`]/g,
                      ""
                    )}" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
                      <div class="accordion-body transparent">
                        <div class="list-group transparent">
                          ${drugListHTML}
                        </div>
                      </div>
                    </div>
                  </div>
                `;
                }

                // Insert the accordion HTML into the desired container element
                var result = `
                <div id="accordion${i}">
                  <div class="card glass format">
                    <div class="card-header">
                      <a id="resultbox" class="collapsed btn" data-bs-toggle="collapse" href="#${disease.replace(
                        /[\s\/\(\)\&\+\'\"\<\>\`]/g,
                        ""
                      )}Id"><i class="fa-solid fa-circle-exclamation"></i> ${
                  disease[0].toUpperCase() + disease.substring(1)
                }</a>
                    </div>
                    <div id="${disease.replace(
                      /[\s\/\(\)\&\+\'\"\<\>\`]/g,
                      ""
                    )}Id" class="collapse" data-bs-parent="#accordion${i}">
                      <div class="card-body">
                        <ul class="nav nav-pills justify-content-md-center flex-nowrap" role="tablist">
                          <li class="nav-item">
                            <a class="nav-link active" data-bs-toggle="pill" href="#treatment"><i class="fa-solid fa-stethoscope"></i> Treatment</a>
                          </li>
                          <li class="nav-item">
                            <a class="nav-link mx-md-5" data-bs-toggle="pill" href="#drug"><i class="fa-solid fa-prescription"></i> Drugs</a>
                          </li>
                          <li class="nav-item">
                            <a class="nav-link disabled" id="pediatricDoseBtn" data-bs-toggle="pill" href="#pediatricdose"><i class="fa-solid fa-baby"></i> Pediatric dose</a>
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
                          <div id="drug" class="container tab-pane fade"><br>
                            <div class="accordion accordion-flush" id="accordionExample">
                              ${accordionHTML}
                            </div>
                          </div>
                          <div id="pediatricdose" class="container tab-pane fade">
                            <div class="mb-3">
                              <label for="" id="DrugDoseHeader" class="form-label">Pediatric Dose Calculation</label>
                                <input type="number" class="form-control form-control-sm" name="" id="" aria-describedby="helpId" placeholder="Enter Weight in Kg">
                              <small id="helpId" class="form-text text-muted">Help text</small>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              `;

                resultDiv.innerHTML += result;
                // Initialize Bootstrap Collapse component
                var accordions = document.querySelectorAll(
                  '[data-bs-toggle="collapse"]'
                );
                accordions.forEach(function (accordion) {
                  new bootstrap.Collapse(accordion);
                });

                // Prevent scrolling when list-group-item is clicked
                document
                  .querySelectorAll(".list-group-item")
                  .forEach((item) => {
                    item.addEventListener("click", (event) => {
                      event.preventDefault();
                    });
                  });
              }
            }
          }
        }
      })
      .catch((error) => {
        console.log("Error fetching data:", error);
      });
  } // fetchData() function ends here.
}); //DOMContentLoaded

function pedDose(drug) {
  document.getElementById("pediatricDoseBtn").classList.remove("disabled");
  document.getElementById("DrugDoseHeader").innerHTML = `${drug} Dose Calculation`;
}

