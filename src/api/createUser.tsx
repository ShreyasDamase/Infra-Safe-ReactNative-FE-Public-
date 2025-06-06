import { string } from "zod";
import axios from "axios";
import { BASE_URL } from "@/service/config";
import { Citizen } from "@/types/Citizen";
interface ValidatedTokenPayload {
  idToken: string;
  data: Citizen;
}
interface ValidatedTokenResponse {
  success: boolean;
  uid: string;
  phoneNumber: string;
}
export const createUser = async (
  payload: ValidatedTokenPayload
): Promise<ValidatedTokenResponse> => {
  console.log("inside api");

  const response = await axios.post<ValidatedTokenResponse>(
    `${BASE_URL}/auth/verify-token`,
    payload,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};
