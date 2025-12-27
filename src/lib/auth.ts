// Simplified auth for now - in production this would use proper session management
export async function getUserFromSession() {
  // For now, return the actual logged-in user (Sathish Sonu)
  // Using ID 'user_sonu' which corresponds to the actual user in the professionals array
  return {
    id: 'user_sonu',
    email: 'sathish.sonu@example.com',
    name: 'Sathish Sonu',
    role: 'freelancer',
    currentRole: 'freelancer',
  }
}
