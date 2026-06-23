#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TEAMS_DIR="$ROOT/public/teams"
PLAYERS_ROOT="$ROOT/public/players"

mkdir -p "$TEAMS_DIR" "$PLAYERS_ROOT"

ISOS=(
  mx kr cz za ca ch ba qa br ma gb-sct ht us au py tr de ci ec cw
  nl jp se tn eg ir be nz es uy cv sa fr no sn iq ar at dz jo co cd pt uz
  gb-eng gh pa hr
)

for iso in "${ISOS[@]}"; do
  echo "Downloading flag: $iso"
  curl -fsSL "https://flagcdn.com/w640/${iso}.png" -o "$TEAMS_DIR/${iso}.png"
done

download_player() {
  local folder="$1"
  local slug="$2"
  local url="$3"
  local fallback_name="$4"
  local bg="${5:-00409F}"

  local dir="$PLAYERS_ROOT/$folder"
  mkdir -p "$dir"
  echo "Downloading player: $folder/$slug"

  if curl -fsSL "$url" -o "$dir/${slug}.png"; then
    return 0
  fi

  echo "  fallback ui-avatars for $slug"
  curl -fsSL "https://ui-avatars.com/api/?name=${fallback_name}&size=256&background=${bg}&color=fff&bold=true&format=png" \
    -o "$dir/${slug}.png"
}

# Brasil
download_player "brasil" "vini-jr" \
  "https://commons.wikimedia.org/w/index.php?title=Special:Redirect/file/Vinicius_Jr_2021.jpg&width=256" \
  "Vini+Jr" "009c3b"
download_player "brasil" "neymar" \
  "https://commons.wikimedia.org/w/index.php?title=Special:Redirect/file/Neymar_Jr._with_Al_Hilal,_3_October_2023_-_03_(cropped).jpg&width=256" \
  "Neymar" "009c3b"
download_player "brasil" "endrick" \
  "https://ui-avatars.com/api/?name=Endrick&size=256&background=009c3b&color=fff&bold=true&format=png" \
  "Endrick" "009c3b"
download_player "brasil" "matheus-cunha" \
  "https://ui-avatars.com/api/?name=Matheus+Cunha&size=256&background=009c3b&color=fff&bold=true&format=png" \
  "Matheus+Cunha" "009c3b"

# Portugal
download_player "portugal" "cristiano-ronaldo" \
  "https://commons.wikimedia.org/w/index.php?title=Special:Redirect/file/Cristiano_Ronaldo_playing_for_Al_Nassr_FC_against_Persepolis,_September_2023_(cropped).jpg&width=256" \
  "C+Ronaldo" "006600"
download_player "portugal" "bruno-fernandes" \
  "https://commons.wikimedia.org/w/index.php?title=Special:Redirect/file/Bruno_Fernandes_2021.jpg&width=256" \
  "Bruno+Fernandes" "006600"
download_player "portugal" "nuno-mendes" \
  "https://commons.wikimedia.org/w/index.php?title=Special:Redirect/file/Nuno_Mendes_2021.jpg&width=256" \
  "Nuno+Mendes" "006600"

# Espanha
download_player "espanha" "lamine-yamal" \
  "https://commons.wikimedia.org/w/index.php?title=Special:Redirect/file/Lamine_Yamal_2024.jpg&width=256" \
  "Lamine+Yamal" "aa1515"
download_player "espanha" "pedri" \
  "https://commons.wikimedia.org/w/index.php?title=Special:Redirect/file/Pedri_2021.jpg&width=256" \
  "Pedri" "aa1515"
download_player "espanha" "rodri" \
  "https://commons.wikimedia.org/w/index.php?title=Special:Redirect/file/Rodri_2023.jpg&width=256" \
  "Rodri" "aa1515"

# França
download_player "franca" "kylian-mbappe" \
  "https://commons.wikimedia.org/w/index.php?title=Special:Redirect/file/Kylian_Mbapp%C3%A9_2018.jpg&width=256" \
  "K+Mbappe" "002654"
download_player "franca" "antoine-griezmann" \
  "https://commons.wikimedia.org/w/index.php?title=Special:Redirect/file/Antoine_Griezmann_2018.jpg&width=256" \
  "A+Griezmann" "002654"
download_player "franca" "ousmane-dembele" \
  "https://commons.wikimedia.org/w/index.php?title=Special:Redirect/file/Ousmane_Dembele_2018.jpg&width=256" \
  "O+Dembele" "002654"

# Alemanha
download_player "alemanha" "jamal-musiala" \
  "https://commons.wikimedia.org/w/index.php?title=Special:Redirect/file/Jamal_Musiala_2022.jpg&width=256" \
  "J+Musiala" "000000"
download_player "alemanha" "florian-wirtz" \
  "https://commons.wikimedia.org/w/index.php?title=Special:Redirect/file/Florian_Wirtz,_2021.jpg&width=256" \
  "F+Wirtz" "000000"
download_player "alemanha" "kai-havertz" \
  "https://commons.wikimedia.org/w/index.php?title=Special:Redirect/file/Kai_Havertz_2019.jpg&width=256" \
  "K+Havertz" "000000"

# Inglaterra
download_player "inglaterra" "harry-kane" \
  "https://commons.wikimedia.org/w/index.php?title=Special:Redirect/file/Harry_Kane_2018.jpg&width=256" \
  "Harry+Kane" "cf142b"
download_player "inglaterra" "bukayo-saka" \
  "https://commons.wikimedia.org/w/index.php?title=Special:Redirect/file/Bukayo_Saka_2021.jpg&width=256" \
  "B+Saka" "cf142b"
download_player "inglaterra" "jude-bellingham" \
  "https://commons.wikimedia.org/w/index.php?title=Special:Redirect/file/Jude_Bellingham_2023.jpg&width=256" \
  "J+Bellingham" "cf142b"

# Japão
download_player "japao" "takefusa-kubo" \
  "https://commons.wikimedia.org/w/index.php?title=Special:Redirect/file/Takefusa_Kubo_2019.jpg&width=256" \
  "T+Kubo" "bc002d"
download_player "japao" "kaoru-mitoma" \
  "https://commons.wikimedia.org/w/index.php?title=Special:Redirect/file/Kaoru_Mitoma_2022.jpg&width=256" \
  "K+Mitoma" "bc002d"
download_player "japao" "ao-tanaka" \
  "https://commons.wikimedia.org/w/index.php?title=Special:Redirect/file/Ao_Tanaka_2022.jpg&width=256" \
  "Ao+Tanaka" "bc002d"

echo "Assets downloaded to public/teams and public/players/*"
