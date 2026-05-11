import csv
import re
import os
import json

# Mapping of Years to City and Season
YEAR_MAP = {
    2026: ("2026 Winter", "Milano Cortina", "Winter"),
    2024: ("2024 Summer", "Paris", "Summer"),
    2022: ("2022 Winter", "Beijing", "Winter"),
    2020: ("2020 Summer", "Tokyo", "Summer"),
    2018: ("2018 Winter", "Pyeongchang", "Winter"),
    2016: ("2016 Summer", "Rio de Janeiro", "Summer"),
    2014: ("2014 Winter", "Sochi", "Winter"),
    2012: ("2012 Summer", "London", "Summer"),
    2010: ("2010 Winter", "Vancouver", "Winter"),
    2008: ("2008 Summer", "Beijing", "Summer"),
    2006: ("2006 Winter", "Torino", "Winter"),
    2004: ("2004 Summer", "Athens", "Summer"),
    2002: ("2002 Winter", "Salt Lake City", "Winter"),
    2000: ("2000 Summer", "Sydney", "Summer"),
    1998: ("1998 Winter", "Nagano", "Winter"),
    1996: ("1996 Summer", "Atlanta", "Summer"),
    1994: ("1994 Winter", "Lillehammer", "Winter"),
    1992: ("1992 Summer", "Barcelona", "Summer"),
    1988: ("1988 Summer", "Seoul", "Summer"),
    1984: ("1984 Summer", "Stoke Mandeville & New York", "Summer"),
    1980: ("1980 Summer", "Arnhem", "Summer"),
    1976: ("1976 Summer", "Toronto", "Summer"),
    1972: ("1972 Summer", "Heidelberg", "Summer"),
    1968: ("1968 Summer", "Tel Aviv", "Summer"),
    1964: ("1964 Summer", "Tokyo", "Summer"),
    1960: ("1960 Summer", "Rome", "Summer")
}

def strip_html(text):
    if not text:
        return ""
    # Remove HTML tags
    clean = re.sub(r'<[^>]*>', '', text)
    # Handle common HTML entities
    clean = clean.replace('&nbsp;', ' ').replace('&amp;', '&').replace('&quot;', '"').replace('?T', "'").replace('?"', "-")
    return clean.strip()

def parse_years(years_str):
    """Extracts years from 'Paralympian 2008, 2012' string."""
    if not years_str or years_str == "N/A":
        return []
    # Find all 4-digit years
    years = re.findall(r'\d{4}', years_str)
    return [int(y) for y in years]

def prepare_data():
    input_file = os.path.join(os.path.dirname(__file__), "..", "Data_Set", "paralympics", "team_usa_paralympians.csv")
    output_file = os.path.join(os.path.dirname(__file__), "..", "Data_Set", "paralympics", "team_usa_paralympians_clean.csv")
    
    if not os.path.exists(input_file):
        print(f"Error: {input_file} not found.")
        return

    print(f"Processing {input_file} for BigQuery...")
    
    entries_created = 0
    athlete_count = 0
    
    with open(input_file, mode='r', encoding='utf-8') as f_in:
        reader = csv.DictReader(f_in)
        
        # Exact 15-column schema for raw_athlete_data
        fieldnames = [
            'ID', 'Name', 'Sex', 'Age', 'Height', 'Weight', 
            'Team', 'NOC', 'Games', 'Year', 'Season', 'City', 
            'Sport', 'Event', 'Medal'
        ]
        
        with open(output_file, mode='w', encoding='utf-8', newline='') as f_out:
            # Use QUOTE_ALL to prevent parsing errors in BigQuery
            writer = csv.DictWriter(f_out, fieldnames=fieldnames, quoting=csv.QUOTE_ALL)
            writer.writeheader()
            
            for row in reader:
                athlete_count += 1
                
                # Basic fields
                name = row['Name']
                # Map Gender to Sex (M/F)
                gender = row.get('Gender', 'N/A').strip().upper()
                sex = 'M' if gender.startswith('M') else ('F' if gender.startswith('F') else 'NA')
                
                # Unit-neutral strings as requested
                age = row['Age'] if row['Age'] != 'N/A' else 'NA'
                height = row['Height'] if row['Height'] != 'N/A' else 'NA'
                weight = row['Weight'] if row['Weight'] != 'N/A' else 'NA'
                
                years = parse_years(row.get('Years', ''))
                
                # If no years found, default to one row with NA for games-related fields
                if not years:
                    years = [None]
                
                for year in years:
                    game_info = YEAR_MAP.get(year, ("NA", "NA", "NA"))
                    
                    clean_row = {
                        'ID': athlete_count,
                        'Name': name,
                        'Sex': sex,
                        'Age': age,
                        'Height': height,
                        'Weight': weight,
                        'Team': 'United States',
                        'NOC': 'USA',
                        'Games': game_info[0],
                        'Year': year if year else 0, # BigQuery INTEGER doesn't like None in some contexts, using 0 as placeholder
                        'Season': game_info[2],
                        'City': game_info[1],
                        'Sport': row['Sport'],
                        'Event': row['Classification'], # Using classification as Event matching
                        'Medal': 'NA' # Default to NA for consistency
                    }
                    writer.writerow(clean_row)
                    entries_created += 1

    print(f"Successfully processed {athlete_count} athletes.")
    print(f"Generated {entries_created} historical rows (expanded by years).")
    print(f"Cleaned data focused on 'raw_athlete_data' schema: {output_file}")

    # Update BigQuery Schema JSON to match
    schema = [
        {"name": "ID", "type": "INTEGER", "mode": "REQUIRED"},
        {"name": "Name", "type": "STRING", "mode": "NULLABLE"},
        {"name": "Sex", "type": "STRING", "mode": "NULLABLE"},
        {"name": "Age", "type": "STRING", "mode": "NULLABLE"},
        {"name": "Height", "type": "STRING", "mode": "NULLABLE"},
        {"name": "Weight", "type": "STRING", "mode": "NULLABLE"},
        {"name": "Team", "type": "STRING", "mode": "NULLABLE"},
        {"name": "NOC", "type": "STRING", "mode": "NULLABLE"},
        {"name": "Games", "type": "STRING", "mode": "NULLABLE"},
        {"name": "Year", "type": "INTEGER", "mode": "NULLABLE"},
        {"name": "Season", "type": "STRING", "mode": "NULLABLE"},
        {"name": "City", "type": "STRING", "mode": "NULLABLE"},
        {"name": "Sport", "type": "STRING", "mode": "NULLABLE"},
        {"name": "Event", "type": "STRING", "mode": "NULLABLE"},
        {"name": "Medal", "type": "STRING", "mode": "NULLABLE"}
    ]
    
    schema_file = os.path.join(os.path.dirname(__file__), "..", "paralympians_schema.json")
    with open(schema_file, 'w') as f_schema:
        json.dump(schema, f_schema, indent=4)
    print(f"Updated BigQuery schema saved to: {schema_file}")

if __name__ == "__main__":
    prepare_data()
