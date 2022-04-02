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
  ToastAndroid,
  Linking,
  AppState,
  Alert,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Entypo from "react-native-vector-icons/Entypo";
import Spinner from "react-native-loading-spinner-overlay";
import Geolocation from "react-native-geolocation-service";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  login,
  addusermasterdata,
  updateofficerprofile,
} from "../utils/apiconfig";
// import { Toast } from "native-base";
import qs from "qs";
import { connect } from "react-redux";
import {
  setLoggedIn,
  setToken,
  setUserType,
} from "../store/action/auth/action";
import { setProfile } from "../store/action/Profile/action";
import CustomButton from "../CustomComponent/CustomButton";
import SocialLogin from "../CustomComponent/SocialLogin";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import messaging from "@react-native-firebase/messaging";
import firebase from "@react-native-firebase/app";
import dynamicLinks from "@react-native-firebase/dynamic-links";
import { LoginManager, AccessToken, LoginButton } from "react-native-fbsdk";
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from "@react-native-google-signin/google-signin";
class Login extends Component {
  constructor() {
    super();
    this.state = {
      isShowPassword: true,
      username: null,
      password: null,
      // username: "Jainminal@gmail.com",
      // password: "12345",
      // usertype: false,

      // username: "deepak@gmail.com",
      // password: "12345",
      // usertype: false,

      // username: "raj@gmail.com",
      // password: "1008",
      // usertype: true,

      // username: "jigisha@gmail.com",

      username: "jainminals@gmail.com",
      password: "Jigish@123",
      usertype: true,
      username: "jainminals@gmail.com",
      password: "1008",
      usertype: false,
      firstname: null,
      ErrorUserName: null,
      ErrorPassword: null,
      ErrorUserEmail: null,
      clientid: 1,
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
      appState: "active",

      // username: "Minal@gmail.com",
      // password: "minal@123",
      // usertype: false,
      // firstname: "minal",
    };
  }
  signIn = async () => {
    this.setState({ isLoading: true });

    await GoogleSignin.signOut();
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      // console.log("userInfoGoogleSignin", userInfo);
      // console.log("idToken", userInfo.idToken);
      let data = qs.stringify({
        grant_type: this.state.grant_type,
        username: userInfo.user.email,
        password: "",
        ClientId: 5,
        FirstName: "communav",
        latitude: this.state.currentLatitude,
        longitude: this.state.currentLongitude,
        Role: 2,
        User_Login_Type: 2,
        User_Token_val: userInfo.idToken,
      });
      // console.log("hiiiii", data);
      login(data).then((res) => {
        // console.log("res: ", JSON.stringify(res));
        if (res) {
          let info = {
            Type: 9,
            User_FB_Token_val: this.state.msgtoken,
            User_Name: userInfo.user.givenName,
            User_Image_Path: userInfo.user.photo,
            User_Email: userInfo.user.email,
            User_latitude: this.state.currentLatitude,
            User_longitude: this.state.currentLongitude,
          };
          // console.log("inform user", info, res.access_token);
          addusermasterdata(info, res.access_token).then((response) => {
            this.props.setToken(res.access_token);
            this.props.setLoggedIn(true);
            this.props.setUserType(false);
            // console.log("123addusermasterdata", response);
            this.setState({ isLoading: false });
          });
        }
      });
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        alert("SIGN_IN_CANCELLED");
      } else if (error.code === statusCodes.IN_PROGRESS) {
        alert("IN_PROGRESS");
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        alert("PLAY_SERVICES_NOT_AVAILABLE");
      } else {
        alert(error);
        console.log(JSON.stringify(error));
      }
    }
  };
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
      this.props.navigation.navigate("ResetPassword", {
        link: link.url,
        editable: true,
      });
    }
  };
  componentDidMount = () => {
    this._getInitialUrl();
    AppState.addEventListener("change", this._handleAppStateChange);
    this.focusListener = this.props.navigation.addListener("focus", () => {
      this.requestUserPermission();
      GoogleSignin.configure({
        webClientId:
          "414781735443-rfov5i0apq0l09b2hfa62hor8252ckbh.apps.googleusercontent.com",
      });

      dynamicLinks()
        .getInitialLink()
        .then((link) => {
          if (link) {
            console.log("Loginlink", link);
            this.props.navigation.navigate("ResetPassword", { link: link.url });
          }
          console.log("Loginlinklink", link);
        });
    });
    this.getLocation();
  };
  requestUserPermission = async () => {
    let authStatus = await firebase.messaging().hasPermission();
    if (authStatus !== firebase.messaging.AuthorizationStatus.AUTHORIZED) {
      authStatus = await firebase.messaging().requestPermission();
    }
    if (authStatus === firebase.messaging.AuthorizationStatus.AUTHORIZED) {
      this.getFcmToken();
    }
  };
  async getFcmToken() {
    const fcmToken = await messaging().getToken();
    console.log("hiiii", fcmToken);
    this.setState({ msgtoken: fcmToken });
  }

  onUsernameChange = (username) => {
    this.setState({ username });
  };
  onPasswordChange = (password) => {
    this.setState({ password });
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

  managePasswordVisibility = () => {
    this.setState({ isShowPassword: !this.state.isShowPassword });
  };
  Validation = () => {
    this.setState({ isLoading: false });
    // debugger;
    const invalidFields = [];

    if (!this.state.username) {
      invalidFields.push("username");
      this.setState({ ErrorUserName: "Email address is required" });
    } else {
      // console.log("else");
      this.setState({ ErrorUserName: null });
    }
    if (!this.state.password) {
      invalidFields.push("password");
      this.setState({ ErrorPassword: "Password is required" });
    } else {
      this.setState({ ErrorPassword: null });
    }
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(this.state.username) === false && this.state.username) {
      invalidFields.push("ErrorUserEmail");
      this.setState({ ErrorUserEmail: "Please enter valid email" });
    } else {
      this.setState({ ErrorUserEmail: null });
    }
    return invalidFields.length > 0;
  };
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
          alert("Unable to find location");
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
      await AsyncStorage.multiSet([latitude, longitude]);
      console.log("Set: ", latitude, longitude);
    } catch (error) {
      console.log(" Location error ", error);
    }
  };
  // showMessage = (message) => {
  //   if (message !== "" && message !== null && message !== undefined) {
  //     Toast.show({
  //       text: message,
  //       duration: 5000,
  //     });
  //   }
  // };
  onPressLogin = async () => {
    this.setState({ isLoading: true });
    const validate = this.Validation();
    // console.log("validate", validate);
    if (!validate) {
      const {
        username,
        password,
        currentLatitude,
        currentLongitude,
        clientid,
        usertype,
        grant_type,
        msgtoken,
      } = this.state;

      this.setState({ isLoading: true });
      let data = qs.stringify({
        grant_type: grant_type,
        username: username,
        password: password,
        ClientId: usertype ? 3 : clientid,
        FirstName: "communav",
        latitude: currentLatitude,
        longitude: currentLongitude,
        Role: 2,
        User_Login_Type: 1,
        User_Token_val: "",
      });
      console.log("loginnnnnn", data);
      await login(data)
        .then((res) => {
          console.log("res", res);
          if (res) {
            console.log("res: ", JSON.stringify(res));
            this.props.setToken(res.access_token);
            this.props.setLoggedIn(true);
          }
          if (usertype) {
            let info = {
              Type: 5,
              User_FB_Token_val: msgtoken,
            };
            console.log("inforrrrrroffcer", info, res.access_token);
            updateofficerprofile(info, res.access_token).then((res) => {
              console.log("123updateofficerprofile", res);
            });
            console.log("im officer");
            this.props.setUserType(true);
          } else {
            console.log("im user");
            let info = {
              Type: 8,
              Off_FB_Token_val: this.state.msgtoken,
            };
            console.log("inforrrrrruser", info, res.access_token);
            addusermasterdata(info, res.access_token).then((res) => {
              console.log("123addusermasterdata", res);
            });
            this.props.setUserType(false);
          }
          this.setState({ isLoading: false, access_token: res.access_token });
        })
        .catch((error) => {
          if (error.response) {
            this.setState({ isLoading: false });
            console.log("error.response", error.response);
            console.log("responce_error", error);
            if (error.response.data.error == "-90") {
              alert("The Email ID or password is incorrect.");
              this.setState({ isLoading: false });
            }
          } else if (error.request) {
            this.setState({ isLoading: false });
            console.log("request error", error.request);
          } else if (error) {
            alert("Server Error");

            // ToastAndroid.show("Server Error.", ToastAndroid.LONG);
            // this.showMessage("Server Error");
            this.setState({ isLoading: false });
          }
        });
      // this.props.navigation.navigate("Home");
    }
  };
  onSelectUserType = async (value) => {
    console.log("jsonValue", value);
    // const jsonValue = JSON.stringify(value);

    this.setState({
      usertype: value,
    });
    await AsyncStorage.setItem("usertype", this.state.usertype.toString());
    console.log(
      "this.state.usertype.toString()",
      this.state.usertype.toString()
    );
  };
  initUser = async (token) => {
    this.setState({ isLoading: true });

    fetch(
      "https://graph.facebook.com/v2.5/me?fields=email,name,picture&access_token=" +
        token
    )
      .then((response) => response.json())
      .then(async (json) => {
        // console.log("*******jsonfb********", json);
        let data = qs.stringify({
          grant_type: this.state.grant_type,
          username: json.email,
          password: "",
          ClientId: 5,
          FirstName: "communav",
          latitude: this.state.currentLatitude,
          longitude: this.state.currentLongitude,
          Role: 2,
          User_Login_Type: 3,
          User_Token_val: token,
        });
        // console.log("hiiiii", data);
        login(data).then((res) => {
          if (res) {
            // console.log("res: ", JSON.stringify(res), json.picture.data.url);
            this.props.setToken(res.access_token);
            this.props.setLoggedIn(true);
            this.props.setUserType(false);
            let info = {
              Type: 9,
              User_FB_Token_val: this.state.msgtoken,
              User_Name: json.name,
              User_Image_Path: json.picture.data.url,
              User_Email: json.email,
              User_latitude: this.state.currentLatitude,
              User_longitude: this.state.currentLongitude,
            };
            // console.log("inforrrrrruser", info, res.access_token);
            addusermasterdata(info, res.access_token).then((res) => {
              // console.log("123addusermasterdata", res);
              this.setState({ isLoading: false });
            });
          }
        });
      })
      .catch((e) => {
        Promise.reject("ERROR GETTING DATA FROM FACEBOOK", e);
      });
  };
  onFBButtonPress = () => {
    LoginManager.logOut();
    LoginManager.logInWithPermissions(["public_profile", "email"])
      .then((result) => {
        if (result.isCancelled) {
          return Promise.reject(new Error("The user cancelled the request"));
        }

        return AccessToken.getCurrentAccessToken();
      })
      .then((data) => {
        // alert(data.accessToken);
        // alert(data.applicationID);
        this.initUser(data.accessToken);
        // this.props.setToken(data.accessToken);
        // this.props.setLoggedIn(true);
        // console.log("Facebook getting data" + JSON.stringify(data));
      })
      .catch((error) => {
        const { code, message } = error;
        // console.log(JSON.stringify(error));
        alert(message);
        console.log(`Facebook login fail with error: ${message} code: ${code}`);
        if (code === "auth/account-exists-with-different-credential") {
          Alert.alert(" Login Error! ", `${message}`, [{ text: "Ok" }], {
            cancelable: false,
          });
        }
      });
  };
  AlertBox = async () => {
    await AsyncStorage.setItem("usertype", this.state.usertype.toString());
    Alert.alert(
      "Forgot Password!!",
      "If you want to proceed as an officer please check 'Login as Officer'.Otherwise ignore.",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => this.props.navigation.navigate("ForgotPassword"),
        },
      ]
    );
  };

  render() {
    const {
      isLoading,
      username,
      password,
      ErrorPassword,
      isShowPassword,
      ErrorUserName,
      ErrorUserEmail,
    } = this.state;

    return (
      <SafeAreaView style={{ backgroundColor: "#fff", height: "100%" }}>
        <ScrollView>
          <Spinner visible={isLoading} />
          <View>
            <View
              style={{
                // flexGrow: 1,
                marginHorizontal: 20,
                backgroundColor: "#fff",
              }}
            >
              <View
                style={{
                  marginTop: 100,
                  // backgroundColor: 'pink',
                  justifyContent: "center",
                  alignItems: "center",
                  flex: 1,
                }}
              >
                <Image
                  style={{ width: 200 }}
                  resizeMode="stretch"
                  source={require("../../assets/Images/communiv/logo.png")}
                />
              </View>
              <View
                style={{
                  // backgroundColor: 'pink',
                  alignItems: "center",
                }}
              >
                <Text style={{ fontWeight: "bold", color: "#4169e1" }}>
                  LOGIN NOW
                </Text>
              </View>
              <View
                style={{
                  // backgroundColor: 'pink',
                  marginTop: 30,
                  alignItems: "center",
                  marginBottom: 20,
                }}
              >
                <Text
                  style={{ fontSize: 12, fontWeight: "bold", color: "gray" }}
                >
                  Please login to continue using our app
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
                  keyboardType="email-address"
                  placeholderTextColor="gray"
                  style={{
                    width: "90%",
                    paddingLeft: 20,
                    // backgroundColor: "red",
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
                  placeholderTextColor="gray"
                  onChangeText={this.onPasswordChange}
                  style={{
                    width: "85%",
                    paddingLeft: 20,
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
                  flexDirection: "row",
                  marginTop: 20,
                  alignItems: "center",
                }}
              >
                <BouncyCheckbox
                  size={25}
                  fillColor="#4169e1"
                  unfillColor="#FFFFFF"
                  // text="Custom Checkbox"
                  iconStyle={{ borderColor: "#4169e1" }}
                  onPress={(value) => this.onSelectUserType(value)}
                  isChecked={this.state.usertype}
                />
                <Text>Login as Officer</Text>
              </View>
              <TouchableOpacity
                onPress={() => this.AlertBox()}
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  marginTop: 20,
                }}
              >
                <Text style={{ color: "gray" }}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <CustomButton
                onPress={() => this.onPressLogin()}
                title={"LOGIN"}
                width={"40%"}
              />
              {!this.state.usertype && (
                <View style={{ flexDirection: "row", marginTop: 20 }}>
                  <Text style={{ color: "gray" }}>
                    Don't have an account ?{" "}
                  </Text>
                  <TouchableOpacity
                    onPress={() => this.props.navigation.navigate("SignUp")}
                  >
                    <Text style={{ color: "#4169e1" }}>Sign up</Text>
                  </TouchableOpacity>
                </View>
              )}

              {!this.state.usertype && (
                <SocialLogin
                  onPressFacebook={() => this.onFBButtonPress()}
                  onPressGmail={() => this.signIn()}
                  // onPressTwitter={() => this.onHandleTwitter()}
                />
              )}

              {/* <LoginButton
                onLoginFinished={(error, result) => {
                  if (error) {
                    console.log("login has error: " + result.error);
                  } else if (result.isCancelled) {
                    console.log("login is cancelled.");
                  } else {
                    AccessToken.getCurrentAccessToken().then((data) => {
                      console.log(data.accessToken.toString());
                    });
                  }
                }}
                onLogoutFinished={() => console.log("logout.")}
              /> */}
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
  setProfile,
};
export default connect(mapStateToProps, mapDispatchToProps)(Login);
