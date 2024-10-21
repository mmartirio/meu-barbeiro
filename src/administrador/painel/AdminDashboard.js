import React, { useEffect, useState } from 'react';
import Sidebar from './sidebar/Sidebar';
import Header from './header/Header';
import { Bar } from 'react-chartjs-2'; // Importa o componente Bar para criar gráficos de barras
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Outlet, useLocation } from 'react-router-dom'; // Adiciona useLocation
import './AdminDashboard.css';

// Registra os componentes do Chart.js que serão usados
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AdminDashboard = () => {
  const [chartData, setChartData] = useState(null);
  const location = useLocation(); // Obtém a localização atual

  useEffect(() => {
    // Simula o carregamento de dados de serviços realizados no mês
    const loadServiceData = async () => {
      // Aqui você pode fazer uma chamada à sua API para obter os dados reais
      const servicesData = {
        labels: ['Corte de Cabelo', 'Barba', 'Corte e Barba', 'Coloração', 'Tratamento'],
        datasets: [
          {
            label: 'Serviços Realizados',
            data: [30, 20, 10, 5, 15], // Dados de exemplo
            backgroundColor: [
              '#FF6384', // Corte de Cabelo
              '#36A2EB', // Barba
              '#FFCE56', // Corte e Barba
              '#4BC0C0', // Coloração
              '#9966FF', // Tratamento/ Cor das barras
            ]
          },
        ],
      };

      // Define os dados no estado
      setChartData(servicesData);
    };

    loadServiceData();
  }, []);

  return (
    <div className="admin-dashboard">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="content-area">
          <h2>Serviços Realizados no Mês</h2>
          {location.pathname === '/dashboard' ? ( // Verifica se a rota atual é o dashboard
            chartData ? (
              <Bar 
                data={chartData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                    title: {
                      display: true,
                      text: 'Gráfico de Serviços Realizados no Mês',
                    },
                  },
                }}
              />
            ) : (
              <p>Carregando dados...</p>
            )
          ) : (
            <Outlet /> // Renderiza o componente alternativo
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
