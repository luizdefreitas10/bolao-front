export function getLogo(name?: string) {
  switch (name) {
    case 'Sport':
      return '/sportlogo.svg'
    case 'Nautico':
      return '/nauticologo.svg'
    case 'Santa Cruz':
      return '/santalogo.svg'
    default:
      return '/defaultlogo.svg'
  }
}
