-- Run this in your Supabase SQL Editor

-- 1. Create tables
CREATE TABLE IF NOT EXISTS public.farms (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name text NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.farm_profile (
    farm_id uuid PRIMARY KEY REFERENCES public.farms(id) ON DELETE CASCADE,
    role text,
  scale text,
  primary_focus text,
  location text,
  size_hectares text,
  operations jsonb,
  crops jsonb,
  irrigation text,
  storage text,
  livestock_details jsonb,
  tech jsonb,
  machinery jsonb,
  compliance_region text,
  certifications jsonb,
    setup_completed_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.farms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farm_profile ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS Policies

-- Users can only view their own farm
CREATE POLICY "Users can view own farm" 
    ON public.farms FOR SELECT 
    USING (auth.uid() = owner_id);

-- Users can only insert their own farm
CREATE POLICY "Users can insert own farm" 
    ON public.farms FOR INSERT 
    WITH CHECK (auth.uid() = owner_id);

-- Users can only view their own farm's profile
CREATE POLICY "Users can view own farm profile" 
    ON public.farm_profile FOR SELECT 
    USING (EXISTS (
        SELECT 1 FROM public.farms 
        WHERE farms.id = farm_profile.farm_id 
        AND farms.owner_id = auth.uid()
    ));

-- Users can only insert their own farm's profile
CREATE POLICY "Users can insert own farm profile" 
    ON public.farm_profile FOR INSERT 
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.farms 
        WHERE farms.id = farm_profile.farm_id 
        AND farms.owner_id = auth.uid()
    ));

-- Users can update their own farm profile
CREATE POLICY "Users can update own farm profile" 
    ON public.farm_profile FOR UPDATE
    USING (EXISTS (
        SELECT 1 FROM public.farms 
        WHERE farms.id = farm_profile.farm_id 
        AND farms.owner_id = auth.uid()
    ));
