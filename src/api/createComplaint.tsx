import { BASE_URL } from "@/service/config";
import axios from "axios";
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
  picture: string;
  videp: string;
}
export const creatComplaint = async (
  payload: ValidatedTokenPayload
): Promise<ValidatedTokenResponse> => {
  const response = await axios.post<ValidatedTokenResponse>(
    `${BASE_URL}/complaint/complaint`,
    payload,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  console.log("inside api");
  console.log(response.data);
  return response.data;
};
