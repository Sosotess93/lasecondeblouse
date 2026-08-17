/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_AGENDA_URL?: string;
  readonly PUBLIC_CAL_LINK?: string;
  readonly PUBLIC_POSTHOG_KEY?: string;
  readonly PUBLIC_POSTHOG_HOST?: string;
  readonly BREVO_API_KEY?: string;
  readonly BREVO_LIST_ID?: string;
  readonly BREVO_LIST_RDV_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface Window {
  /** Défini par BandeauCookies. No-op tant que le consentement n’est pas donné. */
  lsbTrack?: (evenement: string, proprietes?: Record<string, unknown>) => void;
  lsbOuvrirPreferences?: () => void;
  posthog?: {
    capture: (evenement: string, proprietes?: Record<string, unknown>) => void;
    init: (cle: string, options: Record<string, unknown>) => void;
  };
}
