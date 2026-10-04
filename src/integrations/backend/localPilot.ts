/** Display-only hint. The backend owns the actual local pilot security policy. */
export const localPilotNoEmail = import.meta.env.DEV &&
  import.meta.env.VITE_LOCAL_PILOT_NO_EMAIL === 'true' &&
  ['localhost', '127.0.0.1'].includes(window.location.hostname);
