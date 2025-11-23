// Script Node.js para migrar todos os tenants para usar o ID da imagem
// Execute: node scripts/migrateTenantBackgrounds.js

const { Sequelize } = require('sequelize');
const sequelize = require('../backend/config/db');
const Tenant = require('../backend/models/Tenant');
const fs = require('fs');
const Image = require('../backend/models/Image');
const path = require('path');

(async () => {
  await sequelize.authenticate();
  const tenants = await Tenant.findAll();
  for (const tenant of tenants) {
    if (tenant.backgroundImage && tenant.backgroundImage.startsWith('/uploads/')) {
      const filePath = path.join(__dirname, '../backend', tenant.backgroundImage);
      if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath);
        const ext = path.extname(filePath).replace('.', '') || 'jpg';
        const contentType = `image/${ext === 'jpg' ? 'jpeg' : ext}`;
        const image = await Image.create({ data, contentType });
        tenant.backgroundImage = image.id;
        await tenant.save();
        console.log(`Tenant ${tenant.id} migrado para imagem ID ${image.id}`);
      } else {
        console.warn(`Arquivo não encontrado para tenant ${tenant.id}: ${filePath}`);
      }
    }
  }
  console.log('Migração concluída!');
  process.exit(0);
})();
