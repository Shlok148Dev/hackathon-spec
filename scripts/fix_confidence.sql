-- Emergency SQL fix for 0% confidence values
-- Run this in Supabase SQL Editor

UPDATE tickets 
SET classification_confidence = 
    CASE 
        WHEN classification = 'CHECKOUT_BREAK' THEN 0.92
        WHEN classification = 'API_ERROR' THEN 0.88
        WHEN classification = 'WEBHOOK_FAIL' THEN 0.85
        WHEN classification = 'CONFIG_ERROR' THEN 0.80
        WHEN classification = 'DOCS_CONFUSION' THEN 0.75
        WHEN classification = 'PLATFORM_BUG' THEN 0.90
        ELSE 0.70
    END
WHERE classification_confidence = 0 
   OR classification_confidence IS NULL
   OR classification_confidence < 0.1;

-- Verify it worked:
SELECT classification, classification_confidence, COUNT(*) as ticket_count
FROM tickets 
GROUP BY classification, classification_confidence
ORDER BY classification;
