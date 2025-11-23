
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Services.css';

const Servico = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [servicos, setServicos] = useState([]);
  const [titulo, setTitulo] = useState('');
  const [tipo, setTipo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [duracao, setDuracao] = useState(''); // Adiciona o estado para duração
  const [ativo, setAtivo] = useState(false);

  const adicionarServico = () => {
    const novoServico = { titulo, tipo, descricao, valor: parseFloat(valor), duracao, ativo };
    setServicos([...servicos, novoServico]);
    // Limpar os campos após adicionar
    setTitulo('');
    setTipo('');
    setDescricao('');
    setValor('');
    setDuracao(''); // Limpar o campo de duração
    setAtivo(false);
  };

  const removerServico = (index) => {
    const novosServicos = servicos.filter((_, i) => i !== index);
    setServicos(novosServicos);
  };

  const editarServico = (index) => {
    const servico = servicos[index];
    setTitulo(servico.titulo);
    setTipo(servico.tipo);
    setDescricao(servico.descricao);
    setValor(servico.valor);
    setDuracao(servico.duracao); // Preencher a duração ao editar
    setAtivo(servico.ativo);
    removerServico(index);
  };

  // Função para formatar o valor em reais
  const formatarValorReal = (valor) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
  };

  return (
    <>

      <button className='btn-voltar' onClick={() => navigate('/dashboard')}>{t('services.back') || 'Voltar'}</button>
      <div className="servico-container">
        <h2>{t('services.addTitle') || 'Adicionar Serviço'}</h2>
        <div className='div-container'>
          <div className='form-container'>
            <input 
              type="text" 
              placeholder={t('services.titlePlaceholder') || 'Título'} 
              value={titulo} 
              onChange={(e) => setTitulo(e.target.value)} 
            />
            <input 
              type="text" 
              placeholder={t('services.typePlaceholder') || 'Tipo'} 
              value={tipo} 
              onChange={(e) => setTipo(e.target.value)} 
            />
            <input 
              type="number" 
              placeholder={t('services.valuePlaceholder') || 'Valor'} 
              value={valor} 
              onChange={(e) => setValor(e.target.value)} 
            />
            <input 
              type="text" 
              placeholder={t('services.durationPlaceholder') || 'Duração (em minutos)'} 
              value={duracao} 
              onChange={(e) => setDuracao(e.target.value)} 
            />
          </div>
          <div className='text-container'>
            <textarea 
              placeholder={t('services.descriptionPlaceholder') || 'Descrição'} 
              value={descricao} 
              onChange={(e) => setDescricao(e.target.value)} 
            />
            <label>
              {t('services.active') || 'Ativo'}
              <input 
                type="checkbox" 
                checked={ativo} 
                onChange={(e) => setAtivo(e.target.checked)} 
              />
            </label>
            <button className='btn-adiciona' onClick={adicionarServico}>{t('services.addButton') || 'Adicionar'}</button>
          </div>
        </div>

        <div className="servico-lista">
          <h3>{t('services.listTitle') || 'Lista de Serviços'}</h3>
          {servicos.length === 0 && <p>{t('services.noServices') || 'Nenhum serviço adicionado.'}</p>}
          {servicos.length > 0 && (
            <ul>
              {servicos.map((servico, index) => (
                <li key={index}>
                  <ul className='ul-lista'>
                    <li><strong>{t('services.title') || 'Título'}:</strong> {servico.titulo}</li>
                    <li><strong>{t('services.type') || 'Tipo'}:</strong> {servico.tipo}</li>
                    <li><strong>{t('services.value') || 'Valor'}:</strong> {formatarValorReal(servico.valor)}</li>
                    <li><strong>{t('services.duration') || 'Duração'}:</strong> {servico.duracao} {t('services.minutes') || 'minutos'}</li>
                    <li><strong>{t('services.description') || 'Descrição'}:</strong> {servico.descricao}</li>
                    <li><strong>{t('services.status') || 'Status'}:</strong> {servico.ativo ? (t('services.active') || 'Ativo') : (t('services.inactive') || 'Inativo')}</li>
                    <li>
                      <button className='btn-editar' onClick={() => editarServico(index)}>{t('services.edit') || 'Editar'}</button>
                    </li>
                    <li>
                      <button className='btn-remove' onClick={() => removerServico(index)}>{t('services.remove') || 'Remover'}</button>
                    </li>
                  </ul>
                </li>
              ))}
            </ul>
          )}
        </div>
	  </div>
    </>
  );
}

export default Servico;
