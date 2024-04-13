from flask import Flask, request, jsonify
from flask_cors import CORS
from connectToGPT import get_response_from_gpt

app = Flask(__name__)

CORS(app)

@app.route('/ask', methods=['POST'])
def ask():
    data = request.json
    question = data.get('question')
    answer = get_response_from_gpt(question)  # This function will come from your connectToGPT.py
    return jsonify({'answer': answer})

if __name__ == '__main__':
    app.run(debug=True)
