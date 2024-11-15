import React from 'react';
import './ConfirmModal.css';

const ConfirmModal = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Confirmar Remoção</h3>
        <p>Você tem certeza que deseja remover este usuário?</p>
        <button className='btn-caonfirm' onClick={onConfirm}>Confirmar</button>
        <button  onClick={onCancel}>Cancelar</button>
      </div>
    </div>
  );
};

export default ConfirmModal;
