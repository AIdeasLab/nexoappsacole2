-- Add project_type enum for AIdeas LAB projects
CREATE TYPE aideas_project_type AS ENUM (
  'ai_development',
  'web_development',
  'mobile_development',
  'data_science',
  'computer_vision'
);

-- Add project_type column to projects table
ALTER TABLE projects 
ADD COLUMN project_type aideas_project_type;

-- Update existing AIdeas projects with types
UPDATE projects 
SET project_type = 'ai_development' 
WHERE name = 'MindMeeting' AND category = 'aideas';

UPDATE projects 
SET project_type = 'computer_vision' 
WHERE name = 'Dreamer AI' AND category = 'aideas';

UPDATE projects 
SET project_type = 'computer_vision' 
WHERE name = 'Pixel Mapper' AND category = 'aideas';