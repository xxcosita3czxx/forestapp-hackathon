import ollama
import torch
from transformers import AutoModelForSeq2SeqLM, AutoTokenizer


def save_to_text_file(content, filename='output.txt'):
    try:
        with open(filename, 'w', encoding='utf-8') as file:
            file.write(content)
        return filename
    except IOError as e:
        print(f"An error occurred while saving the file: {e}")
        return None
# Define messages BEFORE the main() function
messages = [
    {
        'role': 'system',
        'content': "You are a master at thinking of affirmations. You will think of an infinite number of unique affirmations for children, teens, and even adults. Only reply with the affirmation. Nothing else. Be unique, yet grounded in broad terms applicable to almost anything and anyone. Always respond with only one affirmation, not more! Never explain the affirmation or anything, just say it. Each affirmation has to be completely original."
    }
]
# Your existing translation setup code remains the same...
tokenizer = AutoTokenizer.from_pretrained("facebook/nllb-200-3.3B", trust_remote_code=True)  # noqa: E501
transmodel = AutoModelForSeq2SeqLM.from_pretrained(
    "facebook/nllb-200-3.3B",  # Force a fresh download
    resume_download=True,  # Resume interrupted downloads
)
eng_Latn = tokenizer.convert_tokens_to_ids("eng_Latn")
ces_Latn = tokenizer.convert_tokens_to_ids("ces_Latn")

def translate(text):
    inputs = tokenizer(text, padding=True, truncation=True, max_length=512, return_tensors="pt")  # noqa: E501
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

for _i in range(100):
    response = ollama.chat(model="hermes3:8b", messages=messages)
    short = ollama.generate(model="hermes3:8b", prompt = f"Shorten the following text to just one sentence if it is longer, otherwise respond with it untouched. Do NOT add anything other than either the shortened text or the untouched original. The text: {response['message']['content']}")
    print(response['message']['content'])
    print(f"\nSHort: {short["response"]}")
    check = ollama.generate(model="llama-guard3", prompt=short["response"])["response"]
    print(check)
    if "unsafe" in check:
        print(f"Untranslated and unsafe, babey: {short["response"]}")
    else:
        print(f"Untranslated: {short["response"]}")
        messages.append({
            'role': 'assistant',
            'content': short["response"],
        })
        translated = translate(short["response"])
        affirms.append(translated)
        print(f"Translated: {translated}")

print(affirms)
save_to_text_file(str(affirms))
# Wait for all speaking threads to complete