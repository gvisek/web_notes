const express = require('express');
const app = express();
const path = require('path');
const session = require("express-session");
const categories = ['Work', 'Movies and books', 'Fun', 'Sports'];
let allReminders = 0;
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());

app.use(express.urlencoded({
    extended: true
}));

app.use(session({
    secret: "web1Zi",
    cookie: {maxAge: 6000000},
    resave: false,
    saveUninitialized: true
}));



app.get("/", (req, res) => {
    res.render("home", {categories: categories, todos: req.session.todos || [], numberOfTodo: allReminders, myTodo: req.session.todoAmount || 0, categoryValues: req.session.categories || []});
});
app.post("/add", (req, res) => {
    req.session.todos = req.session.todos || [];
    req.session.categories = req.session.categories || [];
    let search = req.session.todos.find(x => x.category === req.body.category);
    req.session.todoAmount = req.session.todoAmount || 0;
    req.session.todoAmount++;
    allReminders++;
    let item = req.session.categories.find(x => x.id === req.body.category);
    if(item){
        item.value++;
    }else{
        req.session.categories.push({id: req.body.category, value: 1});
        item = {id: req.body.category, value: 1};
    }
    if(search){
        search.value.push({id: Date.now(), value: req.body.inputText})
    }else{
        req.session.todos.push({category: req.body.category, value: [{id: Date.now(), value: req.body.inputText}]});
    }
    
    res.redirect("/");
});

app.get("/remove/:id", (req, res) => {
    allReminders--;
    let pass = req.params.id.split(" ");
    pass[0]= pass[0].substring(1);
    let item = req.session.categories.find(x => x.id === req.query.categoryId);
    item.value--;
    req.session.todoAmount--;
    let search = req.session.todos.find(x => x.category === req.query.categoryId);
    console.log(search.value);
    
    search.value = search.value.filter((product) => product.id !== parseInt(pass[0]));
    
    res.redirect("/");
})
const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}!`);
})