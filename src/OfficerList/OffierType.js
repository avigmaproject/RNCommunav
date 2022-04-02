import React, { Component } from "react";
import {
  Text,
  View,
  SafeAreaView,
  Alert,
  Platform,
  PermissionsAndroid,
  Linking,
} from "react-native";
import LibraryCustom from "../CustomComponent/LibraryCustom";
import Header from "../CustomComponent/Header";
import CustomComponent2 from "../CustomComponent/CustomComponent2";
import { connect } from "react-redux";
import { createcall } from "../utils/apiconfig";
import Spinner from "react-native-loading-spinner-overlay";
import Geolocation from "react-native-geolocation-service";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setLatitude, setLongitude } from "../store/action/Location/action";
import moment from "moment";
import Geocoder from "react-native-geocoding";

class OffierType extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      forceLocation: true,
      highAccuracy: true,
      currentLatitude: 0,
      currentLongitude: 0,
      showLocationDialog: false,
      toggleCheckBox: true,
      responce: 0,
      formatted_address: "",
      short_address: "",
    };
  }
  componentDidMount() {
    this.focusListener = this.props.navigation.addListener(
      "focus",
      async () => {
        this.setState({ toggleCheckBox: true });
      }
    );
    this.getLocation();
  }
  hasLocationPermissionIOS = async () => {
    const openSetting = () => {
      Linking.openSettings().catch(() => {
        Alert.alert("Unable to open settings");
      });
    };
    const status = await Geolocation.requestAuthorization("whenInUse");
    // console.log("Check");
    if (status === "granted") {
      // console.log("granted");
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
          // this.showMessage("Unable to find location");
        },
        {
          accuracy: {
            android: "high",
            ios: "best",
          },
          enableHighAccuracy: this.state.highAccuracy,
          timeout: 15000,
          maximumAge: 10000,
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

      console.log("Set: ", latitude, longitude);
    } catch (error) {
      console.log(" Location error ", error);
    }
  };
  getAddress = async () => {
    this.setState({ isLoading: true });
    Geocoder.init("AIzaSyCJDORIshFYTnm0p5geFHPcJy7YBlQTuKA", {
      language: "en",
    }); // set the language
    await Geocoder.from(this.state.currentLatitude, this.state.currentLongitude)
      .then((json) => {
        // console.log("address json", json);
        var addressComponent = json.results[0].formatted_address;
        var short_address =
          json.results[0].address_components[1].long_name +
          " " +
          json.results[0].address_components[2].long_name;

        this.setState({
          formatted_address: addressComponent,
          short_address,
        });
        this.setState({ isLoading: false });
        console.log("addressComponent", short_address);
      })
      .catch((error) => {
        alert(error.message);
        console.log(error.message);
        alert("Unable to get Location");
        // setInterval(() => {
        this.props.navigation.goBack();
        // }, 100);
      });
  };
  SelectOption = async (item, text) => {
    this.setState({
      responce: item,
      toggleCheckBox: false,
    });
    alert(
      `Your response time is selected. You have confirmed with ${text}. Click on submit to place a call.`
    );
  };
  OnHnadleSubmit = async () => {
    this.setState({ isLoading: true });
    let data = {
      Type: 1,
      Offuc_latitude: this.state.currentLatitude,
      Offuc_longitude: this.state.currentLongitude,
      Offuc_IsRead: 0,
      Offuc_ResponseType: this.state.responce,
      Offuc_Off_PkeyID: this.props.officer.Off_Pkey,
      Offuc_User_PkeyID: this.props.profile.User_PkeyID,
      Offuc_ResponseCalltime: moment().format(),
      Offuc_Address: this.state.formatted_address,
      Offuc_Short_Address: this.state.short_address,
      Offuc_Calldatetime: moment().format(),
    };
    console.log("Offuc_ResponseCalltime", data);
    await createcall(data, this.props.token)
      .then((res) => {
        console.log("hiiiii", res);
        this.setState({ isLoading: false, toggleCheckBox: false });
        alert("Successfully added");
        this.props.navigation.navigate("Home");
      })
      .catch((error) => {
        if (error.response) {
          this.setState({ isLoading: false });
          console.log("responce_error", error.response);
        } else if (error.request) {
          this.setState({ isLoading: false });
          console.log("request error", error.request);
        } else if (error) {
          alert("Server Error");
          this.setState({ isLoading: false });
        }
      });
  };
  ImmediateCall = async () => {
    Linking.openURL(`tel: 9732800699`);
  };
  render() {
    // console.log("=====>", this.props.profile.User_PkeyID);
    return (
      <SafeAreaView
        style={{
          backgroundColor: "#F7F7F7",
          height: "100%",
          flex: 1,
        }}
      >
        <Spinner visible={this.state.isLoading} />

        <Header
          back={false}
          drawer={true}
          notification={true}
          navigation={this.props.navigation}
        />
        <View>
          <View
            style={{
              marginTop: 20,
              // backgroundColor: "pink",
              height: 50,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>
              CHOOSE REPONSE TIME
            </Text>
          </View>
          <LibraryCustom
            onPress={() => this.ImmediateCall()}
            padding={30}
            text={"IMMEDIATE RESPONSE"}
            image={require("../../assets/Images/communiv/emergency/response/icon-1.png")}
          />
          <LibraryCustom
            onPress={() => this.SelectOption(2, "TWO OR THREE HOURS")}
            padding={30}
            text={"TWO OR THREE HOURS"}
            image={require("../../assets/Images/communiv/emergency/response/icon-2.png")}
          />
          <LibraryCustom
            onPress={() => this.SelectOption(3, "AVAILABILITY OF OFFICER")}
            padding={30}
            text={"AVAILABILITY OF OFFICER"}
            image={require("../../assets/Images/communiv/emergency/response/icon-3.png")}
          />

          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              marginRight: 20,
              marginTop: 20,
            }}
          >
            <CustomComponent2
              onPress={() => this.OnHnadleSubmit()}
              next={true}
              toggleCheckBox={this.state.toggleCheckBox}
              title={"SUBMIT"}
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }
}
const mapStateToProps = (state, ownProps) => ({
  officer: state.officerReducer.officer,
  token: state.authReducer.token,
  profile: state.profileReducer.profile,
});

const mapDispatchToProps = { setLatitude, setLongitude };
export default connect(mapStateToProps, mapDispatchToProps)(OffierType);
