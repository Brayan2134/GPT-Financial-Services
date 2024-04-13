import openai

openai.api_key = 'your-api-key'

def get_response(question):
    try:
        response = openai.Completion.create(
            model="text-davinci-003",
            prompt=question,
            max_tokens=150
        )
        return response.choices[0].text.strip()
    except Exception as e:
        print(f"An error occurred: {e}")
        return "There was an error processing your request."
