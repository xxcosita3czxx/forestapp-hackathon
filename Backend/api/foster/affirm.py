import random
import fastapi

router = fastapi.APIRouter()

@router.get("/affirm")
def affirm():
    # Open and read the file
    with open(r"/home/cosita3cz/Projects/forestapp-hackathon/Backend/api/foster/output.txt", encoding='utf-8') as f:
        content = f.read()
    
    try:
        # Convert string to Python list by evaluating literal
        import ast
        affirms = ast.literal_eval(content)
        
        # Validate and clean affirmations
        valid_affirms = []
        for item in affirms:
            # Clean up whitespace and quotes
            cleaned = item.strip().strip('"\'')
            # Only keep reasonable length affirmations
            if cleaned and len(cleaned) < 200:
                valid_affirms.append(cleaned)
        
        if not valid_affirms:
            return {"message": "No valid affirmations found"}
            
        # Return random valid affirmation
        return {"message": random.choice(valid_affirms)}
        
    except:
        return {"message": "Error processing affirmations"}
