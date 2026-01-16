import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './CustomerPortal.css';

/**
 * Portal do Cliente - Interface pública para agendamento
 * Não requer autenticação, apenas telefone e dados básicos
 */
const CustomerPortal = () => {
    const { slug } = useParams();
    const [step, setStep] = useState(1); // 1: Identificação, 2: Seleção, 3: Confirmação
    const [loading, setLoading] = useState(false);
    const [tenantData, setTenantData] = useState({
        id: null,
        name: '',
        logo: '',
        backgroundImage: ''
    });
    
    // Dados do cliente
    const [customerData, setCustomerData] = useState({
        phone: '',
        name: '',
        birthDate: ''
    });
    const [customer, setCustomer] = useState(null);
    
    // Dados do agendamento
    const [services, setServices] = useState([]);
    const [professionals, setProfessionals] = useState([]);
    const [appointmentData, setAppointmentData] = useState({
        serviceId: '',
        professionalId: '',
        date: '',
        time: ''
    });
    
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

    // Carregar dados da barbearia ao montar o componente
    useEffect(() => {
        if (slug) {
            loadTenantData();
        }
    }, [slug]);

    // Carregar dados da barbearia (logo e background)
    const loadTenantData = async () => {
        try {
            const response = await fetch(`${API_URL}/api/tenant/slug/${slug}`);
            if (response.ok) {
                const data = await response.json();
                setTenantData(data);
            } else {
                alert('😞 Ops! Não conseguimos encontrar esta barbearia. Por favor, verifique se o link está correto.');
            }
        } catch (error) {
            console.error('Erro ao carregar dados da barbearia:', error);
        }
    };

    // Passo 1: Identificar/Criar Cliente
    const handleCustomerSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/api/public/customer/get-or-create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...customerData,
                    tenantId: tenantData.id
                })
            });

            if (!response.ok) throw new Error('Erro ao processar dados do cliente');

            const data = await response.json();
            setCustomer(data.customer);
            setStep(2);
            loadServices();
            loadProfessionals();
        } catch (error) {
            console.error('Erro:', error);
            alert('😞 Não foi possível processar seus dados. Por favor, verifique as informações e tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    // Carregar serviços disponíveis
    const loadServices = async () => {
        try {
            // TODO: Criar endpoint público para listar serviços
            const response = await fetch(`${API_URL}/api/service?tenantId=${tenantData.id}`);
            const data = await response.json();
            setServices(data.services || []);
        } catch (error) {
            console.error('Erro ao carregar serviços:', error);
        }
    };

    // Carregar profissionais disponíveis
    const loadProfessionals = async () => {
        try {
            // TODO: Criar endpoint público para listar profissionais
            const response = await fetch(`${API_URL}/api/professional?tenantId=${tenantData.id}`);
            const data = await response.json();
            setProfessionals(data.professionals || []);
        } catch (error) {
            console.error('Erro ao carregar profissionais:', error);
        }
    };

    // Passo 2: Criar Agendamento
    const handleAppointmentSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const dateTime = `${appointmentData.date}T${appointmentData.time}:00`;
            
            const response = await fetch(`${API_URL}/api/public/appointment/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    customerPhone: customer.phone,
                    serviceId: appointmentData.serviceId,
                    professionalId: appointmentData.professionalId,
                    date: dateTime,
                    tenantId: tenantData.id
                })
            });

            if (!response.ok) throw new Error('Erro ao criar agendamento');

            const data = await response.json();
            setStep(3);
        } catch (error) {
            console.error('Erro:', error);
            alert('😞 Não foi possível criar seu agendamento. Por favor, tente novamente ou entre em contato com a barbearia.');
        } finally {
            setLoading(false);
        }
    };

    // Renderizar formulário de identificação
    const renderStepIdentification = () => (
        <div className="customer-portal-step">
            <h2>Identificação</h2>
            <p>Por favor, informe seus dados para agendar</p>
            
            <form onSubmit={handleCustomerSubmit}>
                <div className="form-group">
                    <label>Telefone *</label>
                    <input
                        type="tel"
                        placeholder="(11) 98765-4321"
                        value={customerData.phone}
                        onChange={(e) => setCustomerData({...customerData, phone: e.target.value})}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Nome Completo *</label>
                    <input
                        type="text"
                        placeholder="João Silva"
                        value={customerData.name}
                        onChange={(e) => setCustomerData({...customerData, name: e.target.value})}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Data de Nascimento</label>
                    <input
                        type="date"
                        value={customerData.birthDate}
                        onChange={(e) => setCustomerData({...customerData, birthDate: e.target.value})}
                    />
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? 'Processando...' : 'Continuar'}
                </button>
            </form>
        </div>
    );

    // Renderizar seleção de serviço e horário
    const renderStepSelection = () => (
        <div className="customer-portal-step">
            <h2>Agendar Serviço</h2>
            <p>Olá, {customer?.name}! Escolha o serviço, profissional e horário</p>
            
            <form onSubmit={handleAppointmentSubmit}>
                <div className="form-group">
                    <label>Serviço *</label>
                    <select
                        value={appointmentData.serviceId}
                        onChange={(e) => setAppointmentData({...appointmentData, serviceId: e.target.value})}
                        required
                    >
                        <option value="">Selecione um serviço</option>
                        {services.map(service => (
                            <option key={service.id} value={service.id}>
                                {service.name} - R$ {service.price}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Profissional *</label>
                    <select
                        value={appointmentData.professionalId}
                        onChange={(e) => setAppointmentData({...appointmentData, professionalId: e.target.value})}
                        required
                    >
                        <option value="">Selecione um profissional</option>
                        {professionals.map(prof => (
                            <option key={prof.id} value={prof.id}>
                                {prof.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Data *</label>
                    <input
                        type="date"
                        value={appointmentData.date}
                        onChange={(e) => setAppointmentData({...appointmentData, date: e.target.value})}
                        min={new Date().toISOString().split('T')[0]}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Horário *</label>
                    <select
                        value={appointmentData.time}
                        onChange={(e) => setAppointmentData({...appointmentData, time: e.target.value})}
                        required
                    >
                        <option value="">Selecione um horário</option>
                        <option value="08:00">08:00</option>
                        <option value="08:30">08:30</option>
                        <option value="09:00">09:00</option>
                        <option value="09:30">09:30</option>
                        <option value="10:00">10:00</option>
                        <option value="10:30">10:30</option>
                        <option value="11:00">11:00</option>
                        <option value="11:30">11:30</option>
                        <option value="14:00">14:00</option>
                        <option value="14:30">14:30</option>
                        <option value="15:00">15:00</option>
                        <option value="15:30">15:30</option>
                        <option value="16:00">16:00</option>
                        <option value="16:30">16:30</option>
                        <option value="17:00">17:00</option>
                    </select>
                </div>

                <div className="button-group">
                    <button type="button" onClick={() => setStep(1)}>
                        Voltar
                    </button>
                    <button type="submit" disabled={loading}>
                        {loading ? 'Agendando...' : 'Confirmar Agendamento'}
                    </button>
                </div>
            </form>
        </div>
    );

    // Renderizar confirmação
    const renderStepConfirmation = () => (
        <div className="customer-portal-step confirmation">
            <h2>✓ Agendamento Confirmado!</h2>
            <p>Seu agendamento foi realizado com sucesso.</p>
            
            <div className="confirmation-details">
                <h3>Detalhes do Agendamento</h3>
                <p><strong>Nome:</strong> {customer?.name}</p>
                <p><strong>Telefone:</strong> {customer?.phone}</p>
                <p><strong>Data:</strong> {appointmentData.date}</p>
                <p><strong>Horário:</strong> {appointmentData.time}</p>
            </div>

            <button onClick={() => {
                setStep(1);
                setCustomer(null);
                setCustomerData({ phone: '', name: '', birthDate: '' });
                setAppointmentData({ serviceId: '', professionalId: '', date: '', time: '' });
            }}>
                Fazer Novo Agendamento
            </button>
        </div>
    );

    return (
        <div 
            className="customer-portal"
            style={{
                backgroundImage: tenantData.backgroundImage 
                    ? `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${API_URL}${tenantData.backgroundImage})`
                    : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed'
            }}
        >
            <div className="customer-portal-container">
                {tenantData.logo && (
                    <div className="customer-portal-logo">
                        <img 
                            src={`${API_URL}${tenantData.logo}`} 
                            alt={tenantData.name}
                        />
                    </div>
                )}

                <div className="portal-header">
                    <h1>{tenantData.name || 'Portal do Cliente'}</h1>
                    <p>Agende seu horário de forma rápida e fácil</p>
                </div>

                <div className="portal-progress">
                    <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>1. Identificação</div>
                    <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>2. Agendamento</div>
                    <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>3. Confirmação</div>
                </div>

                <div className="portal-content">
                    {step === 1 && renderStepIdentification()}
                    {step === 2 && renderStepSelection()}
                    {step === 3 && renderStepConfirmation()}
                </div>
            </div>
        </div>
    );
};

export default CustomerPortal;
