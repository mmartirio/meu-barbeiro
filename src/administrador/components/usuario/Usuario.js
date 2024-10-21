import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importa o useNavigate para redirecionamento
import './Usuario.css'; // Importa o arquivo de estilo atualizado

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ name: '', email: '', isAdmin: false });
  const navigate = useNavigate(); // Hook para navegação

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewUser({
      ...newUser,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const addUser = () => {
    if (newUser.name && newUser.email) {
      setUsers([...users, newUser]);
      setNewUser({ name: '', email: '', isAdmin: false });
    }
  };

  const removeUser = (index) => {
    const updatedUsers = users.filter((_, i) => i !== index);
    setUsers(updatedUsers);
  };

  const editUser = (index) => {
    const userToEdit = users[index];
    setNewUser(userToEdit);
    removeUser(index); // Remove o usuário para que ele possa ser editado
  };

  return (
    <>
    <button className="back-button" onClick={() => navigate('/dashboard')}>
    Sair
  </button>
    <div className="user-management">
      {/* Botão para voltar para o AdminDashboard */}

      <div className="create-user-container">
        <h2>Cadastro de Usuários</h2>
        <form>
          <label>
            Nome:
            <input
              type="text"
              name="name"
              value={newUser.name}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Login (E-mail):
            <input
              type="email"
              name="email"
              value={newUser.email}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Administrador:
            <input
              type="checkbox"
              name="isAdmin"
              checked={newUser.isAdmin}
              onChange={handleInputChange}
            />
          </label>
            <button type="button" onClick={addUser}>
              Adicionar
            </button>
        </form>
      </div>

      <div className="user-list-container">
        <h2>Usuários Cadastrados</h2>
        <ul>
          {users.length > 0 ? (
            users.map((user, index) => (
              <li key={index}>
                {user.name} ({user.email}) - {user.isAdmin ? 'Administrador' : 'Usuário'}
                <div className="actions">
                  <button type="button" onClick={() => editUser(index)}>
                    Editar
                  </button>
                  <button type="button" onClick={() => removeUser(index)}>
                    Remover
                  </button>
                </div>
              </li>
            ))
          ) : (
            <p>Nenhum usuário cadastrado.</p>
          )}
        </ul>
      </div>
    </div>
    </>
  );
};

export default UserManagement;
