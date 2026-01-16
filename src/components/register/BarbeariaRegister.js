import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardBody, CardTitle, CardDescription } from '../ui/Card';
import './BarbeariaRegister.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const BarbeariaRegister = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Dados da Empresa
    name: '',
    cnpj: '',
    phone: '',
    email: '',
    slug: '',
    
    // Endereço
    address: '',
    city: '',
    state: '',
    zipCode: '',
    
    // Administrador
    adminName: '',
    adminEmail: '',
    adminPassword: '',
    adminPasswordConfirm: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Limpar erro do campo ao digitar
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Gerar slug automaticamente do nome
    if (name === 'name' && !formData.slug) {
      const slug = value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setFormData(prev => ({ ...prev, slug }));
    }
  };

  const validateStep1 = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Nome é obrigatório';
    if (!formData.cnpj.trim()) newErrors.cnpj = 'CNPJ é obrigatório';
    if (!formData.phone.trim()) newErrors.phone = 'Telefone é obrigatório';
    if (!formData.email.trim()) newErrors.email = 'E-mail é obrigatório';
    if (!formData.slug.trim()) newErrors.slug = 'Slug é obrigatório';
    
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'E-mail inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    
    if (!formData.address.trim()) newErrors.address = 'Endereço é obrigatório';
    if (!formData.city.trim()) newErrors.city = 'Cidade é obrigatória';
    if (!formData.state.trim()) newErrors.state = 'Estado é obrigatório';
    if (!formData.zipCode.trim()) newErrors.zipCode = 'CEP é obrigatório';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors = {};
    
    if (!formData.adminName.trim()) newErrors.adminName = 'Nome do administrador é obrigatório';
    if (!formData.adminEmail.trim()) newErrors.adminEmail = 'E-mail do administrador é obrigatório';
    if (!formData.adminPassword) newErrors.adminPassword = 'Senha é obrigatória';
    if (formData.adminPassword.length < 6) newErrors.adminPassword = 'Senha deve ter no mínimo 6 caracteres';
    if (formData.adminPassword !== formData.adminPasswordConfirm) {
      newErrors.adminPasswordConfirm = 'As senhas não coincidem';
    }

    if (formData.adminEmail && !/\S+@\S+\.\S+/.test(formData.adminEmail)) {
      newErrors.adminEmail = 'E-mail inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    let isValid = false;
    
    switch (step) {
      case 1:
        isValid = validateStep1();
        break;
      case 2:
        isValid = validateStep2();
        break;
      default:
        isValid = true;
    }

    if (isValid) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep3()) return;

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/tenant/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          cnpj: formData.cnpj,
          phone: formData.phone,
          email: formData.email,
          slug: formData.slug,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          adminName: formData.adminName,
          adminEmail: formData.adminEmail,
          adminPassword: formData.adminPassword
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert('🎉 Barbearia cadastrada com sucesso! Você receberá um e-mail de confirmação.');
        navigate('/admin/login');
      } else {
        alert(`❌ Erro: ${data.message || 'Não foi possível cadastrar a barbearia'}`);
      }
    } catch (error) {
      console.error('Erro ao cadastrar:', error);
      alert('❌ Erro ao cadastrar barbearia. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="form-step">
            <div className="form-group">
              <label htmlFor="name">Nome da Barbearia *</label>
              <input
                type="text"
                id="name"
                name="name"
                className="form-input"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ex: Barbearia Premium"
              />
              {errors.name && <span className="form-error">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="cnpj">CNPJ *</label>
              <input
                type="text"
                id="cnpj"
                name="cnpj"
                className="form-input"
                value={formData.cnpj}
                onChange={handleChange}
                placeholder="00.000.000/0000-00"
              />
              {errors.cnpj && <span className="form-error">{errors.cnpj}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="phone">Telefone *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="form-input"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="(00) 00000-0000"
                />
                {errors.phone && <span className="form-error">{errors.phone}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="email">E-mail *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-input"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="contato@barbearia.com"
                />
                {errors.email && <span className="form-error">{errors.email}</span>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="slug">URL da Barbearia *</label>
              <div className="slug-input">
                <span className="slug-prefix">meubarbeiro.com/</span>
                <input
                  type="text"
                  id="slug"
                  name="slug"
                  className="form-input"
                  value={formData.slug}
                  onChange={handleChange}
                  placeholder="barbearia-premium"
                />
              </div>
              {errors.slug && <span className="form-error">{errors.slug}</span>}
              <small className="form-hint">Esta será a URL personalizada da sua barbearia</small>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="form-step">
            <div className="form-group">
              <label htmlFor="address">Endereço *</label>
              <input
                type="text"
                id="address"
                name="address"
                className="form-input"
                value={formData.address}
                onChange={handleChange}
                placeholder="Rua, número e complemento"
              />
              {errors.address && <span className="form-error">{errors.address}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="city">Cidade *</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  className="form-input"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="São Paulo"
                />
                {errors.city && <span className="form-error">{errors.city}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="state">Estado *</label>
                <select
                  id="state"
                  name="state"
                  className="form-select"
                  value={formData.state}
                  onChange={handleChange}
                >
                  <option value="">Selecione</option>
                  <option value="AC">Acre</option>
                  <option value="AL">Alagoas</option>
                  <option value="AP">Amapá</option>
                  <option value="AM">Amazonas</option>
                  <option value="BA">Bahia</option>
                  <option value="CE">Ceará</option>
                  <option value="DF">Distrito Federal</option>
                  <option value="ES">Espírito Santo</option>
                  <option value="GO">Goiás</option>
                  <option value="MA">Maranhão</option>
                  <option value="MT">Mato Grosso</option>
                  <option value="MS">Mato Grosso do Sul</option>
                  <option value="MG">Minas Gerais</option>
                  <option value="PA">Pará</option>
                  <option value="PB">Paraíba</option>
                  <option value="PR">Paraná</option>
                  <option value="PE">Pernambuco</option>
                  <option value="PI">Piauí</option>
                  <option value="RJ">Rio de Janeiro</option>
                  <option value="RN">Rio Grande do Norte</option>
                  <option value="RS">Rio Grande do Sul</option>
                  <option value="RO">Rondônia</option>
                  <option value="RR">Roraima</option>
                  <option value="SC">Santa Catarina</option>
                  <option value="SP">São Paulo</option>
                  <option value="SE">Sergipe</option>
                  <option value="TO">Tocantins</option>
                </select>
                {errors.state && <span className="form-error">{errors.state}</span>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="zipCode">CEP *</label>
              <input
                type="text"
                id="zipCode"
                name="zipCode"
                className="form-input"
                value={formData.zipCode}
                onChange={handleChange}
                placeholder="00000-000"
              />
              {errors.zipCode && <span className="form-error">{errors.zipCode}</span>}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="form-step">
            <div className="form-group">
              <label htmlFor="adminName">Nome do Administrador *</label>
              <input
                type="text"
                id="adminName"
                name="adminName"
                className="form-input"
                value={formData.adminName}
                onChange={handleChange}
                placeholder="Nome completo"
              />
              {errors.adminName && <span className="form-error">{errors.adminName}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="adminEmail">E-mail do Administrador *</label>
              <input
                type="email"
                id="adminEmail"
                name="adminEmail"
                className="form-input"
                value={formData.adminEmail}
                onChange={handleChange}
                placeholder="admin@email.com"
              />
              {errors.adminEmail && <span className="form-error">{errors.adminEmail}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="adminPassword">Senha *</label>
              <input
                type="password"
                id="adminPassword"
                name="adminPassword"
                className="form-input"
                value={formData.adminPassword}
                onChange={handleChange}
                placeholder="Mínimo 6 caracteres"
              />
              {errors.adminPassword && <span className="form-error">{errors.adminPassword}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="adminPasswordConfirm">Confirmar Senha *</label>
              <input
                type="password"
                id="adminPasswordConfirm"
                name="adminPasswordConfirm"
                className="form-input"
                value={formData.adminPasswordConfirm}
                onChange={handleChange}
                placeholder="Digite a senha novamente"
              />
              {errors.adminPasswordConfirm && <span className="form-error">{errors.adminPasswordConfirm}</span>}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <Card className="register-card">
          <CardHeader>
            <CardTitle>Cadastrar Nova Barbearia</CardTitle>
            <CardDescription>
              Preencha os dados para criar sua conta
            </CardDescription>
          </CardHeader>

          <CardBody>
            {/* Progress Stepper */}
            <div className="stepper">
              <div className={`step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
                <div className="step-number">
                  {step > 1 ? '✓' : '1'}
                </div>
                <div className="step-label">Dados da Empresa</div>
              </div>

              <div className="step-line"></div>

              <div className={`step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
                <div className="step-number">
                  {step > 2 ? '✓' : '2'}
                </div>
                <div className="step-label">Endereço</div>
              </div>

              <div className="step-line"></div>

              <div className={`step ${step >= 3 ? 'active' : ''}`}>
                <div className="step-number">3</div>
                <div className="step-label">Administrador</div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              {renderStep()}

              {/* Navigation Buttons */}
              <div className="form-actions">
                {step > 1 && (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleBack}
                    disabled={loading}
                  >
                    ← Voltar
                  </button>
                )}

                {step < 3 ? (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleNext}
                  >
                    Próximo →
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="btn btn-success"
                    disabled={loading}
                  >
                    {loading ? 'Cadastrando...' : '✓ Finalizar Cadastro'}
                  </button>
                )}
              </div>
            </form>

            <div className="register-footer">
              <p>
                Já tem uma conta?{' '}
                <a href="/admin/login" className="link-primary">
                  Fazer login
                </a>
              </p>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default BarbeariaRegister;
