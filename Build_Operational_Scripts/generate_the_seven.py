import json
from google import genai
from google.genai import types

PROJECT_ID = "project-e1786661-5608-4308-9ad"
LOCATION = "us-central1"

def generate(athlete):
    client = genai.Client(vertexai=True, project=PROJECT_ID, location=LOCATION)
    prompt = f"Athlete: {athlete['Name']}, Sport: {athlete['Sport']}, Biometrics: {athlete['H']}cm, {athlete['W']}kg, Medal: {athlete['M']}"
    
    system_instruction = """
    Generate a Cyberpunk Hero Profile (alias, archetype, lore, ability_name, ability_description) as JSON.
    Archetype MUST be one of: Behemoth, Solo, Scout.
    Tone: Heroic, Cyberpunk, Premium.
    """
    
    try:
        res = client.models.generate_content(
            model='gemini-3.1-pro-preview',
            contents=prompt,
            config=types.GenerateContentConfig(
                system_instruction=system_instruction,
                response_mime_type='application/json'
            )
        )
        return json.loads(res.text)
    except Exception as e:
        print(f"Error for {athlete['Name']}: {e}")
        return None

candidates = [
    {'Name': 'Mary Theisen-Lappen', 'Sport': 'Weightlifting', 'H': 183, 'W': 137, 'M': 'Bronze (2024)'},
    {'Name': 'Brady Ellison', 'Sport': 'Archery', 'H': 180, 'W': 86, 'M': 'Multiple Silvers/Bronzes'},
    {'Name': 'Conner Mantz', 'Sport': 'Marathon', 'H': 173, 'W': 57, 'M': 'Top Finisher'}
]

results = []
for c in candidates:
    print(f"Generating for {c['Name']}...")
    profile = generate(c)
    if profile:
        profile['name'] = c['Name']
        profile['sport'] = c['Sport']
        profile['height'] = c['H']
        profile['weight'] = c['W']
        results.append(profile)

print(json.dumps(results, indent=2))
