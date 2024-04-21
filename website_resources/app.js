$(document).ready(function() {
    // Function to load chat history from local storage.
    function loadChatHistory() {
        var storedChat = localStorage.getItem('chatHistory');
        if (storedChat) {
            $('#chat-log').html(storedChat);
            $('#submit-question').prop('disabled', false);
            $('#user-input').prop('disabled', false);
            $('#clear-conversation').removeClass('disabled');
        } else {
            showTermsMessage();
        }
        $('#typing-indicator').hide(); // Ensure typing indicator is hidden on load.
    }

    function showTermsMessage() {
        $('#chat-log').append(`
            <div id="termsMessage" class="alert alert-warning">
                <i class="fas fa-exclamation-triangle"></i>
                <span>Please accept our terms to use this service for entertainment purposes only.</span>
                <button id="acceptTerms" class="btn btn-primary">Accept</button>
            </div>
        `);
        $('#submit-question').prop('disabled', true);
        $('#user-input').prop('disabled', true);
        $('#clear-conversation').addClass('disabled');
    }

    function updateLocalStorage() {
        var currentChat = $('#chat-log').html();
        localStorage.setItem('chatHistory', currentChat);
    }

    function simulateResponse(userInput) {
        $('#typing-indicator').show(); // Show typing indicator when waiting for a response.
        setTimeout(function() {
            $.ajax({
                url: '/ask',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({ question: userInput }),
                success: function(response) {
                    addMessage(response.answer, 'gpt');
                },
                error: function(xhr, status, error) {
                    addMessage("Error connecting to server. Please try again later or refresh the page!", 'gpt');
                },
                complete: function() {
                    $('#typing-indicator').hide(); // Always hide the typing indicator after AJAX completes.
                }
            });
        }, 1000); // Simulate network delay.
    }  

    $(document).on('click', '#acceptTerms', function() {
        $('#termsMessage').remove();
        $('#chat-log').append('<div class="alert alert-success"><i class="fas fa-check-circle"></i> Thank you for accepting the terms!</div>');
        setTimeout(function() {
            $('.alert-success').fadeOut('slow', function() {
                $(this).remove();
                $('#chat-log').append('<div class="chat-message gpt-message"><span>Hello and welcome to GPT Financial Services, how can I help you?</span></div>');
                $('#chat-log').scrollTop($('#chat-log')[0].scrollHeight);
                updateLocalStorage();
            });
        }, 500);
        $('#submit-question').prop('disabled', false);
        $('#user-input').prop('disabled', false);
        $('#clear-conversation').removeClass('disabled');
    });

    $('#submit-question').click(function() {
        var userInput = $('#user-input').val().trim();
        if (userInput) {
            $('#user-input').val('');
            addMessage(userInput, 'user');
            $('#clear-conversation').removeClass('disabled');
            simulateResponse(userInput);
        }
    });

    $('#user-input').keypress(function(event) {
        if (event.which == 13) {
            event.preventDefault();
            $('#submit-question').click();
        }
    });

    function addMessage(text, sender) {
        var messageClass = sender === 'user' ? 'user-message' : 'gpt-message fade-in';
        function appendMessage(messageText) {
            if (messageText.trim() === '') return;
            var messageHTML = '<div class="chat-message ' + messageClass + '"><span>' + messageText + '</span></div>';
            $('#chat-log').append(messageHTML);
            $('#chat-log').scrollTop($('#chat-log')[0].scrollHeight);
        }
        var segments = text.split(/(\d+\.\s*\*{0,2}[^*]+?\*{0,2}\s*:)/).filter(Boolean);
        segments.forEach(segment => {
            var formattedSegment = segment
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\*(.*?)\*/g, '<em>$1</em>');
            appendMessage(formattedSegment);
        });
        updateLocalStorage();
        $('#chat-log').scrollTop($('#chat-log')[0].scrollHeight); // Ensure the chat log scrolls to the bottom after adding a new message
    }

    $('#clear-conversation').click(function(event) {
        if ($(this).hasClass('disabled')) {
            event.preventDefault();
            return;
        } else {
            $('#chat-log').empty();
            $(this).addClass('disabled');
            localStorage.removeItem('chatHistory');
            showTermsMessage();
        }
    });

    loadChatHistory();
});