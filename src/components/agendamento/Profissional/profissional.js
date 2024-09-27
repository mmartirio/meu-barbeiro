import React, { useState } from "react";
import './profissional.css';
import Servico from '../service/servico';

const Profissional = () => {
  const [selectedProf, setSelectedProf] = useState(null);

  return (
    <>
      {!selectedProf ? (
        <section className='container-pro'>
          <h2 className='title-pro'>Selecione o Profissional</h2>
          {['Gabriel', 'Inacio'].map(prof => (
            <div className='pro' key={prof} onClick={() => setSelectedProf(prof)}>
              <h3>Barbeiro {prof === 'Gabriel' ? 1 : 2}</h3>
            </div>
          ))}
        </section>
      ) : <Servico />}
    </>
  );
};

export default Profissional;
