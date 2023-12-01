import express from 'express'
import aesjs from 'aes-js'

const app = express()
app.use(express.json())
const port = process.env.PORT || 3000

// 0. MiddleWare
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

// 2. Meal Related Routes
// get a meal
app.get('/meal/:id', LoginLogic, (req, res) => {
  const mealExists = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'].includes(req.params.id)

  if (mealExists) {
    const userHasAccess = (req.query.user_id === '0' && ['0', '1', '2', '3', '4', '5'].includes(req.params.id)) || (req.query.user_id === '1' && ['6', '7', '8', '9', '10'].includes(req.params.id))
    if (userHasAccess) {
      const dataFetched = req.query.user_id === '0' ? {
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
      } : {
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
      }

      res.status(200).send(dataFetched)
    }
    else {
      res.sendStatus(403)
    }
  }
  else {
    res.sendStatus(404)
  }
})

// create a meal
app.post('/meal/', LoginLogic, (req, res) => {
  const savedDataSuccessfully = req.query?.user_id === '0' ? true : false

  if (savedDataSuccessfully) {
    res.sendStatus(200)
  }
  else {
    res.status(500).send('Internal Server Error. Failed to save.')
  }
})

// update
app.put('/meal/:id', LoginLogic, (req, res) => {
  const userHasAccess = (req.query.user_id === '0' && ['0', '1', '2', '3', '4', '5'].includes(req.params.id)) || (req.query.user_id === '1' && ['6', '7', '8', '9', '10'].includes(req.params.id))

  if (userHasAccess) {
    const updatedDataSuccessfully = ['1','2','6','7'].includes(req.params.id)

    if (updatedDataSuccessfully) {
      res.sendStatus(200)
    }
    else {
      res.sendStatus(500)
    }
  }
  else {
    res.sendStatus(403)
  }
})

app.delete('/meal/:id', (req, res) => {
  const userHasAccess = (req.query.user_id === '0' && ['0', '1', '2', '3', '4', '5'].includes(req.params.id)) || (req.query.user_id === '1' && ['6', '7', '8', '9', '10'].includes(req.params.id))

  if (userHasAccess) {
    const deleteDataSuccessfully = ['1','2','6','7'].includes(req.params.id)

    if (deleteDataSuccessfully) {
      res.sendStatus(200)
    }
    else {
      res.sendStatus(500)
    }
  }
  else {
    res.sendStatus(403)
  }
})

// CGM data storage
// create, must encrypt too
app.post('/cgm/', LoginLogic, (req, res) => {
  if (!!req.body.data) {
    var key = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16 ];
 
    // The initialization vector (must be 16 bytes)
    var iv = [ 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34,35, 36 ];
     
    // Convert text to bytes
    var text = JSON.stringify(req.body.data);
    var textBytes = aesjs.utils.utf8.toBytes(text);
     
    var aesOfb = new aesjs.ModeOfOperation.ofb(key, iv);
    var encryptedBytes = aesOfb.encrypt(textBytes);
     
    // To print or store the binary data, you may convert it to hex
    var encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);

    // When ready to decrypt the hex string, convert it back to bytes
    var encryptedBytes = aesjs.utils.hex.toBytes(encryptedHex);
     
    // The output feedback mode of operation maintains internal state,
    // so to decrypt a new instance must be instantiated.
    var aesOfb = new aesjs.ModeOfOperation.ofb(key, iv);
    var decryptedBytes = aesOfb.decrypt(encryptedBytes);
     
    // Convert our bytes back into text
    var decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes);

    res.status(200).send({
      'original': req.body.data,
      'encrypted': encryptedHex,
      'decrypted': JSON.parse(decryptedText),
      'encryptionKey': [key, iv]
    })
  }
  else {
    res.sendStatus(400)
  }
})

app.delete('/cgm/:id', LoginLogic, (req, res) => {
  const cgmDataExists = ['0', '1', '2'].includes(req.params.id) ? true : false

  if (cgmDataExists) {
    const userHasAccess = (req.query.user_id === '0' && ['0', '1'].includes(req.params.id)) || (req.query.user_id === '1' && req.params.id === '2')

    if (userHasAccess) {
        const deletedSuccessfully = (req.params.id === '0') ? true : false

        if (deletedSuccessfully) {
          res.sendStatus(200)
        }
        else {
          res.sendStatus(500)
        }
    }
    else {
      res.sendStatus(403)
    }
  }
  else {
    res.sendStatus(404)
  }
})

