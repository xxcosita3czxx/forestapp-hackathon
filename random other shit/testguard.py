import ollama
import time

# Variables to track times
total_time_per_iteration = []
finalcheck_times = []
no_finalcheck_times = []
is_first_iteration = True  # Flag to track the first iteration
is_first_finalcheck = True  # Flag to track the first finalcheck execution

# Open the text file with UTF-8 encoding
with open(r"C:\Users\adamd\Downloads\testin cs.txt", 'r', encoding='utf-8') as file:
    # Loop through each line in the file
    for line in file:
        start_time = time.time()  # Start timer for this iteration
        line_content = line.strip()  # Clean up the line content
        print(line_content)
        
        messages = [
            {
                'role': 'user',
                'content': "/set system harm,social_bias,violence,profanity,sexual_content,unethical_behavior",
            },
            {
                'role': 'user',
                'content': line_content,
            },
        ]
        
        granitecheck = ollama.chat(model="granite3-guardian:8b", messages=messages)['message']['content']
        print(f"granitecheck: {granitecheck}")
        
        if "Yes" not in granitecheck:
            granitecheck = True
        else:
            granitecheck = False
        
        if granitecheck:
            finalcheck_start = time.time()  # Start timing for finalcheck
            finalcheck = ollama.generate(model="stric-llama3.2-guardian", prompt=line_content)["response"]
            finalcheck_time = time.time() - finalcheck_start
            
            # Skip recording the time if this is the first finalcheck
            if not is_first_finalcheck and not is_first_iteration:
                finalcheck_times.append(finalcheck_time)
            
            if "safe" not in finalcheck:
                print("fail")
            else:
                print("finalcheck saved yo ahh")
            
            # Update the first finalcheck flag
            is_first_finalcheck = False
        else:
            no_finalcheck_time = time.time() - start_time
            
            if not is_first_iteration:
                no_finalcheck_times.append(no_finalcheck_time)
        
        # Record the total time for this iteration if not the first
        iteration_time = time.time() - start_time
        if not is_first_iteration:
            total_time_per_iteration.append(iteration_time)
        
        # Print the average time so far per iteration (ignoring the first)
        if total_time_per_iteration:
            avg_iteration_time = sum(total_time_per_iteration) / len(total_time_per_iteration)
            print(f"Average time per iteration so far (excluding first): {avg_iteration_time:.2f} seconds")
        
        # Set the first iteration flag to False after the first iteration
        is_first_iteration = False
    
    # Print the overall averages
    print("\nOverall statistics:")
    if finalcheck_times:
        avg_finalcheck_time = sum(finalcheck_times) / len(finalcheck_times)
        print(f"Average time when finalcheck is run (excluding first): {avg_finalcheck_time:.2f} seconds")
    else:
        print("No finalcheck was run (excluding first).")
    
    if no_finalcheck_times:
        avg_no_finalcheck_time = sum(no_finalcheck_times) / len(no_finalcheck_times)
        print(f"Average time when finalcheck isn't run: {avg_no_finalcheck_time:.2f} seconds")
    else:
        print("finalcheck was run for every iteration.")
