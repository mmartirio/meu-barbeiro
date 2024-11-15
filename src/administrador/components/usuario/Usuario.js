import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ConfirmModal from './ConfirmModal'; // Importe o modal corrigido
import './Usuario.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [userData, setUserData] = useState({ name: '', email: '', password: '', isAdmin: false, id: null });
  const [editingIndex, setEditingIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userIdToRemove, setUserIdToRemove] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/user/users');
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Erro ao carregar usuários: ${response.status} - ${errorText}`);
        }
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Erro ao carregar usuários:', error);
        alert('Erro ao carregar usuários.');
      }
    };
    fetchUsers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUserData((prevUser) => ({
      ...prevUser,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Função para adicionar um novo usuário
  const addUser = async () => {
    if (!userData.name || !userData.email || !userData.password) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const roleValue = userData.isAdmin ? 'admin' : 'user'; 
    const userToAdd = { ...userData, role: roleValue };

    console.log('Usuário a ser adicionado:', userToAdd);

    try {
      const response = await fetch('http://localhost:3001/api/user/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userToAdd),
      });
    
      if (response.status === 409) {
        alert('Usuário já cadastrado!');
        return;
      }
    
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro ao adicionar usuário: ${response.status} - ${errorText}`);
      }
    
      const data = await response.json();
      console.log('Usuário adicionado:', data);
      alert('Usuário adicionado com sucesso!');
      setUsers((prevUsers) => [...prevUsers, data.user]);
      setUserData({ name: '', email: '', password: '', isAdmin: false });
    } catch (error) {
      console.error('Erro ao adicionar usuário:', error);
      alert(`Erro ao adicionar usuário: ${error.message}`);
    }
    
  };

  const confirmRemoveUser = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/user/${userIdToRemove}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Erro ao remover usuário: ${response.status} - ${errorData.message}`);
      }

      setUsers((prevUsers) => prevUsers.filter(user => user.id !== userIdToRemove));
      setIsModalOpen(false);
    } catch (error) {
      console.error('Erro ao remover usuário:', error);
    }
  };

  const handleRemoveUser = (userId) => {
    setUserIdToRemove(userId);
    setIsModalOpen(true);
  };

  const cancelRemoveUser = () => {
    setIsModalOpen(false);
    setUserIdToRemove(null);
  };

  const editUser = (user) => {
    setUserData({
      name: user.name,
      email: user.email,
      password: '',
      isAdmin: user.role === 'admin',
      id: user.id,
    });
    setEditingIndex(users.indexOf(user));
  };

  const saveEdit = async () => {
    if (!userData.name || !userData.email) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
  
    const roleValue = userData.isAdmin ? 'admin' : 'user'; 
    const userToUpdate = { ...userData, role: roleValue };
  
    try {
      const response = await fetch(`http://localhost:3001/api/user/${userData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userToUpdate),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro ao editar usuário: ${response.status} - ${errorText}`);
      }
  
      const updatedUser = await response.json();
      setUsers((prevUsers) => {
        const newUsers = [...prevUsers];
        newUsers[editingIndex] = updatedUser;
        return newUsers;
      });
      alert('Usuário editado com sucesso!');
      setUserData({ name: '', email: '', password: '', isAdmin: false, id: null });
      setEditingIndex(null);
    } catch (error) {
      console.error('Erro ao editar usuário:', error);
      alert('Erro ao editar usuário. Confira os logs para mais detalhes.');
    }
  };

  return (
    <>
      <ConfirmModal 
        isOpen={isModalOpen}
        onConfirm={confirmRemoveUser}
        onCancel={cancelRemoveUser}
      />
        
      <div className="user-management">
        <button className="back-button" onClick={() => navigate('/dashboard')}>
          Sair
        </button>
        <div className="create-user-container">
          <h2>{editingIndex !== null ? 'Editar Usuário' : 'Cadastro de Usuários'}</h2>
          <form onSubmit={(e) => { e.preventDefault(); editingIndex !== null ? saveEdit() : addUser(); }}>
            <label htmlFor='name'>
              Nome:
              <input
                id='name'
                type="text"
                name="name"
                value={userData.name}
                onChange={handleInputChange}
                required
              />
            </label>
            <label htmlFor='email'>
              Login (E-mail):
              <input
                id="email"
                type="email"
                name="email"
                value={userData.email}
                onChange={handleInputChange}
                required
              />
            </label>
            <label>
              Senha:
              <input
                type="password"
                name="password"
                value={userData.password}
                onChange={handleInputChange}
                required
              />
            </label>
            <label>
              Administrador:
              <input
                type="checkbox"
                name="isAdmin"
                checked={userData.isAdmin}
                onChange={handleInputChange}
              />
            </label>
            <button type="submit">
              {editingIndex !== null ? 'Salvar' : 'Adicionar'}
            </button>
          </form>
        </div>

        <div className="user-list-container">
          <h2>Usuários Cadastrados</h2>
          <section>
            {users.length > 0 ? (
              users.map((user) => (
                <article key={`${user.id}-${user.name}`}> 
                  {user.name} ({user.email}) - {user.role === 'admin' ? 'Administrador' : 'Usuário'}
                  <div className="actions">
                    <button type="button" onClick={() => editUser(user)}>
                      Editar
                    </button>
                    <button type="button" onClick={() => handleRemoveUser(user.id)}>
                      Remover
                    </button>
                  </div>
                </article>
              ))
            ) : (
              <p>Nenhum usuário cadastrado.</p>
            )}
          </section>
        </div>
      </div>
    </>
  );
};

export default UserManagement;
