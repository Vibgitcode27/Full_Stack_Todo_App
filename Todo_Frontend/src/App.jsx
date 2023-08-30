import React , { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function useTodos(){
  let [todos , setTodos] = React.useState([]);
  
  React.useEffect(() => {
    async function fetchData() {
      let response = await fetch("http://localhost:3000/todos" , {method : 'GET'})
      let data = await response.json();
      console.log(data);
      setTodos(data);
    }

    setInterval(() => {
      fetchData()
    }, 1000);
  } , []);
  return todos;
}

function App() {
 
  const todos = useTodos();
  return (
    <div>
      {todos.map((todos) =>
      {
        return (
          <div>
          {todos.id}
          <br />
          {todos.title}
          <br />
          {todos.description}
          <br />
          <button>Delete</button>
          <br />
          <br />
          </div>
        )
      })} 
    </div>
  )
}

export default App
