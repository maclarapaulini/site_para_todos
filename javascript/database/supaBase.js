import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'

const SUPABASE_URL = 'https://kpsqgmtvrlfkopwmdtgz.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_RxqKzoGQ2O0Bjkqab7F0eQ_BBxTSAVi'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)