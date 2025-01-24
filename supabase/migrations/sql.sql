/*
  # IMF Gadget Management System Schema

  1. New Tables
    - `gadgets`
      - `id` (uuid, primary key)
      - `name` (text)
      - `codename` (text)
      - `status` (text)
      - `decommissioned_at` (timestamptz)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      - `created_by` (uuid, references auth.users)

  2. Security
    - Enable RLS on `gadgets` table
    - Add policies for CRUD operations
    - Only authenticated users can access the table
*/

-- Create enum for gadget status
CREATE TYPE gadget_status AS ENUM (
  'Available',
  'Deployed',
  'Destroyed',
  'Decommissioned'
);

-- Create gadgets table
CREATE TABLE gadgets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  codename text NOT NULL UNIQUE,
  status gadget_status NOT NULL DEFAULT 'Available',
  decommissioned_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE gadgets ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Authenticated users can view their own gadgets only"
  ON gadgets
  FOR SELECT
  TO authenticated
  USING ( (( SELECT auth.uid() AS uid) = created_by));

CREATE POLICY "Authenticated users can insert gadgets"
  ON gadgets
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update their gadgets"
  ON gadgets
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by);

CREATE POLICY "Authenticated users can delete their gadgets"
  ON gadgets
  FOR DELETE
  TO authenticated
  USING (auth.uid() = created_by);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER update_gadgets_updated_at
  BEFORE UPDATE ON gadgets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();