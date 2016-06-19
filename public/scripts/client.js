console.log('javascript is sourced!');

$(document).ready(function() {
  console.log('jQuery is sourced!');
  // display existing To Do list upon application load
  listToDom();

  $('#newTaskBtn').on('click', function () {
    // event.preventDefault();
    $('.outputDiv').empty(); // refresh div each time
    // assemble an object (always need to do this for a POST call)
    var task = $('#newTask').val();
    var category = $('select').val();
    var initialStatus = false;
    // console.log('task added to list: ' + task + 'category: ' + category);
    var objectToSend = {
      'taskName': task,
      'categoryName': category,
      'taskStatus': initialStatus
    }; // end objectToSend
    // send object to /postNewTask via ajax request
    $.ajax({
      type: 'POST',
      url: '/postNewTask',
      data: objectToSend,
      success: function () {
        listToDom(); // after db is updated, immediately display updated list on DOM
      } // end success function
    }); // end ajax POST request
    $('#newTask').val(''); // empty input field after a task is added by user
  }); // end add task click function

  $('#action').on('click', '#complete', function () {
    var getID = {
      "id": $(this).attr('data-item') // set id property to the clicked button's data-item attribute (its unique db id #)
    };
    // console.log('completing this task:' + getID);

    $(this).closest('.row').find('.outputDiv').css('text-decoration', 'line-through').css('opacity', '0.50');

    $.ajax({
     type: 'POST',
     url: '/completeTask', // post to this URL which will update completed status in db
     data: getID,
     success: function (data) {
       console.log(data);
     } // end success function
   }); //end ajax POST request
   }); // end complete button click function

}); // end doc ready function

// global functions
function displayCurrentList (list) {
  //  console.log( 'in displayCurrentList:' + list );
  for (i=0; i<list.length; i++) {
    // populate DOM with data from db and complete/delete buttons for each task
    var todoList = $('#task').find('.outputDiv').append('<p>'+list[i].task+'</p>') + $('#category').find('.outputDiv').append('<p>'+list[i].category+'</p>');
    var taskButtons = $('#action').find('.outputDiv').append('<p><button type="button" id="complete" data-item="'+list[i].id+'">Complete'+'</button><button type="button" id="delete" data-item="'+list[i].id+'">Delete'+'</button></p>');
  } // end for loop
} // end displayCurrentList function

function listToDom () {
  $.ajax({
    type: 'GET',
    url: '/getList',
    success: function (data) {
      displayCurrentList(data);
    } // end success function
  }); //end ajax request
} // end listToDom function
