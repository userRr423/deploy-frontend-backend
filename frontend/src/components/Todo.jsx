import React, { useState, useEffect, use } from "react";
import "./Todo.css";
import { useLocation } from 'react-router-dom';

import axios from 'axios';


const Todo = () => {

  const [tasks, setTasks] = useState({
    Понедельник: [],
    Вторник: [],
    Среда: [],
    Четверг: [],
    Пятница: [],
    Суббота: [],
    Воскресенье: [],
  });
  const [taskInput, setTaskInput] = useState("");
  const [selectedDay, setSelectedDay] = useState("Понедельник");
  const [visibility, setVisibility] = useState({
    Понедельник: true,
    Вторник: true,
    Среда: true,
    Четверг: true,
    Пятница: true,
    Суббота: true,
    Воскресенье: true,
  });

  const [completedTasks, setCompletedTasks] = useState({});

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");

  const [items, setItems] = useState([]);
  const [id, setId] = useState("");
  const location = useLocation();
  const [username, setUsername] = useState(location.state?.username || 'Гость');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://194.169.163.65/api/users");
        if (!response.ok) {
          throw new Error("Ошибка при получении пользователей");
        }
        const data = await response.json();
        setUsers(data);

        // Находим пользователя с username 'mint'

        
        const user = data.find(d => d.username === username);

        // Получаем id
        const id = user ? user.id : null;

        setId(id)
        

      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);



  const handleAddTask = async(e) => {
    e.preventDefault();
    if (taskInput.trim() === "") return;
    const newTasks = { ...tasks };
    newTasks[selectedDay].push(taskInput);
    setTasks(newTasks);
    setTaskInput("");
    

    let days = "";
    if(String(selectedDay) == "Понедельник") {
      days = "0"
    }
    if(String(selectedDay) == "Вторник") {
      days = "1"
    }
    if(String(selectedDay) == "Среда") {
      days = "2"
    }
    if(String(selectedDay) == "Четверг") {
      days = "3"
    }
    if(String(selectedDay) == "Пятница") {
      days = "4"
    }
    if(String(selectedDay) == "Суббота") {
      days = "5"
    }
    if(String(selectedDay) == "Воскресенье") {
      days = "6"
    }

    const taskData = {
      task: taskInput,
      day: days,
      iduser: String(id), // Используем selectedUser для id пользователя
    };

    try {
      const response = await fetch("http://194.169.163.65/api//items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taskData),
      });

      if (!response.ok) {
        throw new Error("Ошибка при добавлении задачи");
      }
    } catch (error) {
      console.error("Error adding task:", error);
    }

  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://194.169.163.65/api/items?iduser="+id);
        if (!response.ok) {
          throw new Error("Ошибка при получении пользователей");
        }
        const data = await response.json();
        setItems(data);


      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [id]);


useEffect(() => {
    // Определяем дни недели
    let daysOfWeek = ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота", "Воскресенье"];
    
    if (items.length > 0) { // Проверяем, что массив items не пуст

        setTasks(prevTasks => {
            const updatedTasks = { ...prevTasks }; // Создаем копию предыдущих задач
            
            items.forEach(item => { // Обходим все элементы массива items
                let day = Number(item.day); // Получаем день как число
                if (!isNaN(day) && day >= 0 && day < daysOfWeek.length) { // Проверяем корректность дня
                    // Обновляем задачи для соответствующего дня
                    updatedTasks[daysOfWeek[day]] = [...(updatedTasks[daysOfWeek[day]] || []), item.task];
                }
            });

            return updatedTasks; // Возвращаем обновленный объект
        });
    } else {
        console.log("items пуст или не содержит элементов");
    }
}, [items]);

  

  const toggleVisibility = (day) => {
    setVisibility((prevVisibility) => ({
      ...prevVisibility,
      [day]: !prevVisibility[day],
    }));
    
  };

  const toggleTaskCompletion = (day, index) => {
    setCompletedTasks((prev) => ({
      ...prev,
      [`${day}-${index}`]: !prev[`${day}-${index}`],
    }));
  };

  const handleDeleteTask = async (day, index) => {
    const taskToDelete = tasks[day][index]; // Получаем задачу для удаления
    const newTasks = { ...tasks };
    newTasks[day].splice(index, 1);
    setTasks(newTasks);

    let daysOfWeek = ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота", "Воскресенье"];
    const d = daysOfWeek.indexOf(day);

    try {
      const response = await axios.delete(`http://194.169.163.65/api/items`, {
        params: {
          task: String(taskToDelete),
          day: d,
          iduser: String(id),
        },
        headers: {
          accept: 'application/json',
        },
      });
    } catch (error) {
    }

  };

  const daysOfWeek = Object.keys(tasks);


  return (
    <div className="app-container">
      <h1>Календарь задач {username}</h1>


      <div className="input-container">
        <select
          className="dropdown"
          value={selectedDay}
          onChange={(e) => setSelectedDay(e.target.value)}
        >
          {daysOfWeek.map((day) => (
            <option key={day} value={day}>{day}</option>
          ))}
        </select>
        <input
          className="task-input"
          type="text"
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)}
          placeholder="Введите задачу"
        />
        <button className="add-button" onClick={handleAddTask}>Добавить</button>
      </div>
      <div className="tasks-container">
        {daysOfWeek.map((day) => (
          <div key={day} className="task-day">
            <h2 onClick={() => toggleVisibility(day)} style={{ cursor: 'pointer' }}>
              {day} {visibility[day] ? '✖' : '➕'}
            </h2>
            {visibility[day] && (
              <ul className="task-list">
                {tasks[day] && tasks[day].length > 0 ? (
                  tasks[day].map((task, index) => (
                    <li key={index} className="task-item">
                      <span
                        style={{ textDecoration: completedTasks[`${day}-${index}`] ? "line-through" : "none", cursor: 'pointer' }}
                        onClick={() => toggleTaskCompletion(day, index)}
                      >
                        {task}
                      </span>
                      <button 
                        onClick={() => handleDeleteTask(day, index)} 
                        className="delete-button"
                        style={{ color: 'red', float: 'right' }}
                      >
                        Удалить
                      </button>
                    </li>
                  ))
                ) : (
                  <li className="no-tasks">Нет задач</li>
                )}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};



const User = () => {
    const location = useLocation();
    const [username, setUsername] = useState(location.state?.username || 'Гость');

    // Если вы хотите, чтобы username обновлялся при изменении location
    useEffect(() => {
        setUsername(location.state?.username || 'Гость');
    }, [location.state]);

    return <span>{username}</span>;
};




export default Todo;
