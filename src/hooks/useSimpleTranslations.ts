'use client';

import { useState, useEffect } from 'react';
import { useLanguage, type Language } from './useLanguage';

// Traductions intégrées directement
const frTranslations = {
  "header": {
    "logo": "Pitch to Me",
    "login": "Connexion",
    "signup": "Inscription"
  },
  "auth": {
    "login": {
      "card": {
        "title": "Bienvenue !",
        "subtitle": "Accédez à votre espace personnel"
      },
      "roleSelector": {
        "label": "Je me connecte en tant que",
        "roles": {
          "learner": "Apprenant",
          "coach": "Coach",
          "hr": "Ressources Humaines"
        }
      },
      "fields": {
        "email": {
          "label": "Email",
          "placeholder": "votre@email.com"
        },
        "password": {
          "label": "Mot de passe",
          "placeholder": "••••••••"
        },
        "learningGoal": {
          "label": "Objectif d'apprentissage",
          "placeholder": "Votre objectif d'apprentissage"
        },
        "specialization": {
          "label": "Spécialisation",
          "placeholder": "Ex: Prise de parole en public"
        },
        "yearsOfExperience": {
          "label": "Années d'expérience",
          "placeholder": "Nombre d'années d'expérience"
        },
        "company": {
          "label": "Entreprise",
          "placeholder": "Nom de l'entreprise"
        },
        "department": {
          "label": "Département",
          "placeholder": "Votre département"
        }
      },
      "stats": {
        "users": "Utilisateurs actifs",
        "modules": "Modules",
        "success": "Taux de réussite"
      },
      "divider": "Ou continuer avec",
      "cta": {
        "coach": "Accéder au tableau de bord Coach",
        "hr": "Accéder au tableau de bord RH",
        "default": "Se connecter"
      },
      "rememberMe": "Se souvenir de moi",
      "forgotPassword": "Mot de passe oublié ?",
      "noAccount": "Pas encore de compte ?",
      "signup": "S'inscrire"
    },
    "signup": {
      "header": {
        "title": "Inscription"
      },
      "card": {
        "title": "Rejoignez Pitch to Me",
        "subtitle": "Commencez votre parcours vers l'excellence oratoire"
      },
      "social": {
        "continueWithGoogle": "Continuer avec Google",
        "continueWithFacebook": "Continuer avec Facebook"
      },
      "country": {
        "label": "Pays/Région",
        "placeholder": "Sélectionnez votre pays"
      },
      "terms": {
        "agree": "J'accepte les ",
        "tos": "Conditions d'utilisation",
        "and": " et ",
        "privacy": "Politique de confidentialité"
      },
      "createAccount": "Créer un compte",
      "otp": {
        "verification": "Vérification",
        "step": "Étape {current} sur {total}",
        "verifyPhone": "Vérifiez votre téléphone",
        "sentCode": "Nous avons envoyé un code à 6 chiffres à",
        "didntReceive": "Vous n'avez pas reçu le code ?",
        "resend": "Renvoyer le code",
        "expires": "Le code expire dans {time}",
        "continue": "Continuer"
      },
      "haveAccount": "Vous avez déjà un compte ?",
      "signin": "Se connecter"
    }
  },
  "hero": {
    "title": {
      "line1": "Transformez votre voix",
      "line2": "en pouvoir"
    },
    "subtitle": "Maîtrisez l'art de la persuasion avec un entraînement alimenté par l'IA, des expériences VR et une communauté mondiale d'orateurs.",
    "buttons": {
      "individual": "Je suis un particulier",
      "company": "Je suis une entreprise"
    },
    "drawer": {
      "title": "Choisissez votre parcours",
      "subtitle": "Découvrez nos solutions adaptées à votre entreprise",
      "client": {
        "title": "Vous êtes client ?",
        "description": "Accédez à votre espace personnel et continuez votre formation"
      },
      "notClient": {
        "title": "Vous n'êtes pas client ?",
        "description": "Demandez un devis personnalisé pour votre entreprise"
      },
      "stats": {
        "companies": "Entreprises satisfaites",
        "response": "Délai de réponse",
        "success": "Taux de réussite"
      }
    }
  },
  "footer": {
    "description": "Transformez votre voix en opportunités avec notre plateforme d'entraînement au pitch ultime.",
    "navigation": {
      "title": "Navigation",
      "links": {
        "home": "Accueil",
        "features": "Fonctionnalités",
        "pricing": "Tarifs",
        "testimonials": "Témoignages"
      }
    },
    "company": {
      "title": "Entreprise",
      "links": {
        "about": "À propos",
        "careers": "Carrières",
        "press": "Presse",
        "contact": "Contact"
      }
    },
    "legal": {
      "title": "Légal",
      "links": {
        "privacy": "Confidentialité",
        "terms": "CGU",
        "legal": "Mentions légales",
        "cookies": "Cookies"
      }
    },
    "copyright": "© {year} Pitch to Me. Tous droits réservés.",
    "bottomLinks": {
      "privacy": "Confidentialité",
      "terms": "Conditions d'utilisation",
      "cookies": "Préférences de cookies"
    }
  },
  "features": {
    "title": "Pourquoi choisir",
    "subtitle": "Découvrez les fonctionnalités qui font de notre plateforme la solution ultime pour maîtriser l'art de la prise de parole en public.",
    "items": {
      "ai": {
        "title": "Entraînement IA",
        "description": "Coaching personnalisé avec analyse vocale et feedback en temps réel"
      },
      "vr": {
        "title": "Expérience VR",
        "description": "Environnements d'entraînement immersifs pour des scénarios réalistes"
      },
      "community": {
        "title": "Communauté mondiale",
        "description": "Connectez-vous avec des orateurs du monde entier et partagez vos expériences"
      },
      "certification": {
        "title": "Certification",
        "description": "Obtenez des certificats et suivez vos progrès avec des analyses détaillées"
      }
    }
  },
  "b2c": {
    "title": "Maîtrisez votre voix avec notre",
    "highlight": "formation individuelle",
    "subtitle": "12 modules complets pour transformer votre prise de parole en public et devenir un orateur confident",
    "video": {
      "alt": "Mawa SIMBA - Expert Coach en prise de parole",
      "live": "EN DIRECT"
    },
    "plans": {
      "standard": {
        "name": "Formation Standard",
        "description": "Expérience web interactive",
        "features": {
          "0": "12 modules complets",
          "1": "Analyse vocale IA",
          "2": "Accès à la communauté",
          "3": "Suivi des progrès",
          "4": "Feedback de base"
        }
      },
      "premium": {
        "name": "Immersion VR",
        "description": "Expérience réalité virtuelle",
        "features": {
          "0": "Tout ce qui est inclus dans Standard",
          "1": "Environnements d'entraînement VR",
          "2": "Feedback en temps réel",
          "3": "Sessions de coaching individuelles",
          "4": "Analyses avancées"
        }
      }
    },
    "cta": {
      "selected": "Sélectionné",
      "choose": "Choisir",
      "individual": "Je suis un particulier"
    },
    "stats": {
      "join": "Rejoignez",
      "speakers": "speakers qui ont transformé leur voix",
      "rating": "4.9/5",
      "reviews": "+1000 avis",
      "guarantee": "Garantie 30 jours"
    }
  }
};

