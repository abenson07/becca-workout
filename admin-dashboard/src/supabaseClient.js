import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ilpnqqvfptdkkzqqplql.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlscG5xcXZmcHRka2t6cXFwbHFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg4NzYxNDAsImV4cCI6MjA2NDQ1MjE0MH0.9Omtk-n3I8_Mlt7YYFP4euRtae6-Wc3LVUwC7Qo1Fws';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

