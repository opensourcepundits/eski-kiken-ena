-- Add a running counter for number of bookings per listing
ALTER TABLE bookings
ADD COLUMN count integer NOT NULL DEFAULT 0;
