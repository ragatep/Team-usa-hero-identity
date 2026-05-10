# Team USA: Hero Identity // Gemini AI Implementation Plan

This document details the technical strategy to resolve the `404 NOT_FOUND` authentication and routing errors, moving the project from "mock/bypass" generation back to a live AI production pipeline using Gemini.

## 1. Problem Identification
The previous attempt to use `vertexai=True` with the `google-genai` SDK failed because:
1.  **Auth Mismatch:** The local environment relied on OAuth Application Default Credentials (ADC), whereas the Studio-generated reasoning models (`gemini-3.1-pro-preview`) prefer API Key authentication for the Developer API surface.
2.  **Missing Thinking Config:** The new Gemini 3.1 Reasoning models require a specific `thinking_config` object in the payload which was initially missing.
3.  **Region Gating:** Preview models are often gated to specific regions (e.g., `us-central1` vs `global`).

## 2. Technical Solution
We will transition the authentication logic to use a **Secure API Key** stored in a local `.env` file and refactor the `genai.Client` to handle the reasoning model requirements.

### Step 1: Secure Credentials Setup
1.  **Generate API Key:** In Google Cloud Console, navigate to **APIs & Services > Credentials** and create a new **API Key**.
2.  **Local Environment:** Create a file named `.env` in the root directory (ensure it is listed in `.gitignore`).
3.  **Configure Key:** Add the following line to `.env`:
    ```bash
    GOOGLE_CLOUD_API_KEY=your_key_here
    ```

### Step 2: Refactor `generate_hero_profiles.py`
Update the initialization and request logic to support the reasoning model:

```python
import os
from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv()

def generate_hero_profile(athlete_data):
    client = genai.Client(
        vertexai=True,
        api_key=os.environ.get("GOOGLE_CLOUD_API_KEY")
    )

    # Use the Reasoning Model with Thinking Config
    response = client.models.generate_content(
        model="gemini-3.1-pro-preview",
        contents=f"Data: {athlete_data_string}",
        config=types.GenerateContentConfig(
            system_instruction=SYSTEM_PROMPT,
            temperature=1.0,
            thinking_config=types.ThinkingConfig(thinking_level="HIGH"),
            response_mime_type="application/json"
        )
    )
    return response.text
```

### Step 3: Deployment & Production Path
*   **Failover Logic:** Implement a fallback to `gemini-1.5-flash` if the reasoning model hits rate limits or regional 404s.
*   **JSON Enforcement:** Since reasoning models can be verbose, we will utilize Gemini's **Controlled Output (JSON Mode)** to ensure the React frontend receives valid `HeroProfile` objects.

## 4. Implementation Status (Successful)
The transition to live API Key authentication and the integration of Gemini 3.1 Pro reasoning models was successfully completed in May 2026. The `404 NOT_FOUND` errors were resolved by switching from OAuth ADC to API Key auth and correctly configuring the `thinking_config`. The entire 20-card set now features live AI-generated lore and ability descriptions.
