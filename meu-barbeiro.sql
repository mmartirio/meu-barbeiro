-- Criação da tabela 'user'
CREATE TABLE IF NOT EXISTS user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'barber', 'client') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criação da tabela 'services'
CREATE TABLE IF NOT EXISTS services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    duration TIME NOT NULL,  -- duração do serviço em formato de horas e minutos
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criação da tabela 'agenda'
CREATE TABLE IF NOT EXISTS agenda (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,  -- referência ao barbeiro
    service_id INT NOT NULL,  -- referência ao serviço
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE
);

-- Criação da tabela 'report'
CREATE TABLE IF NOT EXISTS report (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,  -- referência ao usuário (barbeiro ou admin)
    report_type ENUM('daily', 'weekly', 'biweekly', 'monthly', 'quarterly', 'semiannual', 'annual') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
);

-- Criação da tabela 'login_admin'
CREATE TABLE IF NOT EXISTS login_admin (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,  -- referência ao administrador
    login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    success BOOLEAN NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
);

-- Criação da tabela 'recover_password'
CREATE TABLE IF NOT EXISTS recover_password (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,  -- referência ao usuário
    token VARCHAR(255) NOT NULL,  -- token para recuperação de senha
    expiration TIMESTAMP NOT NULL,  -- data de expiração do token
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
);

-- Criação da tabela 'working_hours'
CREATE TABLE IF NOT EXISTS working_hours (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,  -- referência ao barbeiro
    start_time TIME NOT NULL,  -- horário de início do expediente
    end_time TIME NOT NULL,  -- horário de término do expediente
    lunch_start TIME,  -- horário de início do almoço (opcional)
    lunch_end TIME,  -- horário de término do almoço (opcional)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
);

-- Criação da tabela 'unavailability'
CREATE TABLE IF NOT EXISTS unavailability (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,  -- referência ao barbeiro
    start_time TIMESTAMP NOT NULL,  -- início da indisponibilidade
    end_time TIMESTAMP NOT NULL,  -- fim da indisponibilidade
    reason TEXT,  -- motivo da indisponibilidade
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
);

-- Criação da tabela 'early_closure'
CREATE TABLE IF NOT EXISTS early_closure (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,  -- referência ao barbeiro
    closure_time TIME NOT NULL,  -- horário de encerramento antecipado
    reason TEXT,  -- motivo do encerramento antecipado
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
);

-- Exibir as tabelas criadas
SHOW TABLES;
USE meu_barbeiro;
CREATE DATABASE meu_barbeiro;

SHOW DATABASES;




