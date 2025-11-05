// Simplified auth for now - in production this would use proper session management
export async function getUserFromSession() {
  // For now, return a mock user - in production this would get from WorkOS session
  return {
    id: 'user_123',
    email: 'client@example.com',
    name: 'Demo Client',
    role: 'client',
    currentRole: 'client',
  }
}
