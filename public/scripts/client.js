console.log('javascript is sourced!');

$(document).ready(function() {
  console.log('jQuery is sourced!');

  var date = new Date();
  var getDate = date.getMonth()+1 + '-' + date.getDate() + '-' + date.getFullYear();
  $('#currentDate').append(getDate);

  listToDom(); // display existing list upon application load
  completedListToDom(); // display existing completed list upon application load

  $('#newTaskBtn').on('click', function () {
    // event.preventDefault(); // enables auto-update of list on DOM after first task is added to list and Add button clicked?
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
    // location.reload(true); // force reload page automatically. quick fix for updating DOM when new task added.
  }); // end add task click function

$('.pendingTasksDiv').on('click', '#complete', function () {
  // event.preventDefault(); // enables auto-update of list on DOM after a task is marked completed?
  $('.completedTasksDiv').empty(); // refresh this div each time to prevent duplication
  var getID = {
    'id': $(this).attr('data-item')
  };
  $(this).parent().remove(); // and at the same time remove them from this pendingTasksDiv...
  console.log('this id completed: ' + $(this).attr('data-item'));
  $.ajax({
    type: 'POST',
    url: '/completeTask', // post to this URL which will change completed status to true in db
    data: getID,
    success: function () {
      completedListToDom();
      console.log ('knocked one off the list');
    } // end success function
  }); //end ajax POST request
}); // end complete button click function

$('.pendingTasksDiv').on('click', '#delete', function () {
  var getID = {
    'id': $(this).attr('data-item')
  };
  var confirmDelete = confirm('Your conscience says: Are you sure you want to put off until tomorrow what you can do today?');
  if (confirmDelete) {
    $(this).parent().remove(); // remove task from DOM
    $.ajax({
      type: 'POST',
      url: '/deleteTask', // post to this URL which will delete task from db table
      data: getID,
      success: function () {
        console.log('task no longer necessary');
      } // end success function
    }); //end ajax POST request
  } else {
    alert ('Good choice - your momma would be proud!');
  }// end if statement
}); // end delete button click function

// clear lists on DOM and clear db table
$('#startOver').click(function () {
  $('.completedTasksDiv').empty();
  $('.pendingTasksDiv').empty();
     $.ajax({
       type: 'POST',
       url: '/startOver', // post to this URL to clear db table completely
       success: function () {
         console.log('starting fresh!');
       } // end success function
     }); // end ajax POST request
}); // end clearAll button click function

}); // end doc ready function



// global functions
function displayCurrentList (list) {
  for (i=0; i<list.length; i++) {
    // populate DOM with data from db and complete/delete buttons for each task
    var createDiv = $('.pendingTasksDiv').append('<div data-item="'+list[i].id+'">'+'</div>');
    var displayTask = createDiv.append('<p><input type="checkbox" id="complete" data-item="'+list[i].id+'">'+list[i].task+'<button type="button" id="delete" data-item="'+list[i].id+'">—'+'</button></p>');
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

function displayCompletedList (list) {
  for (i=0; i<list.length; i++) {
    // populate DOM with data from db and complete/delete buttons for each task
    var createNewDiv = $('.completedTasksDiv').append('<div data-item="'+list[i].id+'">'+'</div>');
    var uniqueTaskDiv = $('<p>'+list[i].task+'</p>');
    var displayDoneTask = createNewDiv.append(uniqueTaskDiv);

    uniqueTaskDiv.css('text-decoration', 'line-through').css('opacity', '0.60'); // change visual rep of completed task on FE (only text of task, not whole list)
  } // end for loop
} // end displayCompletedList function

function completedListToDom () {
  $.ajax({
    type: 'GET',
    url: '/getCompletedList',
    success: function (data) {
      displayCompletedList (data);
    } // end success function
  }); //end ajax GET request
} // end completedListToDom function
