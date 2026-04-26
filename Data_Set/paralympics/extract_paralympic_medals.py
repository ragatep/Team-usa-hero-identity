import csv
import re

input_raw = r'E:\joffet\Documents\GitHubRepo\Team-usa-hero-identity\Data_Set\paralympics\team_usa_paralympians.csv'
input_clean = r'E:\joffet\Documents\GitHubRepo\Team-usa-hero-identity\Data_Set\paralympics\team_usa_paralympians_clean.csv'
output_clean = r'E:\joffet\Documents\GitHubRepo\Team-usa-hero-identity\Data_Set\paralympics\team_usa_paralympians_clean_patched.csv'

def extract_medals(bio):
    match = re.search(r'Paralympic medalist \((.*?)\)', str(bio), re.IGNORECASE)
    golds, silvers, bronzes = 0, 0, 0
    if match:
        medal_str = match.group(1).lower()
        g_match = re.search(r'(\d+)\s*gold', medal_str)
        s_match = re.search(r'(\d+)\s*silver', medal_str)
        b_match = re.search(r'(\d+)\s*bronze', medal_str)
        if g_match: golds = int(g_match.group(1))
        if s_match: silvers = int(s_match.group(1))
        if b_match: bronzes = int(b_match.group(1))
    return golds, silvers, bronzes

bios = {}
with open(input_raw, 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        bios[row['Name'].strip()] = row['Biography']

output_rows = []
seen_ids = set()

with open(input_clean, 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    fieldnames = list(reader.fieldnames)
    for row in reader:
        athlete_id = row['ID']
        if athlete_id in seen_ids:
            continue  # Only process the first row per athlete
        seen_ids.add(athlete_id)
        
        name = row['Name'].strip()
        bio = bios.get(name, "")
        g, s, b = extract_medals(bio)
        
        total_medals = g + s + b
        if total_medals == 0:
            row['Medal'] = 'NA'
            output_rows.append(row)
        else:
            for _ in range(g):
                new_row = dict(row)
                new_row['Medal'] = 'Gold'
                output_rows.append(new_row)
            for _ in range(s):
                new_row = dict(row)
                new_row['Medal'] = 'Silver'
                output_rows.append(new_row)
            for _ in range(b):
                new_row = dict(row)
                new_row['Medal'] = 'Bronze'
                output_rows.append(new_row)

print(f"Total unique athletes processed: {len(seen_ids)}")
print(f"Total rows after explosion: {len(output_rows)}")

oksana = [r for r in output_rows if 'Oksana' in r['Name']]
print(f"Oksana Masters row count: {len(oksana)}")
if len(oksana) > 0:
    print(f"Oksana first row medal: {oksana[0]['Medal']}")

with open(output_clean, 'w', encoding='utf-8', newline='') as f:
    writer = csv.DictWriter(f, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(output_rows)
