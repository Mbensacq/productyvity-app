/**
 * Minimal typed i18n. French is the default and only shipped locale in v1, but
 * messages are centralized and key-addressed so additional locales can be added
 * later without touching call sites.
 */
export const fr = {
  'app.title': 'Productivité',
  'app.tagline': 'Notes liées et productivité',
  'app.loading': 'Chargement…',
  'app.initializing': "Application en cours d'initialisation…",

  'nav.notes': 'Notes',
  'nav.graph': 'Graphe',
  'nav.tasks': 'Tâches',
  'nav.calendar': 'Calendrier',
  'nav.toggleSidebar': 'Afficher/masquer la barre latérale',

  'theme.toggle': 'Changer de thème',
  'theme.light': 'Clair',
  'theme.dark': 'Sombre',
  'theme.system': 'Système',

  'auth.signInWithGoogle': 'Se connecter avec Google',
  'auth.signOut': 'Se déconnecter',
  'auth.signingIn': 'Connexion…',
  'auth.required': 'Veuillez vous connecter pour continuer.',
  'auth.error': "Échec de la connexion. Veuillez réessayer.",

  'sync.online': 'Synchronisé',
  'sync.pending': 'En attente',
  'sync.offline': 'Hors-ligne',
  'sync.conflict': 'Conflit',

  'setup.title': 'Configuration requise',
  'setup.supabaseMissing':
    "La connexion à Supabase n'est pas configurée. Renseignez VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY (voir SETUP.md).",
  'setup.googleMissing':
    "L'identifiant client Google n'est pas configuré. Renseignez VITE_GOOGLE_CLIENT_ID (voir SETUP.md).",

  'error.title': 'Une erreur est survenue',
  'error.retry': 'Réessayer',
  'notFound.title': 'Page introuvable',
  'notFound.back': "Retour à l'accueil",
} as const;

export type MessageKey = keyof typeof fr;

const dictionary: Record<MessageKey, string> = fr;

export function t(key: MessageKey): string {
  return dictionary[key];
}
