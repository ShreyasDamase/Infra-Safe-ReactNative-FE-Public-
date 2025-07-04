import { tokenStorage } from "@/store/storage";
import { resetAndNavigate } from "@/utils/Helpers";
import axios from "axios";
import { Alert } from "react-native";
import { BASE_URL } from "./config";
import { useUserStore } from "@/store/userStore";

// export const signin = async (
//   payload: { role: "customer" | "rider"; phone: string },
//   updateAccessToken: () => void,
// ) => {
//   const { setUser } = useCitizenStore.getState();
//   const { setUser: setRiderUser } = useCitizenStore.getState();
//   try {
//     console.log(payload);
//     const res = await axios.post(`${BASE_URL}/auth/signin`, payload);
//     if (res.data.user.role === "customer") {
//       setUser(res.data.user);
//     } else {
//       setRiderUser(res.data.user);
//     }
//     tokenStorage.set("access_token", res.data.access_token);
//     tokenStorage.set("refresh_token", res.data.refresh_token);
//     tokenStorage.set("user", JSON.stringify(res.data.user)); // This was missing!

//     if (res.data.user.role === "customer") {
//       //   resetAndNavigate("/customer/home");
//     } else {
//       //resetAndNavigate("/rider/home");
//     }
//     updateAccessToken();
//   } catch (error: any) {
//     Alert.alert("There was error in login!");
//     console.log("Error: ", error?.response?.data?.msg || "Error in signin");
//   }
// };

export const logOut = async (discconect?: () => void) => {
  if (discconect) {
    discconect();
  }
  const { clearUserData } = useUserStore.getState();
  tokenStorage.clearAll();
  clearUserData();
  resetAndNavigate("/role/login");
};
