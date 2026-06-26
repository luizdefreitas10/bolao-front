import { post } from '../../methods/post'

export default async function SessionService() {
  async function create(data: ILogin): Promise<ISession> {
    return await post<ISession, ILogin>('/sessions', data)
  }

  return {
    create,
  }
}
