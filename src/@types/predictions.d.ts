declare interface IPrediction {
  matchId: string
  predictionHome: number
  predictionAway: number
  playerId?: string | null
  disabled?: boolean | null
}

declare interface IPredictionResponse {
  response: {
    predictionScoreId: string
    predicionPlayerId: string
  }
}

declare interface IPredictionsGetResponse {
  matchId?: string
  round?: { id?: string; name?: string }
  match: {
    matchId?: string
    date: Date
    lastPlayer?: string | null
    roundId?: string
    roundName?: string
    scoreAway?: number | null
    scoreHome?: number | null
    status: string
    teamAway: string | { name: string; logoUrl?: string | null }
    teamHome: string | { name: string; logoUrl?: string | null }
  }
  predictionScore?: {
    predictionHome?: number | null
    predictionAway?: number | null
    status?: 'HIT' | 'MISS' | null
  } | null
  predictionPlayer?: {
    player?: string | null
    team?: string | null
    photoUrl?: string | null
    status?: 'HIT' | 'MISS' | null
  } | null
}

declare interface IUserPredictions {
  match: {
    date: Date
    id: string
    lastPlayer: string
    roundId: string
    roundName: string
    scoreAway: number
    scoreHome: number
    status: string
    teamAway: string
    teamHome: string
  }
  predictionPlayer: {
    player: string
    status: string
    team: string
  }
  predictionScore: {
    predictionHome: number
    predictionAway: number
    status: string
  }
}

// {userPrediction.predictionPlayer.status === 'HIT' && userPrediction.predictionScore.status === 'HIT'}
