from groq import Groq
import os
import json
import requests
from dotenv import load_dotenv
import re
from urllib.parse import quote

load_dotenv()

api_key = os.getenv("GROQ_API_KEY")

client = Groq(api_key=api_key)
MODEL = 'llama3-70b-8192'

f = 1
messages = []
c = 1
user_prompt = ""


def elab_dis(text):
    global f, messages, c, user_prompt
    f = 0
    if c % 5 == 0:
        c = 1
        messages = []
        print("Cleared the Context till now!")
        return
    print(text)
    if text.lower() == "clear":
        c = 1
        messages = []
        print("Cleared the Context till now!")
        return
    c += 1
    if user_prompt != text:
        user_prompt = text

        messages += [
            {
                "role": "system",
                "content": "You are an assistant named FarmAI who provides the details of the disease predicted in plants and crops along with their stage of disease, symptoms, preventive measures, pesticides and other helpful insights. While giving me example of pesticides give it in fixed pattern which must be :- Pesticide: pesticide_name. Make it short and sweet."
            },
            {
                "role": "user",
                "content": user_prompt,
            }
        ]

        tools = []
        response = client.chat.completions.create(
            model=MODEL,
            messages=messages,
            tools=tools,
            tool_choice="auto",
            max_tokens=4096
        )

        response_message = response.choices[0].message
        print("Response Message: ", response_message)
        print("")
        tool_calls = response_message.tool_calls

        if tool_calls:

            available_functions = {}
            messages.append(response_message)

            for tool_call in tool_calls:
                function_name = tool_call.function.name
                function_to_call = available_functions[function_name]
                function_args = json.loads(tool_call.function.arguments)
                if function_name == "get_attendance_details":
                    function_response = function_to_call(
                        person=function_args.get("person")
                    )
                else:
                    function_response = function_to_call(
                        team_name=function_args.get("team_name")
                    )
                messages.append(
                    {
                        "tool_call_id": tool_call.id,
                        "role": "tool",
                        "name": function_name,
                        "content": function_response,
                    }
                )
            second_response = client.chat.completions.create(
                model=MODEL,
                messages=messages
            )
            print("")
            print("Second Response: ", second_response)
            print("")
            ans = second_response.choices[0].message.content
        else:
            ans = response_message.content

        # Using regular expression to extract pesticide names
        pesticides = re.findall(r'Pesticide:\s*(.+)', ans)
        if pesticides:
            ans += "<br><br>Pesticide Links:"

        # Print the names
        for pesticide in pesticides:
            url_supported_string = quote(pesticide)
            link_p = f"https://www.amazon.in/s?k={url_supported_string}&language=hi_IN"
            ans = ans+"<br>"+link_p

        return (ans)
