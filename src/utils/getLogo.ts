const TEAM_LOGO_BY_NAME: Record<string, string> = {
  México: '/teams/mx.png',
  'Coreia do Sul': '/teams/kr.png',
  'República Tcheca': '/teams/cz.png',
  'África do Sul': '/teams/za.png',
  Canadá: '/teams/ca.png',
  Suíça: '/teams/ch.png',
  'Bósnia e Herzegovina': '/teams/ba.png',
  Catar: '/teams/qa.png',
  Brasil: '/teams/br.png',
  Marrocos: '/teams/ma.png',
  Escócia: '/teams/gb-sct.png',
  Haiti: '/teams/ht.png',
  'Estados Unidos': '/teams/us.png',
  Austrália: '/teams/au.png',
  Paraguai: '/teams/py.png',
  Turquia: '/teams/tr.png',
  Alemanha: '/teams/de.png',
  'Costa do Marfim': '/teams/ci.png',
  Equador: '/teams/ec.png',
  Curaçao: '/teams/cw.png',
  Holanda: '/teams/nl.png',
  Japão: '/teams/jp.png',
  Suécia: '/teams/se.png',
  Tunísia: '/teams/tn.png',
  Egito: '/teams/eg.png',
  Irã: '/teams/ir.png',
  Bélgica: '/teams/be.png',
  'Nova Zelândia': '/teams/nz.png',
  Espanha: '/teams/es.png',
  Uruguai: '/teams/uy.png',
  'Cabo Verde': '/teams/cv.png',
  'Arábia Saudita': '/teams/sa.png',
  França: '/teams/fr.png',
  Noruega: '/teams/no.png',
  Senegal: '/teams/sn.png',
  Iraque: '/teams/iq.png',
  Argentina: '/teams/ar.png',
  Áustria: '/teams/at.png',
  Argélia: '/teams/dz.png',
  Jordânia: '/teams/jo.png',
  Colômbia: '/teams/co.png',
  'RD Congo': '/teams/cd.png',
  Portugal: '/teams/pt.png',
  Uzbequistão: '/teams/uz.png',
  Inglaterra: '/teams/gb-eng.png',
  Gana: '/teams/gh.png',
  Panamá: '/teams/pa.png',
  Croácia: '/teams/hr.png',
  Sport: '/sportlogo.svg',
  Nautico: '/nauticologo.svg',
  'Santa Cruz': '/santalogo.svg',
}

export function getLogo(name?: string, logoUrl?: string | null) {
  if (logoUrl) {
    return logoUrl
  }

  if (name && TEAM_LOGO_BY_NAME[name]) {
    return TEAM_LOGO_BY_NAME[name]
  }

  return '/defaultlogo.svg'
}

export function isDefaultLogo(logo: string) {
  return logo === '/defaultlogo.svg'
}
