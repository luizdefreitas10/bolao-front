import { post } from '../../methods/post'

export default async function SessionService() {
  async function create(data: ILogin): Promise<ISession> {
    const payload = JSON.stringify(data)
    return await post<ISession, string>('/sessions', payload)
  }

  return {
    create,
  }
}
