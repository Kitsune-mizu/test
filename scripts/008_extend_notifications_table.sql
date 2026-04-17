-- Add read_at field to notifications table
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS read_at TIMESTAMP NULL;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON notifications(user_id, read_status);
CREATE INDEX IF NOT EXISTS idx_notifications_created ON notifications(created_at DESC);

-- Create trigger function to auto-update read_status when read_at is set
CREATE OR REPLACE FUNCTION update_notification_read_status()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.read_at IS NOT NULL AND NEW.read_status = false THEN
    NEW.read_status = true;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS trg_update_notification_read_status ON notifications;
CREATE TRIGGER trg_update_notification_read_status
  BEFORE UPDATE ON notifications
  FOR EACH ROW
  EXECUTE FUNCTION update_notification_read_status();
