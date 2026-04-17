-- Create OTP verification table
CREATE TABLE IF NOT EXISTS otp_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  email VARCHAR(255) NOT NULL,
  otp_code VARCHAR(6) NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  is_used BOOLEAN DEFAULT FALSE,
  attempts INTEGER DEFAULT 0,
  last_resend_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX idx_otp_user_id ON otp_verifications(user_id);
CREATE INDEX idx_otp_email ON otp_verifications(email);
CREATE INDEX idx_otp_code ON otp_verifications(otp_code);
CREATE INDEX idx_otp_expires_at ON otp_verifications(expires_at);

-- Enable RLS
ALTER TABLE otp_verifications ENABLE ROW LEVEL SECURITY;

-- Allow service role to manage OTP records
CREATE POLICY "Service role can manage OTP verifications" 
  ON otp_verifications
  FOR ALL
  TO authenticated, service_role
  USING (TRUE)
  WITH CHECK (TRUE);
