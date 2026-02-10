const MIN_PASSWORD_LENGTH = 8

function validatePassword(password: string): boolean {
  const hasLetter = /[a-zA-Z]/.test(password)
  const hasDigit = /\d/.test(password)
  return password.length >= MIN_PASSWORD_LENGTH && hasLetter && hasDigit
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

async function hashPassword(password: string): Promise<string> {
  return Bun.password.hash(password)
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return Bun.password.verify(password, hash)
}

export { hashPassword, validateEmail, validatePassword, verifyPassword }
