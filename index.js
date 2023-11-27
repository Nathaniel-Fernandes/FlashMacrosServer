import express from 'express'

const app = express()
app.use(express.json())
const port = process.env.PORT || 3000

// MiddleWare
const LoginLogic = (req, res, next) => {
  if (!!req.query.token) {
    const isAuthenticated = (req.query.token === 'valid token') ? true : false

    if (isAuthenticated) {
      const isAuthorized = (['0', '1'].includes(req.params?.user_id) || ['0', '1'].includes(req.query?.user_id)) ? true : false

      if (isAuthorized) {
        next()
      }
      else {
        res.sendStatus(403)
      }
    }
    else {
      res.status(401).send('Unauthenticated. Please log in.')
    }
  }

  else {
    res.status(400).send('Missing OAuth access_token. Please retry.')
  }
}

// 1. User Related Routes
// read user's details
app.get('/user/:user_id', LoginLogic, (req, res) => {
  // [ECEN 404 TODO] Query the DB and check following
  // 1. Authentication: OAuth token is in DB (i.e., user is signed in)
  // 2. Authorization: OAuth token matches User that has given ID (i.e., does user have permission to access data for )
  res.status(200).send({
    data: {
      name: 'Johanna Doe',
      email: 'johanna@company.com',
      heightFeet: '5',
      heightInches: '5',
      weight: '130',
      race: 'White',
      age: '27',
      sex: 'F'
    }
  })
})

// create a user
app.post('/user', (req, res) => {
  if (!!req.query.username && !!req.query.password) {
    // [ECEN 404 TODO]: attempt to save username/password in db
    const savedSuccessfully = (req.query.username === 'save-succeeds') ? true : false

    if (savedSuccessfully) {
      res.sendStatus(200)
    }
    else {
      if (req.query.username === 'username-already-taken') {
        res.status(409).send('Username already taken')
      }
      else {
        res.status(500).send('Internal Server Error. Please try again.')
      }
    }
  }
  else {
    res.status(400).send('Username or password is missing')
  }
})

// update user's profile information
app.put('/user/:user_id', LoginLogic, (req, res) => {
  // [ECEN 404 TODO] Query the DB and check following
  // 1. Authentication: OAuth token is in DB (i.e., user is signed in)
  // 2. Authorization: OAuth token matches User that has given ID (i.e., does user have permission to access data for )
  if (!!req.body.data) {
    const savedSuccessfully = (req.body?.data.name === 'Johanna Doe') ? true : false

    if (savedSuccessfully) {
      res.sendStatus(200)
    }
    else {
      res.sendStatus(500)
    }
  }
  else {
    res.status(400).send('Missing data to update profile.')
  }
})

// delete user's profile information
app.delete('/user/:user_id', LoginLogic, (req, res) => {
  const deletedSuccessfully = (req.params.id === '0') ? true : false

  if (deletedSuccessfully) {
    res.sendStatus(200)
  }
  else {
    res.sendStatus(500)
  }

})

// Meal Related Routes
app.get('/meal/:id', (req, res) => {

})
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

//create
app.get('/meal/:id', LoginLogic, (req, res) => {
  if (['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'].includes(req.params.id)) {
    if (req.query.user_id === '0' && ['0', '1', '2', '3', '4', '5'].includes(req.params.id)) {
      res.status(200).send({
        'title': '10/13/2023 12:01 PM',
        'description': '',
        'CMNP': {
          'calories': 431,
          'proteins': 22,
          'fats': 16,
          'carbs': 37
        },
        'tags': [],
        'img': {
          'URI': require('../assets/cheftai.jpg'),
          'width': 3024,
          'height': 2830
        }
      })
    }
    else if (req.query.user_id === '1' && ['6', '7', '8', '9', '10'].includes(req.params.id)) {
      res.status(200).send({
        'title': '10/13/2023 6:53 PM',
        'description': 'Atlantic salmon with buttered corn and mashed potatoes',
        'CMNP': {
          'calories': 768,
          'proteins': 42,
          'fats': 31,
          'carbs': 56
        },
        'tags': ['Salmon', 'Corn', 'Mashed Potatoes'],
        'img': {
          'URI': 'salmon.jpg',
          'width': 4032,
          'height': 3024
        }
      })
    }
    else {
      res.sendStatus(403)
    }
  }
  else {
    res.sendStatus(404)
  }
})

app.post('/meal/', LoginLogic, (req, res) => {
  if (req.query?.user_id === '0') {
    res.sendStatus(200)
  }
  else {
    res.status(500).send('Internal Server Error. Failed to save.')
  }
})

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

// spawn C&MNP Cron job 
app.post('/cmnp/', LoginLogic, (req, res) => {
  if (req.query?.user_id === '0') {
    res.sendStatus(200)
  }
  else {
    res.status(500).send('Internal Server Error. Failed to start Cron Job.')
  }
})

app.get('/', (req, res) => {
  res.send(`Hello World! Running on port ${port}`)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})