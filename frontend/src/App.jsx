import React, { useState } from "react";
import "./App.css";

const App = () => {
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

  const handleAddTask = () => {
    if (taskInput.trim() === "") return;
    const newTasks = { ...tasks };
    newTasks[selectedDay].push(taskInput);
    setTasks(newTasks);
    setTaskInput("");
  };

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

  const handleDeleteTask = (day, index) => {
    const newTasks = { ...tasks };
    newTasks[day].splice(index, 1);
    setTasks(newTasks);
  };

  const daysOfWeek = Object.keys(tasks);

  return (
    <div className="app-container">
      <h1>Календарь задач</h1>
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

export default App;
