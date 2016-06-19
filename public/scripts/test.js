console.log('javascript is sourced!');

$(document).ready(function() {
  console.log('jQuery is sourced!');
  // display current To Do list on application load
  getList();

  $('#newTaskBtn').on('click', function () {
    // event.preventDefault();
    // assemble an object (always need to do for a post call)
    $('.outputDiv').empty(); // refresh div each time so no duplicate tasks
    var task = $('#newTask').val();
    var category = $('select').val();
    var initialStatus = false;
    console.log('task added to list: ' + task + 'category: ' + category);
    var objectToSend = {
      'taskName': task,
      'categoryName': category,
      'taskStatus': initialStatus
    }; // end object being sent

    // send object created to the postRoute via an ajax request
    $.ajax({
      type: 'POST',
      url: '/postNewTask',
      data: objectToSend,
      success: function(){
        getList();
      }
    }); // end ajax request
    $('#newTask').val(''); // empty input field after a task is added by user
    // $('.outputDiv').empty(); // refresh div each time so no duplicate tasks
}); // end add task click function

  // $('#action').on('click', '', function () {
  //   console.log('clicked complete button');
  //   $(this).closest('.row').find('.outputDiv').css('text-decoration', 'line-through').css('opacity', '0.50');
  // });


  $('#action').on('click', '#complete', function () {
    var getID = {
      "id": $(this).attr('data-item')
    };
    console.log('completing this task:' + getID);

    $.ajax({
     type: 'POST',
     url: '/completeTask',
     data: getID,
     success: function (data) {
     console.log(data);
     } // end success
     }); //end ajax
   }); // end complete button click function


}); // end doc ready function







function displayCurrentList (list) {
  //  console.log( 'in displayCurrentList:' + list );
  for (i=0; i<list.length; i++) {
    //  var todoList = $('#task').append('<div>'+list[i].task+'</div>') + $('#category').append('<div>'+list[i])
    var todoList = $('#task').find('.outputDiv').append('<p>'+list[i].task+'</p>') + $('#category').find('.outputDiv').append('<p>'+list[i].category+'</p>') + $('#action').find('.outputDiv').append('<p><button type="button" id="complete" data-item="'+list[i].id+'">Complete</button><button type="button" id="delete" data-item="'+list[i].id+'">Delete</button></p>');
    console.log(list[i].id);
  } // end for loop
 } // end displayCurrentList function

function getList () {
  $.ajax({
    type: 'GET',
    url: '/getList',
    success: function (data) {
      console.log('Got the list:');
      displayCurrentList(data);
    } // end success function
  }); //end ajax request
}
