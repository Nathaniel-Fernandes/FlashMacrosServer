import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// load environment variables
dotenv.config()

const supabaseUrl = 'https://hlsylgmkrlvnzjpugzei.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)


const { data, error } = await supabase
  .from('USERS')
  .insert([
    { USERNAME: 'test123', FIRST_NAME: 'Nathaniel', LAST_NAME: 'Fernandes' },
  ])
  .select()

console.log('test: ', error)