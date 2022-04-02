import React, { Component } from "react";
import {
  Text,
  View,
  Image,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Platform,
  PermissionsAndroid,
  Alert,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Entypo from "react-native-vector-icons/Entypo";
import Spinner from "react-native-loading-spinner-overlay";
import { RadioButton } from "react-native-paper";
import { register } from "../utils/apiconfig";
import Geolocation from "react-native-geolocation-service";
import AsyncStorage from "@react-native-async-storage/async-storage";
import qs from "qs";
import CustomButton from "../CustomComponent/CustomButton";
import SocialLogin from "../CustomComponent/SocialLogin";
import { connect } from "react-redux";
import {
  setLoggedIn,
  setToken,
  setUserType,
} from "../store/action/auth/action";
class SignUp extends Component {
  constructor() {
    super();
    this.state = {
      isShowPassword: true,
      isShowCPassword: true,
      username: null,
      password: null,
      // username: "jainminals@gmail.com",
      // password: "12345",
      // firstname: "minal",
      // cpassword: "12345",
      // phonenumber: "1234567890",

      username: null,
      password: null,
      firstname: null,
      cpassword: null,
      phonenumber: null,
      ErrorUserName: null,
      ErrorPassword: null,
      ErrorUserEmail: null,
      ErrorFirstName: null,
      clientid: 2,
      role: 2,
      isLoading: false,
      grant_type: "password",
      access_token: "",
      forceLocation: true,
      highAccuracy: true,
      location: {},
      currentLatitude: 0,
      currentLongitude: 0,
      showLocationDialog: false,
      msgtoken: null,
      checked: "first",
      ErrorCPassword: null,
    };
  }
  componentDidMount() {
    this.getLocation();
  }
  hasLocationPermissionIOS = async () => {
    const openSetting = () => {
      Linking.openSettings().catch(() => {
        Alert.alert("Unable to open settings");
      });
    };
    const status = await Geolocation.requestAuthorization("whenInUse");
    console.log("Check");
    if (status === "granted") {
      console.log("granted");
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
  // showMessage = (message) => {
  //   if (message !== "" && message !== null && message !== undefined) {
  //     Toast.show({
  //       text: message,
  //       duration: 5000,
  //     });
  //   }
  // };
  saveLocation = async () => {
    const { currentLatitude, currentLongitude } = this.state;
    try {
      const latitude = ["latitude", JSON.stringify(currentLatitude)];
      const longitude = ["longitude", JSON.stringify(currentLongitude)];
      await AsyncStorage.multiSet([latitude, longitude]);
      console.log("Set: ", latitude, longitude);
    } catch (error) {
      console.log(" Location error ", error);
    }
  };
  onUsernameChange = (username) => {
    this.setState({ username });
  };
  onPhoneNumberChange = (phonenumber) => {
    let value = phonenumber;
    value = value.replace(/[^0-9]/gi, "");
    this.setState({ phonenumber: value });
  };

  onCPasswordChange = (cpassword) => {
    this.setState({ cpassword });
  };
  onFirstNameChange = (firstname) => {
    let value = firstname;
    value = value.replace(/[^A-Za-z ]/gi, "");
    this.setState({ firstname: value });
  };
  onPasswordChange = (password) => {
    this.setState({ password });
  };
  managePasswordVisibility = () => {
    this.setState({ isShowPassword: !this.state.isShowPassword });
  };
  manageCPasswordVisibility = () => {
    this.setState({ isShowCPassword: !this.state.isShowCPassword });
  };
  Validation = () => {
    const { username, password, firstname, cpassword, phonenumber } =
      this.state;
    this.setState({ isLoading: false });
    // debugger;
    const invalidFields = [];

    if (!username) {
      invalidFields.push("username");
      this.setState({ ErrorUserName: "Email address is required" });
    } else {
      console.log("else");
      this.setState({ ErrorUserName: null });
    }

    if (!firstname) {
      invalidFields.push("password");
      this.setState({ ErrorFirstName: "Name is required" });
    } else {
      this.setState({ ErrorFirstName: null });
    }
    if (!password) {
      invalidFields.push("password");
      this.setState({ ErrorPassword: "Password is required" });
    } else {
      this.setState({ ErrorPassword: null });
    }
    if (!cpassword) {
      invalidFields.push("ErrorCPassword");
      this.setState({ ErrorCPassword: "Confirm Password is required" });
    } else {
      this.setState({ ErrorCPassword: null });
    }
    if (cpassword != password) {
      invalidFields.push("ErrorCPassword2");
      this.setState({
        ErrorCPassword2: "Confirm Password and Password does not match",
      });
    } else {
      this.setState({ ErrorCPassword2: null });
    }
    if (!phonenumber) {
      invalidFields.push("ErrorPhoneNumber");
      this.setState({ ErrorPhoneNumber: "Phone Number is required" });
    } else {
      this.setState({ ErrorPhoneNumber: null });
    }
    if (phonenumber && phonenumber.length != 10) {
      invalidFields.push("ErrorPhoneNumber");
      this.setState({ ErrorPhoneDigit: "Phone Number required 10 digits" });
    } else {
      this.setState({ ErrorPhoneDigit: null });
    }

    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(username) === false && username) {
      invalidFields.push("ErrorUserEmail");
      this.setState({ ErrorUserEmail: "Please enter valid email" });
    } else {
      this.setState({ ErrorUserEmail: null });
    }
    return invalidFields.length > 0;
  };

  onHandleSignUP = async () => {
    // this.setState({ isLoading: true });
    const validate = this.Validation();
    console.log("validate", validate);
    if (!validate) {
      const {
        username,
        password,
        firstname,
        clientid,
        phonenumber,
        grant_type,
        currentLatitude,
        currentLongitude,
        role,
      } = this.state;

      // this.setState({ isLoading: true });
      let data = qs.stringify({
        grant_type: grant_type,
        UserName: username,
        Password: password,
        ClientId: clientid,
        Role: role,
        FirstName: firstname,
        latitude: currentLatitude,
        longitude: currentLongitude,
        MobileNumber: phonenumber,
        User_IsActive: 1,
      });
      console.log(data);
      await register(data)
        .then((res) => {
          console.log("res: ", JSON.stringify(res));
          console.log("res:123", res.access_token);
          this.setState({ isLoading: false, access_token: res.access_token });
          const token = res.access_token;
          AsyncStorage.setItem("token", token);
          this.props.navigation.navigate("Home");
          this.props.setToken(res.access_token);
          this.props.setLoggedIn(true);
          this.props.setUserType(false);
        })
        .catch((error) => {
          if (error.response) {
            console.log(error.response);
            console.log("responce_error", error.response.data.error);
            if (error.response.data.error == "-99") {
              alert("The UserEmail Already Exist.");
              // this.showMessage("The UserEmail Already Exist.");
            }

            if (error.response.data.error == "0") {
              alert("The Email ID or password is incorrect.");

              // this.showMessage("The Email ID or password is incorrect.");
              this.setState({ isLoading: false });
            }
          } else if (error.request) {
            this.setState({ isLoading: false });
            console.log("request error", error.request);
          } else if (error) {
            alert("Server Error");

            // this.showMessage("Server Error.");

            this.setState({ isLoading: false });
          }
        });
    }
  };
  onHandleFaceBook = () => {
    alert("face book");
  };
  onHandleGmail = () => {
    alert("gmail");
  };
  onHandleTwitter = () => {
    alert("Twitter");
  };
  render() {
    // console.log(this.state.isShowPassword)
    const {
      isLoading,
      username,
      password,
      ErrorPassword,
      isShowPassword,
      isShowCPassword,
      ErrorUserName,
      ErrorUserEmail,
      checked,
      ErrorFirstName,
      firstname,
      cpassword,
      ErrorCPassword,
      phonenumber,
      ErrorPhoneDigit,
      ErrorCPassword2,
      ErrorPhoneNumber,
    } = this.state;

    return (
      <SafeAreaView style={{ backgroundColor: "#fff", height: "100%" }}>
        <ScrollView>
          <Spinner visible={isLoading} />

          <View style={{ marginBottom: 100 }}>
            <View
              style={{
                marginHorizontal: 20,
                backgroundColor: "#fff",
              }}
            >
              <TouchableOpacity
                onPress={() => this.props.navigation.goBack()}
                style={{
                  backgroundColor: "#4169e1",
                  width: "8%",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 8,
                  marginTop: 20,
                }}
              >
                <FontAwesome name="chevron-left" size={20} color="#fff" />
              </TouchableOpacity>
              <View
                style={{
                  // backgroundColor: 'pink',
                  alignItems: "center",
                }}
              >
                <Text style={{ fontWeight: "bold", color: "#4169e1" }}>
                  SIGNUP NOW
                </Text>
              </View>
              <View
                style={{
                  // backgroundColor: 'pink',
                  marginTop: 10,
                  alignItems: "center",
                }}
              >
                <Text style={{ fontSize: 12, color: "gray" }}>
                  It's easier to sign up now
                </Text>
              </View>

              <View
                style={{
                  // backgroundColor: 'pink',
                  borderBottomColor: "lightgray",
                  borderBottomWidth: 1,
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 20,
                }}
              >
                <MaterialCommunityIcons
                  name="account-circle"
                  size={20}
                  //   style={{ marginRight: 20 }}
                  color="#4169e1"
                />
                <TextInput
                  placeholder="Name"
                  placeholderTextColor="#565656"
                  style={{
                    width: "90%",
                    paddingLeft: 15,
                    backgroundColor: "#fff",
                    height: 50,
                  }}
                  onChangeText={this.onFirstNameChange}
                  value={firstname}
                />
              </View>
              <View style={{ width: "90%" }}>
                {ErrorFirstName && (
                  <Text style={{ color: "red", marginTop: 5, marginRight: 30 }}>
                    {ErrorFirstName}
                  </Text>
                )}
              </View>

              <View
                style={{
                  // backgroundColor: 'pink',
                  borderBottomColor: "lightgray",
                  borderBottomWidth: 1,
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 20,
                }}
              >
                <MaterialCommunityIcons
                  name="email"
                  size={20}
                  //   style={{ marginRight: 20 }}
                  color="#4169e1"
                />
                <TextInput
                  placeholder="Email ID"
                  placeholderTextColor="#565656"
                  keyboardType="email-address"
                  style={{
                    width: "90%",
                    paddingLeft: 15,
                    backgroundColor: "#fff",
                    height: 50,
                  }}
                  onChangeText={this.onUsernameChange}
                  value={username}
                />
              </View>
              <View style={{ width: "90%" }}>
                {ErrorUserName && (
                  <Text style={{ color: "red", marginTop: 5, marginRight: 30 }}>
                    {ErrorUserName}
                  </Text>
                )}
              </View>
              <View style={{ width: "90%" }}>
                {ErrorUserEmail && (
                  <Text style={{ color: "red", marginTop: 5, marginRight: 30 }}>
                    {ErrorUserEmail}
                  </Text>
                )}
              </View>
              <View
                style={{
                  // backgroundColor: 'pink',
                  borderBottomColor: "lightgray",
                  borderBottomWidth: 1,
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 20,
                }}
              >
                <MaterialCommunityIcons
                  name="lock"
                  size={20}
                  //   style={{ marginRight: 20 }}
                  color="#4169e1"
                />
                <TextInput
                  value={password}
                  placeholder="Password"
                  placeholderTextColor="#565656"
                  onChangeText={this.onPasswordChange}
                  style={{
                    width: "85%",
                    paddingLeft: 15,
                    backgroundColor: "#fff",
                    height: 50,
                  }}
                  secureTextEntry={isShowPassword}
                />
                <TouchableOpacity
                  onPress={() => this.managePasswordVisibility()}
                >
                  {isShowPassword ? (
                    <FontAwesome name="eye" size={20} />
                  ) : (
                    <FontAwesome name="eye-slash" size={20} />
                  )}
                </TouchableOpacity>
              </View>
              <View style={{ width: "90%" }}>
                {ErrorPassword && (
                  <Text style={{ color: "red", marginTop: 5, marginRight: 30 }}>
                    {ErrorPassword}
                  </Text>
                )}
              </View>
              <View
                style={{
                  // backgroundColor: 'pink',
                  borderBottomColor: "lightgray",
                  borderBottomWidth: 1,
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 20,
                }}
              >
                <MaterialCommunityIcons
                  name="lock"
                  size={20}
                  //   style={{ marginRight: 20 }}
                  color="#4169e1"
                />
                <TextInput
                  placeholder="Confirm Password"
                  placeholderTextColor="#565656"
                  style={{
                    width: "85%",
                    paddingLeft: 15,
                    backgroundColor: "#fff",
                    height: 50,
                  }}
                  onChangeText={this.onCPasswordChange}
                  secureTextEntry={isShowCPassword}
                />
                <TouchableOpacity
                  onPress={() => this.manageCPasswordVisibility()}
                >
                  {isShowCPassword ? (
                    <FontAwesome name="eye" size={20} />
                  ) : (
                    <FontAwesome name="eye-slash" size={20} />
                  )}
                </TouchableOpacity>
              </View>
              <View style={{ width: "90%" }}>
                {ErrorCPassword && (
                  <Text style={{ color: "red", marginTop: 5, marginRight: 30 }}>
                    {ErrorCPassword}
                  </Text>
                )}
              </View>
              <View style={{ width: "90%" }}>
                {ErrorCPassword2 && (
                  <Text style={{ color: "red", marginTop: 5, marginRight: 30 }}>
                    {ErrorCPassword2}
                  </Text>
                )}
              </View>
              <View
                style={{
                  // backgroundColor: 'pink',
                  borderBottomColor: "lightgray",
                  borderBottomWidth: 1,
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 20,
                }}
              >
                <MaterialCommunityIcons
                  name="phone"
                  size={20}
                  //   style={{ marginRight: 20 }}
                  color="#4169e1"
                />
                <TextInput
                  placeholder="Phone Number"
                  placeholderTextColor="#565656"
                  keyboardType="email-address"
                  style={{
                    width: "90%",
                    paddingLeft: 15,
                    backgroundColor: "#fff",
                    height: 50,
                  }}
                  onChangeText={this.onPhoneNumberChange}
                  value={phonenumber}
                />
              </View>
              <View style={{ width: "90%" }}>
                {ErrorPhoneNumber && (
                  <Text style={{ color: "red", marginTop: 5, marginRight: 30 }}>
                    {ErrorPhoneNumber}
                  </Text>
                )}
              </View>
              <View style={{ width: "90%" }}>
                {ErrorPhoneDigit && (
                  <Text style={{ color: "red", marginTop: 5, marginRight: 30 }}>
                    {ErrorPhoneDigit}
                  </Text>
                )}
              </View>
            </View>
            {/* <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginHorizontal: 20,
                alignItems: 'center',
                width: '50%',
                // backgroundColor: 'pink',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 20,
                }}>
                <RadioButton
                  value="first"
                  color={'#4169e1'}
                  uncheckedColor={'#4169e1'}
                  status={checked === 'first' ? 'checked' : 'unchecked'}
                  onPress={() =>
                    this.setState({
                      checked: 'first',
                    })
                  }
                />
                <Text>Other</Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 20,
                }}>
                <RadioButton
                  value="second"
                  uncheckedColor={'#4169e1'}
                  color={'#4169e1'}
                  status={checked === 'second' ? 'checked' : 'unchecked'}
                  onPress={() =>
                    this.setState({
                      checked: 'second',
                    })
                  }
                />
                <Text>User</Text>
              </View>
            </View> */}
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <CustomButton
                onPress={() => this.onHandleSignUP()}
                title={"SIGNUP"}
                width={"80%"}
              />

              <View
                style={{
                  flexDirection: "row",
                  marginTop: 20,
                  // paddingHorizontal: 70,
                  // backgroundColor: "pink",
                }}
              >
                <Text style={{ color: "gray" }}>
                  By signing up you agree to our{" "}
                </Text>
                <TouchableOpacity>
                  <Text style={{ color: "#4169e1" }}>terms & condition </Text>
                </TouchableOpacity>
              </View>
              <SocialLogin
                onPressFacebook={() => this.onHandleFaceBook()}
                onPressGmail={() => this.onHandleGmail()}
                onPressTwitter={() => this.onHandleTwitter()}
              />
              {/* <View style={{ marginTop: 30, marginBottom: 10 }}>
                <Text style={{ color: "#4169e1", fontWeight: "bold" }}>
                  OR Connect with
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  width: "50%",
                  // backgroundColor: 'pink',
                  justifyContent: "space-between",
                }}
              >
                <TouchableOpacity
                  style={{
                    borderColor: "#39579B",
                    borderWidth: 2,
                    borderRadius: 50,
                    padding: 3,
                  }}
                >
                  <Entypo
                    name="facebook-with-circle"
                    size={40}
                    color={"#39579B"}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    borderColor: "#3F99FE",
                    borderWidth: 2,
                    borderRadius: 50,
                    padding: 3,
                  }}
                >
                  <Entypo
                    name="twitter-with-circle"
                    size={40}
                    color={"#3F99FE"}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    borderColor: "#DC4B38",
                    borderWidth: 2,
                    borderRadius: 50,
                    padding: 3,
                  }}
                >
                  <Entypo
                    name="google--with-circle"
                    size={40}
                    color={"#DC4B38"}
                  />
                </TouchableOpacity>
              </View> */}
              <View style={{ flexDirection: "row", marginTop: 20 }}>
                <Text style={{ color: "gray" }}>
                  Already have an account ?{" "}
                </Text>
                <TouchableOpacity
                  onPress={() => this.props.navigation.navigate("Login")}
                >
                  <Text style={{ color: "#4169e1" }}>Sign in</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}
const mapStateToProps = (state, ownProps) => ({
  // contacts: state.contactReducer.contacts,
  // parentid: state.parentidReducer.parentid,
});

const mapDispatchToProps = {
  setLoggedIn,
  setToken,
  setUserType,
};
export default connect(mapStateToProps, mapDispatchToProps)(SignUp);
