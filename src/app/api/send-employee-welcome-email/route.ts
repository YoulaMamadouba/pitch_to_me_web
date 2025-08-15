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

    // Contenu de l'email
    const mailOptions = {
      from: `"Pitch To Me" <${process.env.SMTP_USER}>`,
      to: email,
      subject: `Bienvenue chez ${companyName} - Vos accès Pitch To Me`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 28px; font-weight: bold;">Bienvenue chez ${companyName} !</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Votre compte Pitch To Me a été créé avec succès</p>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 10px; margin-top: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #333; margin-top: 0;">Bonjour ${name},</h2>
            
            <p style="color: #666; line-height: 1.6;">
              Nous sommes ravis de vous accueillir dans l'équipe de <strong>${companyName}</strong> ! 
              Votre compte de formation Pitch To Me a été créé et vous pouvez dès maintenant accéder à votre espace d'apprentissage.
            </p>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
              <h3 style="color: #333; margin-top: 0;">Vos identifiants de connexion :</h3>
              <p style="margin: 5px 0;"><strong>Email :</strong> ${email}</p>
              <p style="margin: 5px 0;"><strong>Mot de passe temporaire :</strong> ${password}</p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/login" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                Accéder à mon espace
              </a>
            </div>
            
            <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h4 style="color: #856404; margin-top: 0;">⚠️ Important :</h4>
              <ul style="color: #856404; margin: 10px 0; padding-left: 20px;">
                <li>Ce mot de passe est temporaire, nous vous recommandons de le changer lors de votre première connexion</li>
                <li>Utilisez le rôle "Learner" lors de la connexion</li>
                <li>Vous serez redirigé vers votre espace B2B dédié</li>
              </ul>
            </div>
            
            <p style="color: #666; line-height: 1.6;">
              Si vous avez des questions ou besoin d'aide, n'hésitez pas à contacter votre responsable RH.
            </p>
            
            <p style="color: #666; line-height: 1.6;">
              Bonne formation !<br>
              <strong>L'équipe Pitch To Me</strong>
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
            <p>Cet email a été envoyé automatiquement. Merci de ne pas y répondre.</p>
          </div>
        </div>
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
