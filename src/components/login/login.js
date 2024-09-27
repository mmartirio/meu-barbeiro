import React, { useState } from "react";
import { HiOutlineUser, HiOutlineLockClosed, HiOutlineCake } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import './login.css';

const Login = () => {
    const [userName, setUsername] = useState("");
    const [phone, setPhone] = useState("");
    const [date, setDate] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        navigate('/agendamento/calendarComponent');
    };

    return (
        <>                
            <h1 className='title'>Bem-vindo ao Meu barbeiro</h1>
            <div className="container-login">
                <form className="form" onSubmit={handleSubmit}>
                    <h1>Agende seu horário</h1>
                    {[
                        { label: "Seu nome", type: "text", value: userName, setValue: setUsername, Icon: HiOutlineUser },
                        { label: "Seu telefone", type: "tel", value: phone, setValue: setPhone, Icon: HiOutlineLockClosed },
                        { label: "Seu aniversário", type: "date", value: date, setValue: setDate, Icon: HiOutlineCake }
                    ].map(({ label, type, value, setValue, Icon }) => (
                        <div key={label} className={type === "date" ? "bday" : type === "tel" ? "phone" : "name"}>
                            <label>{label}</label>
                            <input type={type} placeholder={label} onChange={(e) => setValue(e.target.value)} value={value} />
                            <Icon className="icons" />
                        </div>
                    ))}
                    <div className="checkbox">
                        <input type="checkbox" />
                        <label>Lembrar de mim</label>
                        <button type="submit" className="btn-entrar">Entrar</button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default Login;
