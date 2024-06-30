declare interface IPrediction {
  matchId: string
  predictionHome: number
  predictionAway: number
  playerId?: string | null
}

declare interface IPredictionResponse {
  response: {
    predictionScoreId: string
    predicionPlayerId: string
  }
}
