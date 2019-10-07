// Create AJAX request
var req = new XMLHttpRequest();

req.open("GET", "/get-data", true);

req.setRequestHeader('Content-Type', 'application/json');

// Add Event Listener to check valid status
req.addEventListener('load',function(){

  if(req.status >= 200 && req.status < 400){

    createTable(JSON.parse(req.responseText));
  
  }
 
 });

req.send();

//Create table
function createTable(dataArray){

  var tableDiv = document.getElementById("doc-table");

  if(tableDiv.firstChild != null){

    tableDiv.removeChild(tableDiv.firstChild);
  }
  //Create exercise table 
  var table = document.createElement("table");

  // Create header row
  var headRow = document.createElement("tr");
  var headCell1 = document.createElement("th");
  var headCell2 = document.createElement("th");
  var headCell3 = document.createElement("th");
  var headCell4 = document.createElement("th");
  var headCell5 = document.createElement("th");
  var headCell6 = document.createElement("th");
  var headCell7 = document.createElement("th");

  // Populate header cells with appropriate titles
  headCell1.innerText = "Patient First Name";
  headRow.appendChild(headCell1);
  headCell2.innerText = "Patient Last Name";
  headRow.appendChild(headCell2);
  headCell3.innerText = "Date";
  headRow.appendChild(headCell3);
  headCell4.innerText = "Time";
  headRow.appendChild(headCell4);
  headCell5.innerText = "Kind";
  headRow.appendChild(headCell5);
  headRow.appendChild(headCell6);
  headRow.appendChild(headCell7);

  table.appendChild(headRow);

  // For each exercise returned in array, add a row with exercise information

  dataArray.forEach(function(row){
    var dataRow = document.createElement("tr");
    var dateCell = document.createElement("td");
    var nameCell = document.createElement("td");
    var repCell = document.createElement("td");
    var weightCell = document.createElement("td");
    var unitCell = document.createElement("td");
    var editCell = document.createElement("td");
    var deleteCell = document.createElement("td");

    if(row["date"] != null){
      dateCell.innerText = row["date"].substring(0,10);
    }
    dataRow.appendChild(dateCell);
    nameCell.innerText = row["patient_first_name"];
    dataRow.appendChild(nameCell);
    repCell.innerText = row["patient_last_name"];
    dataRow.appendChild(repCell);
    weightCell.innerText = row["date"];
    dataRow.appendChild(weightCell);
    
      // DOM creation of Edit option button
      var form = document.createElement('form');
        var inputId = document.createElement('input');
          inputId.setAttribute('type',"hidden");
          inputId.setAttribute('value',row["id"]);
        var button = document.createElement('input');
          button.setAttribute('type',"button");
          button.setAttribute('value', "Edit");
          button.setAttribute('class', "edit");
        form.appendChild(inputId);
        form.appendChild(button);
      editCell.appendChild(form);
    dataRow.appendChild(editCell);

      // DOM creation of Delete option button
    var form = document.createElement('form');
      var inputId = document.createElement('input');
        inputId.setAttribute('type',"hidden");
        inputId.setAttribute('value',row["id"]);
      var button = document.createElement('input');
        button.setAttribute('type',"button");
        button.setAttribute('value', "Delete");
        button.setAttribute('class', "delete");
      form.appendChild(inputId);
      form.appendChild(button);
    deleteCell.appendChild(form);
    dataRow.appendChild(deleteCell);

    table.appendChild(dataRow);
  });
  tableDiv.appendChild(table);

  // Add click functions to edit buttons
  var editButtons = document.getElementsByClassName("edit");
  for (var i = 0; i < editButtons.length; i++) {
      editButtons[i].addEventListener('click', editEvent, false);
  }

  // Add click functions to delete buttons
  var deleteButtons = document.getElementsByClassName("delete");
  for (var i = 0; i < deleteButtons.length; i++) {
      deleteButtons[i].addEventListener('click', deleteEvent, false);
  }
}