const enTranslations = {
  "header": {
    "logo": "Pitch to Me",
    "login": "Login",
    "signup": "Sign Up"
  },
  "auth": {
    "login": {
      "card": {
        "title": "Welcome!",
        "subtitle": "Access your personal space"
      },
      "roleSelector": {
        "label": "I am logging in as",
        "roles": {
          "learner": "Learner",
          "coach": "Coach",
          "hr": "Human Resources"
        }
      },
      "fields": {
        "email": {
          "label": "Email",
          "placeholder": "your@email.com"
        },
        "password": {
          "label": "Password",
          "placeholder": "••••••••"
        },
        "learningGoal": {
          "label": "Learning goal",
          "placeholder": "Your learning goal"
        },
        "specialization": {
          "label": "Specialization",
          "placeholder": "e.g., Public speaking"
        },
        "yearsOfExperience": {
          "label": "Years of experience",
          "placeholder": "Number of years of experience"
        },
        "company": {
          "label": "Company",
          "placeholder": "Company name"
        },
        "department": {
          "label": "Department",
          "placeholder": "Your department"
        }
      },
      "stats": {
        "users": "Active users",
        "modules": "Modules",
        "success": "Success rate"
      },
      "divider": "Or continue with",
      "cta": {
        "coach": "Go to Coach dashboard",
        "hr": "Go to HR dashboard",
        "default": "Sign in"
      },
      "rememberMe": "Remember me",
      "forgotPassword": "Forgot password?",
      "noAccount": "Don't have an account?",
      "signup": "Sign Up"
    },
    "signup": {
      "header": {
        "title": "Sign Up"
      },
      "card": {
        "title": "Join Pitch to Me",
        "subtitle": "Start your journey to speaking mastery"
      },
      "social": {
        "continueWithGoogle": "Continue with Google",
        "continueWithFacebook": "Continue with Facebook"
      },
      "country": {
        "label": "Country/Region",
        "placeholder": "Select your country"
      },
      "terms": {
        "agree": "I agree to the ",
        "tos": "Terms of Service",
        "and": " and ",
        "privacy": "Privacy Policy"
      },
      "createAccount": "Create Account",
      "otp": {
        "verification": "Verification",
        "step": "Step {current} of {total}",
        "verifyPhone": "Verify Your Phone",
        "sentCode": "We've sent a 6-digit code to",
        "didntReceive": "Didn't receive the code?",
        "resend": "Resend Code",
        "expires": "Code expires in {time}",
        "continue": "Continue"
      },
      "haveAccount": "Already have an account?",
      "signin": "Sign In"
    }
  },
  "hero": {
    "title": {
      "line1": "Transform Your Voice",
      "line2": "Into Power"
    },
    "subtitle": "Master the art of persuasion with AI-powered training, VR experiences, and a global community of speakers.",
    "buttons": {
      "individual": "I am an individual",
      "company": "I am a company"
    },
    "drawer": {
      "title": "Choose your path",
      "subtitle": "Discover our solutions tailored to your business",
      "client": {
        "title": "Are you a client?",
        "description": "Access your personal space and continue your training"
      },
      "notClient": {
        "title": "Not a client yet?",
        "description": "Request a personalized quote for your company"
      },
      "stats": {
        "companies": "Satisfied companies",
        "response": "Response time",
        "success": "Success rate"
      }
    }
  },
  "footer": {
    "description": "Transform your voice into opportunities with our ultimate pitch training platform.",
    "navigation": {
      "title": "Navigation",
      "links": {
        "home": "Home",
        "features": "Features",
        "pricing": "Pricing",
        "testimonials": "Testimonials"
      }
    },
    "company": {
      "title": "Company",
      "links": {
        "about": "About",
        "careers": "Careers",
        "press": "Press",
        "contact": "Contact"
      }
    },
    "legal": {
      "title": "Legal",
      "links": {
        "privacy": "Privacy",
        "terms": "Terms",
        "legal": "Legal Notice",
        "cookies": "Cookies"
      }
    },
    "copyright": "© {year} Pitch to Me. All rights reserved.",
    "bottomLinks": {
      "privacy": "Privacy",
      "terms": "Terms of Use",
      "cookies": "Cookie Preferences"
    }
  },
  "features": {
    "title": "Why choose",
    "subtitle": "Discover the features that make our platform the ultimate solution for mastering public speaking.",
    "items": {
      "ai": {
        "title": "AI-Powered Training",
        "description": "Personalized coaching with voice analysis and real-time feedback"
      },
      "vr": {
        "title": "VR Experience",
        "description": "Immersive practice environments for realistic training scenarios"
      },
      "community": {
        "title": "Global Community",
        "description": "Connect with speakers worldwide and share experiences"
      },
      "certification": {
        "title": "Certification",
        "description": "Earn certificates and track your progress with detailed analytics"
      }
    }
  },
  "b2c": {
    "title": "Master your voice with our",
    "highlight": "individual training",
    "subtitle": "12 comprehensive modules to transform your public speaking and become a confident speaker",
    "video": {
      "alt": "Mawa SIMBA - Expert Speech Coach",
      "live": "LIVE"
    },
    "plans": {
      "standard": {
        "name": "Standard Training",
        "description": "Interactive web experience",
        "features": {
          "0": "12 comprehensive modules",
          "1": "AI voice analysis",
          "2": "Community access",
          "3": "Progress tracking",
          "4": "Basic feedback"
        }
      },
      "premium": {
        "name": "VR Immersive",
        "description": "Virtual reality experience",
        "features": {
          "0": "Everything in Standard",
          "1": "VR practice environments",
          "2": "Real-time feedback",
          "3": "1-on-1 coaching sessions",
          "4": "Advanced analytics"
        }
      }
    },
    "cta": {
      "selected": "Selected",
      "choose": "Choose",
      "individual": "I am an individual"
    },
    "stats": {
      "join": "Join",
      "speakers": "speakers who have transformed their voice",
      "rating": "4.9/5",
      "reviews": "+1000 reviews",
      "guarantee": "30-day guarantee"
    }
  }
};

const translations = {
  fr: frTranslations,
  en: enTranslations
};

export function useSimpleTranslations(langOverride?: Language, isLoadedOverride?: boolean) {
  // If the provider supplies the language, use it. Otherwise fall back to internal hook.
  const { language: hookLanguage, isLoaded: hookIsLoaded } = useLanguage();
  const effectiveLanguage: Language = langOverride ?? hookLanguage ?? 'fr';
  const isLoaded = isLoadedOverride ?? hookIsLoaded ?? true;

  // Utiliser directement les traductions sans état local pour éviter les problèmes de synchronisation
  const currentTranslations: any = translations[effectiveLanguage] || translations.fr;

  const t = (key: string, params?: Record<string, any>) => {
    if (!currentTranslations) return key;

    const keys = key.split('.');
    let value: any = currentTranslations;

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        console.warn(`Translation key not found: ${key}`);
        return key;
      }
    }

    if (typeof value === 'string' && params) {
      return value.replace(/\{(\w+)\}/g, (match: string, param: string) => {
        return params[param] || match;
      });
    }

    return value || key;
  };

  return {
    t,
    isLoading: !isLoaded,
    language: effectiveLanguage
  };
}
