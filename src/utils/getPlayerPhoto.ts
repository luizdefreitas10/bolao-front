export function getPlayerPhoto(
  photoUrl?: string | null,
  playerName?: string,
) {
  if (photoUrl) {
    return photoUrl
  }

  return '/player.png'
}
