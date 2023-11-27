import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// load environment variables
dotenv.config()

const supabaseUrl = 'https://hlsylgmkrlvnzjpugzei.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

// 1. read data from database
let { data, error } = await supabase
  .from('CAL_MACRO_PREDICTION')
  .select('*')

console.log('test: ', data)