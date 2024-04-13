$(document).ready(function() {
    // Initially disable the send button and input field
    $('#submit-question').prop('disabled', true);
    $('#user-input').prop('disabled', true);

   // Insert terms acceptance message into the conversation box with full width and close button aligned
   $('#chat-log').append(`
    <div id="termsMessage" class="chat-message alert alert-warning">
        <i class="fas fa-exclamation-triangle"></i> <!-- Warning icon -->
        <span>Please accept our terms to use this service for entertainment purposes only.</span>
        <button type="button" class="close">&times;</button> <!-- Close button -->
        <button id="acceptTerms" class="btn">Accept</button> <!-- Accept button -->
    </div>
    `);



    // Handle the close button for terms message
    $('.close').click(function() {
        $('#termsMessage').remove();
    });

   // Handle acceptance of terms and update message
    $('#acceptTerms').click(function() {
        $('#termsMessage')
            .removeClass('alert-warning')
            .addClass('alert-success d-flex align-items-center justify-content-between')
            .html(`
                <span class="mr-2"><i class="fas fa-check-circle"></i> Thank you!</span>
                <button type="button" class="close" data-dismiss="alert" style="font-size:1.2rem;">&times;</button>
            `);

        $('.close').click(function() {  // Make sure the close button still works after HTML change
            $('#termsMessage').remove();
        });

        setTimeout(function() { $('#termsMessage').fadeOut('slow', function() { $(this).remove(); }); }, 5000);
        $('#submit-question').prop('disabled', false);
        $('#user-input').prop('disabled', false);
    });


    // Handle the send button click
    $('#submit-question').click(function() {
        var userInput = $('#user-input').val();
        $('#user-input').val('');
        $('#chat-log').append('<div class="my-2 chat-message user" style="display:none;"><strong>You:</strong> ' + userInput + '</div>');
        $('.chat-message').last().fadeIn(600);
        $('#typing-indicator').show();

        // Send data to your server via AJAX
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
                $('#chat-log').append('<div class="my-2 chat-message gpt" style="display:none;"><strong>Error:</strong> Error connecting to server.</div>');
                $('.chat-message').last().fadeIn(600);
            }
        });
    });

    // Handle pressing enter to send message
    $('#user-input').keypress(function(event) {
        if (event.which == 13) {
            event.preventDefault();
            $('#submit-question').click();
        }
    });
});
