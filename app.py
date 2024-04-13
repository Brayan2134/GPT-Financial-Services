import os
from openai import OpenAI

# Initialize the OpenAI client with the API key from the environment
client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

def chat_with_openai():
    conversation = []
    print("You can start chatting with OpenAI (type 'quit' to stop):")

    while True:
        user_input = input("You ('quit' to exit): ")
        if user_input.lower() == 'quit':
            break

        # Append the user's message to the conversation history
        conversation.append({"role": "user", "content": user_input})

        # Create a chat completion
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=conversation
        )

        # Properly accessing the response object
        if response.choices and response.choices[0].message:
            assistant_message = response.choices[0].message.content  # Access using the .content attribute
            print("AI:", assistant_message)
            # Append the assistant's message to the conversation history
            conversation.append({"role": "system", "content": assistant_message})
        else:
            print("AI: No response generated.")

if __name__ == "__main__":
    chat_with_openai()
