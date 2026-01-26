-- Add cancelled_at column to bookings for admin cancellations auditing
ALTER TABLE bookings ADD COLUMN cancelled_at TIMESTAMP;
