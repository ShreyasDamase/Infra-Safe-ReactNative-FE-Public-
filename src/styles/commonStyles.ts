import { getTheme } from "@/theme/useAppTheme";
import { StyleSheet } from "react-native";



export const commonStyle = StyleSheet.create({
    container: {
        flex: 1,


    },
    statusbar: {
        backgroundColor: getTheme().statusbar.backgroundColor,

    }
})