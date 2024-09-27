import React, { useState } from 'react';
import { jsPDF } from 'jspdf'; 
import logo from '../../../assets/logo-meu-barbeiro.png'; // Verifique o caminho
import './pdfGenerator.css'; // Importa o arquivo de estilos

const PDFGenerator = ({ servicesDescription, totalValue, totalDuration, onDownloadComplete }) => {
  const [showAlert, setShowAlert] = useState(false);

  const handleGeneratePDF = () => {
    const doc = new jsPDF();
    const pdfWidth = doc.internal.pageSize.getWidth();

    // Definições da imagem
    const imageWidth = 24; 
    const imageHeight = 20; 
    const xPosition = (pdfWidth - imageWidth) / 2;

    // Adiciona a imagem da logo ao PDF (centralizada)
    try {
      doc.addImage(logo, 'PNG', xPosition, 10, imageWidth, imageHeight);
    } catch (error) {
      console.error("Erro ao adicionar imagem:", error);
      return; // Retorna caso ocorra erro
    }

    // Adiciona texto formatado ao PDF
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text("Resumo dos Serviços Selecionados", 20, 40);
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text(`Serviços: ${servicesDescription}`, 20, 60);
    doc.text(`Valor Total: R$ ${totalValue},00`, 20, 80);
    doc.text(`Duração Total: ${totalDuration} min`, 20, 100);

    // Formatação adicional
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    doc.line(20, 110, 190, 110);

    // Salva o PDF
    doc.save("Agendamento-barbeiro.pdf");

    // Chama a função de callback para sinalizar a conclusão do download
    onDownloadComplete();
  };

  const handleClick = () => {
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
      handleGeneratePDF(); // Gera o PDF após 2 segundos
    }, 2000);
  };

  return (
    <div>
      {showAlert && (
        <div className="alert">
          Agendamento realizado com sucesso!
        </div>
      )}
      <button className='btn-serv' onClick={handleClick}>
        Aceitar e Gerar PDF
      </button>
    </div>
  );
};

export default PDFGenerator;
