import os
import json
from dotenv import load_dotenv
from google import genai
from google.genai import types
from google.cloud import bigquery

load_dotenv() # Load GOOGLE_CLOUD_API_KEY from .env

# Configuration
PROJECT_ID = "project-e1786661-5608-4308-9ad"
LOCATION = "us-central1"
DATASET_ID = "team_usa_hackathon"
IDENTITY_TABLE = "hero_identities"
OUTPUT_FILE = os.path.join(os.path.dirname(__file__), "..", "Data_Set", "data_set_combined", "hero_identities.json")

# Archetype Definitions for the AI
ARCHETYPE_DESCRIPTIONS = {
    "Tank": "Defense & Control. High durability and positioning (e.g., Weightlifting, Judo, Wrestling, Rugby).",
    "DPS": "Damage Dealers - Burst. Speed and high impact (e.g., Sprints, Gymnastics, Fencing).",
    "DPS (DoT)": "Damage over Time. Endurance and sustained output (e.g., Marathon, Triathlon, Rowing).",
    "Support": "Utility & Buffs. Team synergy (e.g., Basketball, Volleyball).",
    "Controller": "Precision & Strategy. Strategy and field manipulation (e.g., Archery, Shooting)."
}

SYSTEM_PROMPT = f"""
You are the AI Overseer of the 'Team USA Digital Mirror' system. 
Your tone is heroic, futuristic, and leans into a 'Premium' Cyberpunk 2077 / Edge Runners aesthetic.

TASK:
Generate a high-fidelity 'Hero Profile' for a Team USA athlete based on their biometrics and achievement data.

MMO ARCHETYPES:
{json.dumps(ARCHETYPE_DESCRIPTIONS, indent=2)}

DIRECTIONS:
1. The athlete's Archetype and Rarity are already determined. Use the provided MMO Archetype strictly.
2. If their 'Origin' is 'Paralympic', emphasize their 'Augmented' status heroically. Use terms referring to advanced cybernetics, neural-links, and high-tech medical engineering.
3. Generate a 'Heroic Alias' (e.g., 'The Crimson Flash' or 'Iron Wall').
4. Write a 2-3 sentence 'Hero Lore' (backstory) that sounds like a character report from a high-tech resistance movement or elite operative faction.
5. Generate a 'Powerful Main Ability Name' based on a move or action performed in real life from their sport.
6. Write an 'Ability Description' detailing how the archetype uses this powerful ability on opponents (e.g., tactical descriptions of specific throws, timing-based counters, or resource-ignored effects) in an MMO combat context.

OUTPUT FORMAT:
Return ONLY a JSON object with these keys:
- alias
- lore
- ability_name
- ability_description
"""

def generate_hero_profile(athlete_data):
    """Uses Gemini to generate a hero profile."""
    # Use API Key authentication for the Gemini API
    client = genai.Client(api_key=os.environ.get("GOOGLE_CLOUD_API_KEY"))
    
    # Format athlete data for prompt
    athlete_str = f"""
    Name: {athlete_data['Name']}
    Sport: {athlete_data['Sport']}
    Event: {athlete_data['Event']}
    Biometrics: {athlete_data['Height']}cm, {athlete_data['Weight']}kg
    Age: {athlete_data.get('Age', 'Unknown')}
    Medals: {athlete_data.get('Medal', 'None')}
    Year: {athlete_data['Year']}
    Origin: {athlete_data['Origin']}
    Assigned Archetype: {athlete_data['Archetype']}
    Assigned Rarity: {athlete_data['Rarity']}
    """
    
    try:
        response = client.models.generate_content(
            model="gemini-3.1-pro-preview",
            contents=f"Data: {athlete_str}\n\nGenerate Hero Profile:",
            config=types.GenerateContentConfig(
                system_instruction=SYSTEM_PROMPT,
                temperature=1.0,
                response_mime_type="application/json",
                thinking_config=types.ThinkingConfig(thinking_level="HIGH")
            )
        )
        return json.loads(response.text) if response.text else None
    except Exception as e:
        print(f"AI Generation Error for {athlete_data['Name']}: {e}")
        return None

def get_representative_athletes():
    """Queries BigQuery for exactly 1 athlete per Archetype per Rarity."""
    bq_client = bigquery.Client(project=PROJECT_ID)
    
    query = f"""
        SELECT *
        FROM (
          SELECT 
            Name, Sex, Age, Height, Weight, Sport, Event, Medal, Year, Origin, Rarity, Archetype,
            STRENGTH, SPEED, PRECISION, UTILITY, ENDURANCE,
            ROW_NUMBER() OVER(PARTITION BY Archetype, Rarity ORDER BY RAND()) as rn
          FROM `{PROJECT_ID}.{DATASET_ID}.{IDENTITY_TABLE}`
          WHERE Height IS NOT NULL 
            AND Weight IS NOT NULL
            AND Archetype IS NOT NULL
            AND Rarity IS NOT NULL
        )
        WHERE rn = 1
    """
    
    query_job = bq_client.query(query)
    return query_job.result()

def main():
    print(f"--- Team USA Hero Profile Generator (Powered by Gemini 3.1 Pro) ---")
    print("Fetching 1 athlete per Archetype per Rarity (Max 20 athletes)...")
    
    athletes = get_representative_athletes()
    final_dataset = []
    
    for athlete in athletes:
        print(f"\nProcessing: [{athlete.Rarity}] [{athlete.Archetype}] {athlete.Name} ({athlete.Sport})...")
        
        # Capture row data
        data = dict(athlete)
        
        # Remove the 'rn' key from BigQuery output
        if 'rn' in data:
            del data['rn']
            
        # Generate AI Profile
        profile = generate_hero_profile(data)
        
        if profile:
            data['alias'] = profile.get('alias', '')
            data['lore'] = profile.get('lore', '')
            data['ability'] = {
                'name': profile.get('ability_name', ''),
                'description': profile.get('ability_description', '')
            }
            final_dataset.append(data)
            print(f" -> Success! Alias: {data['alias']}")
        else:
            print(" -> Failed to generate profile.")
            
    # Save to JSON
    print(f"\nSaving {len(final_dataset)} profiles to {OUTPUT_FILE}...")
    with open(OUTPUT_FILE, 'w') as f:
        json.dump(final_dataset, f, indent=2)
    print("Done!")

if __name__ == "__main__":
    main()
