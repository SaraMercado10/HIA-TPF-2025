const pdfController = require('../controllers/pdf.controller');
const express = require('express');
const router = express.Router();

// Ruta para generar y descargar el PDF
router.post('/generate', async (req, res) => {
    try {
      // Aquí asumimos que los datos necesarios para generar el PDF están en req.body
      const data = req.body;
  
      // Llamar al método generatePDF del controlador
      await pdfController.generatePDF(data, res);
    } catch (error) {
      console.error('Error al generar el PDF:', error);
      res.status(500).send('Error al generar el PDF');
    }
  });


module.exports = router;