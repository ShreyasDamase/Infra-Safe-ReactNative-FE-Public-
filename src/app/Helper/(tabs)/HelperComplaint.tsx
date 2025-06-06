// import { Alert, StyleSheet, Switch, Text, View } from "react-native";
// import React, { useEffect, useState } from "react";
// import { getCurrentLocationDetails } from "@/utils/mapUtils";
// import { useWS } from "@/service/WSProvider";
// import { useUserStore } from "@/store/userStore";
// import * as Location from "expo-location";
// import { useIsFocused } from "@react-navigation/native";

// interface Coords {
//   latitude: number;
//   longitude: number;
// }

// const HelperComplaint = () => {
//   const [place, setPlace] = useState<any>();
//   const [coords, setCoords] = useState<Coords | undefined>();
//   const [isEnabled, setIsEnabled] = useState(false);
//   const { onDuty, setLocation, setOnDuty } = useUserStore();
//   const isFocused = useIsFocused();
//   const [assignedComplaints, setAssignedComplaints] = useState([]);

//   const { emit, on, off, disconnect } = useWS();

//   const toggleSwitch = () => setOnDuty(!onDuty);
//   useEffect(() => {
//     const formatAddress = (addr: Location.LocationGeocodedAddress) => {
//       const parts = [addr.street, addr.city, addr.region, addr.country];

//       return parts.filter(Boolean).join(", ");
//     };
//     const fetchLocation = async () => {
//       const { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== "granted") {
//         console.log("Permission not granted");
//         return;
//       }

//       const location = await Location.getCurrentPositionAsync({
//         accuracy: Location.Accuracy.Highest,
//       });

//       const { latitude, longitude } = location.coords;

//       console.log("🔁 FORCED COORDS =>", latitude, longitude);

//       setCoords({ latitude, longitude });

//       const [addr] = await Location.reverseGeocodeAsync({
//         latitude,
//         longitude,
//       });

//       const addressString = formatAddress(addr);
//       console.log(addressString);
//       setPlace(addressString);
//     };

//     fetchLocation();
//   }, []);

//   useEffect(() => {
//     let locationsSubsription: any;
//     const startLocationUpdate = async () => {
//       const { status } = await Location.requestForegroundPermissionsAsync();
//       if (status === "granted") {
//         locationsSubsription = await Location.watchPositionAsync(
//           {
//             accuracy: Location.Accuracy.High,
//             timeInterval: 5000,
//             // distanceInterval: 10,
//           },
//           (location) => {
//             const { latitude, longitude, heading } = location.coords;
//             setLocation({
//               latitude: latitude,
//               longitude: longitude,
//               address: "Somewhere",
//               heading: heading as number,
//             });
//             emit("updateLocation", {
//               latitude,
//               longitude,
//               heading,
//             });
//           }
//         );
//       }
//     };

//     if (onDuty && isFocused) {
//       startLocationUpdate();
//     }
//     return () => {
//       if (locationsSubsription) {
//         locationsSubsription.remove();
//       }
//     };
//   }, [onDuty, isFocused]);
//   const toggleOnDuty = async () => {
//     if (onDuty) {
//       const { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== "granted") {
//         Alert.alert(
//           "Permission Denied",
//           "Location permission is required to go on duty"
//         );
//         return;
//       }
//       const location = await Location.getCurrentPositionAsync({});
//       const { latitude, longitude, heading } = location.coords;
//       setLocation({
//         latitude: latitude,
//         longitude: longitude,
//         address: "Somewhere",
//         heading: heading as number,
//       });
//       emit("goOnDuty", {
//         latitude: location?.coords?.latitude,
//         longitude: location?.coords?.longitude,
//         heading: heading,
//       });
//     } else {
//       emit("goOffDuty");
//     }
//   };

//   useEffect(() => {
//     if (isFocused) {
//       toggleOnDuty();
//     }
//   }, [isFocused, onDuty]);

//   useEffect(() => {
//     const handleAssignHelper = ({
//       complaintId,
//       helperId,
//       complaintData,
//     }: any) => {
//       console.log("📦 New complaint assigned:", complaintId);
//       console.log("Complaint Details:", complaintData);
//       setAssignedComplaints((prev) => [...prev, complaintData]);

//       // You can update state or navigate to a complaint detail screen here
//       Alert.alert("New Complaint Assigned", `Complaint ID: ${complaintId}`);
//     };

//     on("assignHelper", handleAssignHelper);

//     return () => {
//       off("assignHelper", handleAssignHelper);
//     };
//   }, []);

