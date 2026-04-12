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
archetype_mapping AS (
  SELECT *,
    CASE 
      -- 1. OVERCLOCKERS: Multi-sport athletes (detected by comma or slash)
      WHEN REGEXP_CONTAINS(Sport, r'[,/]') THEN 'Overclocker'
      
      -- 2. BEHEMOTH: Strength & Power
      WHEN Sport IN ('Weightlifting', 'Judo', 'Wrestling', 'Boxing', 'Taekwondo', 'Karate', 'Bobsleigh', 'Rugby', 'Rugby Sevens', 'Tug-Of-War', 'Powerlifting', 'Para Powerlifting') THEN 'Behemoth'
      
      -- 3. SOLO: Speed & Combat
      WHEN Sport IN ('Fencing', 'Skeleton', 'Luge', 'Speed Skating', 'Short Track Speed Skating', 'Sled Hockey', 'Ice Hockey', 'Football', 'Soccer', 'Baseball', 'Softball') 
           OR (Sport = 'Athletics' AND (REGEXP_CONTAINS(Event, r'100m|200m|400m|Relay|Hurdles'))) THEN 'Solo'
      
      -- 4. NETRUNNER: Precision & Focus
      WHEN Sport IN ('Archery', 'Para Archery', 'Shooting', 'Equestrianism', 'Sailing', 'Diving', 'Boccia', 'Golf', 'Curling', 'Wheelchair Curling', 'Croquet', 'Roque', 'Polo', 'Cricket', 'Motorboating') THEN 'Netrunner'
      
      -- 5. SCOUT: Agility & Reflexes
      WHEN Sport IN ('Gymnastics', 'Artistic Gymnastics', 'Rhythmic Gymnastics', 'Trampolining', 'Basketball', 'Wheelchair Basketball', 'Table Tennis', 'Para Table Tennis', 'Badminton', 'Para Badminton', 'Tennis', 'Wheelchair Tennis', 'Volleyball', 'Beach Volleyball', 'Sitting Volleyball', 'Handball', 'Lacrosse', 'Racquets') THEN 'Scout'
      
      -- 6. GHOST: Endurance & Flow
      WHEN Sport IN ('Swimming', 'Para Swimming', 'Cycling', 'Para-Cycling', 'Rowing', 'Para-Rowing', 'Kayaking', 'Canoeing', 'Paracanoe', 'Triathlon', 'Paratriathlon', 'Modern Pentathlon', 'Cross-Country Skiing', 'Para Nordic Skiing', 'Biathlon', 'Para Biathlon', 'Marathon', 'Walking', 'Alpinism') THEN 'Ghost'
      
      ELSE 'Solo' -- Default fallback
    END as Archetype
  FROM unified_data
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
    WHEN Archetype = 'Behemoth' THEN 80 + variance_seed
    WHEN Archetype = 'Overclocker' THEN 75 + (variance_seed / 2)
    WHEN Archetype = 'Solo' THEN 60 + variance_seed
    ELSE 40 + variance_seed
  END as STRENGTH,
  
  CASE 
    WHEN Archetype = 'Solo' THEN 80 + variance_seed
    WHEN Archetype = 'Overclocker' THEN 75 + (variance_seed / 2)
    WHEN Archetype = 'Scout' THEN 70 + variance_seed
    ELSE 40 + variance_seed
  END as SPEED,
  
  CASE 
    WHEN Archetype = 'Netrunner' THEN 85 + variance_seed
    WHEN Archetype = 'Overclocker' THEN 75 + (variance_seed / 2)
    WHEN Archetype = 'Ghost' THEN 65 + variance_seed
    ELSE 40 + variance_seed
  END as PRECISION,
  
  CASE 
    WHEN Archetype = 'Scout' THEN 85 + variance_seed
    WHEN Archetype = 'Overclocker' THEN 75 + (variance_seed / 2)
    WHEN Archetype = 'Solo' THEN 65 + variance_seed
    ELSE 40 + variance_seed
  END as AGILITY,
  
  CASE 
    WHEN Archetype = 'Ghost' THEN 85 + variance_seed
    WHEN Archetype = 'Overclocker' THEN 75 + (variance_seed / 2)
    WHEN Archetype = 'Behemoth' THEN 60 + variance_seed
    ELSE 40 + variance_seed
  END as ENDURANCE
FROM stat_generation;
