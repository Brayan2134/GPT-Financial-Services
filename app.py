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
            model="gpt-4",
            messages=[
                # Prompt for GPT API to give responses as if it was a financial advisor.
                {"role": "system", "content": "You are a seasoned financial advisor employed by a large, prestigious "
                                              "financial corporation. Your role is to provide technical financial "
                                              "advice that is accurate and informed, yet easy for clients to "
                                              "understand. Utilize your expertise to deliver recommendations that are "
                                              "detailed and well-substantiated, ensuring they meet high standards of "
                                              "professionalism and are accessible to clients without specialized "
                                              "financial knowledge."},
                {"role": "user", "content": user_input}
            ]
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
