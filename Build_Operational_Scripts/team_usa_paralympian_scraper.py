import requests
import csv
import os

# Configuration
LIMIT = 50
SKIP = 0
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "..", "Data_Set", "paralympics")
OUTPUT_FILE = os.path.join(OUTPUT_DIR, "team_usa_paralympians.csv")

# Base API URL
BASE_URL = "https://www.teamusa.com/api/athletes"

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

def fetch_athletes(skip, limit):
    """Fetches a batch of athletes from the Team USA API."""
    params = {
        "skip": skip,
        "limit": limit,
        "matchAllTags": "false",
        "filtersStatusSports": "true",
        "showTopAthletesAtTheTop": "true",
        "sortField": "last_name.keyword"
    }
    # We omit 'query' to get all athletes
    try:
        response = requests.get(BASE_URL, params=params, headers=HEADERS, timeout=15)
        response.raise_for_status()
        json_data = response.json()
        if not json_data:
            print(f"Empty JSON received for skip={skip}")
        return json_data
    except Exception as e:
        print(f"Error fetching data: {e}")
        if hasattr(e, 'response') and e.response:
            print(f"Response status: {e.response.status_code}")
            print(f"Response text: {e.response.text[:500]}")
        return {}

def main():
    # Ensure output directory exists
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)
        
    print(f"--- Team USA Full Paralympian Roster Scraper ---")
    print(f"Target: {OUTPUT_FILE}")
    
    skip = 0
    limit = 100 # Increased for efficiency
    total_athletes = 1 # Temporary placeholder
    all_paralympians = []
    
    # Clean file first
    with open(OUTPUT_FILE, 'w', newline='', encoding='utf-8') as f:
        pass

    while skip < total_athletes:
        print(f"Fetching batch: skip={skip}, limit={limit}...")
        data = fetch_athletes(skip, limit)
        
        if not data:
            print("No data received. Ending scrape.")
            break
            
        # Update total count from API
        total_athletes = data.get("total", 0)
        items = data.get("entries", [])
        
        if not items:
            print("No more entries found.")
            break

        batch_paralympians = []
        for item in items:
            if not isinstance(item, dict):
                continue
                
            # Strict Filter for Paralympians
            if item.get("olympic_paralympic") == "Paralympian":
                # Extract nested bio fields
                bio_data = item.get("bio", {})
                qf = bio_data.get("quick_facts", {}) if isinstance(bio_data, dict) else {}
                biography = bio_data.get("biography", "") if isinstance(bio_data, dict) else ""
                
                # Clean hometown
                hometown_dict = qf.get("hometown", {}) if isinstance(qf, dict) else {}
                hometown_str = "N/A"
                if isinstance(hometown_dict, dict):
                    city = hometown_dict.get("city", "")
                    state = hometown_dict.get("state", "")
                    hometown_str = f"{city}, {state}".strip(", ") or "N/A"

                batch_paralympians.append({
                    "Name": f"{item.get('first_name', '')} {item.get('last_name', '')}".strip() or item.get("title", "Unknown"),
                    "Gender": item.get("gender", "N/A"),
                    "Age": qf.get("age", "N/A"),
                    "Height": qf.get("height", "N/A"),
                    "Weight": qf.get("weight", "N/A"),
                    "Sport": ", ".join([s.get("title", "") for s in item.get("sport", []) if isinstance(s, dict)]) or "N/A",
                    "Classification": item.get("para_classification", "N/A"),
                    "Hometown": hometown_str,
                    "Biography": biography.replace("\r\n", " ").strip() if isinstance(biography, str) else "N/A",
                    "Profile_URL": f"https://www.teamusa.com{item.get('url')}" if item.get('url') else "N/A",
                    "Years": item.get("olympian_paralympian_years", "N/A")
                })

        # Save batch to CSV
        if batch_paralympians:
            file_exists = os.path.isfile(OUTPUT_FILE) and os.path.getsize(OUTPUT_FILE) > 0
            keys = batch_paralympians[0].keys()
            with open(OUTPUT_FILE, 'a', newline='', encoding='utf-8') as f:
                writer = csv.DictWriter(f, fieldnames=keys)
                if not file_exists:
                    writer.writeheader()
                writer.writerows(batch_paralympians)
            
            all_paralympians.extend(batch_paralympians)
            print(f"Added {len(batch_paralympians)} Paralympians to CSV. (Total saved: {len(all_paralympians)})")

        skip += limit
        print(f"Progress: {min(skip, total_athletes)}/{total_athletes} athletes scanned.")

    print(f"\n✅ FULL SCRAPE COMPLETE!")
    print(f"Total Paralympians Found: {len(all_paralympians)}")
    print(f"File Location: {OUTPUT_FILE}")

if __name__ == "__main__":
    main()
