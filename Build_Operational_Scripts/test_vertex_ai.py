import os
from google import genai
from google.genai import types

# Configuration
PROJECT_ID = "project-e1786661-5608-4308-9ad"
LOCATION = "us-central1"

def test_vertex_ai():
    print(f"--- Vertex AI Connection Test (Gemini 3.1 Pro Preview) ---")
    print(f"Project: {PROJECT_ID}")
    print(f"Location: {LOCATION}")
    
    try:
        # Initialize the GenAI Client for Vertex AI exactly as shown in console
        client = genai.Client(
            vertexai=True, 
            project=PROJECT_ID, 
            location=LOCATION
        )
        
        print("\nSending test prompt to Gemini 3.1 Pro Preview...")
        
        # Using the exact model and config suggested for Reasoning models
        response = client.models.generate_content(
            model="gemini-3.1-pro-preview",
            contents="Say 'Vertex AI is connected with Gemini 3.1 Pro Preview!' in a heroic tone.",
            config=types.GenerateContentConfig(
                temperature=1.0,
                thinking_config=types.ThinkingConfig(include_thoughts=True)
            )
        )
        
        print("\n--- Response ---")
        if response.text:
            print(response.text.strip())
        else:
            print("No text returned, checking for content parts...")
            print(response)
            
        print("----------------\n")
        print("SUCCESS: Vertex AI is fully configured with Gemini 3.1 Pro via ADC.")
        
    except Exception as e:
        print("\nERROR: Connection failed.")
        print(str(e))
        print("\nTroubleshooting Tips:")
        print("1. Ensure you ran 'gcloud auth application-default login'")
        print("2. Verify that the 'Vertex AI User' role is assigned to your account.")
        print("3. Check the Google Cloud Console to ensure the API is fully active for this model.")

if __name__ == "__main__":
    test_vertex_ai()
