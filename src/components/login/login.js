import React, { useState } from "react";
import { HiOutlineUser, HiOutlineLockClosed, HiOutlineCake } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import './login.css';

function Login() {
    const [userName, setUsername] = useState("");
    const [phone, setPhone] = useState("");
    const [date, setDate] = useState("");
    const navigate = useNavigate();

    const handleEntrar = () => {
        navigate('/agendamento/calendarComponent');
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        handleEntrar();
    };

    return (
        <>                
        <h1 className='title'>Bem-vindo ao Meu barbeiro</h1>
        <div className="container-login">
            <form className="form" onSubmit={handleSubmit}>
                <h1>Agende seu horário</h1>
                <div className="name">
                    <label>Seu nome </label>
                    <input 
                        type="text" 
                        placeholder="Nome" 
                        onChange={(e) => setUsername(e.target.value)} 
                        value={userName}
                    />
                    <HiOutlineUser className="icons" />
                </div>
                <div className="phone">
                    <label>Seu telefone</label>
                    <input 
                        type="tel" 
                        placeholder="telefone" 
                        onChange={(e) => setPhone(e.target.value)} 
                        value={phone} 
                    />
                    <HiOutlineLockClosed className="icons" />
                </div>
                <div className="bday">
                    <label>Seu aniversário </label>
                    <input 
                        type="date" 
                        onChange={(e) => setDate(e.target.value)} 
                        value={date} 
                    />
                    <HiOutlineCake className="icons" />
                </div>
                <div className="checkbox">
                    <input type="checkbox" />
                    <label>Lembrar de mim</label>
                    <button type="submit" className="btn-entrar">Entrar</button>
                </div>
                
            </form>
        </div>
        </>
    );
}

export default Login;
