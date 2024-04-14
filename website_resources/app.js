$(document).ready(function() {
    // Initially disable the send button and input field
    $('#submit-question').prop('disabled', true);
    $('#user-input').prop('disabled', true);

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
                // After the thank you message fades out, display the welcome message
                $('#chat-log').append('<div class="chat-message gpt-message"><span>Hello and welcome to GPT Financial Services, how can I help you?</span></div>');
                $('#chat-log').scrollTop($('#chat-log')[0].scrollHeight);
            }); 
        }, 500);  // Delay for the welcome message can be adjusted here
        $('#submit-question').prop('disabled', false);
        $('#user-input').prop('disabled', false);
    });
    

    // Handle the send button click
    $('#submit-question').click(function() {
        var userInput = $('#user-input').val().trim();
        if(userInput) {
            $('#user-input').val('');
            addMessage(userInput, 'user');
            $('#typing-indicator').show();
            $.ajax({
                url: 'http://localhost:5000/ask',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({ question: userInput }),
                success: function(response) {
                    $('#typing-indicator').hide();
                    addMessage(response.answer, 'gpt');
                },
                error: function(xhr, status, error) {
                    $('#typing-indicator').hide();
                    addMessage("Error connecting to server. Please try again later or refresh the page!", 'gpt');
                }
            });
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
        var messageClass = sender === 'user' ? 'user-message' : 'gpt-message';
        var messageHTML = '<div class="chat-message ' + messageClass + '"><span>' + text + '</span></div>';
        $('#chat-log').append(messageHTML);
        $('#chat-log').scrollTop($('#chat-log')[0].scrollHeight);
    }
});
