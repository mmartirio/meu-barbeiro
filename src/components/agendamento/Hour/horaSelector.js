import React, { useState, useEffect } from 'react';
import './horaSelector.css';

const HoraSelector = ({ selectedDate, onSelectHour, onBook }) => {
  const [horarios, setHorarios] = useState([]);
  const [selectedHour, setSelectedHour] = useState(null);

  useEffect(() => {
    if (selectedDate) {
      setHorarios([
        '08:00', '09:00', '10:00', '11:00', '12:00',
        '13:00', '14:00', '15:00', '16:00', '17:00',
        '18:00', '19:00', '20:00', '21:00', '22:00'
      ]);
    }
  }, [selectedDate]);

  const handleHourClick = (hour) => {
    setSelectedHour(hour);
    onSelectHour?.(hour);
  };

  return (
    <div className='hora-selector'>
      {selectedDate ? (
        <div>
          <h3>Horários Disponíveis para {selectedDate.toLocaleDateString('pt-BR')}:</h3>
          <ul>
            {horarios.map((hora, index) => (
              <li 
                key={index} 
                onClick={() => handleHourClick(hora)}
                style={{ backgroundColor: hora === selectedHour ? '#3e4095' : 'transparent' }}
              >
                {hora}
              </li>
            ))}
          </ul>
          <button
            onClick={onBook}
            disabled={!selectedHour}
            className='btn-book'
          >
            Confirmar horário
          </button>
        </div>
      ) : (
        <p>Selecione uma data para ver os horários disponíveis.</p>
      )}
    </div>
  );
};

export default HoraSelector;
