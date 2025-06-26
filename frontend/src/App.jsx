import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Todo from './components/Todo';
import './Header.css'; // Импортируем стили

import { useLocation } from 'react-router-dom';

const App = () => {


    return (
        <Router>
            <div>
                <header>
            <nav>
                <ul>
                  <li>
                    <UserGreeting />
                  </li>
                    <li>
                        <Link to="/login">Login</Link>
                    </li>
                    <li>
                        <Link to="/register">Register</Link>
                    </li>
                    <li>
                        <Link to="/">Главная</Link>
                    </li>
                </ul>
            </nav>
        </header>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/" element={<Todo />} />
                </Routes>
            </div>
        </Router>
    );
};

const UserGreeting = () => {
    const location = useLocation();
    const username = location.state?.username || 'Гость';
    
    return <sapn>Добро пожаловать, {username}!</sapn>;
};

export default App;