app.get('/cgm/:id', LoginLogic, (req, res) => {
  const cgmDataExists = ['0', '1', '2'].includes(req.params.id) ? true : false

  if (cgmDataExists) {
    const userHasAccess = (req.query.user_id === '0' && ['0', '1'].includes(req.params.id)) || (req.query.user_id === '1' && req.params.id === '2')

    if (userHasAccess) {
        const fetchedSuccessfully = (req.params.id === '0') ? true : false

        if (fetchedSuccessfully) {
          const fetchedData = ['this', 'is', 'a', 'test', 'array']
          var key = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16 ];
 
          // The initialization vector (must be 16 bytes)
          var iv = [ 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34,35, 36 ];
           
          // Convert text to bytes
          var text = JSON.stringify(fetchedData);
          var textBytes = aesjs.utils.utf8.toBytes(text);
           
          var aesOfb = new aesjs.ModeOfOperation.ofb(key, iv);
          var encryptedBytes = aesOfb.encrypt(textBytes);
           
          // To print or store the binary data, you may convert it to hex
          var encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);
      
          // When ready to decrypt the hex string, convert it back to bytes
          var encryptedBytes = aesjs.utils.hex.toBytes(encryptedHex);
           
          // The output feedback mode of operation maintains internal state,
          // so to decrypt a new instance must be instantiated.
          var aesOfb = new aesjs.ModeOfOperation.ofb(key, iv);
          var decryptedBytes = aesOfb.decrypt(encryptedBytes);
           
          // Convert our bytes back into text
          var decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes);
      
          res.status(200).send({
            'original': fetchedData,
            'encrypted': encryptedHex,
            'decrypted': JSON.parse(decryptedText)
          })
        }
        else {
          res.sendStatus(500)
        }
    }
    else {
      res.sendStatus(403)
    }
  }
  else {
    res.sendStatus(404)
  }
})

// Viome data storage
app.post('/viome/', LoginLogic, (req, res) => {
  if (!!req.body.data) {
    const savedDataSuccessfully = (req.query.user_id == '0') ? true : false

    if (savedDataSuccessfully) {
      res.sendStatus(200)
    }
    else {
      res.sendStatus(500)
    }
  }
  else {
    res.sendStatus(400)
  }
})

app.delete('/viome/:id', LoginLogic, (req, res) => {
  const viomeDataExists = ['0', '1', '2'].includes(req.params.id) ? true : false

  if (viomeDataExists) {
    const userHasAccess = (req.query.user_id === '0' && ['0', '1'].includes(req.params.id)) || (req.query.user_id === '1' && req.params.id === '2')

    if (userHasAccess) {
        const deletedSuccessfully = (req.params.id === '0') ? true : false

        if (deletedSuccessfully) {
          res.sendStatus(200)
        }
        else {
          res.sendStatus(500)
        }
    }
    else {
      res.sendStatus(403)
    }
  }
  else {
    res.sendStatus(404)
  }
})

app.get('/viome/:id', LoginLogic, (req, res) => {
  const viomeDataExists = ['0', '1', '2'].includes(req.params.id) ? true : false

  if (viomeDataExists) {
    const userHasAccess = (req.query.user_id === '0' && ['0', '1'].includes(req.params.id)) || (req.query.user_id === '1' && req.params.id === '2')

    if (userHasAccess) {
        const fetchedSuccessfully = (req.params.id === '0') ? true : false
        const fetchedData = [
          ['Name', 'Type', 'Present?'],
          ['Lactobacillus', 'Bacteria', '1'],
          ['Streptococcus', 'Bacteria', '0']
        ]

        if (fetchedSuccessfully) {
          res.status(200).send({ data: fetchedData})
        }
        else {
          res.sendStatus(500)
        }
    }
    else {
      res.sendStatus(403)
    }
  }
  else {
    res.sendStatus(404)
  }
})

// spawn C&MNP Cron job 
app.post('/cmnp/', LoginLogic, (req, res) => {
  const savedData = req.query?.user_id === '0' ? true : false

  if (savedData) {
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