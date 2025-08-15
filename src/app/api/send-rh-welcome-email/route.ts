import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  let rhName, rhEmail, companyName, password;
  
  try {
    const data = await request.json();
    rhName = data.rhName;
    rhEmail = data.rhEmail;
    companyName = data.companyName;
    password = data.password;

    console.log('📧 Tentative d\'envoi d\'email:', { rhName, rhEmail, companyName });

              // Vérifier si les variables d'environnement sont configurées
          const gmailUser = process.env.SMTP_USER;
          const gmailPass = process.env.SMTP_PASS;

          console.log('📧 Variables d\'environnement:');
          console.log('📧 SMTP_USER:', gmailUser ? `${gmailUser.substring(0, 3)}***` : 'non configuré');
          console.log('📧 SMTP_PASS:', gmailPass ? 'configuré' : 'non configuré');
          console.log('📧 Toutes les variables env:', Object.keys(process.env).filter(key => key.includes('SMTP')));

          if (!gmailUser || !gmailPass) {
            console.log('📧 Variables d\'environnement SMTP non configurées, simulation d\'envoi');
      
      // Simulation d'envoi d'email
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('📧 Email simulé envoyé à:', rhEmail);
      console.log('📧 Contenu:', {
        to: rhEmail,
        subject: `Bienvenue sur PitchToMe - ${companyName}`,
        rhName,
        companyName,
        password
      });

      return NextResponse.json({ 
        success: true, 
        messageId: 'simulated-email-id',
        message: 'Email simulé envoyé (SMTP non configuré)'
      });
    }

              // Configuration du transporteur email avec Gmail SMTP
          const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: false, // true pour 465, false pour les autres ports
            auth: {
              user: gmailUser,
              pass: gmailPass
            },
          });

    // Template de l'email
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Bienvenue sur PitchToMe</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 10px 10px 0 0;
          }
          .content {
            background: #f9f9f9;
            padding: 30px;
            border-radius: 0 0 10px 10px;
          }
          .button {
            display: inline-block;
            background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
            font-weight: bold;
          }
          .credentials {
            background: #e8f4fd;
            border: 1px solid #bee5eb;
            border-radius: 5px;
            padding: 15px;
            margin: 20px 0;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            color: #666;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🎯 Bienvenue sur PitchToMe</h1>
          <p>Votre entreprise a été ajoutée avec succès !</p>
        </div>
        
        <div class="content">
          <h2>Bonjour ${rhName},</h2>
          
          <p>Félicitations ! Votre entreprise <strong>${companyName}</strong> a été créée avec succès sur la plateforme PitchToMe.</p>
          
          <p>En tant que responsable RH, vous avez maintenant accès à votre tableau de bord pour gérer vos employés et suivre leur progression dans les modules de formation.</p>
          
          <div class="credentials">
            <h3>🔐 Vos identifiants de connexion :</h3>
            <p><strong>Email :</strong> ${rhEmail}</p>
            <p><strong>Mot de passe temporaire :</strong> ${password}</p>
            <p><em>⚠️ Veuillez changer votre mot de passe lors de votre première connexion.</em></p>
          </div>
          
          <p>Vous pouvez dès maintenant :</p>
          <ul>
            <li>✅ Accéder à votre tableau de bord RH</li>
            <li>✅ Créer des comptes pour vos employés</li>
            <li>✅ Suivre leur progression dans les modules</li>
            <li>✅ Consulter les rapports de formation</li>
          </ul>
          
          <div style="text-align: center;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/login" class="button">
              Accéder à mon tableau de bord
            </a>
          </div>
          
          <p>Si vous avez des questions ou besoin d'aide, n'hésitez pas à contacter notre équipe support.</p>
          
          <p>Cordialement,<br>
          L'équipe PitchToMe</p>
        </div>
        
        <div class="footer">
          <p>Cet email a été envoyé automatiquement. Veuillez ne pas y répondre.</p>
          <p>© 2024 PitchToMe. Tous droits réservés.</p>
        </div>
      </body>
      </html>
    `;

    // Envoi de l'email
    const info = await transporter.sendMail({
      from: `"PitchToMe" <${gmailUser}>`,
      to: rhEmail,
      subject: `Bienvenue sur PitchToMe - ${companyName}`,
      html: emailHtml,
    });

    console.log('📧 Email envoyé avec succès:', info.messageId);

    return NextResponse.json({ 
      success: true, 
      messageId: info.messageId,
      message: 'Email envoyé avec succès'
    });

  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    
    // Fallback : simulation si SMTP échoue
    console.log('📧 Fallback: Email simulé envoyé à:', rhEmail);
    console.log('📧 Contenu:', {
      to: rhEmail,
      subject: `Bienvenue sur PitchToMe - ${companyName}`,
      rhName,
      companyName,
      password
    });

    return NextResponse.json({ 
      success: true, 
      messageId: 'simulated-email-id',
      message: 'Email simulé envoyé (erreur SMTP)'
    });
  }
}
