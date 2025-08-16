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

    // Template de l'email avec styles en ligne pour une meilleure compatibilité
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Bienvenue sur Pitch To Me</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f5f5f5;">
        <div style="max-width: 600px; margin: 0 auto; background: #ffffff;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%); padding: 40px 30px; text-align: center; border-radius: 10px 10px 0 0; color: #1a1a1a;">
            <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 20px; color: #1a1a1a; font-size: 24px; font-weight: 700;">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor" style="margin-right: 10px;">
                <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
              </svg>
              Pitch To Me
            </div>
            <h1 style="margin: 0; font-size: 28px; font-weight: 700;">Bienvenue sur Pitch To Me</h1>
            <p style="margin: 10px 0 0; font-size: 16px; opacity: 0.9;">Votre compte RH a été créé avec succès</p>
          </div>
          
          <!-- Content -->
          <div style="padding: 40px 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #1a1a1a; margin-top: 0; font-size: 22px; font-weight: 600;">Bonjour ${rhName},</h2>
            
            <p style="color: #555; line-height: 1.8; margin-bottom: 20px; font-size: 15px;">
              Bienvenue sur la plateforme Pitch To Me pour <strong style="color: #1a1a1a;">${companyName}</strong> !
              Votre compte RH a été créé avec succès et vous pouvez dès maintenant gérer vos employés et suivre leur progression.
            </p>
            
            <!-- Credentials -->
            <div style="background: #FFF9E6; border-left: 4px solid #FFD700; padding: 20px; border-radius: 8px; margin: 25px 0;">
              <h3 style="color: #1a1a1a; margin-top: 0; font-size: 18px; font-weight: 600;">Vos identifiants de connexion :</h3>
              <p style="margin: 8px 0; font-size: 14px;"><strong>Email :</strong> ${rhEmail}</p>
              <p style="margin: 8px 0; font-size: 14px;"><strong>Mot de passe temporaire :</strong> ${password}</p>
            </div>
            
            <!-- Note -->
            <div style="background: #FFF3E0; border: 1px solid #FFE0B2; padding: 15px; border-radius: 8px; margin: 25px 0;">
              <div style="color: #E65100; font-size: 16px; font-weight: 600; margin-bottom: 10px;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#E65100" style="vertical-align: middle; margin-right: 8px;">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
                </svg>
                Pour votre première connexion :
              </div>
              <ul style="margin: 10px 0 0 0; padding-left: 20px; color: #5D4037; font-size: 14px;">
                <li style="margin-bottom: 8px;">Cliquez sur le bouton ci-dessous</li>
                <li style="margin-bottom: 8px;">Utilisez les identifiants fournis ci-dessus</li>
                <li style="margin-bottom: 8px;">Changez votre mot de passe immédiatement</li>
                <li>Utilisez le rôle "HR" lors de la connexion</li>
              </ul>
            </div>
            
            <!-- Button -->
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/login" 
                 style="background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%); color: #1a1a1a; padding: 15px 30px; text-decoration: none; border-radius: 50px; font-weight: 600; display: inline-block; font-size: 15px;">
                Accéder à mon espace RH
              </a>
            </div>
            
            <p style="color: #555; line-height: 1.8; margin-bottom: 20px; font-size: 15px;">
              Si vous avez des questions ou besoin d'aide, n'hésitez pas à nous contacter.
            </p>
            
            <p style="color: #555; line-height: 1.8; margin: 30px 0 0 0; font-size: 15px;">
              Cordialement,<br>
              <strong style="color: #1a1a1a;">L'équipe Pitch To Me</strong>
            </p>
            
            <!-- Footer -->
            <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; color: #777; font-size: 13px;">
              <p>© ${new Date().getFullYear()} Pitch To Me. Tous droits réservés.</p>
              <p>Cet email a été envoyé automatiquement. Merci de ne pas y répondre.</p>
            </div>
          </div>
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
