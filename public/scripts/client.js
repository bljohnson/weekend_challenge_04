console.log('javascript is sourced!');

$(document).ready(function() {
  console.log('jQuery is sourced!');
  listToDom(); // display existing list upon application load

  $('#newTaskBtn').on('click', function () {
    event.preventDefault(); // enables auto-update of list on DOM after first task is added to list and Add button clicked
    $('.pendingTasksDiv').empty(); // refresh this div each time to prevent duplication
    // assemble an object (always need to do this for a POST call)
    var task = $('#newTask').val();
    var initialStatus = false; // when new task added to list, not completed
    var objectToSend = {
      'taskName': task,
      'taskStatus': initialStatus
    }; // end objectToSend
    // send object to postNewTask URL via ajax request
    $.ajax({
      type: 'POST',
      url: '/postNewTask',
      data: objectToSend,
      success: function () {
        listToDom(); // when db is successfully updated, immediately display updated list on DOM
      } // end success function
    }); // end ajax POST request
    $('#newTask').val(''); // empty input field after a task is added by user
  }); // end add task click function

$('.pendingTasksDiv').on('click', '#complete', function () {
  var getID = {
    'id': $(this).attr('data-item')
  };
  $(this).parent().css('text-decoration', 'line-through').css('opacity', '0.50'); // change visual rep of completed task on FE
  console.log('this id completed: ' + $(this).attr('data-item'));
  $.ajax({
    type: 'POST',
    url: '/completeTask', // post to this URL which will change completed status to true in db
    data: getID,
    success: function () {
      console.log ('knocked one off the list');
    } // end success function
  }); //end ajax POST request
}); // end complete button click function

$('.pendingTasksDiv').on('click', '#delete', function () {
  var getID = {
    'id': $(this).attr('data-item')
  };
  $(this).parent().remove(); // remove task from DOM
  $.ajax({
    type: 'POST',
    url: '/deleteTask', // post to this URL which will delete task from db table
    data: getID,
    success: function () {
      console.log('task no longer necessary');
    } // end success function
  }); //end ajax POST request
}); // end delete button click function

}); // end doc ready function


// global functions
function displayCurrentList (list) {
  for (i=0; i<list.length; i++) {
    // populate DOM with data from db and complete/delete buttons for each task
    var createDiv = $('.pendingTasksDiv').append('<div data-item="'+list[i].id+'">'+'</div>');
    var displayTask = createDiv.append('<p>'+list[i].task+'<button type="button" id="complete" data-item="'+list[i].id+'">Complete'+'</button><button type="button" id="delete" data-item="'+list[i].id+'">Delete'+'</button></p>');
  } // end for loop
} // end displayCurrentList function

function listToDom () {
  $.ajax({
    type: 'GET',
    url: '/getList',
    success: function (data) {
      displayCurrentList (data);
    } // end success function
  }); //end ajax GET request
} // end listToDom function


//
// function displayCompletedList (list) {
//   //  console.log( 'in displayCurrentList:' + list );
//   for (i=0; i<list.length; i++) {
//     // populate DOM with data from db and complete/delete buttons for each task
//     var createDiv = $('.completedTasksDiv').append('<div data-item="'+list[i].id+'">'+'</div>');
//     var displayTask = createDiv.append('<p>'+list[i].task+'<button type="button" id="complete" data-item="'+list[i].id+'">Complete'+'</button><button type="button" id="delete" data-item="'+list[i].id+'">Delete'+'</button></p>');
//   } // end for loop
// } // end displayCurrentList function
//
//
// function listCompletedToDom () {
//   $.ajax({
//     type: 'GET',
//     url: '/getCompletedList',
//     success: function (data) {
//       console.log('completed list posted to DOM');
//       displayCompletedList(data);
//     } // end success function
//   }); //end ajax request
// }
