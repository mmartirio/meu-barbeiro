import React, { useState, lazy, Suspense } from 'react';
import './servico.css';

const Login = lazy(() => import('../../login/login'));
const PDFGenerator = lazy(() => import('../PDF/pdfGenerator'));

const servicesData = [
  { name: 'Corte Social', duration: 30, value: 20 },
  { name: 'Corte Degradê', duration: 60, value: 25 },
  { name: 'Barba', duration: 30, value: 15 },
  { name: 'Sobrancelha', duration: 15, value: 5 },
  { name: 'Luzes Cabelo', duration: 90, value: 40 },
  { name: 'Luzes Barba', duration: 30, value: 20 },
  { name: 'Platinado', duration: 120, value: 70 },
  { name: 'Pigmentação Cabelo', duration: 20, value: 8 },
  { name: 'Pigmentação Barba', duration: 15, value: 5 },
];

const Servico = () => {
  const [selectedServices, setSelectedServices] = useState([]);
  const [showLogin, setShowLogin] = useState(false); // Estado para controlar a exibição do Login

  const toggleService = (service) => {
    setSelectedServices((prev) =>
      prev.includes(service) ? prev.filter(s => s !== service) : [...prev, service]
    );
  };

  const total = selectedServices.reduce((acc, name) => {
    const { value = 0, duration = 0 } = servicesData.find(s => s.name === name) || {};
    return { value: acc.value + value, duration: acc.duration + duration };
  }, { value: 0, duration: 0 });

  const handlePdfGenerated = () => {
    // Atualiza o estado para exibir o Login e ocultar o componente de serviços
    setShowLogin(true);
  };

  if (showLogin) {
    // Renderiza apenas o Login, substituindo completamente o componente de serviços
    return (
      <Suspense fallback={<div>Carregando Login...</div>}>
        <Login />
      </Suspense>
    );
  }

  return (
    <section className='container-serv'>
      <h2 className='title-serv'>Selecione o Serviço desejado</h2>
      {servicesData.map(({ name, duration, value }) => (
        <div 
          key={name} 
          className={`serv ${selectedServices.includes(name) ? 'selected' : ''}`} 
          onClick={() => toggleService(name)}
        >
          <h3>{name}</h3>
          <p>Duração: {duration} min</p>
          <p>Valor: R$ {value},00</p>
        </div>
      ))}
      {selectedServices.length > 0 && (
        <section className='summary-serv'>
          <h3>Resumo dos Serviços Selecionados:</h3>
          <p>Serviço: {selectedServices.join(' + ')}</p>
          <p>Valor Total: R$ {total.value},00</p>
          <p>Duração Total: {total.duration} min</p>
          <Suspense fallback={<div>Carregando PDF...</div>}>
            <PDFGenerator 
              servicesDescription={selectedServices.join(' + ')} 
              totalValue={total.value} 
              totalDuration={total.duration} 
              onDownloadComplete={handlePdfGenerated} // Passa a função de callback correta
            />
          </Suspense>
        </section>
      )}
    </section>
  );
}

export default Servico;
