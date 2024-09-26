import React, { useState } from 'react';
import jsPDF from 'jspdf';
import logo from './logo-meu-barbeiro.png';

const PDFGenerator = ({ servicesDescription, totalValue, totalDuration }) => {
  const [showAlert, setShowAlert] = useState(false);

  const handleGeneratePDF = () => {
    const doc = new jsPDF();
    const pdfWidth = doc.internal.pageSize.getWidth();
    
    // Definições da imagem
    const imageWidth = 24; // Largura da imagem
    const imageHeight = 20; // Altura da imagem
    const xPosition = (pdfWidth - imageWidth) / 2; // Calcula a posição X para centralizar a imagem

    // Adiciona a imagem da logo ao PDF (centralizada)
    doc.addImage(logo, 'PNG', xPosition, 10, imageWidth, imageHeight);

    // Adiciona texto formatado ao PDF
    doc.setFontSize(18);
    doc.setFont('Arial', 'bold');
    doc.text("Resumo dos Serviços Selecionados", 20, 40);
    
    doc.setFontSize(14);
    doc.setFont('Arial', 'normal');
    doc.text(`Serviços: ${servicesDescription}`, 20, 60);
    doc.text(`Valor Total: R$ ${totalValue},00`, 20, 80);
    doc.text(`Duração Total: ${totalDuration} min`, 20, 100);

    // Adiciona mais formatação, se necessário
    doc.setDrawColor(0, 0, 0); // Cor da linha
    doc.setLineWidth(0.5); // Largura da linha
    doc.line(20, 110, 190, 110); // Posições X e Y iniciais e finais da linha

    // Salva o PDF
    doc.save("Agendamento-barbeiro.pdf");
  };

  const handleClick = () => {
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
      handleGeneratePDF(); // Gera o PDF após 3 segundos
    }, 2000);
  };

  return (
    <div>
      {showAlert && (
        <div style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          fontWeight: '600',
          transform: 'translateX(-50%)',
          backgroundColor: '#ee4c02',
          color: 'white',
          padding: '20px 20px',
          borderRadius: '5px',
          zIndex: 1000
        }}>
          Agendamento realizado com sucesso!
        </div>
      )}
      <button className='btn-serv' onClick={handleClick}>
        Aceitar
      </button>
    </div>
  );
};

export default PDFGenerator;
