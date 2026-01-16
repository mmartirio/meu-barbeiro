import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardBody } from '../../components/ui/Card';
import StatCard from '../../components/ui/StatCard';
import Badge from '../../components/ui/Badge';
import './EnhancedDashboard.css';

const EnhancedDashboard = () => {
  const [stats, setStats] = useState({
    totalClients: 0,
    totalAppointments: 0,
    monthlyRevenue: 0,
    servicesPerformed: 0,
    loading: true
  });

  const [recentAppointments, setRecentAppointments] = useState([]);
  const [topServices, setTopServices] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Simulando dados - substitua com chamadas reais à API
      setTimeout(() => {
        setStats({
          totalClients: 342,
          totalAppointments: 128,
          monthlyRevenue: 15420.50,
          servicesPerformed: 89,
          loading: false
        });

        setRecentAppointments([
          { id: 1, client: 'João Silva', service: 'Corte + Barba', time: '14:30', status: 'confirmed' },
          { id: 2, client: 'Pedro Santos', service: 'Corte Simples', time: '15:00', status: 'pending' },
          { id: 3, client: 'Carlos Lima', service: 'Barba', time: '15:30', status: 'confirmed' },
        ]);

        setTopServices([
          { name: 'Corte + Barba', count: 45, revenue: 'R$ 5.850,00' },
          { name: 'Corte Simples', count: 32, revenue: 'R$ 2.240,00' },
          { name: 'Barba', count: 12, revenue: 'R$ 600,00' },
        ]);
      }, 1000);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      confirmed: { variant: 'success', text: 'Confirmado' },
      pending: { variant: 'warning', text: 'Pendente' },
      cancelled: { variant: 'error', text: 'Cancelado' },
      completed: { variant: 'primary', text: 'Concluído' }
    };

    const { variant, text } = variants[status] || variants.pending;
    return <Badge variant={variant} size="sm">{text}</Badge>;
  };

  return (
    <div className="enhanced-dashboard">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Dashboard</h1>
          <p className="dashboard-subtitle">
            Bem-vindo de volta! Aqui está o resumo de hoje.
          </p>
        </div>
        <div className="dashboard-actions">
          <button className="btn btn--outline">
            📊 Relatórios
          </button>
          <button className="btn btn--primary">
            ➕ Novo Agendamento
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <StatCard
          title="Total de Clientes"
          value={stats.totalClients}
          icon="👥"
          trend="up"
          trendValue="+12% este mês"
          variant="primary"
          loading={stats.loading}
        />
        <StatCard
          title="Agendamentos Hoje"
          value={stats.totalAppointments}
          icon="📅"
          trend="up"
          trendValue="+8% vs ontem"
          variant="success"
          loading={stats.loading}
        />
        <StatCard
          title="Faturamento Mensal"
          value={`R$ ${stats.monthlyRevenue.toFixed(2)}`}
          icon="💰"
          trend="up"
          trendValue="+23% vs mês anterior"
          loading={stats.loading}
        />
        <StatCard
          title="Serviços Realizados"
          value={stats.servicesPerformed}
          icon="✂️"
          trend="down"
          trendValue="-3% esta semana"
          loading={stats.loading}
        />
      </div>

      <div className="dashboard-grid">
        {/* Recent Appointments */}
        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle>Próximos Agendamentos</CardTitle>
          </CardHeader>
          <CardBody>
            <div className="appointments-list">
              {recentAppointments.map(appointment => (
                <div key={appointment.id} className="appointment-item">
                  <div className="appointment-info">
                    <h4 className="appointment-client">{appointment.client}</h4>
                    <p className="appointment-service">{appointment.service}</p>
                  </div>
                  <div className="appointment-meta">
                    <span className="appointment-time">🕐 {appointment.time}</span>
                    {getStatusBadge(appointment.status)}
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Top Services */}
        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle>Serviços Mais Vendidos</CardTitle>
          </CardHeader>
          <CardBody>
            <div className="services-list">
              {topServices.map((service, index) => (
                <div key={index} className="service-item">
                  <div className="service-rank">#{index + 1}</div>
                  <div className="service-details">
                    <h4 className="service-name">{service.name}</h4>
                    <div className="service-stats">
                      <span>{service.count} serviços</span>
                      <span className="service-revenue">{service.revenue}</span>
                    </div>
                  </div>
                  <div className="service-bar">
                    <div 
                      className="service-bar-fill" 
                      style={{ width: `${(service.count / 50) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Quick Actions */}
        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
          </CardHeader>
          <CardBody>
            <div className="quick-actions">
              <button className="quick-action-btn">
                <span className="quick-action-icon">➕</span>
                <span className="quick-action-text">Novo Cliente</span>
              </button>
              <button className="quick-action-btn">
                <span className="quick-action-icon">📅</span>
                <span className="quick-action-text">Agendar</span>
              </button>
              <button className="quick-action-btn">
                <span className="quick-action-icon">✂️</span>
                <span className="quick-action-text">Novo Serviço</span>
              </button>
              <button className="quick-action-btn">
                <span className="quick-action-icon">👤</span>
                <span className="quick-action-text">Novo Profissional</span>
              </button>
              <button className="quick-action-btn">
                <span className="quick-action-icon">📊</span>
                <span className="quick-action-text">Relatórios</span>
              </button>
              <button className="quick-action-btn">
                <span className="quick-action-icon">⚙️</span>
                <span className="quick-action-text">Configurações</span>
              </button>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default EnhancedDashboard;
