# Supabase RLS Policy Setup

## Step 1: Create the Waitlist Table (if not already created)

Run this in your Supabase SQL Editor:

```sql
CREATE TABLE IF NOT EXISTS waitlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  referral_source TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Step 2: Enable Row Level Security

```sql
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;
```

## Step 3: Create Policies for Public Access

```sql
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public inserts" ON waitlist;
DROP POLICY IF EXISTS "Allow public select" ON waitlist;

-- Allow anyone to insert into waitlist (for signups)
CREATE POLICY "Allow public inserts" ON waitlist
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Allow public to select (needed for duplicate email checking)
CREATE POLICY "Allow public select" ON waitlist
  FOR SELECT
  TO public
  USING (true);
```

## Step 4: Verify the Setup

After running the above SQL, test your waitlist form. It should now work without authentication!

