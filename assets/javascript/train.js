


// 1. Initialize Firebase
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


$("#addTrain").click(function (event) {
  event.preventDefault();

  // Get user input and create a trainInfo object 
  var trainStart = moment($("#inputFirstTime").val().trim(), "HH:mm");

  var trainInfo = {
    name: $("#inputTrainName").val().trim(),
    destination: $("#inputDestination").val().trim(),
    firstTrain: trainStart.format("HH:mm"),
    frequency: $("#inputFrequency").val()
  }
  console.log(trainInfo);

  // // Write trainInfo object to database
  database.ref("trainSchedule").push(trainInfo);

  // Clear the input fields
  // $("#inputTrainName").val("");
  // $("#inputDestination").val("");
  // $("#inputFirstTime").val("");
  // $("#inputFrequency").val("");

});

database.ref("trainSchedule").on("child_added", function (childSnapshot) {

  // Log everything that's coming out of snapshot
  console.log(childSnapshot.val().name);
  console.log(childSnapshot.val().destination);
  console.log(childSnapshot.val().firstTrain);
  console.log(childSnapshot.val().frequency);
  console.log("----------------------------");

  var trainInfo = {
    name: childSnapshot.val().name,
    destination: childSnapshot.val().destination,
    firstTrain: childSnapshot.val().firstTrain,
    frequency: childSnapshot.val().frequency
  }

  var fTrain = moment(trainInfo.firstTrain, "HH:mm");
  var diffMins = moment().diff(fTrain,'minutes');
  var timeToDepart = trainInfo.frequency - (diffMins % trainInfo.frequency);
  var nextDepart = moment().add(timeToDepart, 'minutes').format("HH:mm");

  var trainRow = $("<tr>").append(
    $("<td>").text(trainInfo.name),
    $("<td>").text(trainInfo.destination),
    $("<td>").text(nextDepart),
    $("<td>").text(timeToDepart),
    $("<td>").text("")
  )

  $("#trainSchedule").append(trainRow);

  // Handle the errors
}, function (errorObject) {
  console.log("Errors handled: " + errorObject.code);
});


$(document).ready(function () {
  var curTime = moment().format('LT');
  $("#currenTime").text(curTime);
});
