import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './BarbeariaRegister.css';

/**
 * Formulário de Cadastro Completo de Barbearia
 * Cria tenant + grupos + usuário admin em uma operação
 */
const BarbeariaRegister = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1); // 1: Dados da Barbearia, 2: Endereço, 3: Proprietário, 4: Sucesso
    const [error, setError] = useState('');
    const [successData, setSuccessData] = useState(null);

    const [formData, setFormData] = useState({
        // Dados da Barbearia
        name: '',
        companyName: '',
        cnpj: '',
        email: '',
        phone: '',
        // Endereço
        address: '',
        neighborhood: '',
        city: '',
        state: '',
        zipCode: '',
        // Proprietário
        ownerName: '',
        ownerEmail: '',
        ownerPhone: '',
        ownerPassword: '',
        ownerPasswordConfirm: ''
    });

    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError('');
    };

    const formatCNPJ = (value) => {
        const numbers = value.replace(/\D/g, '');
        return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    };

    const formatPhone = (value) => {
        const numbers = value.replace(/\D/g, '');
        if (numbers.length <= 10) {
            return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
        }
        return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    };

    const formatCEP = (value) => {
        const numbers = value.replace(/\D/g, '');
        return numbers.replace(/(\d{5})(\d{3})/, '$1-$2');
    };

    const handleCNPJChange = (e) => {
        const formatted = formatCNPJ(e.target.value);
        setFormData(prev => ({ ...prev, cnpj: formatted }));
    };

    const handlePhoneChange = (e, field) => {
        const formatted = formatPhone(e.target.value);
        setFormData(prev => ({ ...prev, [field]: formatted }));
    };

    const handleCEPChange = (e) => {
        const formatted = formatCEP(e.target.value);
        setFormData(prev => ({ ...prev, zipCode: formatted }));
    };

    const validateStep1 = () => {
        if (!formData.name || !formData.email) {
            setError('📝 Por favor, preencha o nome fantasia e o e-mail da barbearia');
            return false;
        }
        if (!formData.email.includes('@')) {
            setError('📧 O e-mail informado não é válido. Por favor, corrija');
            return false;
        }
        return true;
    };

    const validateStep2 = () => {
        // Endereço é opcional
        return true;
    };

    const validateStep3 = () => {
        if (!formData.ownerName || !formData.ownerEmail || !formData.ownerPassword) {
            setError('👤 Por favor, preencha todos os dados do proprietário (nome, e-mail e senha)');
            return false;
        }
        if (formData.ownerPassword.length < 6) {
            setError('🔒 A senha precisa ter pelo menos 6 caracteres para sua segurança');
            return false;
        }
        if (formData.ownerPassword !== formData.ownerPasswordConfirm) {
            setError('🔒 As senhas não estão iguais. Por favor, confirme novamente');
            return false;
        }
        return true;
    };

    const handleNext = () => {
        setError('');
        if (step === 1 && validateStep1()) setStep(2);
        else if (step === 2 && validateStep2()) setStep(3);
    };

    const handleBack = () => {
        setError('');
        if (step > 1) setStep(step - 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateStep3()) return;

        setLoading(true);
        setError('');

        try {
            const response = await fetch(`${API_URL}/api/tenant/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Erro ao cadastrar barbearia');
            }

            setSuccessData(data);
            setStep(4);
        } catch (err) {
            console.error('Erro:', err);
            setError(err.message || 'Erro ao cadastrar barbearia. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    const renderStep1 = () => (
        <div className="form-step">
            <h3>Dados da Barbearia</h3>
            
            <div className="form-group">
                <label>Nome Fantasia *</label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Barbearia do João"
                    required
                />
            </div>

            <div className="form-group">
                <label>Razão Social</label>
                <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    placeholder="João Silva Barbearia LTDA"
                />
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label>CNPJ</label>
                    <input
                        type="text"
                        name="cnpj"
                        value={formData.cnpj}
                        onChange={handleCNPJChange}
                        placeholder="00.000.000/0000-00"
                        maxLength={18}
                    />
                </div>

                <div className="form-group">
                    <label>Telefone</label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={(e) => handlePhoneChange(e, 'phone')}
                        placeholder="(11) 98765-4321"
                        maxLength={15}
                    />
                </div>
            </div>

            <div className="form-group">
                <label>Email da Barbearia *</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="contato@barbearia.com.br"
                    required
                />
            </div>

            <button type="button" onClick={handleNext} className="btn-primary">
                Próximo
            </button>
        </div>
    );

    const renderStep2 = () => (
        <div className="form-step">
            <h3>Endereço</h3>
            
            <div className="form-row">
                <div className="form-group">
                    <label>CEP</label>
                    <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleCEPChange}
                        placeholder="00000-000"
                        maxLength={9}
                    />
                </div>

                <div className="form-group" style={{flex: 2}}>
                    <label>Rua/Avenida, Número</label>
                    <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Rua das Flores, 123"
                    />
                </div>
            </div>

            <div className="form-group">
                <label>Bairro</label>
                <input
                    type="text"
                    name="neighborhood"
                    value={formData.neighborhood}
                    onChange={handleChange}
                    placeholder="Centro"
                />
            </div>

            <div className="form-row">
                <div className="form-group" style={{flex: 2}}>
                    <label>Cidade</label>
                    <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="São Paulo"
                    />
                </div>

                <div className="form-group">
                    <label>Estado</label>
                    <select
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                    >
                        <option value="">UF</option>
                        <option value="AC">AC</option>
                        <option value="AL">AL</option>
                        <option value="AP">AP</option>
                        <option value="AM">AM</option>
                        <option value="BA">BA</option>
                        <option value="CE">CE</option>
                        <option value="DF">DF</option>
                        <option value="ES">ES</option>
                        <option value="GO">GO</option>
                        <option value="MA">MA</option>
                        <option value="MT">MT</option>
                        <option value="MS">MS</option>
                        <option value="MG">MG</option>
                        <option value="PA">PA</option>
                        <option value="PB">PB</option>
                        <option value="PR">PR</option>
                        <option value="PE">PE</option>
                        <option value="PI">PI</option>
                        <option value="RJ">RJ</option>
                        <option value="RN">RN</option>
                        <option value="RS">RS</option>
                        <option value="RO">RO</option>
                        <option value="RR">RR</option>
                        <option value="SC">SC</option>
                        <option value="SP">SP</option>
                        <option value="SE">SE</option>
                        <option value="TO">TO</option>
                    </select>
                </div>
            </div>

            <div className="button-group">
                <button type="button" onClick={handleBack} className="btn-secondary">
                    Voltar
                </button>
                <button type="button" onClick={handleNext} className="btn-primary">
                    Próximo
                </button>
            </div>
        </div>
    );

    const renderStep3 = () => (
        <div className="form-step">
            <h3>Dados do Proprietário</h3>
            <p className="step-description">
                Essas credenciais serão usadas para acessar o painel administrativo
            </p>
            
            <div className="form-group">
                <label>Nome Completo *</label>
                <input
                    type="text"
                    name="ownerName"
                    value={formData.ownerName}
                    onChange={handleChange}
                    placeholder="João Silva"
                    required
                />
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label>Email *</label>
                    <input
                        type="email"
                        name="ownerEmail"
                        value={formData.ownerEmail}
                        onChange={handleChange}
                        placeholder="joao@email.com"
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Telefone</label>
                    <input
                        type="tel"
                        name="ownerPhone"
                        value={formData.ownerPhone}
                        onChange={(e) => handlePhoneChange(e, 'ownerPhone')}
                        placeholder="(11) 98765-4321"
                        maxLength={15}
                    />
                </div>
            </div>

            <div className="form-group">
                <label>Senha de Acesso *</label>
                <input
                    type="password"
                    name="ownerPassword"
                    value={formData.ownerPassword}
                    onChange={handleChange}
                    placeholder="Mínimo 6 caracteres"
                    required
                    minLength={6}
                />
            </div>

            <div className="form-group">
                <label>Confirmar Senha *</label>
                <input
                    type="password"
                    name="ownerPasswordConfirm"
                    value={formData.ownerPasswordConfirm}
                    onChange={handleChange}
                    placeholder="Digite a senha novamente"
                    required
                />
            </div>

            <div className="button-group">
                <button type="button" onClick={handleBack} className="btn-secondary">
                    Voltar
                </button>
                <button 
                    type="submit" 
                    onClick={handleSubmit}
                    disabled={loading} 
                    className="btn-primary"
                >
                    {loading ? 'Cadastrando...' : 'Finalizar Cadastro'}
                </button>
            </div>
        </div>
    );

    const renderStep4 = () => (
        <div className="form-step success">
            <div className="success-icon">✓</div>
            <h2>Cadastro Realizado com Sucesso!</h2>
            <p>Sua barbearia foi cadastrada e está pronta para uso.</p>

            <div className="credentials-box">
                <h4>Credenciais de Acesso</h4>
                <div className="credential-item">
                    <strong>Email:</strong> {successData?.credentials?.email}
                </div>
                <div className="credential-item">
                    <strong>URL de acesso:</strong> {successData?.accessUrl}
                </div>
                <p className="credential-note">
                    Um email foi enviado com as instruções de acesso.
                </p>
            </div>

            <div className="success-details">
                <h4>O que foi criado:</h4>
                <ul>
                    <li>✓ Barbearia cadastrada</li>
                    <li>✓ 3 grupos de acesso (Administrador, Barbeiro, Atendente)</li>
                    <li>✓ Usuário administrador criado</li>
                    <li>✓ Sistema pronto para uso</li>
                </ul>
            </div>

            <button 
                onClick={() => navigate('/admin')} 
                className="btn-primary"
            >
                Fazer Login
            </button>
        </div>
    );

    return (
        <div className="barbearia-register">
            <div className="register-container">
                <div className="register-header">
                    <h1>Cadastro de Barbearia</h1>
                    <p>Complete os dados para começar a usar o sistema</p>
                </div>

                {step < 4 && (
                    <div className="progress-bar">
                        <div className="progress-steps">
                            <div className={`progress-step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
                                <span className="step-number">1</span>
                                <span className="step-label">Barbearia</span>
                            </div>
                            <div className={`progress-step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
                                <span className="step-number">2</span>
                                <span className="step-label">Endereço</span>
                            </div>
                            <div className={`progress-step ${step >= 3 ? 'active' : ''} ${step > 3 ? 'completed' : ''}`}>
                                <span className="step-number">3</span>
                                <span className="step-label">Proprietário</span>
                            </div>
                        </div>
                        <div className="progress-line">
                            <div 
                                className="progress-line-fill" 
                                style={{width: `${((step - 1) / 2) * 100}%`}}
                            />
                        </div>
                    </div>
                )}

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="register-form">
                    {step === 1 && renderStep1()}
                    {step === 2 && renderStep2()}
                    {step === 3 && renderStep3()}
                    {step === 4 && renderStep4()}
                </form>
            </div>
        </div>
    );
};

export default BarbeariaRegister;
