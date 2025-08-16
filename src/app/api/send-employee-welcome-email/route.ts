import { NextRequest, NextResponse } from 'next/server';
import * as nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, companyName } = await request.json();

    console.log('📧 Tentative d\'envoi d\'email employé:', {
      name,
      email,
      companyName
    });

    // Configuration Nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      }
    });

    console.log('📧 Variables d\'environnement:');
    console.log('📧 SMTP_USER:', process.env.SMTP_USER ? 'configuré' : 'non configuré');
    console.log('📧 SMTP_PASS:', process.env.SMTP_PASS ? 'configuré' : 'non configuré');
    console.log('📧 SMTP_HOST:', process.env.SMTP_HOST || 'smtp.gmail.com');
    console.log('📧 SMTP_PORT:', process.env.SMTP_PORT || '587');

    // Contenu de l'email avec styles en ligne pour une meilleure compatibilité
    const mailOptions = {
      from: `"Pitch To Me" <${process.env.SMTP_USER}>`,
      to: email,
      subject: `Bienvenue chez ${companyName} - Vos accès Pitch To Me`,
      html: `
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
              <h1 style="margin: 0; font-size: 28px; font-weight: 700;">Bienvenue chez ${companyName} !</h1>
              <p style="margin: 10px 0 0; font-size: 16px; opacity: 0.9;">Prêt à perfectionner votre pitch ?</p>
            </div>
            
            <!-- Content -->
            <div style="padding: 40px 30px; border-radius: 0 0 10px 10px;">
              <h2 style="color: #1a1a1a; margin-top: 0; font-size: 22px; font-weight: 600;">Bonjour ${name},</h2>
              
              <p style="color: #555; line-height: 1.8; margin-bottom: 20px; font-size: 15px;">
                Nous sommes ravis de vous accueillir dans l'équipe de <strong style="color: #1a1a1a;">${companyName}</strong> ! 
                Votre compte de formation Pitch To Me a été créé et vous pouvez dès maintenant accéder à votre espace d'apprentissage.
              </p>
              
              <!-- Credentials -->
              <div style="background: #FFF9E6; border-left: 4px solid #FFD700; padding: 20px; border-radius: 8px; margin: 25px 0;">
                <h3 style="color: #1a1a1a; margin-top: 0; font-size: 18px; font-weight: 600;">Vos identifiants de connexion :</h3>
                <p style="margin: 8px 0; font-size: 14px;"><strong>Email :</strong> ${email}</p>
                <p style="margin: 8px 0; font-size: 14px;"><strong>Mot de passe temporaire :</strong> ${password}</p>
              </div>
              
              <!-- Button -->
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/login" 
                   style="background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%); color: #1a1a1a; padding: 15px 30px; text-decoration: none; border-radius: 50px; font-weight: 600; display: inline-block; font-size: 15px;">
                  Accéder à mon espace
                </a>
              </div>
              
              <!-- Note -->
              <div style="background: #FFF3E0; border: 1px solid #FFE0B2; padding: 15px; border-radius: 8px; margin: 25px 0;">
                <div style="color: #E65100; font-size: 16px; font-weight: 600; margin-bottom: 10px;">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#E65100" style="vertical-align: middle; margin-right: 8px;">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
                  </svg>
                  Important :
                </div>
                <ul style="margin: 10px 0 0 0; padding-left: 20px; color: #5D4037; font-size: 14px;">
                  <li style="margin-bottom: 8px;">Ce mot de passe est temporaire, nous vous recommandons de le changer lors de votre première connexion</li>
                  <li style="margin-bottom: 8px;">Utilisez le rôle "Learner" lors de la connexion</li>
                  <li>Vous serez redirigé vers votre espace B2B dédié</li>
                </ul>
              </div>
              
              <p style="color: #555; line-height: 1.8; margin-bottom: 20px; font-size: 15px;">
                Si vous avez des questions ou besoin d'aide, n'hésitez pas à contacter votre responsable RH.
              </p>
              
              <p style="color: #555; line-height: 1.8; margin: 30px 0 0 0; font-size: 15px;">
                Bonne formation !<br>
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
      `,
    };

    // Vérifier la configuration du transporteur
    console.log('📧 Configuration du transporteur:', {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS ? '***' : 'manquant'
    });

    // Envoi de l'email
    const info = await transporter.sendMail(mailOptions);
    console.log('📧 Email envoyé avec succès:', info.messageId);
    console.log('📧 Détails de l\'envoi:', {
      messageId: info.messageId,
      response: info.response,
      accepted: info.accepted,
      rejected: info.rejected
    });

    return NextResponse.json({
      success: true,
      messageId: info.messageId
    });

  } catch (error) {
    console.error('❌ Erreur lors de l\'envoi de l\'email employé:', error);
    
    // Fallback : simulation d'envoi si SMTP n'est pas configuré
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.log('📧 SMTP non configuré, simulation d\'envoi d\'email');
      return NextResponse.json({
        success: true,
        messageId: 'simulated-email-id',
        note: 'Email simulé (SMTP non configuré)'
      });
    }

    return NextResponse.json(
      { error: 'Erreur lors de l\'envoi de l\'email' },
      { status: 500 }
    );
  }
}
