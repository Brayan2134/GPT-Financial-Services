import os
from flask import Flask, request, jsonify, session, send_from_directory
from flask_cors import CORS
from openai import OpenAI
from flask_session import Session

# Initialize the Flask application
app = Flask(__name__, static_folder='website_resources')
CORS(app)


# Serve your main page
@app.route('/')
def index():
    return send_from_directory(app.root_path, 'index.html')


# Session configuration for storing conversation history
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

# Initialize the OpenAI client with the API key from the environment
client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))


@app.route('/reset_session', methods=['POST'])
def reset_session():
    session.clear()  # This clears all data in the session
    return 'Session cleared', 200


@app.route('/ask', methods=['POST'])
def ask():
    try:
        # Extract the user's message from the POST request
        data = request.json
        user_input = data.get('question')

        # Initialize or retrieve conversation history from the session
        if 'history' not in session:
            session['history'] = [
                {"role": "system", "content": "You are a seasoned financial advisor employed by a large, prestigious "
                                              "financial corporation. Your role is to provide technical financial "
                                              "advice that is accurate and informed, yet easy for clients to "
                                              "understand. Utilize your expertise to deliver recommendations that are "
                                              "detailed and well-substantiated, ensuring they meet high standards of "
                                              "professionalism and are accessible to clients without specialized "
                                              "financial knowledge. Below are some requirements response requirements"
                                              "for you."
                                              "1. UNDER NO CIRCUMSTANCES WILL YOU EVER SAY ANYTHING ALONG THE LINES "
                                              "OF 'CONSULT A FINANCIAL ADVISOR' AS THE USER ALREADY KNOWS THAT!!!!!"
                                              "2. ASK A FOLLOWUP QUESTION AT THE END OF MESSAGE "
                                              "BASED ON THE USER INPUT. FOR EXAMPLE, IF THE USER ASKS "
                                              "'What are stocks and bonds?', YOU SHOULD ASK 'Are you looking "
                                              "to build a portfolio of stocks and bonds?'"
                                              "THAT THIS MESSAGE IS ALWAYS BOLDED. FOR EXAMPLE, **Are there specific"
                                              "financial goals that you had in mind?** SHOULD BE SAID IF THE USER ASKS"
                                              "'I want to learn to invest'."
                                              ""}
            ]

        # Append the new user message to the history
        session['history'].append({"role": "user", "content": user_input})

        # Create a chat completion using the client instance
        context_to_send = session['history'][-25:]  # Limiting to last 25 interactions
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",  # Note: Consider using gpt-4-turbo if applicable???
            messages=context_to_send
        )

        # Access the content of the message directly
        assistant_message = response.choices[0].message.content

        # Append the assistant's response to the history
        session['history'].append({"role": "assistant", "content": assistant_message})

        # Return the response as JSON
        return jsonify({'answer': assistant_message})
    except Exception as e:
        # Log the exception and return an error message
        app.logger.error(f"An error occurred: {str(e)}")
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)
    # app.run(debug=True)  # Debug mode should only be used for development
