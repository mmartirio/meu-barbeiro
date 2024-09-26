import React, { useState } from 'react';
import './servico.css';
import PDFGenerator from '../PDF/pdfGenerator';  // Importe o componente PDFGenerator

const Servico = () => {
  // Definindo os serviços com seus valores e durações
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

  const [selectedServices, setSelectedServices] = useState([]);

  const handleSelectService = (service) => {
    if (selectedServices.includes(service)) {
      setSelectedServices(selectedServices.filter(s => s !== service));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  // Gera a descrição dos serviços selecionados
  const servicesDescription = selectedServices.join(' + ');

  // Calcula a soma dos valores e durações dos serviços selecionados
  const totalValue = selectedServices.reduce((total, serviceName) => {
    const selectedService = servicesData.find(s => s.name === serviceName);
    return total + (selectedService ? selectedService.value : 0);
  }, 0);

  const totalDuration = selectedServices.reduce((total, serviceName) => {
    const selectedService = servicesData.find(s => s.name === serviceName);
    return total + (selectedService ? selectedService.duration : 0);
  }, 0);

  return (
    <>
      <section className='container-serv'>
        <h2 className='title-serv'>Selecione o Serviço desejado</h2>
        {servicesData.map(service => (
          <div 
            key={service.name}
            className={`serv ${selectedServices.includes(service.name) ? 'selected' : ''}`} 
            onClick={() => handleSelectService(service.name)}
          >
            <h3>{service.name}</h3>
            <p>Duração: {service.duration} min</p>
            <p>Valor: R$ {service.value},00</p>
          </div>
        ))}
        {selectedServices.length > 0 && (
          <section className='summary-serv'>
            <h3>Resumo dos Serviços Selecionados:</h3>
            <p>Serviço: {servicesDescription}</p>
            <p>Valor Total: R$ {totalValue},00</p>
            <p>Duração Total: {totalDuration} min</p>
            {/* Usa o componente PDFGenerator */}
            <PDFGenerator 
              servicesDescription={servicesDescription} 
              totalValue={totalValue} 
              totalDuration={totalDuration} 
            />
          </section>
        )}
      </section>
    </>
  );
}

export default Servico;
