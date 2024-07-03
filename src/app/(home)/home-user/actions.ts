'use server'

import { handleAxiosError } from '@/services/api/error'
import ChampionshipService from '@/services/api/models/championship'
import PredictionsService from '@/services/api/models/predictions'

export async function fetchChampionshipsWithRounds(token: string) {
  try {
    const { fetchChampionshipsWithRounds } = await ChampionshipService()
    const championships = await fetchChampionshipsWithRounds(token)

    return { isError: false, championships }
  } catch (error) {
    const customError = handleAxiosError(error)
    return { isError: true, error: customError.message }
  }
}

export async function submitPredictions(data: IPrediction, token: string) {
  try {
    const { submitPredictions } = await PredictionsService()
    const { response } = await submitPredictions(data, token)

    return { isError: false, response }
  } catch (error) {
    const customError = handleAxiosError(error)
    return { isError: true, error: customError.message }
  }
}

export async function getPredictions(token: string) {
  try {
    const { getPredictions } = await PredictionsService()
    const { predictions } = await getPredictions(token)

    return { isError: false, predictions }
  } catch (error) {
    const customError = handleAxiosError(error)
    return { isError: true, error: customError.message }
  }
}
