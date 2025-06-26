import React, { useState } from 'react';
import axios from 'axios';
import './Login.css'; // Импортируем стили
import { useNavigate } from 'react-router-dom'; // Импортируем useNavigate

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const navigate = useNavigate(); // Создаем экземпляр navigate

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://194.169.163.65/api/register', {
                username,
                password
            });
            setMessage(`User ${response.data.username} registered successfully!`);
            // После успешной авторизации перенаправляем на главную страницу
            navigate('/login', { state: { username } }); // Сохраняем имя пользователя в состоянии
        } catch (error) {
            setMessage(`Error: ${error.response.data.detail}`);
            
        }
    };

    return (
        <div className="login-container">
    
            <form className="login-form" onSubmit={handleRegister}>
                <h2>Регистрация</h2>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Register</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default Register;