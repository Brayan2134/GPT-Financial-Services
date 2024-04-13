from flask import Flask, request, jsonify
from flask_cors import CORS
import connectToGPT  # Assuming this module has a function to talk to OpenAI

app = Flask(__name__)
CORS(app)  # This enables CORS for all domains on all routes

@app.route('/ask', methods=['POST', 'OPTIONS'])  # Ensure correct methods are allowed
def ask():
    if request.method == 'OPTIONS':  # Preflight request
        response = app.make_default_options_response()
        return response

    data = request.json
    question = data.get('question')
    answer = connectToGPT.get_response(question)  # Call your GPT function
    return jsonify({'answer': answer})

# Set up logging for debugging purposes
import logging
logging.basicConfig(level=logging.DEBUG)

if __name__ == '__main__':
    app.run(debug=True)
