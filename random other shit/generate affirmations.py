import ollama
import torch
from transformers import AutoModelForSeq2SeqLM, AutoTokenizer

def save_to_text_file(content, filename='output.txt'):
    try:
        with open(filename, 'w', encoding='utf-8') as file:
            file.write(content)
        return filename
    except OSError as e:
        print(f"An error occurred while saving the file: {e}")
        return None

messages = [
    {
        'role': 'system',
        'content': "You are a master at thinking of affirmations. You will think of an infinite number of unique affirmations for children, teens, and even adults. Only reply with the affirmation. Nothing else. Be unique, yet grounded in broad terms applicable to almost anything and anyone. Never explain the affirmation or anything, just say it. Each affirmation has to be completely original.",
    },
]

tokenizer = AutoTokenizer.from_pretrained("facebook/nllb-200-3.3B", trust_remote_code=True)
transmodel = AutoModelForSeq2SeqLM.from_pretrained(
    "facebook/nllb-200-3.3B",
    resume_download=True,
)

eng_Latn = tokenizer.convert_tokens_to_ids("eng_Latn")
ces_Latn = tokenizer.convert_tokens_to_ids("ces_Latn")

def translate(text):
    inputs = tokenizer(text, padding=True, truncation=True, max_length=512, return_tensors="pt")
    target_lang_id = ces_Latn
    with torch.no_grad():
        translated_tokens = transmodel.generate(
            **inputs,
            forced_bos_token_id=target_lang_id,
            max_length=512,
        )
    translation = tokenizer.batch_decode(translated_tokens, skip_special_tokens=True)
    return translation[0]

affirms = []
max_attempts = 50
current_attempts = 0

while len(affirms) < max_attempts and current_attempts < max_attempts * 2:
    try:
        # Ollama chat generation
        response = ollama.chat(model="hermes3:8b", messages=messages)
        
        # Shorten the response
        short = ollama.generate(
            model="hermes3:8b", 
            prompt=f"Shorten the following text to just one sentence if it is longer, otherwise respond with it untouched. Do NOT add anything other than either the shortened text or the untouched original. The text: {response['message']['content']}"
        )
        
        # Safety check
        check = ollama.generate(model="llama-guard3", prompt=short["response"])["response"]
        
        if "unsafe" not in check:
            messages.append({
                'role': 'assistant',
                'content': short["response"],
            })
            translated = translate(short["response"])
            affirms.append(translated)
            print(f"Translated: {translated}")
        
    except Exception as e:
        print(f"Error in iteration {current_attempts}: {e}")
    
    current_attempts += 1

# Save results
if affirms:
    save_to_text_file(str(affirms))
    print(f"Generated {len(affirms)} affirmations")
else:
    print("No affirmations generated")