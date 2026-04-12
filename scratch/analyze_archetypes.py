from google.cloud import bigquery

PROJECT_ID = "project-e1786661-5608-4308-9ad"
DATASET_ID = "team_usa_hackathon"
TABLE_ID = "team_usa_olympians"

def analyze_archetypes():
    client = bigquery.Client(project=PROJECT_ID)
    
    # SQL to find extremes for each biological category
    query = f"""
        WITH SportStats AS (
            SELECT 
                Sport, 
                COUNT(*) as athlete_count,
                AVG(SAFE_CAST(Height AS FLOAT64)) as avg_h, 
                AVG(SAFE_CAST(Weight AS FLOAT64)) as avg_w,
                AVG(SAFE_CAST(Age AS FLOAT64)) as avg_a
            FROM `{PROJECT_ID}.{DATASET_ID}.{TABLE_ID}`
            WHERE Height IS NOT NULL AND Weight IS NOT NULL AND Height != 'NA' AND Weight != 'NA'
            GROUP BY Sport
            HAVING athlete_count > 10
        )
        SELECT * FROM (
            (SELECT 'TITAN' as archetype, Sport, avg_h, avg_w, avg_a FROM SportStats ORDER BY avg_w DESC LIMIT 3)
            UNION ALL
            (SELECT 'SCOUT' as archetype, Sport, avg_h, avg_w, avg_a FROM SportStats ORDER BY (avg_w / (avg_h/100 * avg_h/100)) ASC LIMIT 3)
            UNION ALL
            (SELECT 'NAVIGATOR' as archetype, Sport, avg_h, avg_w, avg_a FROM SportStats ORDER BY avg_h DESC LIMIT 3)
            UNION ALL
            (SELECT 'SOLO' as archetype, Sport, avg_h, avg_w, avg_a FROM SportStats ORDER BY avg_a DESC LIMIT 3)
            UNION ALL
            (SELECT 'GHOST' as archetype, Sport, avg_h, avg_w, avg_a FROM SportStats ORDER BY (avg_h / avg_w) DESC LIMIT 3)
        )
    """
    
    try:
        query_job = client.query(query)
        results = query_job.result()
        
        print(f"{'ARCHETYPE':<10} | {'SPORT':<20} | {'AVG_H':<6} | {'AVG_W':<6} | {'AVG_A'}")
        print("-" * 60)
        
        for row in results:
            print(f"{row.archetype:<10} | {row.Sport:<20} | {row.avg_h:<6.1f} | {row.avg_w:<6.1f} | {row.avg_a:.1f}")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    analyze_archetypes()
