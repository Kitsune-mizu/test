-- Create notification settings table
CREATE TABLE IF NOT EXISTS public.notification_preferences (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
  
  -- Email notifications
  email_new_order BOOLEAN DEFAULT true,
  email_order_confirmed BOOLEAN DEFAULT true,
  email_order_preparing BOOLEAN DEFAULT true,
  email_order_shipped BOOLEAN DEFAULT true,
  email_order_delivered BOOLEAN DEFAULT true,
  email_product_update BOOLEAN DEFAULT true,
  email_low_stock BOOLEAN DEFAULT true,
  email_promotional BOOLEAN DEFAULT false,
  
  -- In-app notifications
  app_new_order BOOLEAN DEFAULT true,
  app_order_confirmed BOOLEAN DEFAULT true,
  app_order_preparing BOOLEAN DEFAULT true,
  app_order_shipped BOOLEAN DEFAULT true,
  app_order_delivered BOOLEAN DEFAULT true,
  app_product_update BOOLEAN DEFAULT true,
  app_low_stock BOOLEAN DEFAULT true,
  app_promotional BOOLEAN DEFAULT false,
  
  -- Push notifications
  push_orders BOOLEAN DEFAULT true,
  push_promotions BOOLEAN DEFAULT false,
  
  -- Frequency settings
  email_frequency TEXT DEFAULT 'immediate' CHECK (email_frequency IN ('immediate', 'daily', 'weekly', 'never')),
  
  -- Communication preferences
  newsletter_subscribed BOOLEAN DEFAULT true,
  communication_language TEXT DEFAULT 'en',
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_notification_preferences_user_id 
  ON public.notification_preferences(user_id);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_notification_preferences_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_update_notification_preferences_timestamp 
  ON public.notification_preferences;

CREATE TRIGGER trg_update_notification_preferences_timestamp
  BEFORE UPDATE ON public.notification_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_notification_preferences_timestamp();

-- Create function to get or create notification preferences
CREATE OR REPLACE FUNCTION get_or_create_notification_preferences(p_user_id uuid)
RETURNS TABLE (
  id uuid,
  user_id uuid,
  email_new_order boolean,
  email_order_confirmed boolean,
  email_order_preparing boolean,
  email_order_shipped boolean,
  email_order_delivered boolean,
  email_product_update boolean,
  email_low_stock boolean,
  email_promotional boolean,
  app_new_order boolean,
  app_order_confirmed boolean,
  app_order_preparing boolean,
  app_order_shipped boolean,
  app_order_delivered boolean,
  app_product_update boolean,
  app_low_stock boolean,
  app_promotional boolean,
  push_orders boolean,
  push_promotions boolean,
  email_frequency text,
  newsletter_subscribed boolean,
  communication_language text
) AS $$
BEGIN
  -- Try to insert if not exists
  INSERT INTO public.notification_preferences (user_id)
  VALUES (p_user_id)
  ON CONFLICT (user_id) DO NOTHING;
  
  -- Return the preferences
  RETURN QUERY
  SELECT
    np.id,
    np.user_id,
    np.email_new_order,
    np.email_order_confirmed,
    np.email_order_preparing,
    np.email_order_shipped,
    np.email_order_delivered,
    np.email_product_update,
    np.email_low_stock,
    np.email_promotional,
    np.app_new_order,
    np.app_order_confirmed,
    np.app_order_preparing,
    np.app_order_shipped,
    np.app_order_delivered,
    np.app_product_update,
    np.app_low_stock,
    np.app_promotional,
    np.push_orders,
    np.push_promotions,
    np.email_frequency,
    np.newsletter_subscribed,
    np.communication_language
  FROM public.notification_preferences np
  WHERE np.user_id = p_user_id;
END;
$$ LANGUAGE plpgsql;

-- Enable RLS on notification preferences
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
DROP POLICY IF EXISTS "Users can view own notification preferences" ON public.notification_preferences;
DROP POLICY IF EXISTS "Users can update own notification preferences" ON public.notification_preferences;
DROP POLICY IF EXISTS "System can insert notification preferences" ON public.notification_preferences;

CREATE POLICY "Users can view own notification preferences"
  ON public.notification_preferences
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notification preferences"
  ON public.notification_preferences
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "System can insert notification preferences"
  ON public.notification_preferences
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Enhance notifications table with more metadata
ALTER TABLE public.notifications 
  ADD COLUMN IF NOT EXISTS title TEXT,
  ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'general' CHECK (category IN ('order', 'product', 'system', 'promotional', 'general')),
  ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high')),
  ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS read_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;

-- Create indexes for notifications
CREATE INDEX IF NOT EXISTS idx_notifications_user_category 
  ON public.notifications(user_id, category);
CREATE INDEX IF NOT EXISTS idx_notifications_user_read 
  ON public.notifications(user_id, read_status);
CREATE INDEX IF NOT EXISTS idx_notifications_priority 
  ON public.notifications(priority DESC);

-- Create function to clean up old read notifications
CREATE OR REPLACE FUNCTION cleanup_old_notifications(days_old INT DEFAULT 30)
RETURNS INT AS $$
DECLARE
  deleted_count INT;
BEGIN
  DELETE FROM public.notifications
  WHERE read_status = true 
    AND created_at < NOW() - INTERVAL '1 day' * days_old;
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;
