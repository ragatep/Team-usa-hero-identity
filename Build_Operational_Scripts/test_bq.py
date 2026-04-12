from google.cloud import bigquery

# Configuration
PROJECT_ID = "project-e1786661-5608-4308-9ad"
DATASET_ID = "team_usa_hackathon"
TABLE_ID = "team_usa_olympians"

def test_bigquery():
    print(f"--- BigQuery Data Test ---")
    print(f"Querying random Team USA athletes from the {TABLE_ID} table...\n")
    
    # Initialize BigQuery Client
    client = bigquery.Client(project=PROJECT_ID)
    
    # SQL Query: Get 5 athletes from 2016 with full biometric data
    query = f"""
        SELECT Name, Sex, Age, Height, Weight, Sport, Event, Medal
        FROM `{PROJECT_ID}.{DATASET_ID}.{TABLE_ID}`
        WHERE Year = 2016 
          AND Height IS NOT NULL 
          AND Weight IS NOT NULL
        LIMIT 5
    """
    
    try:
        query_job = client.query(query)
        results = query_job.result()
        
        print(f"{'Name':<30} | {'Sport':<15} | {'Height':<6} | {'Weight':<6} | {'Medal'}")
        print("-" * 75)
        
        for row in results:
            medal = row.Medal if row.Medal else "None"
            print(f"{row.Name[:30]:<30} | {row.Sport:<15} | {row.Height:<6} | {row.Weight:<6} | {medal}")
            
        print("\nSUCCESS: BigQuery is connected and the Team USA dataset is ready for analysis!")
        
    except Exception as e:
        print(f"\nERROR: Query failed.")
        print(str(e))

if __name__ == "__main__":
    test_bigquery()
Line: 1