//   return (
//     <View>
//       <Text>{coords?.latitude}</Text>
//       <Text>{coords?.longitude}</Text>
//       <Text>{place}</Text>
//       <Switch
//         trackColor={{ false: "#767577", true: "#81b0ff" }}
//         thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
//         ios_backgroundColor="#3e3e3e"
//         onValueChange={toggleSwitch}
//         value={isEnabled}
//       />
//     </View>
//   );
// };

// export default HelperComplaint;

// const styles = StyleSheet.create({});
import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { commonStyle } from "@/styles/commonStyles";
import { useAppTheme } from "@/theme/useAppTheme";
import { getCurrentLocationDetails } from "@/utils/mapUtils";
import { useWS } from "@/service/WSProvider";
import { useUserStore } from "@/store/userStore";
import * as Location from "expo-location";
import { useIsFocused } from "@react-navigation/native";
import { D } from "@/utils/dimensions";
import { fonts } from "@/theme/fonts";
import { RFValue } from "react-native-responsive-fontsize";
import MapView, { Marker, Region } from "react-native-maps";
import { customMapStyle } from "@/styles/CustomMap";
import { reverseGeocode } from "@/utils/mapUtils";
import { mapStyles } from "@/styles/mapStyles";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { FontAwesome, Ionicons } from "@expo/vector-icons";

interface Coords {
  latitude: number;
  longitude: number;
}

interface Complaint {
  _id: string;
  complaintName: string;
  complaintDepartment: string;
  complaintDetail: string;
  address: string;
  coords: Coords;
  status: string;
  user: {
    name: string;
    phone: string;
  };
  picture?: {
    path: string;
  };
  video?: {
    path: string;
  };
}

