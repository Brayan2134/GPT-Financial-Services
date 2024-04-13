import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI

# Initialize the Flask application
app = Flask(__name__)
CORS(app)

# Initialize the OpenAI client with the  API key from the environment
client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))


@app.route('/ask', methods=['POST'])
def ask():
    try:
        # Extract the user's message from the POST request
        data = request.json
        user_input = data.get('question')

        # Create a chat completion using the client instance
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": user_input}]
        )

        # Access the content of the message directly
        assistant_message = response.choices[0].message.content

        # Return the response as JSON
        return jsonify({'answer': assistant_message})
    except Exception as e:
        # Log the exception and return an error message
        app.logger.error(f"An error occurred: {str(e)}")
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)  # Debug mode should only be used for development
