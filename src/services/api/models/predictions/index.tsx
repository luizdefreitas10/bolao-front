import { post } from '../../methods/post'

export default async function PredictionsService() {
  async function submitPredictions(
    data: IPrediction,
    token: string,
  ): Promise<IPredictionResponse> {
    const payload = JSON.stringify(data)
    const response = await post<IPredictionResponse, string>(
      '/predictions',
      payload,
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
  }
}
