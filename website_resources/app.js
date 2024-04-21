$(document).ready(function() {
    // Function to check and load the chat history from local storage when the page loads.
    function loadChatHistory() {
        // Retrieve chat history from local storage.
        var storedChat = localStorage.getItem('chatHistory');
        // Check if there is any stored chat.
        if (storedChat) {
            // If chat history exists, populate the chat log with stored content.
            $('#chat-log').html(storedChat);
            // Enable the send button, input field, and clear conversation link as chat history is present.
            $('#submit-question').prop('disabled', false);
            $('#user-input').prop('disabled', false);
            $('#clear-conversation').removeClass('disabled');
        } else {
            // If no chat history exists, display the terms acceptance message.
            showTermsMessage();
        }
    }

    // Function to display the terms acceptance message.
    function showTermsMessage() {
        $('#chat-log').append(`
            <div id="termsMessage" class="alert alert-warning">
                <i class="fas fa-exclamation-triangle"></i>
                <span>Please accept our terms to use this service for entertainment purposes only.</span>
                <button id="acceptTerms" class="btn btn-primary">Accept</button>
            </div>
        `);
        // Disable the send button, input field, and clear conversation link until terms are accepted.
        $('#submit-question').prop('disabled', true);
        $('#user-input').prop('disabled', true);
        $('#clear-conversation').addClass('disabled');
    }

    // Function to update the chat history in local storage.
    function updateLocalStorage() {
        // Get the current HTML content of the chat log.
        var currentChat = $('#chat-log').html();
        // Store the current chat log into local storage.
        localStorage.setItem('chatHistory', currentChat);
    }

    // Initially disable interaction until terms are accepted or chat is loaded from local storage.
    $('#submit-question').prop('disabled', true);
    $('#user-input').prop('disabled', true);
    $('#clear-conversation').addClass('disabled');

    // Event delegation for dynamically created 'Accept Terms' button.
    $(document).on('click', '#acceptTerms', function() {
        // Remove the terms message.
        $('#termsMessage').remove();
        // Display a success message after accepting terms.
        $('#chat-log').append('<div class="alert alert-success"><i class="fas fa-check-circle"></i> Thank you for accepting the terms!</div>');
        setTimeout(function() {
            // Fade out the success message and then remove it from the DOM.
            $('.alert-success').fadeOut('slow', function() {
                $(this).remove();
                // After fading out the success message, display the welcome message.
                $('#chat-log').append('<div class="chat-message gpt-message"><span>Hello and welcome to GPT Financial Services, how can I help you?</span></div>');
                // Scroll the chat log to the newest message.
                $('#chat-log').scrollTop($('#chat-log')[0].scrollHeight);
                // Update the local storage to include the welcome message.
                updateLocalStorage();
            });
        }, 500);
        // Enable the send button, input field, and clear conversation link after terms are accepted.
        $('#submit-question').prop('disabled', false);
        $('#user-input').prop('disabled', false);
        $('#clear-conversation').removeClass('disabled');
    });

    // Event handler for the 'Send' button click.
    $('#submit-question').click(function() {
        // Retrieve the user input and trim any leading or trailing whitespace.
        var userInput = $('#user-input').val().trim();
        // Check if the user input is not empty.
        if (userInput) {
            // Clear the input field after capturing the input.
            $('#user-input').val('');
            // Add the user message to the chat log.
            addMessage(userInput, 'user');
            // Re-enable the clear conversation link when a new message is sent.
            $('#clear-conversation').removeClass('disabled');
            // Show the typing indicator.
            $('#typing-indicator').show();
            setTimeout(function() {
                // Simulate a slight delay then send the input to the server via AJAX.
                $.ajax({
                    url: '/ask',
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify({ question: userInput }),
                    success: function(response) {
                        // Hide the typing indicator and display the server's response.
                        $('#typing-indicator').hide();
                        addMessage(response.answer, 'gpt');
                    },
                    error: function(xhr, status, error) {
                        // On error, hide the typing indicator and show an error message.
                        $('#typing-indicator').hide();
                        addMessage("Error connecting to server. Please try again later or refresh the page!", 'gpt');
                    }
                });
            }, 500);
        }
    });

    // Event handler for pressing 'Enter' key in the input field.
    $('#user-input').keypress(function(event) {
        if (event.which == 13) {
            // Prevent the default action (form submission) when 'Enter' is pressed.
            event.preventDefault();
            // Trigger the 'Send' button click programmatically.
            $('#submit-question').click();
        }
    });

    // Function to add messages to the chat log.
    function addMessage(text, sender) {
        // Hide the typing indicator before adding a new message.
        $('#typing-indicator').hide();
        // Determine the CSS class based on the sender type.
        var messageClass = sender === 'user' ? 'user-message' : 'gpt-message fade-in';
        // Replace markdown-like bold and italic syntaxes with HTML tags.
        text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        text = text.replace(/(?<!\*)\*(?!\*)\s*([^*]+?)\s*\*(?!\*)/g, '<em>$1</em>');
        // Construct the message HTML.
        var messageHTML = '<div class="chat-message ' + messageClass + '"><span>' + text + '</span></div>';
        // Append the message and the typing indicator to the chat log.
        $('#chat-log').append(messageHTML);
        $('#chat-log').append($('#typing-indicator'));
        // Scroll to the latest message.
        $('#chat-log').scrollTop($('#chat-log')[0].scrollHeight);
        // Update local storage to include the new message.
        updateLocalStorage();
    }

    // Event handler for the 'Clear conversation' link.
    $('#clear-conversation').click(function(event) {
        if ($(this).hasClass('disabled')) {
            // Prevent action if the link is disabled.
            event.preventDefault();
            return;
        } else {
            // Clear the chat log content.
            $('#chat-log').empty();
            // Re-disable the link after clearing the chat.
            $(this).addClass('disabled');
            // Remove the chat history from local storage.
            localStorage.removeItem('chatHistory');
            // Display the terms acceptance message again.
            showTermsMessage();
        }
    });

    // Load any stored chat history when the page is first loaded.
    loadChatHistory();
});
