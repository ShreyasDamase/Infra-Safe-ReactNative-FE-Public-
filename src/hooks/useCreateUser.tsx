import { createUser } from "@/api/createUser";
import { Citizen } from "@/types/Citizen";
import { useMutation } from "@tanstack/react-query";

interface ValidatedTokenPayload {
  idToken: string;
  data: Citizen;
}
interface ValidatedTokenResponse {
  success: boolean;
  uid: string;
  phoneNumber: string;
}
export const useCreateUser = () => {
  console.log("inside hook");
  return useMutation<ValidatedTokenResponse, Error, ValidatedTokenPayload>({
    mutationFn: createUser,
  });
};
