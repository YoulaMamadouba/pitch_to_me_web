import { NextRequest, NextResponse } from 'next/server';
import * as nodemailer from 'nodemailer';
import { generateOTP, storeOTP, getOTP, deleteOTP, getAllOTPs } from '@/lib/otpStore';

export async function POST(request: NextRequest) {
  let otpCode: string = '';
  
  try {
    const { email, name } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email requis' },
        { status: 400 }
      );
    }

    // Générer le code OTP
    otpCode = generateOTP();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

    // Stocker l'OTP
    storeOTP(email, otpCode, expiresAt);

    console.log('📧 Envoi OTP:', { email, otpCode });

    // Vérifier si les variables d'environnement SMTP sont configurées
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    if (!smtpUser || !smtpPass) {
      console.log('📧 Variables SMTP non configurées, simulation d\'envoi');
      
      // Simulation d'envoi d'email
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('📧 Email OTP simulé envoyé à:', email);
      console.log('📧 Code OTP (simulation):', otpCode);

      return NextResponse.json({ 
        success: true, 
        message: 'Code de vérification envoyé avec succès (simulation)',
        note: 'SMTP non configuré - email simulé'
      });
    }

    // Configuration Nodemailer
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      }
    });

    // Template de l'email avec le même style que les autres templates
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Code de vérification - Pitch To Me</title>
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
            <h1 style="margin: 0; font-size: 28px; font-weight: 700;">Code de vérification</h1>
            <p style="margin: 10px 0 0; font-size: 16px; opacity: 0.9;">Vérifiez votre adresse email</p>
          </div>
          
          <!-- Content -->
          <div style="padding: 40px 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #1a1a1a; margin-top: 0; font-size: 22px; font-weight: 600;">Bonjour ${name || 'utilisateur'},</h2>
            
            <p style="color: #555; line-height: 1.8; margin-bottom: 20px; font-size: 15px;">
              Pour finaliser votre inscription sur <strong style="color: #1a1a1a;">Pitch To Me</strong>, 
              veuillez utiliser le code de vérification ci-dessous :
            </p>

            <!-- Code OTP -->
            <div style="background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); border: 2px solid #FFD700; border-radius: 15px; padding: 30px; text-align: center; margin: 30px 0;">
              <p style="color: #1a1a1a; font-size: 16px; margin: 0 0 15px 0; font-weight: 600;">Votre code de vérification</p>
              <div style="background: #1a1a1a; color: #FFD700; font-size: 32px; font-weight: 700; letter-spacing: 8px; padding: 20px; border-radius: 10px; display: inline-block; min-width: 200px;">
                ${otpCode}
              </div>
              <p style="color: #666; font-size: 14px; margin: 15px 0 0 0;">Ce code expire dans 5 minutes</p>
            </div>

            <p style="color: #555; line-height: 1.8; margin-bottom: 20px; font-size: 15px;">
              Si vous n'avez pas demandé ce code, vous pouvez ignorer cet email en toute sécurité.
            </p>

            <div style="background: #f8f9fa; border-left: 4px solid #FFD700; padding: 15px; margin: 20px 0; border-radius: 0 5px 5px 0;">
              <p style="color: #666; font-size: 14px; margin: 0;">
                <strong>Conseil de sécurité :</strong> Ne partagez jamais ce code avec qui que ce soit. 
                L'équipe Pitch To Me ne vous demandera jamais votre code de vérification.
              </p>
            </div>
          </div>

          <!-- Footer -->
          <div style="background: #1a1a1a; color: #fff; padding: 20px 30px; text-align: center; border-radius: 0 0 10px 10px;">
            <p style="margin: 0; font-size: 14px; opacity: 0.8;">
              © 2024 Pitch To Me. Tous droits réservés.
            </p>
            <p style="margin: 10px 0 0; font-size: 12px; opacity: 0.6;">
              Cet email a été envoyé à ${email}
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Options de l'email
    const mailOptions = {
      from: `"Pitch To Me" <${smtpUser}>`,
      to: email,
      subject: 'Code de vérification - Pitch To Me',
      html: emailHtml
    };

    // Envoyer l'email
    await transporter.sendMail(mailOptions);

    console.log('✅ Email OTP envoyé avec succès à:', email);

    return NextResponse.json({ 
      success: true, 
      message: 'Code de vérification envoyé avec succès' 
    });

  } catch (error) {
    console.error('❌ Erreur lors de l\'envoi de l\'email OTP:', error);
    
    // Fallback : simulation si SMTP échoue
    console.log('📧 Fallback: Simulation d\'envoi d\'email OTP');
    console.log('📧 Code OTP (fallback):', otpCode);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Code de vérification envoyé avec succès (simulation)',
      note: 'Erreur SMTP - email simulé'
    });
  }
}

// API route pour vérifier l'OTP
export async function PUT(request: NextRequest) {
  try {
    const { email, code } = await request.json();

    console.log('🔍 Vérification OTP demandée:', { email, code });

    if (!email || !code) {
      console.log('❌ Email ou code manquant');
      return NextResponse.json(
        { error: 'Email et code requis' },
        { status: 400 }
      );
    }

    // Debug: afficher tous les OTP stockés
    const allOTPs = getAllOTPs();
    console.log('📧 Tous les OTP stockés:', allOTPs);

    const storedOTP = getOTP(email);

    if (!storedOTP) {
      console.log('❌ OTP non trouvé pour:', email);
      console.log('📧 OTP disponibles:', allOTPs.map(otp => otp.email));
      return NextResponse.json(
        { error: 'Code expiré ou non trouvé' },
        { status: 400 }
      );
    }

    console.log('🔍 OTP trouvé:', { 
      email, 
      storedCode: storedOTP.code, 
      providedCode: code,
      expiresAt: new Date(storedOTP.expiresAt).toISOString(),
      now: new Date().toISOString()
    });

    if (Date.now() > storedOTP.expiresAt) {
      console.log('❌ OTP expiré pour:', email);
      deleteOTP(email);
      return NextResponse.json(
        { error: 'Code expiré' },
        { status: 400 }
      );
    }

    if (storedOTP.code !== code) {
      console.log('❌ Code incorrect pour:', email, { stored: storedOTP.code, provided: code });
      return NextResponse.json(
        { error: 'Code incorrect' },
        { status: 400 }
      );
    }

    // Code correct, supprimer l'OTP seulement après vérification réussie
    console.log('✅ Code correct pour:', email);
    deleteOTP(email);

    return NextResponse.json({ 
      success: true, 
      message: 'Code vérifié avec succès' 
    });

  } catch (error) {
    console.error('❌ Erreur lors de la vérification de l\'OTP:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la vérification du code' },
      { status: 500 }
    );
  }
}
