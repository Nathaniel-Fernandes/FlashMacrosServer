import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// load environment variables
dotenv.config()

const supabaseUrl = 'https://hlsylgmkrlvnzjpugzei.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

const { data, error } = await supabase
  .storage
  .from('MealImages')
  .list('MealImages', {
    limit: 100,
    offset: 0,
    sortBy: { column: 'name', order: 'asc' },
  })

console.log(data)
  
// const { data, error } = await supabase
//   .from('USERS')
//   .insert([
//     { USERNAME: 'test123', FIRST_NAME: 'Nathaniel', LAST_NAME: 'Fernandes' },
//   ])
//   .select()

// let { data, error } = await supabase
//   .from('CAL_MACRO_PREDICTION')
//   .select('*')

// console.log(data)