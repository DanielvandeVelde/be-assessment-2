/* eslint-disable semi */

var express = require('express')
var session = require('express-session')
var bodyParser = require('body-parser')
var multer = require('multer')
var mysql = require('mysql')
var argon2 = require('argon2')

require('dotenv').config()

var connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
})

connection.connect()

var upload = multer({dest: 'static/upload/'})

express()
  .use(express.static('static'))
  .use(bodyParser.urlencoded({extended: true}))
  .use(session({
    resave: false,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET
  }))
  .set('view engine', 'ejs')
  .set('views', 'view')
  .get('/', pictures)
  .get('/sign-up', signupForm)
  .post('/sign-up', upload.single('picture'), signup)
  .get('/change', changeForm)
  .post('/change', upload.single('picture'), change)
  .get('/log-in', loginForm)
  .post('/log-in', login)
  .get('/log-out', logout)
  .get('/:id', picture)
  .use(notFound)
  .post('/:id', remove)
  .delete('/:id', removing)
  .listen(8000)

function pictures(req, res, next) {
  connection.query('SELECT * FROM users', done)

  function done(err, data) {
    if (err) {
      next(err)
    } else {
      res.render('list.ejs', {data: data, user: req.session.user})
    }
  }
}

function picture(req, res, next) {
  if (!req.session.user) {
    res.status(401).render('error.ejs')
    return
  }

  var id = req.params.id

  connection.query('SELECT * FROM users WHERE id = ?', id, done)

  function done(err, data) {
    if (err) {
      next(err)
    } else if (data.length === 0) {
      next()
    } else {
      res.render('detail.ejs', {data: data[0], user: req.session.user})
    }
  }
}

function remove(req, res) {
  var id = req.params.id

    connection.query('DELETE users WHERE id = ?', id, done)

    function done(err) {
      if (err) {
        return res.status(400).send('Cannot delete')
      } else {
        //Deleted, logout and destroy session
        req.session.destroy(function (err) {
          if (err) {
            next(err)
          } else {
            res.redirect('/')
          }
        })
      }
    }
  }

function removing(req, res) {
  var id = req.params.id

  connection.query('DELETE FROM users WHERE id = ?', id, done)

  function done(err) {
    if (err) {
      return res.status(400).send('Cannot delete')
    } else {
      //Deleted, logout and destroy session
      req.session.destroy(function (err) {
        if (err) {
          next(err)
        } else {
          res.redirect('/')
        }
      })
    }
  }
}

function signupForm(req, res) {
  res.render('sign-up.ejs')
}

function signup(req, res, next) {
  var username = req.body.username
  var password = req.body.password
  var picture = req.body.picture
  var message = req.body.message
  var min = 8
  var max = 160

  if (!username || !password) {
    return res.status(400).send('Username or password are missing')
  }

  if (password.length < min || password.length > max) {
    return res.status(400).send(
      'Password must be between ' + min +
      ' and ' + max + ' characters'
    )
  }

  connection.query('SELECT * FROM users WHERE username = ?', username, done)

  function done(err, data) {
    if (err) {
      next(err)
    } else if (data.length === 0) {
      argon2.hash(password).then(onhash, next)
    } else {
      res.status(409).send('Username already in use')
    }
  }

  function onhash(hash) {
    connection.query('INSERT INTO users SET ?', {
      username: username,
      hash: hash,
      picture: req.file ? req.file.filename : null,
      message:message
    }, oninsert)

    function oninsert(err) {
      if (err) {
        next(err)
      } else {
        req.session.user = {username: username}
        res.redirect('/')
      }
    }
  }
}

function changeForm(req, res) {
  if (!req.session.user) {
    res.status(401).render('error.ejs')
    return
  }

  res.render('change.ejs', {user: req.session.user})
}

function change(req, res, next) {
  var picture = req.body.picture
  var message = req.body.message
  var username = req.session.user.username

    connection.query('UPDATE users SET ? WHERE username = ?', [{
      picture: req.file ? req.file.filename : null,
      message: message
    }, username], done)

    function done(err) {
      if (err) {
        next(err)
      } else {
        res.redirect('/')
      }
    }
  }

function loginForm(req, res) {
  res.render('log-in.ejs')
}

function login(req, res, next) {
  var username = req.body.username
  var password = req.body.password

  if (!username || !password) {
    return res.status(400).send('Username or password are missing')
  }

  connection.query('SELECT * FROM users WHERE username = ?', username, done)

  function done(err, data) {
    var user = data && data[0]

    if (err) {
      next(err)
    } else if (user) {
      argon2.verify(user.hash, password).then(onverify, next)
    } else {
      res.status(401).send('Username does not exist')
    }

    function onverify(match) {
      if (match) {
        req.session.user = {username: user.username};
        res.redirect('/')
      } else {
        res.status(401).send('Password incorrect')
      }
    }
  }
}

function logout(req, res, next) {
  req.session.destroy(function (err) {
    if (err) {
      next(err)
    } else {
      res.redirect('/')
    }
  })
}

function notFound(req, res) {
  res.status(404).render('not-found.ejs')
}
