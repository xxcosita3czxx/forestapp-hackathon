import ollama
messages = [
    {
        'role': 'user',
        'content': "/set system harm,violence,profanity,sexual_content",
    },
]
"""
messages = [
    {
        'role': 'user',
        'content': "",
    },
]"""
# Open the text file with UTF-8 encoding
with open(r"C:\Users\adamd\Downloads\testin cs.txt", 'r', encoding='utf-8') as file:
    # Loop through each line in the file
    for line in file:
        # Print the line (strip removes any extra newline characters)
        print(line.strip())
        check = ollama.chat(model="granite3-guardian:8b", messages=messages)['message']['content']
        print(check)
        if "Yes" not in check:
            print("failed!")
            input()
