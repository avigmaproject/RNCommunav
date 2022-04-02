import React, { Component } from "react";
import {
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Image,
  TextInput,
  Platform,
  ScrollView,
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { forgotpassword } from "../utils/apiconfig";
import CustomButton from "../CustomComponent/CustomButton";
import firebase from "@react-native-firebase/app";
import dynamicLinks from "@react-native-firebase/dynamic-links";
import Spinner from "react-native-loading-spinner-overlay";

export default class ForgotPassword extends Component {
  constructor() {
    super();
    this.state = {
      username: "jainminals@gmail.com",
      // username: "Minal@gmail.com",
      ErrorUserName: null,
      ErrorUserEmail: null,
      device: 2,
      link: null,
      isLoading: false,
    };
  }
  componentDidMount = () => {
    // this.generateLink();
    if (Platform.OS === "android") {
      this.setState({
        device: 1,
      });
    } else {
      this.setState({
        device: 2,
      });
    }
  };
  generateLink = async () => {
    // alert("hiiii");
    const link = await dynamicLinks().buildShortLink({
      link: `https://communv.page.link/forgetpassword/${this.state.username}`,
      domainUriPrefix: "https://communv.page.link",
      ios: {
        bundleId: "com.avigma.communv",
        appStoreId: "1579823021",
        fallbackUrl: "https://apps.apple.com/us/app/com.communa_v/id1535962213",
      },
      android: {
        packageName: "com.communa_v",
        fallbackUrl:
          "https://play.google.com/store/apps/details?id=com.communa_v",
      },
      navigation: {
        forcedRedirectEnabled: true,
      },
    });
    console.log(link);
    this.setState({ link });
  };
  onUsernameChange = (username) => {
    this.setState({ username });
  };
  Validation = () => {
    this.setState({ isLoading: false });
    // debugger;
    const invalidFields = [];

    if (!this.state.username) {
      invalidFields.push("username");
      this.setState({ ErrorUserName: "Email address is required" });
    } else {
      console.log("else");
      this.setState({ ErrorUserName: null });
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
  onHandleSend = async () => {
    await this.generateLink();
    const error = this.Validation();
    console.log(error);
    if (!error) {
      const { username, device } = this.state;
      this.setState({ isLoading: true });
      let data = {
        EmailID: username,
        Type: 1,
        Device: device,
        Email_Url: this.state.link,
      };
      console.log(data);
      await forgotpassword(data)
        .then((res) => {
          console.log("res: ", JSON.stringify(res));
          console.log("res:123", res[0].UserCode);
          this.setState({ isLoading: false });
          if (res[0].UserCode === "Sucesss") {
            alert(
              "Link sent successfully. Please check your registered email."
            );
          }
          this.props.navigation.navigate("Login");
        })
        .catch((error) => {
          if (error.response) {
            console.log("responce_error", error.response);
            this.setState({ isLoading: false });
          } else if (error.request) {
            this.setState({ isLoading: false });
            console.log("request error", error.request);
          }
          // else if (error) {
          //   alert("Server Error");

          //   // ToastAndroid.show("Server Error.", ToastAndroid.LONG);
          //   // this.showMessage("Server Error");
          //   this.setState({ isLoading: false });
          // }
        });
    }
  };
  render() {
    // console.log(this.state.device);
    return (
      <SafeAreaView style={{ backgroundColor: "#fff", height: "100%" }}>
        <Spinner visible={this.state.isLoading} />

        <ScrollView>
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
                source={require("../../assets/Images/communiv/library/forgot-password/icon-1.png")}
              />
            </View>
          </View>
          <View style={{ alignItems: "center", justifyContent: "center" }}>
            <View
              style={{
                // backgroundColor: "pink",
                alignItems: "center",
                marginTop: 40,
                width: "90%",
              }}
            >
              <Text
                style={{ fontWeight: "bold", color: "#4169e1", lineHeight: 30 }}
              >
                FORGOT YOUR PASSWORD
              </Text>
              <Text
                style={{ textAlign: "center", lineHeight: 25, color: "gray" }}
              >
                Enter your Email id to get the link to for reset your password
              </Text>
            </View>
          </View>

          <View
            style={{
              // backgroundColor: 'pink',
              borderBottomColor: "lightgray",
              borderBottomWidth: 1,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              marginHorizontal: 20,
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
              keyboardType="email-address"
              placeholderTextColor="gray"
              style={{
                width: "90%",
                paddingLeft: 20,
                // backgroundColor: "red",
                height: 40,
              }}
              onChangeText={this.onUsernameChange}
              value={this.state.username}
              onSubmitEditing={() => this.generateLink()}
              onBlur={() => this.generateLink()}
            />
          </View>
          <View style={{ width: "90%", marginHorizontal: 20 }}>
            {this.state.ErrorUserName && (
              <Text style={{ color: "red", marginTop: 5, marginRight: 30 }}>
                {this.state.ErrorUserName}
              </Text>
            )}
          </View>
          <View style={{ width: "90%", marginHorizontal: 20 }}>
            {this.state.ErrorUserEmail && (
              <Text style={{ color: "red", marginTop: 5, marginRight: 30 }}>
                {this.state.ErrorUserEmail}
              </Text>
            )}
          </View>
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginTop: 20,
            }}
          >
            <CustomButton
              onPress={() => this.onHandleSend()}
              title={"SEND"}
              width={"80%"}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}
