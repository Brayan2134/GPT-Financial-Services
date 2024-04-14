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
    

        // Function to handle the click event on the 'Send' button
        $('#submit-question').click(function() {
            var userInput = $('#user-input').val().trim();
            if(userInput) {
                // Clear the input field and add the user message to the chat log
                $('#user-input').val('');
                addMessage(userInput, 'user');
                
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
                }, 500); // The delay before sending the question can be adjusted as needed
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
        // Before appending a new message, hide the typing indicator temporarily.
        $('#typing-indicator').hide();
        
        var messageClass = sender === 'user' ? 'user-message' : 'gpt-message';
        var messageHTML = '<div class="chat-message ' + messageClass + '"><span>' + text + '</span></div>';
        $('#chat-log').append(messageHTML);
        
        // After adding a new message, move the typing indicator to the end and show it if needed.
        $('#chat-log').append($('#typing-indicator'));
        
        // If the GPT is expected to respond, show the typing indicator.
        if (sender === 'user') {
            $('#typing-indicator').show();
        }
    
        $('#chat-log').scrollTop($('#chat-log')[0].scrollHeight); // Auto-scroll to the latest message
    }
});
