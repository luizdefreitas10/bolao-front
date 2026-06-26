const PLAYER_PHOTO_BY_NAME: Record<string, string> = {
  'Vini Jr': '/players/brasil/vini-jr.png',
  Neymar: '/players/brasil/neymar.png',
  Endrick: '/players/brasil/endrick.png',
  'Matheus Cunha': '/players/brasil/matheus-cunha.png',
  'Cristiano Ronaldo': '/players/portugal/cristiano-ronaldo.png',
  'Bruno Fernandes': '/players/portugal/bruno-fernandes.png',
  'Nuno Mendes': '/players/portugal/nuno-mendes.png',
  'Lamine Yamal': '/players/espanha/lamine-yamal.png',
  Pedri: '/players/espanha/pedri.png',
  Rodri: '/players/espanha/rodri.png',
  'Kylian Mbappé': '/players/franca/kylian-mbappe.png',
  'Antoine Griezmann': '/players/franca/antoine-griezmann.png',
  'Ousmane Dembélé': '/players/franca/ousmane-dembele.png',
  'Jamal Musiala': '/players/alemanha/jamal-musiala.png',
  'Florian Wirtz': '/players/alemanha/florian-wirtz.png',
  'Kai Havertz': '/players/alemanha/kai-havertz.png',
  'Harry Kane': '/players/inglaterra/harry-kane.png',
  'Bukayo Saka': '/players/inglaterra/bukayo-saka.png',
  'Jude Bellingham': '/players/inglaterra/jude-bellingham.png',
  'Takefusa Kubo': '/players/japao/takefusa-kubo.png',
  'Kaoru Mitoma': '/players/japao/kaoru-mitoma.png',
  'Ao Tanaka': '/players/japao/ao-tanaka.png',
}

export function getPlayerPhoto(photoUrl?: string | null, name?: string) {
  if (photoUrl) {
    return photoUrl
  }

  if (name && PLAYER_PHOTO_BY_NAME[name]) {
    return PLAYER_PHOTO_BY_NAME[name]
  }

  return '/player.png'
}
