import os
import json
from google import genai
from google.genai import types
from google.cloud import bigquery

# Configuration
PROJECT_ID = "project-e1786661-5608-4308-9ad"
LOCATION = "us-central1"
DATASET_ID = "team_usa_hackathon"
OLYMPIAN_TABLE = "team_usa_olympians"
IDENTITY_TABLE = "hero_identities"

# Archetype Definitions for the AI
ARCHETYPE_DESCRIPTIONS = {
    "Behemoth": "Strength & Resilience. The frontline tank (e.g., Wrestling, Weightlifting).",
    "Solo": "Precision & Lethal Accuracy. The specialist (e.g., Archery, Fencing, Shooting).",
    "Netrunner": "Technical & Strategic. Master of systems and flow (e.g., Sailing, Rowing, Tactical Cycling).",
    "Scout": "Distance & Endurance. The relentless operative who never stops (e.g., Marathon, Triathlon).",
    "Ghost": "Speed & Agility. Fluid motion, vanishing before the enemy sees them (e.g., 100m Sprint, Swimming).",
    "Vanguard": "Versatility. Elite operatives who master multiple sporting systems (e.g., Decathlon, Pentathlon).",
    "Equalizer": "Augmented. Heroes who use advanced tech/prosthesis to redefine the limits of human potential."
}

SYSTEM_PROMPT = f"""
You are the AI Overseer of the 'Team USA Digital Mirror' system. 
Your tone is heroic, futuristic, and leans into a 'Premium' Cyberpunk 2077 / Edge Runners aesthetic.

TASK:
Generate a high-fidelity 'Hero Profile' for a Team USA athlete based on their biometrics and achievement data.

ARCHETYPES:
{json.dumps(ARCHETYPE_DESCRIPTIONS, indent=2)}

DIRECTIONS:
1. Assign the most fitting Archetype based on the athlete's sport and biometrics.
2. If the athlete competed in multiple distinct types of events, assign 'Vanguard'.
3. If they are a Paralympian (Para-prefixed sports or Origin context), assign 'Equalizer' and emphasize their 'Augmented' status heroically.
4. Generate a 'Heroic Alias' (e.g., 'The Crimson Flash' or 'Iron Wall').
5. Write a 2-3 sentence 'Hero Lore' (backstory) that sounds like a character report from a high-tech resistance movement. Use terms like 'Optics', 'Neural-Link', 'Overdrive', 'Kinetics'.

OUTPUT FORMAT:
Return ONLY a JSON object with these keys:
- alias
- archetype
- lore
- primary_stat (e.g., Strength, Agility, Intelligence)
- ability_name
- ability_description
"""

def generate_hero_profile(athlete_data):
    """Uses Gemini 3.1 Pro Preview to generate a hero profile."""
    client = genai.Client(vertexai=True, project=PROJECT_ID, location=LOCATION)
    
    # Format athlete data for prompt
    athlete_str = f"""
    Name: {athlete_data['Name']}
    Sport: {athlete_data['Sport']}
    Event: {athlete_data['Event']}
    Biometrics: {athlete_data['Height']}cm, {athlete_data['Weight']}kg
    Age: {athlete_data['Age']}
    Medals: {athlete_data.get('Medal', 'None')}
    Year: {athlete_data['Year']}
    """
    
    try:
        response = client.models.generate_content(
            model="gemini-3.1-pro-preview",
            contents=f"Data: {athlete_str}\n\nGenerate Hero Profile:",
            config=types.GenerateContentConfig(
                system_instruction=SYSTEM_PROMPT,
                temperature=0.7,
                response_mime_type="application/json"
            )
        )
        return json.loads(response.text) if response.text else None
    except Exception as e:
        print(f"AI Generation Error: {e}")
        return None

def get_random_athletes(count=3):
    """Queries BigQuery for random Team USA athletes."""
    bq_client = bigquery.Client(project=PROJECT_ID)
    
    # We mix both tables if possible, or just focus on the identities one
    query = f"""
        SELECT Name, Sex, Age, Height, Weight, Sport, Event, Medal, Year, Archetype as Static_Archetype
        FROM `{PROJECT_ID}.{DATASET_ID}.{IDENTITY_TABLE}`
        WHERE Height IS NOT NULL 
          AND Weight IS NOT NULL
        ORDER BY RAND()
        LIMIT {count}
    """
    
    query_job = bq_client.query(query)
    return query_job.result()

def main():
    print(f"--- Team USA Hero Profile Generator (Powered by Gemini 3.1 Pro) ---")
    
    athletes = get_random_athletes(3)
    
    for athlete in athletes:
        print(f"\nProcessing: {athlete.Name} ({athlete.Sport})...")
        
        # Capture row data
        data = dict(athlete)
        
        # Generate AI Profile
        profile = generate_hero_profile(data)
        
        if profile:
            print(f"ALIAS: {profile.get('alias')}")
            print(f"ARCHETYPE: {profile.get('archetype')}")
            print(f"LORE: {profile.get('lore')}")
            print(f"ABILITY: {profile.get('ability_name')} - {profile.get('ability_description')}")
            print("-" * 50)
        else:
            print("Failed to generate profile.")

if __name__ == "__main__":
    main()
