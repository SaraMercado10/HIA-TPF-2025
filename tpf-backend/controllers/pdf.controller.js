// pdf.controller.js

const pdf = require('html-pdf');
const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');



// Función para generar el PDF y el QR
const generatePDF = async (data, res) => {
  try {
    // Generar el contenido HTML con comillas inversas (`)
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Comprobante de Pago</title>
        <style>
          /* Estilos CSS omitidos por brevedad */
          body {
            font-family: 'Arial, sans-serif';
            margin: 0;
            padding: 0;
            background: #f4f4f4;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh; /* Asegura que el contenido esté centrado verticalmente */
          }
          .comprobante-container {
            background: #fff;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            width: 600px; /* Ancho máximo del contenido */
            max-width: calc(100% - 40px); /* Asegura que no exceda el ancho del viewport */
          }
          .header {
            text-align: center;
            margin-bottom: 20px;
          }
          .header img {
            width: 100px;
            margin-bottom: 10px;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
            color: #333;
          }
          .details {
            margin-bottom: 20px;
          }
          .details p {
            margin: 5px 0;
            font-size: 16px;
            color: #555;
          }
          .footer {
            text-align: center;
            margin-top: 20px;
          }
          .footer p {
            margin: 0;
            font-size: 14px;
            color: #999;
          }
          .qr-code {
            text-align: center;
            margin-top: 20px;
          }
          .qr-code img {
            width: 100px;
          }
        </style>
      </head>
      <body>
        <div class="comprobante-container">
          <div class="header">
            <img src="../temp/log.png" alt="Logo">
            <h1>Comprobante de Pago</h1>
          </div>
          <div class="details">
            <p><strong>ID Transacción:</strong> ${data.id}</p>
            <p><strong>Monto: $</strong> ${data.purchase_units[0].amount.value} </p>
            <p><strong>Estado:</strong> ${data.status}</p>
            <p><strong>Fecha:</strong> ${new Date(data.create_time).toLocaleDateString()}</p>
            <p><strong>Nombre del Cliente:</strong> ${data.payer.name.given_name} ${data.payer.name.surname}</p>
            <p><strong>Correo Electrónico:</strong> ${data.payer.email_address}</p>
            <p><strong>Detalles del Pago:</strong> Pago de Cuota de alquiler</p>
          </div>
          <div class="footer">
            <p>Gracias por su pago.</p>
            <p>© 2024 Amazone</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Opciones para la generación del PDF
    const pdfOptions = {
      width: '128mm',    // 2/3 del ancho de A4 (210mm)
      height: '130mm',   // Mitad de la altura de A4 (297mm)
      border: '10mm',   // Borde alrededor del contenido
    };

    // Generar el PDF en memoria
    pdf.create(htmlContent, pdfOptions).toBuffer(async (err, buffer) => {
      if (err) {
        console.error('Error al generar el PDF:', err);
        return res.status(500).send('Error al generar el PDF');
      }

      try {
        // Generar un nombre único para el archivo PDF
        const pdfFileName = `comprobante_${Date.now()}.pdf`; // Nombre único con timestamp
        const pdfFilePath = path.join(__dirname, '../temp', pdfFileName);
        console.log('ruta generada')
        // Guardar el PDF en el servidor
        fs.writeFile(pdfFilePath, buffer, async (err) => {
          if (err) {
            console.error('Error al guardar el PDF:', err);
            return res.status(500).send('Error al guardar el PDF');
          }

          // Generar la URL de descarga del PDF
          const pdfUrl = `http://localhost:3000/temp/${pdfFileName}`;
          
          // Generar el código QR para la URL de descarga del PDF
          const qrCode = await QRCode.toDataURL(pdfUrl);
          
          // Devolver la respuesta con la URL del PDF, la URL absoluta y el código QR
          
          res.json({ pdfUrl, pdfFilePath, qrCode });
          
        });
      } catch (error) {
        console.error('Error al guardar el PDF:', error);
        res.status(500).send('Error al guardar el PDF');
      }
    });
  } catch (error) {
    console.error('Error al generar el PDF:', error);
    res.status(500).send('Error al generar el PDF');
  }
};

module.exports = { generatePDF };