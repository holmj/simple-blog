const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const todos = [];

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use(express.static('public'));

const posts = [];

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

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
