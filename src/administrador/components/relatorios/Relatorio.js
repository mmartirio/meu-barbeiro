import React, { useState } from 'react';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { useNavigate } from 'react-router-dom'; // Importando useNavigate
import './Relatorio.css';

import Button from '../../../components/Button';
import FeedbackMessage from '../../../components/FeedbackMessage';

import { useTranslation } from 'react-i18next';
import logo from '../../../assets/logo-meu-barbeiro.png'; // Caminho correto

const Relatorio = () => {

  const [tipoRelatorio, setTipoRelatorio] = useState('');
  const [usuario, setUsuario] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const navigate = useNavigate();
  const { t } = useTranslation();

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

  const gerarRelatorio = async () => {
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);
    try {
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([595, 842]); // A4 portrait
      const { width, height } = page.getSize();
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      page.drawText(t('report.title') || 'Relatório de Serviços Executados', {
        x: 60,
        y: height - 60,
        size: 18,
        font: fontBold,
        color: rgb(0, 0, 0),
      });
      let dadosFiltrados = dadosServicos;
      if (usuario) {
        dadosFiltrados = dadosFiltrados.filter(d => d.usuario === usuario);
      }
      const groupedData = {};
      dadosFiltrados.forEach(item => {
        if (!groupedData[item.data]) groupedData[item.data] = [];
        groupedData[item.data].push(item);
      });
      const headers = ['Usuário', 'Serviço', 'Data', 'Quantidade'];
      let y = height - 100;
      page.drawText(headers.join('   |   '), {
        x: 40,
        y,
        size: 12,
        font: fontBold,
        color: rgb(0, 0, 0),
      });
      y -= 20;
      for (const [date, services] of Object.entries(groupedData)) {
        page.drawText(`Data: ${date}`, {
          x: 40,
          y,
          size: 11,
          font: fontBold,
          color: rgb(0.2, 0.2, 0.2),
        });
        y -= 16;
        services.forEach(service => {
          page.drawText(
            `${service.usuario}   |   ${service.servico}   |   ${service.data}   |   ${service.quantidade}`,
            {
              x: 40,
              y,
              size: 11,
              font,
              color: rgb(0, 0, 0),
            }
          );
          y -= 14;
        });
        y -= 8;
      }
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
      setSuccessMsg(t('report.success') || 'Relatório gerado com sucesso!');
    } catch (err) {
      setErrorMsg(t('report.error') || 'Erro ao gerar relatório.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className='title'>{t('report.title') || 'Gerar Relatório'}</h2>
      <FeedbackMessage message={errorMsg} type="error" onClose={() => setErrorMsg('')} />
      <FeedbackMessage message={successMsg} type="success" onClose={() => setSuccessMsg('')} />
      <div className='btn-return'>
        <Button variant="secondary" onClick={() => navigate('/dashboard')}>{t('report.back') || 'Voltar'}</Button>
      </div>
      <div className="relatorio-container">
        <div className="options-container">
          <div className="option">
            <label htmlFor="tipoRelatorio">{t('report.type') || 'Tipo de Relatório:'}</label>
            <select id="tipoRelatorio" value={tipoRelatorio} onChange={(e) => setTipoRelatorio(e.target.value)}>
              <option value="">{t('report.selectType') || 'Selecione...'}</option>
              <option value="diario">{t('report.daily') || 'Diário'}</option>
              <option value="semanal">{t('report.weekly') || 'Semanal'}</option>
              <option value="quinzenal">{t('report.biweekly') || 'Quinzenal'}</option>
              <option value="mensal">{t('report.monthly') || 'Mensal'}</option>
              <option value="trimestral">{t('report.quarterly') || 'Trimestral'}</option>
              <option value="semestral">{t('report.semiannual') || 'Semestral'}</option>
              <option value="anual">{t('report.annual') || 'Anual'}</option>
            </select>
          </div>
          <div className="option">
            <label htmlFor="usuario">{t('report.user') || 'Usuário:'}</label>
            <select id="usuario" value={usuario} onChange={(e) => setUsuario(e.target.value)}>
              <option value="">{t('report.selectUser') || 'Selecione um usuário...'}</option>
              {usuariosCadastrados.map((user) => (
                <option key={user.id} value={user.nome}>{user.nome}</option>
              ))}
            </select>
          </div>
          <div className="button-container">
            <Button onClick={gerarRelatorio} loading={loading} aria-busy={loading} className={loading ? 'loading' : ''}>
              {t('report.generate') || 'Gerar Relatório'}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Relatorio;
