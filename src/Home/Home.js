import React, { Component } from "react";
import {
  Text,
  View,
  SafeAreaView,
  TextInput,
  Image,
  ScrollView,
  TouchableOpacity,
  Platform,
  PermissionsAndroid,
  Linking,
  AppState,
  Dimensions,
  FlatList,
} from "react-native";
import Entypo from "react-native-vector-icons/Entypo";
import Modal from "react-native-modal";
import Header from "../CustomComponent/Header";
import Ionicons from "react-native-vector-icons/Ionicons";
import Octicons from "react-native-vector-icons/Octicons";
import StarRating from "react-native-star-rating";
import HomeIcon from "../CustomComponent/HomeIcon";
import { connect } from "react-redux";
import { setToken } from "../store/action/auth/action";
import { setLatitude, setLongitude } from "../store/action/Location/action";
import Spinner from "react-native-loading-spinner-overlay";
import Geolocation from "react-native-geolocation-service";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Geocoder from "react-native-geocoding";
import { getofficerlist } from "../utils/apiconfig";
// import { width } from "styled-system";
import { color } from "react-native-reanimated";
import dynamicLinks from "@react-native-firebase/dynamic-links";
import { setOfficer } from "../store/action/Officer/action";

const { height } = Dimensions.get("window");
const modalMargin = height / 3.5;
class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      starCount: 5,
      forceLocation: true,
      highAccuracy: true,
      location: {},
      currentLatitude: 0,
      currentLongitude: 0,
      showLocationDialog: false,
      formatted_address: null,
      filterModal: true,
      officerdata: [],
      appState: "active",
      selection: {
        start: 0,
        end: 0,
      },
    };
  }

  _getInitialUrl = async () => {
    const url = dynamicLinks().onLink(this.handleDynamicLink);
  };
  componentWillUnmount() {
    AppState.removeEventListener("change", this._handleAppStateChange);
  }

  _handleAppStateChange = async (nextAppState) => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      this._getInitialUrl();
    }
    this.setState({ appState: nextAppState });
  };
  handleDynamicLink = (link) => {
    if (link.url) {
      this.props.navigation.navigate("SubmitOfficer", {
        link: link,
        editable: true,
      });
    }
  };
  componentDidMount = () => {
    this._getInitialUrl();
    AppState.addEventListener("change", this._handleAppStateChange);

    dynamicLinks()
      .getInitialLink()
      .then((link) => {
        if (link) {
          console.log("Loginlink", link);
          this.props.navigation.navigate("SubmitOfficer", {
            link,
            editable: true,
          });
        }
        console.log("Homelinklink", link);
      });
    this.getLocation();
    this.GetOfficerDetail();
  };
  onStarRatingPress(rating) {
    this.setState({
      starCount: rating,
    });
  }
  getAddress() {
    Geocoder.init("AIzaSyCJDORIshFYTnm0p5geFHPcJy7YBlQTuKA", {
      language: "en",
    }); // set the language
    Geocoder.from(this.state.currentLatitude, this.state.currentLongitude)
      .then((json) => {
        // console.log("address json", json);
        var addressComponent = json.results[0].formatted_address;
        this.setState({
          formatted_address: addressComponent,
        });
      })
      .catch((error) => console.warn(error));
  }
  hasLocationPermissionIOS = async () => {
    const openSetting = () => {
      Linking.openSettings().catch(() => {
        Alert.alert("Unable to open settings");
      });
    };
    const status = await Geolocation.requestAuthorization("whenInUse");
    if (status === "granted") {
      return true;
    }

    if (status === "denied") {
      Alert.alert(
        `Turn on Location Services to allow pickuppro to determine your location.`,
        "",
        [
          {
            text: "Don't Use Location",
            onPress: () => {
              BackHandler.exitApp();
            },
          },
        ]
      );

      console.log("denied");
    }

    if (status === "disabled") {
      Alert.alert(
        `Turn on Location Services to allow pickuppro to determine your location.`,
        "",
        [
          { text: "Go to Settings", onPress: openSetting },
          {
            text: "Don't Use Location",
            onPress: () => {
              BackHandler.exitApp();
            },
          },
        ]
      );

      console.log("disable");
    }

    return false;
  };

  hasLocationPermission = async () => {
    if (Platform.OS === "ios") {
      const hasPermission = await this.hasLocationPermissionIOS();
      return hasPermission;
    }

    if (Platform.OS === "android" && Platform.Version < 23) {
      return true;
    }

    const hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );

    if (hasPermission) {
      return true;
    }

    const status = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );

    if (status === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    }

    if (status === PermissionsAndroid.RESULTS.DENIED) {
      ToastAndroid.show(
        "Location permission denied by user.",
        ToastAndroid.LONG
      );
    } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      ToastAndroid.show(
        "Location permission revoked by user.",
        ToastAndroid.LONG
      );
    }

    return false;
  };

  getLocation = async () => {
    const hasLocationPermission = await this.hasLocationPermission();

    if (!hasLocationPermission) {
      console.log("POst");
      return;
    }

    this.setState({ isLoading: true }, () => {
      // Geolocation.requestAuthorization("always");
      Geolocation.getCurrentPosition(
        (position) => {
          // console.log("positionposition", position);
          this.setState(
            {
              currentLatitude: position.coords.latitude,
              currentLongitude: position.coords.longitude,
              isLoading: false,
            },
            () => this.saveLocation()
          );
        },
        (error) => {
          this.setState({ isLoading: false });
          console.log("loction time out", error);
          alert("Unable to find location");
        },
        {
          accuracy: {
            android: "high",
            ios: "best",
          },
          enableHighAccuracy: this.state.highAccuracy,
          // timeout: 15000,
          // maximumAge: 10000,
          distanceFilter: 0,
          forceRequestLocation: this.state.forceLocation,
          showLocationDialog: this.state.showLocationDialog,
        }
      );
    });
  };
  saveLocation = async () => {
    const { currentLatitude, currentLongitude } = this.state;
    try {
      const latitude = ["latitude", JSON.stringify(currentLatitude)];
      const longitude = ["longitude", JSON.stringify(currentLongitude)];
      this.props.setLatitude(latitude);
      this.props.setLongitude(longitude);
      await AsyncStorage.multiSet([latitude, longitude]);
      this.getAddress();
      // console.log("Set: ", latitude, longitude);
    } catch (error) {
      console.log(" Location error ", error);
    }
  };
  renderImportModal = () => {
    return (
      <Modal
        animationType={"fade"}
        transparent={true}
        isVisible={this.state.filterModal}
        avoidKeyboard={false}
        style={{ justifyContent: "center", alignItems: "center" }}
      >
        <View
          style={{
            backgroundColor: "#ffffff",
            // backgroundColor: "pink",
            // backgroundColor: "#ffffff",
            // marginHorizontal: 20,
            // marginTop: modalMargin,
            // borderWidth: 1,
            height: 400,
          }}
        >
          <View
            style={{
              // marginTop: 20,
              //   paddingVertical: 10,
              //   backgroundColor: "pink",
              // justifyContent: "flex-end",
              // flexDirection: "row",
              paddingHorizontal: 20,
              backgroundColor: "#4169e1",
              height: "50%",
            }}
          >
            <View
              style={{
                justifyContent: "flex-end",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                style={{ marginTop: 20 }}
                onPress={() =>
                  this.setState({
                    filterModal: !this.state.filterModal,
                  })
                }
              >
                <Entypo name="cross" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
            <View
              style={{
                // backgroundColor: "pink",
                height: 150,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Image
                style={{ width: 100, height: 100 }}
                resizeMode="stretch"
                source={require("../../assets/Images/communiv/emergency/emergency/icon1.jpg")}
              />
            </View>
          </View>
          <View
            style={{
              // justifyContent: "center",
              // alignItems: "center",
              paddingHorizontal: 20,
              // backgroundColor: "red",
              height: 150,
            }}
          >
            <View>
              <View style={{ flexDirection: "row" }}>
                <Text style={{ lineHeight: 30 }}>In an emergency,</Text>
                <Text style={{ lineHeight: 30, color: "#4169e1" }}>
                  {" "}
                  DIAL 911{" "}
                </Text>
                <Text style={{ lineHeight: 30 }}>or your local</Text>
              </View>
              <Text style={{ lineHeight: 30 }}>
                emergency number immediately. An emergency is any situation that
                requires immediate assistance from the police, fire department
                or ambulance.
              </Text>
            </View>
          </View>
        </View>
      </Modal>
    );
  };
  OpenModal = () => {
    this.setState({
      filterModal: true,
    });
  };
  GetOfficerDetail = async () => {
    this.setState({ isLoading: true });
    let data = {
      Type: 2,
    };
    console.log("high rated officer data", data, this.props.token);
    await getofficerlist(data, this.props.token)
      .then((res) => {
        console.log("high rated officer", res[0]);
        this.setState({
          officerdata: res[0],
        });
        // this.setState({ officerdata: res[0], isLoading: false });
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status == 500) {
            alert(error.response.data.Message);
          }
          this.setState({ isLoading: false });
          console.log("responce_error", error.response.status);
        } else if (error.request) {
          this.setState({ isLoading: false });
          console.log("request error", error.request);
        } else if (error) {
          console.log("Server Error");
          this.setState({ isLoading: false });
        }
      });
  };
  SelectOfficer = (item) => {
    this.props.setOfficer(item);
    console.log("itemitemitemitem", item);
    this.props.navigation.navigate("OfficerDetail");
  };
  render() {
    return (
      <SafeAreaView
        style={{
          backgroundColor: "#F7F7F7",
          height: "100%",
          flex: 1,
        }}
      >
        <View>
          <Header
            search={true}
            notification={true}
            navigation={this.props.navigation}
            onPress={() =>
              this.props.navigation.navigate("OfficerList", {
                id: 0,
                show: true,
              })
            }
          />
          <ScrollView>
            <View style={{ marginBottom: 100 }}>
              <View
                style={{
                  flexDirection: "row",
                  //   justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#fff",
                  paddingLeft: 20,
                }}
              >
                <Ionicons name="location" size={30} />
                <TextInput
                  style={{ height: 50, paddingLeft: 10 }}
                  placeholder="My Current Location"
                  placeholderTextColor="gray"
                  // onChangeText={onChangeText}
                  value={this.state.formatted_address}
                  editable={false}
                  selection={this.state.selection}
                />
              </View>
              <View
                style={{
                  marginLeft: 10,
                  marginRight: 20,
                  flexDirection: "row",
                }}
              >
                <HomeIcon
                  onPress={() =>
                    this.props.navigation.navigate("OfficerList", { id: 10 })
                  }
                  title="SPECIAL ALERT"
                  text1="Notify your local"
                  text2="department of any"
                  image={require("../../assets/Images/communiv/library/home-screen/icon-1.png")}
                />
                <HomeIcon
                  onPress={() =>
                    this.props.navigation.navigate("OfficerList", { id: 7 })
                  }
                  title="AREA"
                  text1="Request 0fficer"
                  text2="in your"
                  image={require("../../assets/Images/icons/icon-3.png")}
                />
              </View>
              <View
                style={{
                  marginLeft: 10,
                  marginRight: 20,
                  flexDirection: "row",
                }}
              >
                <HomeIcon
                  onPress={() =>
                    this.props.navigation.navigate("OfficerList", { id: 6 })
                  }
                  title="OFFICER"
                  text1="Crisis intervention"
                  text2="trained"
                  image={require("../../assets/Images/communiv/library/home-screen/icon-3.png")}
                />
                <HomeIcon
                  onPress={() =>
                    this.props.navigation.navigate("OfficerList", { id: 11 })
                  }
                  title="OFFICER"
                  text1="Request a school"
                  text2="resource"
                  image={require("../../assets/Images/communiv/library/home-screen/icon-4.png")}
                />
              </View>
              <View
                style={{
                  marginLeft: 10,
                  marginRight: 20,
                  flexDirection: "row",
                }}
              >
                <HomeIcon
                  onPress={() =>
                    this.props.navigation.navigate("OfficerList", { id: 8 })
                  }
                  title="OFFICER"
                  text1="Request domestic"
                  text2="Violence"
                  image={require("../../assets/Images/icons/icon-5.png")}
                />
                <HomeIcon
                  onPress={() =>
                    this.props.navigation.navigate("OfficerList", { id: 9 })
                  }
                  title="OFFICER"
                  text1="Request bilingual"
                  text2="speaking"
                  image={require("../../assets/Images/icons/icon-6.png")}
                />
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: "90%",
                  alignItems: "center",
                  // backgroundColor: "pink",
                  margin: 20,
                  marginTop: 30,
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Octicons name="primitive-dot" size={20} />
                  <Text
                    style={{ fontWeight: "bold", marginLeft: 10, fontSize: 15 }}
                  >
                    High Rating Officer{" "}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate("OfficerList", {
                      id: 0,
                      show: false,
                    })
                  }
                >
                  <Text style={{ color: "gray",textDecorationLine:"underline" }}>View all</Text>
                </TouchableOpacity>
              </View>
              <FlatList
                numColumns={2}
                data={this.state.officerdata}
                renderItem={({ item, index }) => (
                  <TouchableOpacity
                    onPress={() => this.SelectOfficer(item)}
                    style={{
                      marginHorizontal: 10,
                      marginTop: 70,
                      backgroundColor: "#fff",
                      borderRadius: 10,
                      borderWidth: 1,
                      borderColor: "blue",
                      padding: 20,
                      width: "45%",
                    }}
                  >
                    <View
                      style={{
                        width: 90,
                        height: 90,
                        borderRadius: 50,
                        borderColor: "blue",
                        borderWidth: 1,
                        position: "absolute",
                        top: -50,
                        right: "30%",
                        backgroundColor: "#fff",
                      }}
                    >
                      <Image
                        style={{
                          width: 90,
                          height: 90,
                          borderRadius: 50,
                        }}
                        resizeMode="stretch"
                        source={require("../../assets/Images/communiv/library/home-screen/icon-3.png")}
                      />
                    </View>
                    <View
                      style={{
                        marginTop: 30,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Text style={{ color: "#4169e1" }}>
                        {item.Off_BadgeNumber}
                      </Text>
                      <StarRating
                        disabled={true}
                        maxStars={5}
                        rating={item.Off_Rating}
                        starSize={20}
                        emptyStarColor={"#FD9D26"}
                        fullStarColor={"#FD9D26"}
                        // selectedStar={(rating) =>
                        //   this.onStarRatingPress1(rating)
                        // }
                      />
                    </View>
                    <Text
                      style={{
                        textAlign: "center",
                        textTransform: "capitalize",
                      }}
                    >
                      {item.Off_Name}
                    </Text>
                  </TouchableOpacity>
                )}
                keyExtractor={(item) => item.Off_Pkey}
              />
            </View>
          </ScrollView>
          {this.renderImportModal()}
        </View>
      </SafeAreaView>
    );
  }
}
const mapStateToProps = (state, ownProps) => ({
  token: state.authReducer.token,
  // parentid: state.parentidReducer.parentid,
});

const mapDispatchToProps = {
  setToken,
  setLatitude,
  setLongitude,
  setOfficer,
};
export default connect(mapStateToProps, mapDispatchToProps)(Home);