const HelperComplaint = () => {
  const { theme } = useAppTheme();
  const [place, setPlace] = useState<string>("");
  const [coords, setCoords] = useState<Coords | undefined>();
  const { onDuty, setLocation, setOnDuty } = useUserStore();
  const isFocused = useIsFocused();
  const [assignedComplaints, setAssignedComplaints] = useState<Complaint[]>([]);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(
    null
  );
  const { emit, on, off } = useWS();
  const mapRef = useRef<MapView>(null);

  const toggleSwitch = () => setOnDuty(!onDuty);

  useEffect(() => {
    const formatAddress = (addr: Location.LocationGeocodedAddress) => {
      const parts = [addr.street, addr.city, addr.region, addr.country];
      return parts.filter(Boolean).join(", ");
    };

    const fetchLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission not granted");
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });

      const { latitude, longitude } = location.coords;
      setCoords({ latitude, longitude });

      const [addr] = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });
      const addressString = formatAddress(addr);
      setPlace(addressString);
    };

    fetchLocation();
  }, []);

  useEffect(() => {
    let locationsSubscription: any;

    const startLocationUpdate = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        locationsSubscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 5000,
          },
          (location) => {
            const { latitude, longitude, heading } = location.coords;
            setLocation({
              latitude,
              longitude,
              address: "Current Location",
              heading: heading as number,
            });
            emit("updateLocation", { latitude, longitude, heading });
          }
        );
      }
    };

    if (onDuty && isFocused) {
      startLocationUpdate();
    }

    return () => {
      if (locationsSubscription) {
        locationsSubscription.remove();
      }
    };
  }, [onDuty, isFocused]);

  const toggleOnDuty = async () => {
    if (onDuty) {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Location permission is required to go on duty"
        );
        return;
      }
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude, heading } = location.coords;
      console.log("location", location, longitude, latitude);
      setLocation({
        latitude,
        longitude,
        address: "Current Location",
        heading: heading as number,
      });
      //colling onduety
      console.log("before callig onduty ");
      try {
        emit("goOnDuty", {
          latitude,
          longitude,
          heading,
        });
      } catch (error) {
        console.error("Failed to emit goOnDuty:", error);
      }
    } else {
      emit("goOffDuty");
    }
  };

  useEffect(() => {
    if (isFocused) {
      toggleOnDuty();
    }
  }, [isFocused, onDuty]);

  useEffect(() => {
    const handleAssignHelper = ({
      complaintData,
    }: {
      complaintData: Complaint;
    }) => {
      setAssignedComplaints((prev) => [...prev, complaintData]);
      Alert.alert(
        "New Complaint Assigned",
        `Complaint Type: ${complaintData.complaintName}\nLocation: ${complaintData.address}`
      );

      // Center map on the new complaint
      if (complaintData.coords) {
        mapRef.current?.animateToRegion(
          {
            latitude: complaintData.coords.latitude,
            longitude: complaintData.coords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          },
          1000
        );
      }
    };

    on("assignHelper", handleAssignHelper);

    return () => {
      off("assignHelper", handleAssignHelper);
    };
  }, []);

  const handleGpsButtonPress = async () => {
    try {
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      mapRef.current?.animateToRegion(
        {
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        1000
      );
    } catch (error) {
      console.log("Error getting location", error);
    }
  };

  const getComplaintIcon = (type: string) => {
    switch (type) {
      case "electrical_fault":
        return (
          <MaterialIcons
            name="electrical-services"
            size={24}
            color={theme.complaints.electric.main}
          />
        );
      case "water_leakage":
        return (
          <MaterialIcons
            name="water-damage"
            size={24}
            color={theme.complaints.water.main}
          />
        );
      case "road_damage":
        return (
          <MaterialIcons
            name="add-road"
            size={24}
            color={theme.complaints.road.main}
          />
        );
      default:
        return <MaterialIcons name="warning" size={24} color={theme.primary} />;
    }
  };

  return (
    <Fragment>
      <StatusBar
        backgroundColor={commonStyle.statusbar.backgroundColor}
        barStyle={theme.statusbar.barStyle}
      />
      <SafeAreaView />
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        {/* Header with Dashboard Title and Toggle */}
        <View
          style={[
            styles.headerContainer,
            { backgroundColor: theme.rang.background },
          ]}
        >
          <View style={styles.headerContent}>
            <Text style={[styles.headerText, { color: theme.text.primary }]}>
              Helper Dashboard
            </Text>
            <View style={styles.switchContainer}>
              <Text style={[styles.switchLabel, { color: theme.text.primary }]}>
                {onDuty ? "On Duty" : "Off Duty"}
              </Text>
              <Switch
                trackColor={{
                  false: theme.forms.switch.inactive,
                  true: theme.primary,
                }}
                thumbColor={
                  onDuty ? theme.forms.switch.thumb : theme.text.inverted
                }
                ios_backgroundColor={theme.rang.boxBorder}
                onValueChange={toggleSwitch}
                value={onDuty}
              />
            </View>
          </View>
        </View>

        {/* Map View with GPS Button */}
        <View style={styles.mapContainer}>
          <MapView
            ref={mapRef}
            style={styles.map}
            customMapStyle={customMapStyle}
            initialRegion={{
              latitude: coords?.latitude || 18.5204,
              longitude: coords?.longitude || 73.8567,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            showsUserLocation={true}
          >
            {assignedComplaints.map((complaint, index) => (
              <Marker
                key={index}
                coordinate={{
                  latitude: complaint.coords.longitude,
                  longitude: complaint.coords.latitude,
                }}
                onPress={() => setSelectedComplaint(complaint)}
              >
                <View
                  style={[
                    styles.markerContainer,
                    { backgroundColor: theme.background },
                  ]}
                >
                  {getComplaintIcon(complaint.complaintName)}
                </View>
              </Marker>
            ))}
          </MapView>

          <TouchableOpacity
            style={[styles.gpsButton, { backgroundColor: theme.background }]}
            onPress={handleGpsButtonPress}
          >
            <MaterialCommunityIcons
              name="crosshairs-gps"
              size={RFValue(20)}
              color={theme.primary}
            />
          </TouchableOpacity>
        </View>

        {/* Current Location Card */}
        <View
          style={[
            styles.locationCard,
            { backgroundColor: theme.rang.mediaContainer },
          ]}
        >
          <Ionicons name="location" size={20} color={theme.primary} />
          <Text
            style={[styles.locationText, { color: theme.text.primary }]}
            numberOfLines={2}
          >
            {place || "Fetching location..."}
          </Text>
        </View>

        {/* Main Content */}
        <ScrollView style={styles.contentScroll}>
          {/* Assigned Complaints Section */}
          <View style={styles.sectionHeaderContainer}>
            <Text style={[styles.sectionHeader, { color: theme.text.primary }]}>
              Assigned Complaints
            </Text>
            <View style={[styles.badge, { backgroundColor: theme.primary }]}>
              <Text style={[styles.badgeText, { color: theme.text.onPrimary }]}>
                {assignedComplaints.length}
              </Text>
            </View>
          </View>

          {selectedComplaint ? (
            <View
              style={[
                styles.complaintDetailContainer,
                { backgroundColor: theme.rang.background },
              ]}
            >
              <View style={styles.complaintHeader}>
                <View
                  style={[
                    styles.complaintIconContainer,
                    { backgroundColor: theme.background },
                  ]}
                >
                  {getComplaintIcon(selectedComplaint.complaintName)}
                </View>
                <Text
                  style={[styles.complaintTitle, { color: theme.text.primary }]}
                >
                  {selectedComplaint.complaintName.replace("_", " ")}
                </Text>
                <TouchableOpacity
                  onPress={() => setSelectedComplaint(null)}
                  style={[
                    styles.closeButton,
                    { backgroundColor: theme.rang.boxBorder },
                  ]}
                >
                  <Ionicons name="close" size={18} color={theme.text.primary} />
                </TouchableOpacity>
              </View>

              <View style={styles.detailRow}>
                <View style={styles.detailIcon}>
                  <FontAwesome
                    name="user"
                    size={16}
                    color={theme.text.secondary}
                  />
                </View>
                <Text
                  style={[styles.detailText, { color: theme.text.primary }]}
                >
                  {selectedComplaint.user.name}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <View style={styles.detailIcon}>
                  <FontAwesome
                    name="phone"
                    size={16}
                    color={theme.text.secondary}
                  />
                </View>
                <Text
                  style={[styles.detailText, { color: theme.text.primary }]}
                >
                  {selectedComplaint.user.phone}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <View style={styles.detailIcon}>
                  <Ionicons
                    name="location"
                    size={16}
                    color={theme.text.secondary}
                  />
                </View>
                <Text
                  style={[styles.detailText, { color: theme.text.primary }]}
                >
                  {selectedComplaint.address}
                </Text>
              </View>

              <View style={styles.descriptionContainer}>
                <Text
                  style={[
                    styles.complaintDescription,
                    { color: theme.text.primary },
                  ]}
                >
                  {selectedComplaint.complaintDetail}
                </Text>
              </View>

              {selectedComplaint.picture && (
                <Image
                  source={{
                    uri: `http://192.168.0.119:3000/${selectedComplaint.picture.path}`,
                  }}
                  style={styles.complaintImage}
                />
              )}

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[
                    styles.actionButton,
                    { backgroundColor: theme.buttons.primary.background },
                  ]}
                >
                  <Text
                    style={[
                      styles.buttonText,
                      { color: theme.buttons.primary.text },
                    ]}
                  >
                    Accept
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.actionButton,
                    { backgroundColor: theme.buttons.danger.background },
                  ]}
                >
                  <Text
                    style={[
                      styles.buttonText,
                      { color: theme.buttons.danger.text },
                    ]}
                  >
                    Reject
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View
              style={[
                styles.complaintsList,
                { backgroundColor: theme.rang.background },
              ]}
            >
              {assignedComplaints.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <Ionicons
                    name="document-text-outline"
                    size={40}
                    color={theme.text.secondary}
                  />
                  <Text
                    style={[styles.emptyText, { color: theme.text.secondary }]}
                  >
                    No complaints assigned yet
                  </Text>
                </View>
              ) : (
                assignedComplaints.map((complaint) => (
                  <TouchableOpacity
                    key={complaint._id}
                    style={[
                      styles.complaintItem,
                      {
                        backgroundColor: theme.background,
                        borderBottomColor: theme.rang.boxBorder,
                      },
                    ]}
                    onPress={() => setSelectedComplaint(complaint)}
                  >
                    <View style={styles.complaintItemHeader}>
                      <View
                        style={[
                          styles.complaintItemIcon,
                          { backgroundColor: theme.rang.mediaContainer },
                        ]}
                      >
                        {getComplaintIcon(complaint.complaintName)}
                      </View>
                      <View style={styles.complaintTextContainer}>
                        <Text
                          style={[
                            styles.complaintItemTitle,
                            { color: theme.text.primary },
                          ]}
                        >
                          {complaint.complaintName.replace("_", " ")}
                        </Text>
                        <Text
                          style={[
                            styles.complaintItemAddress,
                            { color: theme.text.secondary },
                          ]}
                        >
                          {complaint.address}
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.statusBadge,
                          complaint.status === "assigned"
                            ? { backgroundColor: theme.status.active.main }
                            : { backgroundColor: theme.rang.boxBorder },
                        ]}
                      >
                        <Text
                          style={[
                            styles.statusText,
                            {
                              color:
                                complaint.status === "assigned"
                                  ? theme.status.active.contrast
                                  : theme.text.primary,
                            },
                          ]}
                        >
                          {complaint.status}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))
              )}
            </View>
          )}
        </ScrollView>
      </View>
    </Fragment>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    paddingVertical: D.spacing.large,
    paddingHorizontal: D.spacing.medium,
    borderBottomLeftRadius: D.radius.xxlarge,
    borderBottomRightRadius: D.radius.xxlarge,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerText: {
    fontFamily: fonts.bold,
    fontSize: RFValue(20),
    flex: 1,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  switchLabel: {
    fontFamily: fonts.medium,
    fontSize: RFValue(12),
    marginRight: D.spacing.small,
  },
  mapContainer: {
    height: D.hp(30),
    width: "100%",
    marginVertical: D.spacing.medium,
    borderRadius: D.radius.large,
    overflow: "hidden",
  },
  map: {
    flex: 1,
  },
  gpsButton: {
    position: "absolute",
    top: D.spacing.medium,
    right: D.spacing.medium,
    padding: D.spacing.small,
    borderRadius: D.radius.round,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  locationCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: D.spacing.medium,
    marginHorizontal: D.spacing.medium,
    borderRadius: D.radius.large,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  locationText: {
    fontFamily: fonts.regular,
    fontSize: RFValue(12),
    marginLeft: D.spacing.small,
    flex: 1,
  },
  contentScroll: {
    flex: 1,
    marginTop: D.spacing.medium,
  },
  sectionHeaderContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: D.spacing.large,
    marginBottom: D.spacing.medium,
  },
  sectionHeader: {
    fontFamily: fonts.bold,
    fontSize: RFValue(18),
    marginRight: D.spacing.small,
  },
  badge: {
    paddingHorizontal: D.spacing.small,
    paddingVertical: 2,
    borderRadius: D.radius.round,
  },
  badgeText: {
    fontFamily: fonts.bold,
    fontSize: RFValue(12),
  },
  complaintsList: {
    borderRadius: D.radius.large,
    marginHorizontal: D.spacing.medium,
    padding: D.spacing.small,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: D.spacing.xlarge,
  },
  emptyText: {
    fontFamily: fonts.regular,
    fontSize: RFValue(14),
    marginTop: D.spacing.small,
  },
  complaintItem: {
    padding: D.spacing.medium,
    borderRadius: D.radius.medium,
    marginBottom: D.spacing.small,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  complaintItemHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  complaintItemIcon: {
    padding: D.spacing.small,
    borderRadius: D.radius.medium,
    marginRight: D.spacing.small,
  },
  complaintTextContainer: {
    flex: 1,
  },
  complaintItemTitle: {
    fontFamily: fonts.medium,
    fontSize: RFValue(14),
  },
  complaintItemAddress: {
    fontFamily: fonts.light,
    fontSize: RFValue(12),
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: D.spacing.small,
    paddingVertical: 2,
    borderRadius: D.radius.small,
  },
  statusText: {
    fontFamily: fonts.medium,
    fontSize: RFValue(10),
    textTransform: "capitalize",
  },
  complaintDetailContainer: {
    borderRadius: D.radius.large,
    marginHorizontal: D.spacing.medium,
    padding: D.spacing.medium,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  complaintHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: D.spacing.medium,
    paddingBottom: D.spacing.small,
    borderBottomWidth: 1,
  },
  complaintIconContainer: {
    padding: D.spacing.small,
    borderRadius: D.radius.medium,
    marginRight: D.spacing.small,
  },
  complaintTitle: {
    fontFamily: fonts.bold,
    fontSize: RFValue(16),
    flex: 1,
    textTransform: "capitalize",
  },
  closeButton: {
    padding: D.spacing.small,
    borderRadius: D.radius.round,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: D.spacing.small,
  },
  detailIcon: {
    width: 24,
    alignItems: "center",
  },
  detailText: {
    fontFamily: fonts.regular,
    fontSize: RFValue(14),
    marginLeft: D.spacing.small,
    flex: 1,
  },
  descriptionContainer: {
    marginVertical: D.spacing.medium,
    padding: D.spacing.medium,
    borderRadius: D.radius.medium,
  },
  complaintDescription: {
    fontFamily: fonts.regular,
    fontSize: RFValue(14),
    lineHeight: RFValue(20),
  },
  complaintImage: {
    width: "100%",
    height: D.hp(20),
    borderRadius: D.radius.medium,
    marginVertical: D.spacing.medium,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: D.spacing.medium,
  },
  actionButton: {
    flex: 1,
    padding: D.spacing.medium,
    borderRadius: D.radius.medium,
    alignItems: "center",
    marginHorizontal: D.spacing.small,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  buttonText: {
    fontFamily: fonts.bold,
    fontSize: RFValue(14),
  },
  markerContainer: {
    padding: D.spacing.small,
    borderRadius: D.radius.round,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
});

export default HelperComplaint;
