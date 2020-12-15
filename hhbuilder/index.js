//Individual class used to create each person added to household

function Individual(age, relationship, isSmoker) {
  this.id = individualId;
  this.age = age;
  this.relationship = relationship;
  this.isSmoker = isSmoker;
}

var individualId = 0;

Individual.prototype.validateEntry = function() {
  var error = false;

  if (isNaN(this.age)) {
    alert("age should be a number")
    error = true;
  } else if (this.age <= 0) {
    alert("age should be more than 0");
    error = true;
  }

  if (!this.relationship) {
    alert("relationship is required");
    error = true;
  }

  return error;
};


 //HouseholdManager holds each individual created and serializes household

function HouseholdManager() {
  this.individuals = [];
}

HouseholdManager.prototype.addIndividual = function(individual) {
  var errors = individual.validateEntry();

  if (errors) {
    throw "see alert for error";
  }

  this.individuals.push(individual);
  individualId = individualId + 1;
};

HouseholdManager.prototype.removeIndividual = function(individualId) {
  var index = this.individuals.findIndex(function(individual) {
    return individual.id === individualId;
  });

  this.individuals.splice(index, 1);
};

HouseholdManager.prototype.serialize = function() {
  return JSON.stringify(this.individuals.map(function(individual) {
    return {age: individual.age, relationship: individual.relationship, isSmoker: individual.isSmoker };
  }), null, 2);
}


//  Manage DOM, HTML, and event listeners

function FormManager () {
  this.addButton = document.querySelector("button.add");
  this.submitButton = document.querySelector("button[type='submit']:not(.add)");
  this.resultsArea = document.querySelector("pre.debug");

  //form handlers
  this.formElement = document.querySelector("form");
  this.relationshipInput = document.querySelector("form select[name=rel]");
  this.smokerInput = document.querySelector("form input[name=smoker]");
  this.ageInput =  document.querySelector("form input[name=age]");
  this.debugArea = document.querySelector("pre.debug");
  this.householdList = document.querySelector("ol.household");
  this.householdManager = new HouseholdManager();

  // Error list handler

  this.errorList = document.createElement("div");
  this.errorList.setAttribute("id", "error-list");

  this.formElement.insertBefore(this.errorList, this.formElement.firstChild);
}

// Event handlers
FormManager.prototype.handleAddIndividual = function(e) {

  e.preventDefault();

  var age = this.ageInput.value;
  var relationship =  this.relationshipInput.value;
  var isSmoker = this.smokerInput.checked;


  try {
    this.householdManager.addIndividual(
      new Individual(age, relationship, isSmoker)
    );

    this.clearForm();
    this.renderList();
  } catch (e) {
    console.log(e);
  }

}

FormManager.prototype.handleDelete = function(e) {
  var id = e.target.parentElement.getAttribute("id");
  this.householdManager.removeIndividual(parseInt(id));
  this.renderList();
}

FormManager.prototype.handleSubmit = function(e) {
  e.preventDefault();
  var serialize = this.householdManager.serialize();
  this.debugArea.innerText = serialize;
  this.resultsArea.style.display = "block";
}


// Builds the HTML for the list

FormManager.prototype.renderList = function() {

  this.householdList.innerHTML = "";

  for (var i = 0; i < this.householdManager.individuals.length; i++) {
    var individual = this.householdManager.individuals[i];

    var li = document.createElement('li');
    var age = document.createElement('span');
    var relationship = document.createElement("span");
    var isSmoker = document.createElement("span");
    var deleteButton = document.createElement("button");

    li.setAttribute("id", individual.id);
    age.innerText = "Age: " + individual.age + "; ";
    relationship.innerText = "Relationship: " + individual.relationship + "; ";
    isSmoker.innerText = "Is a smoker: " + (individual.isSmoker ? "Yes" : "No") + "  ";
    deleteButton.innerText = "Remove";

    deleteButton.onclick = this.handleDelete.bind(this);

    li.append(age);
    li.append(relationship);
    li.append(isSmoker);
    li.append(deleteButton);

    this.householdList.append(li);
  }
}

FormManager.prototype.clearForm = function() {
  this.ageInput.value = "";
  this.relationshipInput.selectedIndex = null;
  this.smokerInput.checked = false;
}

FormManager.prototype.initializeEvents = function() {
  this.addButton.onclick = this.handleAddIndividual.bind(this);
  this.submitButton.onclick = this.handleSubmit.bind(this);
}


 var formManager = new FormManager();

 formManager.initializeEvents();