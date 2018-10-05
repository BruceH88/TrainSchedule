// Define constants
var $inputTrainName = $("#inputTrainName");
var $inputDestination = $("#inputDestination");
var $inputFirstTime = $("#inputFirstTime");
var $inputFrequency = $("#inputFrequency");
var $trainSchedule = $("#trainSchedule");
var $currenTime = $("#currenTime");
var $addTrain = $("#addTrain");

// Define variables
var trainID;

// Initialize Firebase
var config = {
  apiKey: "AIzaSyBUiLjqpoq9uwgRIATnR7jDAP1RLfJrgHU",
  authDomain: "classwork-cdbee.firebaseapp.com",
  databaseURL: "https://classwork-cdbee.firebaseio.com",
  projectId: "classwork-cdbee",
  storageBucket: "classwork-cdbee.appspot.com",
  messagingSenderId: "127438239941"
};

firebase.initializeApp(config);
var database = firebase.database();

// Define functions

function addTrainToSchedule(trainInfo) {
  console.log(trainInfo);
  var fTrain = moment(trainInfo.firstTrain, "HH:mm");
  var diffMins = moment().diff(fTrain, 'minutes');
  var timeToDepart = trainInfo.frequency - (diffMins % trainInfo.frequency);
  var nextDepart = moment().add(timeToDepart, 'minutes').format("HH:mm a");

  var editBtn = $("<button class='edtBtn' data_name=" + trainInfo.name + ">").text("Edit");
  var deletetBtn = $("<button class='delBtn' data_name=" + trainInfo.name + ">").text("X");

  var trainRow = $("<tr>").append(
    $("<td>").text(trainInfo.name),
    $("<td>").text(trainInfo.destination),
    $("<td>").text(nextDepart),
    $("<td>").text(timeToDepart),
    $("<td>").append(editBtn, deletetBtn),
  )
  $trainSchedule.append(trainRow);
};

function updateSchedule() {
  $trainSchedule.empty();
  database.ref("trainSchedule").once('value', function (snapshot) {
    console.log(snapshot.val());
    for (var trainInfo in snapshot.val()) {
      addTrainToSchedule(snapshot.val()[trainInfo]);
    };
  });
};

// Define events
$("#addTrain").click(function (event) {
  event.preventDefault();
  var updateTrain = false;
  // Determine if this is an update or new train 
  if (trainID === $inputTrainName.val().trim()) {
    // Update existing train
    updateTrain = true;
  } else {
    // Add a new train
    trainID = $inputTrainName.val().trim();
  }
  var trainStart = moment($inputFirstTime.val().trim(), "HH:mm");
  var destination = $inputDestination.val().trim();
  var frequency = $inputFrequency.val();

  database.ref('trainSchedule/' + trainID).set({
    name: trainID,
    destination: destination,
    firstTrain: trainStart.format("HH:mm"),
    frequency: frequency
  });

  // Clear the input fields
  $inputTrainName.val("");
  $inputDestination.val("");
  $inputFirstTime.val("");
  $inputFrequency.val("");
  trainID = "";
  if (updateTrain) {
    updateSchedule();
  }
});

database.ref("trainSchedule").on("child_added", function (childSnapshot) {

  // // Log everything that's coming out of snapshot
  console.log(childSnapshot.val().name);
  // console.log(childSnapshot.val().destination);
  // console.log(childSnapshot.val().firstTrain);
  // console.log(childSnapshot.val().frequency);
  // console.log("----------------------------");

  var trainInfo = {
    name: childSnapshot.val().name,
    destination: childSnapshot.val().destination,
    firstTrain: childSnapshot.val().firstTrain,
    frequency: childSnapshot.val().frequency
  }
  addTrainToSchedule(trainInfo);

  // Handle the errors
}, function (errorObject) {
  console.log("Errors handled: " + errorObject.code);
});

$(document).on("click", ".edtBtn", function () {
  // get the train to update
  trainID = $(this).attr("data_name");
  database.ref("trainSchedule").orderByChild("name").equalTo(trainID).on("child_added", function (snapshot) {
    $inputTrainName.val(snapshot.val().name);
    $inputDestination.val(snapshot.val().destination);
    $inputFirstTime.val(snapshot.val().firstTrain);
    $inputFrequency.val(snapshot.val().frequency);
  });
});

$(document).on("click", ".delBtn", function () {
  // get the train to update
  trainID = $(this).attr("data_name");
  database.ref('trainSchedule/' + trainID).remove();
  updateSchedule();
});

$(document).on("click", "#clearBtn", function () {
  // Clear the input fields
  $inputTrainName.val("");
  $inputDestination.val("");
  $inputFirstTime.val("");
  $inputFrequency.val("");
  $inputTrainName.disabled = false;
  trainID = "";
});

$(document).ready(function () {
  var curTime = moment().format('LT');
  $currenTime.text(curTime);
});
