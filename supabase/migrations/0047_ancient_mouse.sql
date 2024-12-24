-- Update the category constraint to include 'aideas'
ALTER TABLE projects 
DROP CONSTRAINT IF EXISTS valid_category;

ALTER TABLE projects 
ADD CONSTRAINT valid_category 
CHECK (category IN ('architecture', 'events', 'aideas'));

-- Update existing AIdeas LAB projects
UPDATE projects 
SET category = 'aideas' 
WHERE name IN ('MindMeeting', 'Dreamer AI', 'Pixel Mapper');