import ollama
from transformers import AutoModelForSeq2SeqLM, AutoTokenizer
import torch

messages = {'role': 'system',
                'content':"You are a master at thinking of affirmations. You will think of an infinite number of unique affirmations for children, teens, and even adults. Only reply with the affirmation. Nothing else. Be unique, yet grounded in broad terms applicable to almost anything."}
tokenizer = AutoTokenizer.from_pretrained("facebook/nllb-200-3.3B", trust_remote_code=True)
transmodel = AutoModelForSeq2SeqLM.from_pretrained(
    "facebook/nllb-200-3.3B",
    cache_dir=None,  # Use default cache
    force_download=True,  # Force a fresh download
    resume_download=True,  # Resume interrupted downloads
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
for i in range(100):
    response = ollama.chat(model="llama3.2:3b", messages=messages)
    messages.append(
            {
                'role': 'assistant',
                'content': response,
            },
        )
    translated = translate(response)
    affirms.append(translated)
    print(response)
    print(translated)
