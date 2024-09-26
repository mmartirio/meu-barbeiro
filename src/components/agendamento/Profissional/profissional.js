import React from "react";
import { useState } from "react";
import './profissional.css';
import Servico from '../service/servico';

const Profissional = () => {
  const [selectedProf, setSelectedProf] = useState(null);

  const handleSelectProf = (prof) => {
    setSelectedProf(prof);
  };

  return (
    <>
      {!selectedProf ? (
        <section className='container-pro'>
          <h2 className='title-pro'>Selecione o Profissional</h2>
          <div className='pro' onClick={() => handleSelectProf('Gabriel')}>
            <h3>Barbeiro 1</h3>
          </div>
          <div className='pro' onClick={() => handleSelectProf('Inacio')}>
            <h3>Barbeiro 2</h3>
          </div>
        </section>
      ) : (
        <Servico />
      )}
    </>
  );
};

export default Profissional;