// Clicking to add exercise will send payload of information to store
document.getElementById("addTime").addEventListener("click", function(e){
  var req = new XMLHttpRequest();
  var payload = {date:null, docname:null, patname:null, time:null};
    payload.date = document.getElementById('new-date').value || null;
    document.getElementById('new-date').value = null;
    payload.docname = document.getElementById('new-name').value || null;
    document.getElementById('new-name').value = null;
    payload.patname = document.getElementById('new-patient').value || null;
    document.getElementById('new-patient').value = null;
    payload.time = document.getElementById('new-time').value || null; 

    if(payload.docname == null){
      alert("Doctor name missing. Try Again!");
      e.preventDefault();
      return;
    }
  req.open("POST", "/add", true);
  req.setRequestHeader('Content-Type', 'application/json');

  req.addEventListener('load',function(){
    if(req.status >= 200 && req.status < 400){
      createTable(JSON.parse(req.responseText));
    }
    else {
        console.log("Error in network request: " + req.statusText);
      }
  });
  req.send(JSON.stringify(payload));
  e.preventDefault();
});

// After update button is clicked, send values to update database
function updateEvent(event){
  var id = this.previousSibling.value;
  var req = new XMLHttpRequest();
  var payload = {id:null, date:null, docname:null, patname:null, weight:null};
    payload.date = document.getElementById('update-date').value || null;
    payload.docname = document.getElementById('update-name').value;
    payload.patname = document.getElementById('update-patname').value || null;
    payload.time = document.getElementById('update-time').value || null;
    payload.id = id;
  req.open("POST", "/update", true);
  req.setRequestHeader('Content-Type', 'application/json');

  req.addEventListener('load',function(){
    if(req.status >= 200 && req.status < 400){
      createTable(JSON.parse(req.responseText));
    }
    else {
        console.log("Error in network request: " + req.statusText);
      }
  });
  req.send(JSON.stringify(payload));
  event.preventDefault();
}

// If an edit button is clicked, make the selected row ready to edit 
function editEvent(event){
  var updateButtons = document.getElementsByClassName("update");
  if(updateButtons.length > 0){
      alert("Finish modifying before continuing");
      return;
  }
  var curRow = this.parentElement.parentElement.parentElement; 
  // Replace date field -> form input
  var dateInput = document.createElement("input");
  dateInput.setAttribute("value",curRow.children[0].innerText);
  dateInput.setAttribute("type", "date");
  dateInput.setAttribute("id","update-date");
  curRow.children[0].innerText = "";
  curRow.children[0].appendChild(dateInput);

  // Replace name field -> form input
  var nameInput = document.createElement("input");
  nameInput.setAttribute("value",curRow.children[1].innerText);
  nameInput.setAttribute("type", "text");
  nameInput.setAttribute("id","update-name");
  curRow.children[1].innerText = "";
  curRow.children[1].appendChild(nameInput);

  // Replace reps field -> form input
  var repInput = document.createElement("input");
  repInput.setAttribute("value",curRow.children[2].innerText);
  repInput.setAttribute("type", "text");
  repInput.setAttribute("id","update-patname");
  curRow.children[2].innerText = "";
  curRow.children[2].appendChild(repInput);

  // Replace weight field -> form input
  var weightInput = document.createElement("input");
  weightInput.setAttribute("value",curRow.children[3].innerText);
  weightInput.setAttribute("type", "number");
  weightInput.setAttribute("id","update-time");
  weightInput.setAttribute("class","num-input");
  curRow.children[3].innerText = "";
  curRow.children[3].appendChild(weightInput);

  // Replace edit button -> update button
var id = this.previousSibling.value;
  curRow.children[5].innerHTML = '';
  var form = document.createElement('form');
  var updateButton = document.createElement('form');
  var inputId = document.createElement('input');
    inputId.setAttribute('type',"hidden");
    inputId.setAttribute('value',id);
  var button = document.createElement('input');
    button.setAttribute('type',"button");
    button.setAttribute('value', "Update");
    button.setAttribute('class', "update");
  form.appendChild(inputId);
  form.appendChild(button);
  curRow.children[5].appendChild(form);

  // Add click event to newest update button
  button.addEventListener("click", updateEvent, false);
  event.preventDefault();
}

// When a delete button is clicked, send that button's data to server to be deleted
function deleteEvent(event){
  var req = new XMLHttpRequest();
  var id = this.previousSibling.value;
  var payload = {"id":id};
  req.open("POST", "/delete", true);
  req.setRequestHeader("Content-Type","application/json");
  req.addEventListener("load",function(){
    if(req.status >= 200 && req.status < 400){
      createTable(JSON.parse(req.responseText));
    }
    else {
        console.log("Error in network request: " + req.statusText);
      }
  });
  req.send(JSON.stringify(payload));
  event.preventDefault();
}