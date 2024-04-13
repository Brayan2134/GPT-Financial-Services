// app.js

$(document).ready(function() {
    $('#submit-question').click(function() {
        var userInput = $('#user-input').val();
        $('#user-input').val('');
        $('#chat-log').append('<div class="my-2 chat-message user" style="display:none;"><strong>You:</strong> ' + userInput + '</div>');
        $('.chat-message').last().fadeIn(600);
        $('#typing-indicator').show();

        $.ajax({
            url: 'http://localhost:5000/ask',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ question: userInput }),
            success: function(response) {
                $('#typing-indicator').hide();
                $('#chat-log').append('<div class="my-2 chat-message gpt" style="display:none;"><strong>ChatGPT:</strong> ' + response.answer + '</div>');
                $('.chat-message').last().fadeIn(600);
                $('#chat-log').animate({ scrollTop: $('#chat-log')[0].scrollHeight }, 1000);
            },
            error: function(xhr, status, error) {
                $('#typing-indicator').hide();
                console.error("AJAX Error: " + status + error);
            }
        });
    });

    $('#user-input').keypress(function(event) {
        if (event.which == 13) {
            event.preventDefault();
            $('#submit-question').click();
        }
    });
});
