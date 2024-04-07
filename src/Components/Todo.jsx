import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [newTodoText, setNewTodoText] = useState('');
  const [updatingTodoId, setUpdatingTodoId] = useState(null);
  const [updatedTodoText, setUpdatedTodoText] = useState('');

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await axios.get(
        'https://jsonplaceholder.typicode.com/todos'
      );
      setTodos(response.data);
    } catch (error) {
      console.error('Error fetching task:', error);
    }
  };

  const addTodo = async () => {
    try {
      const response = await axios.post(
        'https://jsonplaceholder.typicode.com/todos',
        {
          title: newTodoText,
          completed: false,
        }
      );
      const newTodo = { ...response.data, id: uuidv4() };
      setTodos([...todos, newTodo]);
      setNewTodoText('');
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`https://jsonplaceholder.typicode.com/todos/${id}`);
      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const updateTodo = async (id) => {
    try {
      await axios.put(`https://jsonplaceholder.typicode.com/todos/${id}`, {
        title: updatedTodoText,
      });
      const updatedTodos = todos.map((todo) => {
        if (todo.id === id) {
          return { ...todo, title: updatedTodoText };
        }
        return todo;
      });
      setTodos(updatedTodos);
      setUpdatingTodoId(null);
      setUpdatedTodoText('');
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  return (
    <div>
      <h1>Todo List</h1>
      <input
        type="text"
        value={newTodoText}
        onChange={(e) => setNewTodoText(e.target.value)}
        placeholder="Enter new task"
      />
      <button onClick={addTodo}>Add Todo</button>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            {updatingTodoId === todo.id ? (
              <div>
                <input
                  type="text"
                  value={updatedTodoText}
                  onChange={(e) => setUpdatedTodoText(e.target.value)}
                  placeholder="Enter updated task"
                />
                <button onClick={() => updateTodo(todo.id)}>Update</button>
              </div>
            ) : (
              <div>
                {todo.title}
                <button onClick={() => deleteTodo(todo.id)}>Delete</button>
                <button
                  onClick={() => {
                    setUpdatingTodoId(todo.id);
                    setUpdatedTodoText(todo.title);
                  }}
                >
                  Edit
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
