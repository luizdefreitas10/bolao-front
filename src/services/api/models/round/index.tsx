import { post } from "../../methods/post";

export default async function RoundService() {
  async function create(data: INewRound): Promise<{roundId:string}> {
    const payload = JSON.stringify(data);
    const response = await post<{roundId:string}, string>("/round", payload);
    return response
  }


  return {
    create,
  };
}
