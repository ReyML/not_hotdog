export function detectHamburger(description: string | null | undefined): boolean {
  if (!description) {
    return false;
  }

  const text = description.toUpperCase().trim();

  if (text === 'HAMBURGER' || text === 'BURGER') {
    return true;
  }

  if (text === 'NOT_HAMBURGER' || text === 'NOT HAMBURGER' || text.includes('NOT')) {
    return false;
  }

  return text.includes('HAMBURGER') && !text.includes('NOT');
}
