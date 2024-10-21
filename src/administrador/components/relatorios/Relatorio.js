import React, { useState } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useNavigate } from 'react-router-dom'; // Importando useNavigate
import './Relatorio.css';
import logo from '../../../assets/logo-meu-barbeiro.png'; // Caminho correto

const Relatorio = () => {
  const [tipoRelatorio, setTipoRelatorio] = useState('');
  const [usuario, setUsuario] = useState('');
  const navigate = useNavigate(); // Inicializando o hook useNavigate

  // Simulação de usuários cadastrados
  const usuariosCadastrados = [
    { id: 1, nome: 'Usuário 1' },
    { id: 2, nome: 'Usuário 2' },
    { id: 3, nome: 'Usuário 3' },
    // Adicione mais usuários conforme necessário
  ];

  // Simulação de dados de serviços executados
  const dadosServicos = [
    { usuario: 'Usuário 1', servico: 'Corte de Cabelo', data: '2024-10-20', quantidade: 3 },
    { usuario: 'Usuário 1', servico: 'Barba', data: '2024-10-18', quantidade: 1 },
    { usuario: 'Usuário 2', servico: 'Corte de Cabelo', data: '2024-10-20', quantidade: 2 },
    { usuario: 'Usuário 3', servico: 'Barba', data: '2024-10-19', quantidade: 1 },
    // Adicione mais dados conforme necessário
  ];

  const gerarRelatorio = () => {
    const doc = new jsPDF();

    // Adiciona a logo no PDF
    doc.addImage(logo, 'PNG', 10, 10, 40, 40);
    doc.text('Relatório de Serviços Executados', 60, 20);

    const tabelaY = 70; // Posição Y da tabela
    let headers = ['Usuário', 'Serviço', 'Data', 'Quantidade'];

    // Filtrar dados com base nas seleções
    let dadosFiltrados = dadosServicos;

    if (usuario) {
      dadosFiltrados = dadosFiltrados.filter(d => d.usuario === usuario);
    }

    // Agrupando os serviços por data
    const groupedData = {};
    dadosFiltrados.forEach(item => {
      if (!groupedData[item.data]) {
        groupedData[item.data] = [];
      }
      groupedData[item.data].push(item);
    });

    // Prepara os dados para o PDF
    const pdfData = [];
    for (const [date, services] of Object.entries(groupedData)) {
      // Adiciona a data como uma linha
      pdfData.push([{ content: `Data: ${date}`, colSpan: 4, styles: { halign: 'left', fontStyle: 'bold' } }]);

      // Adiciona os serviços para essa data
      services.forEach(service => {
        pdfData.push([service.usuario, service.servico, service.data, service.quantidade]);
      });
    }

    // Adiciona a tabela ao PDF
    doc.autoTable({
      head: [headers],
      body: pdfData,
      startY: tabelaY,
    });

    // Gera a string do PDF
    const pdfOutput = doc.output('datauristring');

    // Abre o PDF em uma nova aba
    const pdfWindow = window.open('', '_blank');
    pdfWindow.document.write('<iframe width="100%" height="100%" src="' + pdfOutput + '"></iframe>');
    pdfWindow.document.close();
  };

  return (
    <>
      <h2 className='title'>Gerar Relatório</h2>


         {/* Adicionando o botão "Voltar" */}
          <div className='btn-return'>
          <button onClick={() => navigate('/dashboard')}>Voltar</button>
        </div>

      <div className="relatorio-container">
        <div className="options-container">
          <div className="option">
            <label>Tipo de Relatório:</label>
            <select value={tipoRelatorio} onChange={(e) => setTipoRelatorio(e.target.value)}>
              <option value="">Selecione...</option>
              <option value="diario">Diário</option>
              <option value="semanal">Semanal</option>
              <option value="quinzenal">Quinzenal</option>
              <option value="mensal">Mensal</option>
              <option value="trimestral">Trimestral</option>
              <option value="semestral">Semestral</option>
              <option value="anual">Anual</option>
            </select>
          </div>

          <div className="option">
            <label>Usuário:</label>
            <select value={usuario} onChange={(e) => setUsuario(e.target.value)}>
              <option value="">Selecione um usuário...</option>
              {usuariosCadastrados.map((user) => (
                <option key={user.id} value={user.nome}>{user.nome}</option>
              ))}
            </select>
          </div>

          <div className="button-container">
            <button onClick={gerarRelatorio}>Gerar Relatório</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Relatorio;
