$(() => {
  $('#submitComment').click(() => {
    var comment = $('#comment').val()
    postComment(comment)
  })
})

 $('#refreshPosts').click(function() {
   $.ajax({
     url : '/blogs/posts',
     type : 'GET',
     success : function(data) {
       return data;
     },
     fail : function(err) {
       console.log("No" + err)
     }
    })
 })

function postComment(comment) {
  $.post('http://localhost:7000/post/:id/comment', comment)
}

//to toggle the comment button
$('.showComment').click(function() {
  let $card = $(this);
  $card.closest('.card')
        .find('.commentSection')
        .toggle('fast')

})

$('.edit-frm').css('display', 'none')

 $('#showEdit').click(function() {
    $('.edit-frm').fadeToggle()
 })


var socket = io.connect('http://localhost:7000')
socket.on('connect', function(data) {
  socket.emit('join', 'Hello!!')
})

socket.on('messages', function(data) {
  alert(data)
})

// To allow commenting without page reload using jquery ajax..


$('#sbtComment').on('click', function(event) {
  event.preventDefault()
  event.stopPropagation()
  $.ajax({
    url: `/post/${$(this).attr('data-userid')}/comment`,
    type : 'POST',
    contentType : 'application/json',
    data: JSON.stringify({comment: {"body" : $('.commentBody').val()}})
  }).done( function(result) {
    changeComments(result)
    clearInputValue('commentbdy')
  }).fail( function(err) {
    console.log(err);
  })
})


function confirmDelete() {
  alert("Are you want to delete?")
}


var changeComments = function(res) {
  var ul = document.getElementById('list-comment-section')
  ul.innerHTML = res
}

var clearInputValue = function(iv) {
  var input = document.getElementById(iv);
  input.value = ''
}
