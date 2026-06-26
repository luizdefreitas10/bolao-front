import { get } from '../../methods/get'
import { post } from '../../methods/post'

export default async function PredictionsService() {
  async function submitPredictions(
    data: IPrediction,
    token: string,
  ): Promise<IPredictionResponse> {
    return await post<IPredictionResponse, IPrediction>('/predictions', data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  }

  async function getPredictions(
    token: string,
  ): Promise<{ predictions: IPredictionsGetResponse[] }> {
    const response = await get<{ predictions: IPredictionsGetResponse[] }>(
      '/prediction',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
    return response
  }

  return {
    submitPredictions,
    getPredictions,
  }
}
