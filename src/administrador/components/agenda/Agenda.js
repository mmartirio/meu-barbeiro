import React, { useState, Suspense, lazy } from 'react';
import { useNavigate } from 'react-router-dom'; // Importar o useNavigate
import './Agenda.css';


import FeedbackMessage from '../../../components/FeedbackMessage';
import { useTranslation } from 'react-i18next';

// Importação preguiçosa do componente Calendar
const Calendar = lazy(() => import('react-calendar')); // Lazy loading do calendário

const Agenda = () => {
  const [horarioAlmocoInicio, setHorarioAlmocoInicio] = useState('');
  const [horarioAlmocoFim, setHorarioAlmocoFim] = useState('');
  const [encerramentoAntecipado, setEncerramentoAntecipado] = useState('');
  const [motivoEncerramento, setMotivoEncerramento] = useState('');
  const [indisponibilidadeInicio, setIndisponibilidadeInicio] = useState('');
  const [indisponibilidadeFim, setIndisponibilidadeFim] = useState('');
  const [horarioAtendimentoInicio, setHorarioAtendimentoInicio] = useState('');
  const [horarioAtendimentoFim, setHorarioAtendimentoFim] = useState('');
  const [selectedDays, setSelectedDays] = useState([]);
  const [calendarDate, setCalendarDate] = useState(new Date());

  const { t } = useTranslation();
  const daysOfWeek = [
    t('agenda.monday') || 'Seg',
    t('agenda.tuesday') || 'Ter',
    t('agenda.wednesday') || 'Qua',
    t('agenda.thursday') || 'Qui',
    t('agenda.friday') || 'Sex',
    t('agenda.saturday') || 'Sab',
    t('agenda.sunday') || 'Dom',
  ];
  const navigate = useNavigate(); // Hook para navegação

  // Lógica para alternar dias selecionados
  const handleDayToggle = (day) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d) => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  // Lógica para aplicar o horário padrão para todo o ano
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const handleHorarioPadrao = () => {
    if (selectedDays.length === 0) {
      setFeedbackMsg(t('agenda.selectDay') || 'Selecione ao menos um dia da semana!');
      return;
    }
    // Aplicar lógica para definir o horário para todos os dias selecionados no ano
    console.log(`Definir horários para os dias: ${selectedDays.join(', ')}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({
      horarioAlmocoInicio,
      horarioAlmocoFim,
      encerramentoAntecipado,
      motivoEncerramento,
      indisponibilidadeInicio,
      indisponibilidadeFim,
      horarioAtendimentoInicio,
      horarioAtendimentoFim,
      selectedDays,
    });
  };

  // Função para voltar ao dashboard
  const handleVoltar = () => {
    navigate('/dashboard'); // Redireciona para a rota do dashboard
  };

  return (
    <>
      <h2 className='title'>{t('agenda.title') || 'Definir Agenda'}</h2>
      <FeedbackMessage message={feedbackMsg} type="error" onClose={() => setFeedbackMsg('')} />
      <form onSubmit={handleSubmit}>
        <div className="horarios-container">

          <h3>{t('agenda.attendance') || 'Horário de Atendimento'}</h3>
          <div className='set-horario'>
            <label>{t('agenda.start') || 'Início:'}</label>
            <input
              type="time"
              value={horarioAtendimentoInicio}
              onChange={(e) => setHorarioAtendimentoInicio(e.target.value)}
            />
            <label>{t('agenda.end') || 'Fim:'}</label>
            <input
              type="time"
              value={horarioAtendimentoFim}
              onChange={(e) => setHorarioAtendimentoFim(e.target.value)}
            />
          </div>


          <h3>{t('agenda.lunch') || 'Horário de Almoço'}</h3>
          <div className='set-horario'>
            <label>{t('agenda.start') || 'Início:'}</label>
            <input
              type="time"
              value={horarioAlmocoInicio}
              onChange={(e) => setHorarioAlmocoInicio(e.target.value)}
            />
            <label>{t('agenda.end') || 'Fim:'}</label>
            <input
              type="time"
              value={horarioAlmocoFim}
              onChange={(e) => setHorarioAlmocoFim(e.target.value)}
            />
          </div>


          <h3>{t('agenda.unavailable') || 'Indisponibilidade'}</h3>
          <div className='set-horario'>
            <label>{t('agenda.start') || 'Início:'}</label>
            <input
              type="time"
              value={indisponibilidadeInicio}
              onChange={(e) => setIndisponibilidadeInicio(e.target.value)}
            />
            <label>{t('agenda.end') || 'Fim:'}</label>
            <input
              type="time"
              value={indisponibilidadeFim}
              onChange={(e) => setIndisponibilidadeFim(e.target.value)}
            />
          </div>


          <h3>{t('agenda.earlyClose') || 'Encerramento Antecipado'}</h3>
          <div>
            <label>{t('agenda.end') || 'Fim:'}</label>
            <input
              type="time"
              value={encerramentoAntecipado}
              onChange={(e) => setEncerramentoAntecipado(e.target.value)}
            />
            <label>{t('agenda.reason') || 'Motivo:'}</label>
            <input
              type="text"
              placeholder={t('agenda.reasonPlaceholder') || 'Motivo do encerramento'}
              value={motivoEncerramento}
              onChange={(e) => setMotivoEncerramento(e.target.value)}
            />
          </div>


          <h3>{t('agenda.selectDays') || 'Selecione os Dias da Semana'}</h3>
          <div className='set-horario'>
            {daysOfWeek.map((day) => (
              <label key={day}>
                <input
                  type="checkbox"
                  value={day}
                  checked={selectedDays.includes(day)}
                  onChange={() => handleDayToggle(day)}
                />
                {day}
              </label>
            ))}
          </div>
        </div>


        <div className="calendar-container">
          <Suspense fallback={<div>{t('agenda.loadingCalendar') || 'Carregando Calendário...'}</div>}>
            <Calendar onChange={setCalendarDate} value={calendarDate} minDate={new Date()} />
          </Suspense>


        <div className='btn-agenda'>
          <button type="button" onClick={handleHorarioPadrao}>
            {t('agenda.defaultSchedule') || 'Horário Padrão'}
          </button>
          <button type="submit">{t('agenda.save') || 'Salvar Agenda'}</button>
        </div>
        </div>

          {/* Botão para Voltar ao Dashboard */}
        <button type="button" onClick={handleVoltar}>
          {t('agenda.back') || 'Voltar'}
        </button>
      </form>
      
    </>
  );
};

export default Agenda;
