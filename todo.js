const express = require('express');
const app = express();
const fs = require('fs');
const port = 3000;
const bodyparser = require('body-parser')
const cors = require('cors')
const { listeners } = require('process');

let listener = () =>
{
    console.log("App is running at port 3000");
}

app.listen(port , listener);
app.use(bodyparser.json())
app.use(cors());

app.use(express.json());

// Fetch all Todos;

let getTodos = (req ,res) =>
{
    fs.readFile(`todos.json` , `utf-8` , (err , data) =>
    {
        if(err) throw err;
        let Todos = JSON.parse(data);
        res.status(200).json(Todos);
    })
}

app.get(`/todos` , getTodos)

// Fetch TODO with specific ID

let getTodosId = (req ,res) =>
{
    fs.readFile("todos.json" , 'utf-8' , (err , data) =>
    {
        if(err) throw err;
        let Todos = JSON.parse(data);
        let found = Todos.find(t => t.id === parseInt(req.params.id));
        if(found)
        {
            res.status(200).json(found);
        }
        else
        {
            res.status(404).json({message : "Failed to find this ID"});
        }
    })
}

app.get('/todos/:id' , getTodosId)

// Post Todo Function

let postTodos = (req ,res) =>
{
    fs.readFile('todos.json' , 'utf-8' , (err , data) =>
    {
        if(err) throw err;
        let newTodo = {
            id : Math.floor(Math.random()*10000000) , 
            title : req.body.title,
            completed : req.body.completed,
            description: req.body.description 
        }
        let Todos = JSON.parse(data);
        Todos.push(newTodo);
        fs.writeFile(`todos.json` , JSON.stringify(Todos) ,(err) =>
        {
            if(err) throw err;
            res.status(200).json({message : "New todo created successfully" , newTodo})
        })
    })
}

app.post('/todos' , postTodos);

// Update exiting todos

let putTodos = (req ,res) =>
{
    fs.readFile(`todos.json` , `utf-8` , (err , data) =>
    {
        if(err) throw err;
        let Todos = JSON.parse(data);
        let foundIndex = Todos.findIndex(t => t.id === parseInt(req.params.id));
        if(foundIndex)
        {
            let updatedTodo = {
                id : Todos[foundIndex].id ,
                title : req.body.title,
                completed : req.body.completed,
                description: req.body.description     
            }
            Todos[foundIndex] = updatedTodo;
            fs.writeFile('todos.json' , JSON.stringify(Todos) , (err) =>
            {
                if(err) throw err;
                res.status(200).json({message : "Todo updated successfully" , updatedTodo});
            })
        }
        else
        {
            res.status(404).json({message : "Cannot find todo with this ID"});
        }
    })
}

app.put('/todos/:id' , putTodos);

// Delete specific todo

let deleteTodos = (req ,res) =>
{
    fs.readFile('todos.json' , 'utf-8' , (err ,data) =>
    {
        if(err) throw err;
        let Todos = JSON.parse(data);
        let foundIndex = Todos.findIndex(t => t.id === parseInt(req.params.id));
        if(foundIndex)
        {
            Todos.splice(foundIndex , 1);
            fs.writeFile('Todos.json' , JSON.stringify(Todos) , (err) =>
            {
                if(err) throw err;
                res.status(200).json({message : 'Todo deleted successfully'});
            })
        }
        else
        {
            res.status(404).json({message : "Cannot find specific todo."});
        }
    })
}

app.delete('/todos/:id' , deleteTodos)