/** "hey! rahul" — first name only, lowercased to match home screen design. */
export function formatHomeGreeting(fullName: string | null | undefined): string {
  const first = fullName?.trim().split(/\s+/)[0];
  if (!first) return "hey!";
  return `hey! ${first.toLowerCase()}`;
}
