import csv
import os

def compare_names():
    olympic_file = os.path.join(os.path.dirname(__file__), "..", "Data_Set", "olympics", "athlete_events.csv")
    paralympic_file = os.path.join(os.path.dirname(__file__), "..", "Data_Set", "paralympics", "team_usa_paralympians.csv")

    if not os.path.exists(olympic_file):
        print(f"Error: {olympic_file} not found.")
        return
    if not os.path.exists(paralympic_file):
        print(f"Error: {paralympic_file} not found.")
        return

    print("Reading Olympic names...")
    olympic_names = set()
    try:
        with open(olympic_file, mode='r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                name = row['Name'].strip()
                olympic_names.add(name)
    except Exception as e:
        print(f"Error reading olympics file: {e}")
        return

    print(f"Loaded {len(olympic_names)} unique Olympic names.")

    print("Comparing with Paralympic names...")
    overlaps = []
    try:
        with open(paralympic_file, mode='r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                name = row['Name'].strip()
                if name in olympic_names:
                    overlaps.append(name)
    except Exception as e:
        print(f"Error reading paralympics file: {e}")
        return

    print(f"Found {len(overlaps)} overlaps:")
    for name in sorted(list(set(overlaps))):
        print(f"- {name}")

if __name__ == "__main__":
    compare_names()
