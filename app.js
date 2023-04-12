const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const todos = [];
// login page
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const posts = [];

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use(express.static('public'));

//login page
app.use(session({
  secret: '8fh28cKd0aG9cnYfV7Rn71TjZr5pZq3s',
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(
  function (username, password, done) {
    const users = {
      user1: {
        id: 'user1',
        username: 'username',
        password: 'password',
      },
    };

    const user = users[username];

    if (!user) {
      console.log('Incorrect username');
      return done(null, false, { message: 'Incorrect username.' });
    }

    if (user.password !== password) {
      console.log('Incorrect password');
      return done(null, false, { message: 'Incorrect password.' });
    }

    console.log('User authenticated successfully');
    return done(null, user);
  }
));
n

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  const users = {
    user1: {
      id: 'user1',
      username: 'username',
      password: 'password',
    },
  };

  const user = users[id];
  done(null, user);
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login',
  passport.authenticate('local', { failureRedirect: '/login' }),
  function (req, res) {
    res.redirect('/');
  });

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/login');
});

app.get('/todo-list', ensureAuthenticated, (req, res) => {
  // Your existing Todo list route code
  res.render('todo-list', { todos: todos, user: req.user });
});

app.get('/', (req, res) => {
  res.render('home', { posts });
});

app.get('/compose', (req, res) => {
  res.render('compose');
});

// Added a todo-list
app.get('/todo-list', (req, res) => {
  res.render('todo-list', { todos });
});

app.post('/add-todo', (req, res) => {
  const todo = req.body.todo;
  todos.push(todo);
  res.redirect('/todo-list');
});

app.post('/compose', (req, res) => {
  const post = {
    title: req.body.postTitle,
    content: req.body.postContent,
  };
  posts.push(post);
  res.redirect('/');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});