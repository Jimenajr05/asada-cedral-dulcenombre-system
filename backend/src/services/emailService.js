const sgMail = require("@sendgrid/mail");

exports.sendVerificationEmail = async (email, token) => {
  try {
    // 1. Cargar variables de entorno dinámicamente dentro de la función
    // Esto evita problemas si dotenv se inicializa después de importar este archivo
    const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
    const EMAIL_FROM = process.env.EMAIL_FROM;

    console.log("🛠️ [emailService] Iniciando envío de correo de verificación...");
    console.log("   → Destinatario (to):", email);
    console.log("   → Remitente (from):", EMAIL_FROM);
    console.log("   → API Key presente:", !!SENDGRID_API_KEY, SENDGRID_API_KEY ? `(Empieza con: ${SENDGRID_API_KEY.substring(0, 5)}...)` : "");

    // 2. Validaciones estrictas
    if (!SENDGRID_API_KEY || !SENDGRID_API_KEY.startsWith("SG.")) {
      throw new Error("SENDGRID_API_KEY no está configurada correctamente en el .env (Debe empezar con 'SG.')");
    }
    if (!EMAIL_FROM) {
      throw new Error("EMAIL_FROM no está configurada en el .env");
    }

    // 3. Configurar API Key
    sgMail.setApiKey(SENDGRID_API_KEY);

    // 4. Preparar el mensaje
    const verifyUrl = `${process.env.BACKEND_URL || "http://localhost:4000"}/api/users/verify/${token}`;

    const msg = {
      to: email,
      from: EMAIL_FROM,
      subject: "Verifica tu cuenta de administrador",
      text: `Por favor verifica tu cuenta copiando y pegando este enlace: ${verifyUrl}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333;">¡Hola!</h2>
          <p>Has sido registrado como administrador en el sistema.</p>
          <p>Para activar tu cuenta, haz clic en el siguiente enlace:</p>
          <div style="margin: 30px 0;">
            <a href="${verifyUrl}" style="display: inline-block; padding: 12px 24px; background-color: #0284c7; color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">Verificar Cuenta</a>
          </div>
          <p><i>Este enlace expirará en 24 horas.</i></p>
        </div>
      `,
    };

    console.log("📧 [emailService] Enviando request a SendGrid...");

    // 5. Enviar el correo
    const response = await sgMail.send(msg);

    console.log("✅ [emailService] Correo enviado exitosamente a SendGrid.");
    console.log("   → Status Code:", response[0]?.statusCode);
    console.log("   → Message ID:", response[0]?.headers['x-message-id']);

    return response;
  } catch (error) {
    // 6. Manejo de errores avanzado
    console.error("❌ [emailService] Error CRÍTICO al enviar correo con SendGrid:");
    console.error("   → Mensaje general:", error.message);

    if (error.response) {
      console.error("   → HTTP Status Code:", error.response.status);
      console.error("   → Response Body:", JSON.stringify(error.response.body, null, 2));

      const { message, code, help } = error.response.body?.errors?.[0] || {};
      if (message) console.error("   → Detalle SendGrid:", message);
      if (help) console.error("   → Ayuda SendGrid:", help);
    }

    // Lanzar el error original para que el controlador lo maneje
    throw error;
  }
};
