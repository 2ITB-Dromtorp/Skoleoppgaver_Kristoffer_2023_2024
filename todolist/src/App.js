

import './App.css';
import { useState } from 'react';

function App() {

  const [todoList, setTodolist] = useState([])

  class Todo {
    constructor(Title, Desc, Key) {
      this.Title = Title;
      this.Desc = Desc;
      this.Key = Key
    }
    edit(newTitle, newDesc) {
      this.Title = newTitle
      this.Desc = newDesc
    }
  }

  function createTodo() {
    let newtodo = new Todo(document.getElementById("todoTitle").value, document.getElementById("todoDesc").value, todoList.length.toString())
    setTodolist([...todoList, newtodo])

  }
  //document.getElementsByClassName("Todo")[key].childNodes[0].innerHTML
  function editTodo(key) {
    let editField = document.createElement("input")
    editField.type = "text"
    document.getElementsByClassName("Todo")[key].appendChild(editField)
  }

  function deleteTodo() {

  }

  return (
    <div className="App">
      <header className="App-header">
        <div>
          <input type="text" id="todoTitle"></input>
          <input type="text" id="todoDesc"></input>
          <button onClick={() => createTodo()}>Submit</button>
        </div>
        <div id="todoList">
          {todoList.map(todo => (
            <div class="Todo" key={todo.Key}>
              <p>{todo.Title}</p>
              <p>{todo.Desc}</p>
              <button onClick={() => editTodo(todo.Key)}>Edit</button>
              <button>Delete</button>
            </div>
          ))}
        </div>

      </header>
    </div>
  );
}

export default App;
