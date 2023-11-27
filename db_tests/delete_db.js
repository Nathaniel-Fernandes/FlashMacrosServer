import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// load environment variables
dotenv.config()

const supabaseUrl = 'https://hlsylgmkrlvnzjpugzei.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

// 2. write data to database
const { data, error } = await supabase
  .from('USERS')
  .delete()
  .eq('USERNAME', 'test123')

console.log('test', error)