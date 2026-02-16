from google import genai
import pandas as pd
import os
import time
import json
from dotenv import load_dotenv
from tqdm import tqdm

# Load API Key
load_dotenv()
API_KEY = os.getenv("GEMINI_API_KEY")

if not API_KEY:
    print("❌ Error: GEMINI_API_KEY not found in .env file")
    exit(1)

# New SDK initialization
client = genai.Client(api_key=API_KEY)
MODEL_ID = "gemini-2.0-flash" # Reverting to 2.0 as 1.5 endpoint is unavailable 

# --- CONFIGURATION ---
INPUT_FILE = "schemes.csv"
OUTPUT_FILE = "schemes_translated.csv"
CHECKPOINT_FILE = "checkpoint.json"

# Columns to translate
COLUMNS_TO_TRANSLATE = ["scheme_name", "details", "benefits", "eligibility", "application", "documents"]
# STABILITY CONFIGURATION:
# Speed caused rate limits (429). We must slow down slightly to finish at all.
# batch 12 -> batch 6 (reduces payload size by half)
# delay 5s -> delay 10s (gives 200% more cooldown time)
# This results in ~5-6 RPM, which is very safe and reliable.
BATCH_SIZE = 6  
DELAY_BETWEEN_REQUESTS = 10  
MAX_RETRIES = 5

def translate_batch(batch_df, target_lang):
    """
    Sends a batch of rows to Gemini for translation with exponential backoff.
    """
    data_to_translate = batch_df[COLUMNS_TO_TRANSLATE].to_dict(orient='records')
    
    prompt = f"""
    Translate the following list of government scheme data into {target_lang}.
    Maintain the JSON format exactly. Return ONLY a JSON array of objects with the keys:
    {", ".join(COLUMNS_TO_TRANSLATE)}
    
    Data:
    {json.dumps(data_to_translate)}
    """
    
    retries = 0
    while retries < MAX_RETRIES:
        try:
            response = client.models.generate_content(
                model=MODEL_ID,
                contents=prompt
            )
            
            text = response.text
            if "```json" in text:
                text = text.split("```json")[-1].split("```")[0]
            elif "```" in text:
                text = text.split("```")[-1].split("```")[0]
            
            return json.loads(text.strip())
            
        except Exception as e:
            if "429" in str(e) or "RESOURCE_EXHAUSTED" in str(e):
                wait_time = (2 ** retries) * 30  # Start with 30s, then 60s, 120s...
                print(f"\n⚠️  Rate limit reached (429). Retrying in {wait_time}s... (Attempt {retries+1}/{MAX_RETRIES})")
                time.sleep(wait_time)
                retries += 1
            else:
                print(f"⚠️  Error in batch translation for {target_lang}: {e}")
                return None
    
    print(f"❌ Failed to translate batch after {MAX_RETRIES} attempts.")
    return None

def main():
    if not os.path.exists(INPUT_FILE):
        print(f"❌ Error: {INPUT_FILE} not found. Please place your CSV file here.")
        return

    df = pd.read_csv(INPUT_FILE)
    total_rows = len(df)
    print(f"📖 Loaded {total_rows} records from {INPUT_FILE}")

    # Load checkpoint
    start_index = 0
    if os.path.exists(CHECKPOINT_FILE):
        with open(CHECKPOINT_FILE, "r") as f:
            checkpoint = json.load(f)
            start_index = checkpoint.get("last_index", 0)
            print(f"🔄 Resuming from index {start_index}...")

    # Initialize translated columns if they don't exist
    for col in COLUMNS_TO_TRANSLATE:
        if f"{col}_hi" not in df.columns:
            df[f"{col}_hi"] = ""
        if f"{col}_mr" not in df.columns:
            df[f"{col}_mr"] = ""

    # Processing in batches
    for i in tqdm(range(start_index, total_rows, BATCH_SIZE), desc="Translating..."):
        batch_end = min(i + BATCH_SIZE, total_rows)
        batch_df = df.iloc[i:batch_end]

        # Translate to Hindi
        hi_translated = translate_batch(batch_df, "Hindi")
        time.sleep(DELAY_BETWEEN_REQUESTS) # Respect Rate Limits
        
        # Translate to Marathi
        mr_translated = translate_batch(batch_df, "Marathi")
        time.sleep(DELAY_BETWEEN_REQUESTS)

        if hi_translated and mr_translated:
            # Map back to dataframe
            for idx, (hi_row, mr_row) in enumerate(zip(hi_translated, mr_translated)):
                actual_idx = i + idx
                for col in COLUMNS_TO_TRANSLATE:
                    df.at[actual_idx, f"{col}_hi"] = hi_row.get(col, "")
                    df.at[actual_idx, f"{col}_mr"] = mr_row.get(col, "")
            
            # Save progress incrementally
            df.to_csv(OUTPUT_FILE, index=False)
            with open(CHECKPOINT_FILE, "w") as f:
                json.dump({"last_index": batch_end}, f)
        else:
            print(f"🛑 Stopping at index {i} due to API error. You can restart the script to resume.")
            break

    print(f"✅ Success! Translated file saved as {OUTPUT_FILE}")

if __name__ == "__main__":
    main()
