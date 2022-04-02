import React, { Component } from "react";
import {
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Image,
  TextInput,
  AppState,
  Linking,
  Keyboard,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { resetpassword } from "../utils/apiconfig";
import CustomButton from "../CustomComponent/CustomButton";
import { connect } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";

class ResetPassword extends Component {
  constructor() {
    super();
    this.state = {
      username: null,
      ErrorPassword: null,
      ErrorCPassword: null,
      ErrorCPassword2: null,
      cpassword: null,
      password: null,
      isShowPassword: false,
      isShowCPassword: false,
      appState: "background",
      url: "",
      UserVerificationID: null,
      VerificationCode: null,
      Type: null,
      email: null,
    };
  }

  componentDidMount() {
    console.log("restpassword", this.props.route.params.link);
    const { link } = this.props.route.params;
    const spliturl = link.split("/");
    console.log("spliturl", spliturl[4]);
    this.setState({ email: spliturl[4] });
  }

  onCPasswordChange = (cpassword) => {
    this.setState({ cpassword });
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
    this.setState({ isLoading: false });
    // debugger;
    const { password, cpassword } = this.state;
    const invalidFields = [];

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
    return invalidFields.length > 0;
  };
  onHandleSubmit = async () => {
    Keyboard.dismiss();
    const value = await AsyncStorage.getItem("usertype");
    if (value !== null) {
      const error = this.Validation();
      if (!error) {
        const { password, email } = this.state;
        this.setState({ isLoading: true });
        let data = {
          User_Email: email,
          Type: 7,
          User_Password: password,
          User_Type: value === "false" ? 1 : 2,
        };
        console.log(data);
        await resetpassword(data)
          .then((res) => {
            console.log("res: ", JSON.stringify(res));
            this.setState({ isLoading: false });
            this.props.navigation.navigate("SuccessPage", {
              text: "Password Changed Successfully",
              login: true,
            });
          })
          .catch((error) => {
            if (error.response) {
              console.log("responce_error", error.response.data.error);
              this.setState({ isLoading: false });
            } else if (error.request) {
              this.setState({ isLoading: false });
              console.log("request error", error.request);
            } else if (error) {
              alert("Server Error");
              this.setState({ isLoading: false });
            }
          });
      }
    }
  };
  render() {
    const {
      ErrorCPassword,
      ErrorCPassword2,
      ErrorPassword,
      isShowPassword,
      password,
      cpassword,
      isShowCPassword,
    } = this.state;
    // console.log(this.props.usertype);
    return (
      <SafeAreaView style={{ backgroundColor: "#fff", height: "100%" }}>
        <ScrollView>
          <View>
            <View
              style={{
                marginLeft: 20,
                flexDirection: "row",
                justifyContent: "space-between",
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
                  height: 30,
                }}
              >
                <FontAwesome name="chevron-left" size={15} color="#fff" />
              </TouchableOpacity>

              <View>
                <Image
                  style={{ width: 300, height: 300 }}
                  resizeMode="stretch"
                  source={require("../../assets/Images/communiv/reset-password.png")}
                />
              </View>
            </View>
            <View
              style={{
                // backgroundColor: 'pink',
                alignItems: "center",
                marginTop: 40,
              }}
            >
              <Text style={{ fontWeight: "bold", color: "#4169e1" }}>
                RESET YOUR PASSWORD
              </Text>
              <Text style={{ fontWeight: "bold", marginTop: 20 }}>
                Please enter your new password
              </Text>
            </View>
            <View style={{ marginHorizontal: 20 }}>
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
                  // placeholderTextColor="gray"
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
                  style={{
                    width: "85%",
                    paddingLeft: 15,
                    backgroundColor: "#fff",
                    height: 50,
                  }}
                  onChangeText={this.onCPasswordChange}
                  value={cpassword}
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
            </View>

            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                marginTop: 20,
              }}
            >
              <CustomButton
                onPress={() => this.onHandleSubmit()}
                title={"SUBMIT"}
                width={"80%"}
              />
              {/* <TouchableOpacity
                onPress={() => this.onHandleSubmit()}
                style={{
                  backgroundColor: "#4169e1",
                  width: "80%",
                  alignItems: "center",
                  justifyContent: "center",
                  paddingVertical: 15,
                  borderRadius: 5,
                  marginTop: 20,
                }}
              >
                <Text
                  style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}
                >
                  Submit
                </Text>
              </TouchableOpacity> */}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}
const mapStateToProps = (state, ownProps) => ({
  usertype: state.authReducer.usertype,
});

export default connect(mapStateToProps)(ResetPassword);
