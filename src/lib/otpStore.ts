// Stockage temporaire des OTP (en production, utilisez Redis ou une base de données)
const otpStore = new Map<string, { code: string; expiresAt: number }>();

// Fonction pour nettoyer les OTP expirés
export function cleanupExpiredOTPs() {
  const now = Date.now();
  for (const [email, otpData] of otpStore.entries()) {
    if (now > otpData.expiresAt) {
      otpStore.delete(email);
    }
  }
}

// Générer un code OTP à 6 chiffres
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Stocker un OTP
export function storeOTP(email: string, code: string, expiresAt: number) {
  cleanupExpiredOTPs();
  otpStore.set(email, { code, expiresAt });
  console.log('📧 OTP stocké:', { email, code, expiresAt: new Date(expiresAt).toISOString() });
  console.log('📧 Nombre d\'OTP en stockage:', otpStore.size);
}

// Récupérer un OTP
export function getOTP(email: string) {
  cleanupExpiredOTPs();
  return otpStore.get(email);
}

// Supprimer un OTP
export function deleteOTP(email: string) {
  otpStore.delete(email);
}

// Récupérer tous les OTP (pour debug)
export function getAllOTPs() {
  cleanupExpiredOTPs();
  return Array.from(otpStore.entries()).map(([email, data]) => ({
    email,
    code: data.code,
    expiresAt: new Date(data.expiresAt).toISOString(),
    remainingTime: Math.max(0, Math.floor((data.expiresAt - Date.now()) / 1000))
  }));
}

