"use server";

import { handleAxiosError } from "@/services/api/error";
import SessionService from "@/services/api/session";

export async function createSession(data: ILogin): Promise<ISession> {
  try {
    const { create } = await SessionService();
    const response = await create(data);
    return { isError: false, access_token: response.access_token };
  } catch (error) {
    const customError = handleAxiosError(error);
    return { isError: true, error: customError.message };
  }
}
