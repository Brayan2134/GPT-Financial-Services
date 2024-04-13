import openai

openai.api_key = "asst_ZxuSXrdv3sMvGlwp5P0GY3ms"

def get_response_from_gpt(question):
    response = openai.Completion.create(
        model="gpt-3.5-turbo-0125",  # Replace with the model you're using
        prompt=question,
        max_tokens=150
    )
    return response.choices[0].text.strip()  # Adjust based on the actual response format
