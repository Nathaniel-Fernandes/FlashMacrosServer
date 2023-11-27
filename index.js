const express = require('express')

const app = express()
const port = process.env.PORT || 3000

// User Related Routes
app.post('/user') // create a user

app.get('/user/:id') // read user's details

app.post('/user/:id') // update user's profile information

app.delete('/user/:id') // delete user's profile information

// Meal Related Routes
// app.get('/meal/:id') // read meal data (CMN, )      'title': '10/13/2023 6:53 PM',
//       'description': 'Atlantic salmon with buttered corn and mashed potatoes',
//       'CMNP': {
//           'calories': 768,
//           'proteins': 42,
//           'fats': 31,
//           'carbs': 56
//       },
//       'tags': ['Salmon', 'Corn', 'Mashed Potatoes'],
//       'img': {
//         'URI': require('../assets/salmon.jpg'),
//         'width': 4032,
//         'height': 3024
//       }
//   },

app.post('/meal/') //create

app.post('/meal/:id') // update

app.delete('/meal/:id') // delete

// CGM data storage
app.post('/cgm/') // create, must encrypt too

app.get('/viome/:id') // get

app.delete('/viome/:id') // delete

// Viome data storage
app.post('/viome/') // create

app.delete('/viome/:id') //delete

app.get('/viome/:id') // read

// 
app.post('/cmnp/') // spawn C&MNP Cron job

app.get('/', (req, res) => {
  res.send(`Hello World! Running on port ${port}`)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})