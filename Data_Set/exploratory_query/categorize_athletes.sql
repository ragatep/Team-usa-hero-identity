-- BIGQUERY SQL: Create Unified Hero Identities Table
-- Project: Team USA Hero Identity (Digital Mirror)

CREATE OR REPLACE TABLE `project-e1786661-5608-4308-9ad.team_usa_hackathon.hero_identities` AS
WITH unified_data AS (
  -- Olympic Data
  SELECT 
    ID, Name, Sex, 
    IF(Age = 'NA', NULL, CAST(Age AS INT64)) as Age,
    Height, Weight, Team, NOC, Games, Year, Season, City, Sport, Event, Medal,
    'Olympic' as Origin
  FROM `project-e1786661-5608-4308-9ad.team_usa_hackathon.team_usa_olympians`
  
  UNION ALL
  
  -- Paralympic Data
  SELECT 
    ID, Name, Sex, 
    IF(Age = 'NA', NULL, CAST(Age AS INT64)) as Age,
    Height, Weight, Team, NOC, Games, Year, Season, City, Sport, Event, Medal,
    'Paralympic' as Origin
  FROM `project-e1786661-5608-4308-9ad.team_usa_hackathon.team_usa_paralympians`
),
athlete_medal_counts AS (
  SELECT ID, Name, 
         SUM(CASE WHEN Medal = 'Gold' THEN 1 ELSE 0 END) as Total_Golds,
         SUM(CASE WHEN Medal IN ('Silver', 'Bronze') THEN 1 ELSE 0 END) as Total_Other_Medals
  FROM unified_data
  GROUP BY ID, Name
),
unified_with_rarity AS (
  SELECT u.*,
         CASE
           WHEN a.Total_Golds > 1 THEN 'Legendary'
           WHEN a.Total_Golds = 1 THEN 'Epic'
           WHEN a.Total_Other_Medals > 0 THEN 'Rare'
           ELSE 'Common'
         END as Rarity
  FROM unified_data u
  JOIN athlete_medal_counts a ON u.ID = a.ID AND u.Name = a.Name
),
archetype_mapping AS (
  SELECT *,
    CASE 
      -- 1. THE TANK (Defense & Control)
      WHEN Sport IN ('Weightlifting', 'Judo', 'Wrestling', 'Boxing', 'Taekwondo', 'Karate', 'Bobsleigh', 'Rugby', 'Rugby Sevens', 'Tug-Of-War', 'Powerlifting', 'Para Powerlifting') THEN 'Tank'
      
      -- 2. THE DPS (Damage Dealers & Strikers) - High Burst Output
      WHEN Sport IN ('Fencing', 'Skeleton', 'Luge', 'Speed Skating', 'Short Track Speed Skating', 'Sled Hockey', 'Ice Hockey', 'Football', 'Soccer', 'Baseball', 'Softball', 'Gymnastics', 'Artistic Gymnastics', 'Rhythmic Gymnastics', 'Trampolining') 
           OR (Sport = 'Athletics' AND (REGEXP_CONTAINS(Event, r'100m|200m|400m|Relay|Hurdles'))) THEN 'DPS'
           
      -- 3. THE DPS (DoT / Damage Over Time) - Endurance Specialists
      WHEN Sport IN ('Swimming', 'Para Swimming', 'Cycling', 'Para-Cycling', 'Rowing', 'Para-Rowing', 'Kayaking', 'Canoeing', 'Paracanoe', 'Triathlon', 'Paratriathlon', 'Modern Pentathlon', 'Cross-Country Skiing', 'Para Nordic Skiing', 'Biathlon', 'Para Biathlon', 'Marathon', 'Walking', 'Alpinism') 
           OR (Sport = 'Athletics' AND NOT REGEXP_CONTAINS(Event, r'100m|200m|400m|Relay|Hurdles')) THEN 'DPS (DoT)'
      
      -- 4. THE SUPPORT (Utility & Buffs) - Team Synergy
      WHEN Sport IN ('Basketball', 'Wheelchair Basketball', 'Volleyball', 'Beach Volleyball', 'Sitting Volleyball', 'Handball', 'Lacrosse') THEN 'Support'
      
      -- 5. THE CONTROLLER (Strategy & Field Manipulation) - Precision & Range
      WHEN Sport IN ('Archery', 'Para Archery', 'Shooting', 'Equestrianism', 'Sailing', 'Diving', 'Boccia', 'Golf', 'Curling', 'Wheelchair Curling', 'Croquet', 'Roque', 'Polo', 'Cricket', 'Motorboating', 'Tennis', 'Wheelchair Tennis', 'Table Tennis', 'Para Table Tennis', 'Badminton', 'Para Badminton', 'Racquets') THEN 'Controller'
      
      ELSE 'DPS' -- Default fallback
    END as Archetype
  FROM unified_with_rarity
),
stat_generation AS (
  SELECT *,
    -- Use FARM_FINGERPRINT for deterministic but random-looking stats (0-100)
    ABS(MOD(FARM_FINGERPRINT(CONCAT(Name, CAST(Year AS STRING))), 15)) as variance_seed
  FROM archetype_mapping
)
SELECT 
  *,
  -- Generate Stats based on Archetype + Variance
  CASE 
    WHEN Archetype = 'Tank' THEN 85 + variance_seed
    WHEN Archetype LIKE 'DPS%' THEN 60 + variance_seed
    WHEN Archetype = 'Support' THEN 70 + variance_seed
    ELSE 50 + variance_seed
  END as STRENGTH,
  
  CASE 
    WHEN Archetype = 'DPS' THEN 85 + variance_seed
    WHEN Archetype = 'DPS (DoT)' THEN 75 + variance_seed
    WHEN Archetype = 'Controller' THEN 65 + variance_seed
    ELSE 40 + variance_seed
  END as SPEED,
  
  CASE 
    WHEN Archetype = 'Controller' THEN 85 + variance_seed
    WHEN Archetype = 'Support' THEN 75 + variance_seed
    WHEN Archetype LIKE 'DPS%' THEN 65 + variance_seed
    ELSE 40 + variance_seed
  END as PRECISION,
  
  CASE 
    WHEN Archetype = 'Support' THEN 85 + variance_seed
    WHEN Archetype = 'DPS' THEN 75 + variance_seed
    WHEN Archetype = 'Controller' THEN 70 + variance_seed
    ELSE 40 + variance_seed
  END as UTILITY,
  
  CASE 
    WHEN Archetype = 'DPS (DoT)' THEN 85 + variance_seed
    WHEN Archetype = 'Tank' THEN 80 + variance_seed
    WHEN Archetype = 'Support' THEN 75 + (variance_seed / 2)
    ELSE 40 + variance_seed
  END as ENDURANCE
FROM stat_generation;
