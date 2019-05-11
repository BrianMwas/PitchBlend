


//selecting elements to animate
//arrow down in the first window is supposed to be bouncing with a specified timing interval
$(function() {
  $('.file_upload').file_upload()
  //to toggle the comment button
  $('.showComment').click(function () {
    let $card = $(this);
    $card.closest('.card')
      .find('.commentSection')
      .toggle('fast')
  })

 

  //testing the commenting toggle button

    // $('#submitComment').on('click', function (e) {
    //   e.preventDefault()
    //   var comment = $(this).closest('input').val()
    //   $.ajax({
    //     type: 'POST',
    //     url: '/post/{{post._id}}/comment',
    //     success: function () {
    //       alert(comment)
    //     },
    //     error: function () {
    //       alert('error')
    //     }
    //   })
    // })
  })
 


