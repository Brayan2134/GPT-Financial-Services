$(document).ready(function() {

    // Initially disable the send button, input field, and clear conversation link
    $('#submit-question').prop('disabled', true);
    $('#user-input').prop('disabled', true);
    $('#clear-conversation').addClass('disabled');

    // Insert terms acceptance message into the conversation box with full width
    $('#chat-log').append(`
        <div id="termsMessage" class="alert alert-warning">
            <i class="fas fa-exclamation-triangle"></i>
            <span>Please accept our terms to use this service for entertainment purposes only.</span>
            <button id="acceptTerms" class="btn btn-primary">Accept</button>
        </div>
    `);

    // Handle acceptance of terms and update message
    $('#acceptTerms').click(function() {
        $('#termsMessage').remove();
        $('#chat-log').append('<div class="alert alert-success"><i class="fas fa-check-circle"></i> Thank you for accepting the terms!</div>');
        setTimeout(function() { 
            $('.alert-success').fadeOut('slow', function() { 
                $(this).remove(); 
                $('#chat-log').append('<div class="chat-message gpt-message"><span>Hello and welcome to GPT Financial Services, how can I help you?</span></div>');
                $('#chat-log').scrollTop($('#chat-log')[0].scrollHeight);
            }); 
        }, 500);
        $('#submit-question').prop('disabled', false);
        $('#user-input').prop('disabled', false);
    });

    // Function to handle the click event on the 'Send' button
    $('#submit-question').click(function() {
        var userInput = $('#user-input').val().trim();
        if(userInput) {
            // Clear the input field and add the user message to the chat log
            $('#user-input').val('');
            addMessage(userInput, 'user');
            // Re-enable the clear conversation link when a new message is sent
            $('#clear-conversation').removeClass('disabled');
            
            // Show the typing indicator
            $('#typing-indicator').show();

            // Simulate a slight delay as if the server is processing the question
            setTimeout(function() {
                // Make the AJAX request to your backend
                $.ajax({
                    url: 'http://localhost:5000/ask',
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify({ question: userInput }),
                    success: function(response) {
                        // Upon success, hide the typing indicator and display the response
                        $('#typing-indicator').hide();
                        addMessage(response.answer, 'gpt');
                    },
                    error: function(xhr, status, error) {
                        // On error, hide the typing indicator and show an error message
                        $('#typing-indicator').hide();
                        addMessage("Error connecting to server. Please try again later or refresh the page!", 'gpt');
                    }
                });
            }, 500);
        }
    });

    // Handle pressing enter to send message
    $('#user-input').keypress(function(event) {
        if (event.which == 13) {
            event.preventDefault();
            $('#submit-question').click();
        }
    });

    // Function to add messages to the chat log
    function addMessage(text, sender) {
        $('#typing-indicator').hide();
        var messageClass = sender === 'user' ? 'user-message' : 'gpt-message';
        var messageHTML = '<div class="chat-message ' + messageClass + '"><span>' + text + '</span></div>';
        $('#chat-log').append(messageHTML);
        $('#chat-log').append($('#typing-indicator'));
        $('#chat-log').scrollTop($('#chat-log')[0].scrollHeight);
    }

    // Clear conversation button/link handler
    $('#clear-conversation').click(function(event) {
        // Prevent click if the link is disabled
        if($(this).hasClass('disabled')) {
            event.preventDefault();
            return;
        } else {
            $('#chat-log').empty(); // Clear the chat log
            $(this).addClass('disabled'); // Disable the link after clearing the chat
            $('#chat-log').append('<div class="chat-message gpt-message"><span>Hello and welcome to GPT Financial Services, how can I help you?</span></div>');
        }
    });
});