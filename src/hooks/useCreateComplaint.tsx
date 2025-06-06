import { creatComplaint } from "@/api/createComplaint";
import { useMutation } from "@tanstack/react-query";
interface Coords {
  latitude: number;
  longitude: number;
}
interface ValidatedTokenPayload {
  user: any;
  complaint: string;
  address: string;
  detail: string;
  pictureData: {
    uri: string;
    name: string;
    type: "image/jpeg";
  };
  videoData: {
    uri: string;
    name: string;
    type: "video/mp4";
  };
  coords: Coords;
}

interface ValidatedTokenResponse {
  message: string;
  title: string;
  picture?: string;
  video?: string;
}
export const useCreateComplaint = () => {
  console.log("inside hook ");
  return useMutation<ValidatedTokenResponse, Error, ValidatedTokenPayload>({
    mutationFn: creatComplaint,
  });
};
