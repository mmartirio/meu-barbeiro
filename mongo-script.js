// mongo-script.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./backend/models/User');
const Service = require('./backend/models/Service');
const Professional = require('./backend/models/Professional');

dotenv.config();

const mongoURI = process.env.MONGO_URI;

const seedDatabase = async () => {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Limpa as coleções existentes
    await User.deleteMany({});
    await Service.deleteMany({});
    await Professional.deleteMany({});

    // Adiciona usuários
    const users = await User.insertMany([
      { name: 'Administrador', email: 'admin@meubarbeiro.com', password: 'admin123' },
    ]);

    // Adiciona serviços
    const services = await Service.insertMany([
      { name: 'Corte de Cabelo', duration: 30, price: 50 },
      { name: 'Barba', duration: 15, price: 20 },
      { name: 'Corte e Barba', duration: 45, price: 60 },
    ]);

    // Adiciona profissionais
    const professionals = await Professional.insertMany([
      { name: 'Carlos Silva', specialty: 'Corte e Barba' },
      { name: 'Maria Oliveira', specialty: 'Corte de Cabelo' },
    ]);

    console.log('Dados inseridos com sucesso!');
  } catch (error) {
    console.error(`Error: ${error.message}`);
  } finally {
    mongoose.connection.close();
  }
};

seedDatabase();
