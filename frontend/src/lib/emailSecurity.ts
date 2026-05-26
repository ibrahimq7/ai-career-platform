const disposableDomains = new Set([
  '10minutemail.com',
  'guerrillamail.com',
  'mailinator.com',
  'tempmail.com',
  'temp-mail.org',
  'yopmail.com',
  'throwawaymail.com',
  'getnada.com',
]);

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function validateGmailAddress(email: string) {
  const normalized = normalizeEmail(email);
  const domain = normalized.split('@')[1] ?? '';

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
    return { valid: false, message: 'Enter a valid email address.' };
  }

  if (disposableDomains.has(domain)) {
    return { valid: false, message: 'Temporary or disposable email addresses are not allowed.' };
  }

  if (domain !== 'gmail.com') {
    return { valid: false, message: 'Only Gmail accounts ending in @gmail.com are allowed.' };
  }

  return { valid: true, message: '' };
}
