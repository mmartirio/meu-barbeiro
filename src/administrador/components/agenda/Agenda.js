import React, { useState } from 'react';

const Agenda = () => {
  const [horarioAlmocoInicio, setHorarioAlmocoInicio] = useState('');
  const [horarioAlmocoFim, setHorarioAlmocoFim] = useState('');
  const [encerramentoAntecipado, setEncerramentoAntecipado] = useState('');
  const [motivoEncerramento, setMotivoEncerramento] = useState('');
  const [indisponibilidadeInicio, setIndisponibilidadeInicio] = useState('');
  const [indisponibilidadeFim, setIndisponibilidadeFim] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Processamento da agenda aqui
    console.log({
      horarioAlmocoInicio,
      horarioAlmocoFim,
      encerramentoAntecipado,
      motivoEncerramento,
      indisponibilidadeInicio,
      indisponibilidadeFim
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Definir Agenda</h2>

      {/* Horário de Almoço */}
      <div>
        <label>Horário de Almoço (Início):</label>
        <input
          type="time"
          value={horarioAlmocoInicio}
          onChange={(e) => setHorarioAlmocoInicio(e.target.value)}
        />
        <label>Horário de Almoço (Fim):</label>
        <input
          type="time"
          value={horarioAlmocoFim}
          onChange={(e) => setHorarioAlmocoFim(e.target.value)}
        />
      </div>

      {/* Encerramento Antecipado */}
      <div>
        <label>Encerramento Antecipado:</label>
        <input
          type="time"
          value={encerramentoAntecipado}
          onChange={(e) => setEncerramentoAntecipado(e.target.value)}
        />
        <label>Motivo:</label>
        <input
          type="text"
          placeholder="Motivo do encerramento"
          value={motivoEncerramento}
          onChange={(e) => setMotivoEncerramento(e.target.value)}
        />
      </div>

      {/* Horário de Indisponibilidade */}
      <div>
        <h3>Horário de Indisponibilidade</h3>
        <label>Início:</label>
        <input
          type="time"
          value={indisponibilidadeInicio}
          onChange={(e) => setIndisponibilidadeInicio(e.target.value)}
        />
        <label>Fim:</label>
        <input
          type="time"
          value={indisponibilidadeFim}
          onChange={(e) => setIndisponibilidadeFim(e.target.value)}
        />
      </div>

      <button type="submit">Salvar Agenda</button>
    </form>
  );
};

export default Agenda;
