import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ConfirmModal from './ConfirmModal'; // Importe o modal corrigido
import './Usuario.css';
import Button from '../../../components/Button';
import { useTranslation } from 'react-i18next';

const UserManagement = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [userData, setUserData] = useState({ name: '', email: '', password: '', isAdmin: false, id: null });
  const [editingIndex, setEditingIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userIdToRemove, setUserIdToRemove] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setErrorMsg('');
      try {
        const response = await fetch('http://localhost:3001/api/user/users');
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Erro ao carregar usuários: ${response.status} - ${errorText}`);
        }
        const data = await response.json();
        setUsers(data.users || []);
      } catch (error) {
        setErrorMsg(t('usuario.errorLoad') || 'Erro ao carregar usuários.');
      } finally {
        setLoading(false);
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
    setErrorMsg('');
    setSuccessMsg('');
    if (!userData.name || !userData.email || !userData.password) {
      setErrorMsg(t('usuario.fillAllFields') || 'Por favor, preencha todos os campos obrigatórios.');
      if (nameRef.current) nameRef.current.focus();
      return;
    }
    setLoading(true);
    const roleValue = userData.isAdmin ? 'admin' : 'user';
    const userToAdd = { ...userData, role: roleValue };
    try {
      const response = await fetch('http://localhost:3001/api/user/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userToAdd),
      });
      if (response.status === 409) {
        setErrorMsg(t('usuario.alreadyExists') || 'Usuário já cadastrado!');
        setLoading(false);
        return;
      }
      if (!response.ok) {
        const errorText = await response.text();
        setErrorMsg(t('usuario.errorAdd') + `: ${response.status} - ${errorText}` || `Erro ao adicionar usuário: ${response.status} - ${errorText}`);
        setLoading(false);
        return;
      }
      const data = await response.json();
      setSuccessMsg(t('usuario.successAdd') || 'Usuário adicionado com sucesso!');
      setUsers((prevUsers) => [...prevUsers, data.user]);
      setUserData({ name: '', email: '', password: '', isAdmin: false });
    } catch (error) {
      setErrorMsg(t('usuario.errorAdd') + `: ${error.message}` || `Erro ao adicionar usuário: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const confirmRemoveUser = async () => {
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3001/api/user/${userIdToRemove}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json();
        setErrorMsg(t('usuario.errorRemove') + `: ${response.status} - ${errorData.message}` || `Erro ao remover usuário: ${response.status} - ${errorData.message}`);
        setLoading(false);
        return;
      }
      setUsers((prevUsers) => prevUsers.filter(user => user.id !== userIdToRemove));
      setSuccessMsg(t('usuario.successRemove') || 'Usuário removido com sucesso!');
      setIsModalOpen(false);
    } catch (error) {
      setErrorMsg(t('usuario.errorRemove') || 'Erro ao remover usuário.');
    } finally {
      setLoading(false);
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
    setErrorMsg('');
    setSuccessMsg('');
    if (!userData.name || !userData.email) {
      setErrorMsg(t('usuario.fillAllFields') || 'Por favor, preencha todos os campos obrigatórios.');
      if (nameRef.current) nameRef.current.focus();
      return;
    }
    setLoading(true);
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
        setErrorMsg(t('usuario.errorEdit') + `: ${response.status} - ${errorText}` || `Erro ao editar usuário: ${response.status} - ${errorText}`);
        setLoading(false);
        return;
      }
      const updatedUser = await response.json();
      setUsers((prevUsers) => {
        const newUsers = [...prevUsers];
        newUsers[editingIndex] = updatedUser;
        return newUsers;
      });
      setSuccessMsg(t('usuario.successEdit') || 'Usuário editado com sucesso!');
      setUserData({ name: '', email: '', password: '', isAdmin: false, id: null });
      setEditingIndex(null);
    } catch (error) {
      setErrorMsg(t('usuario.errorEditLog') || 'Erro ao editar usuário. Confira os logs para mais detalhes.');
    } finally {
      setLoading(false);
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
        <Button variant="secondary" className="back-button" onClick={() => navigate('/dashboard')}>{t('usuario.exit') || 'Sair'}</Button>
        <div className="create-user-container">
          <h2>{editingIndex !== null ? t('usuario.editTitle') || 'Editar Usuário' : t('usuario.title') || 'Cadastro de Usuários'}</h2>
          {errorMsg && <div className="alert-error" role="alert">{errorMsg}</div>}
          {successMsg && <div className="alert-success" role="status">{successMsg}</div>}
          <form onSubmit={(e) => { e.preventDefault(); editingIndex !== null ? saveEdit() : addUser(); }} autoComplete="on" aria-label={t('usuario.formLabel') || 'Formulário de cadastro de usuário'}>
            <label htmlFor='name'>
              {t('usuario.name') || 'Nome:'}
              <input
                ref={nameRef}
                id='name'
                type="text"
                name="name"
                value={userData.name}
                onChange={handleInputChange}
                required
                aria-required="true"
                aria-label={t('usuario.name') || 'Nome'}
              />
            </label>
            <label htmlFor='email'>
              {t('usuario.email') || 'Login (E-mail):'}
              <input
                ref={emailRef}
                id="email"
                type="email"
                name="email"
                value={userData.email}
                onChange={handleInputChange}
                required
                aria-required="true"
                aria-label={t('usuario.email') || 'E-mail'}
              />
            </label>
            <label>
              {t('usuario.password') || 'Senha:'}
              <input
                type="password"
                name="password"
                value={userData.password}
                onChange={handleInputChange}
                required
                aria-required="true"
                aria-label={t('usuario.password') || 'Senha'}
              />
            </label>
            <label>
              {t('usuario.admin') || 'Administrador:'}
              <input
                type="checkbox"
                name="isAdmin"
                checked={userData.isAdmin}
                onChange={handleInputChange}
                aria-label={t('usuario.admin') || 'Administrador'}
              />
            </label>
            <Button type="submit" loading={loading} aria-busy={loading} className={loading ? 'loading' : ''}>
              {editingIndex !== null ? t('usuario.save') || 'Salvar' : t('usuario.add') || 'Adicionar'}
            </Button>
          </form>
        </div>
        <div className="user-list-container">
          <h2>{t('usuario.registeredTitle') || 'Usuários Cadastrados'}</h2>
          <section>
            {loading ? (
              <p>{t('usuario.loading') || 'Carregando usuários...'}</p>
            ) : users.length > 0 ? (
              users.map((user) => (
                <article key={`${user.id}-${user.name}`}> 
                  {user.name} ({user.email}) - {user.role === 'admin' ? t('usuario.admin') || 'Administrador' : t('usuario.user') || 'Usuário'}
                  <div className="actions">
                    <Button type="button" variant="secondary" onClick={() => editUser(user)}>
                      {t('usuario.edit') || 'Editar'}
                    </Button>
                    <Button type="button" variant="danger" onClick={() => handleRemoveUser(user.id)}>
                      {t('usuario.remove') || 'Remover'}
                    </Button>
                  </div>
                </article>
              ))
            ) : (
              <p>{t('usuario.none') || 'Nenhum usuário cadastrado.'}</p>
            )}
          </section>
        </div>
      </div>
    </>
  );
};

export default UserManagement;
