import React, { Component } from "react";
import {
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import HeaderArrow from "../CustomComponent/HeaderArrow";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import CustomComponent2 from "../CustomComponent/CustomComponent2";
import Spinner from "react-native-loading-spinner-overlay";
import { Avatar } from "react-native-paper";
import { ActionSheetCustom as ActionSheet } from "react-native-actionsheet";
import ImagePicker from "react-native-image-crop-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  userprofile,
  userprofileupdate,
  registerStoreImage,
} from "../utils/apiconfig";
import { connect } from "react-redux";
import { setToken } from "../store/action/auth/action";
import { setProfile } from "../store/action/Profile/action";

const options = [
  "Cancel",
  <View>
    {/* <EvilIcons
      name="pencil"
      size={35}
      //   style={{ marginRight: 20 }}
      // color=""
    /> */}
    <Text style={{ color: "black" }}>Gallery</Text>
  </View>,
  <Text style={{ color: "black" }}>Camera</Text>,
];
class EditProfile extends Component {
  constructor() {
    super();
    this.state = {
      isShowPassword: true,
      username: null,
      password: null,
      username: null,
      password: null,
      firstname: null,
      ErrorPhoneDigit: null,
      ErrorPhoneNumber: null,
      ErrorStateName: null,
      ErrorUserName: null,
      ErrorPassword: null,
      ErrorUserEmail: null,
      ErrorFirstName: null,
      ErrorCity: null,
      ErrorTags: null,
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
      iseditemail: false,
      showLocationDialog: false,
      msgtoken: null,
      checked: "first",
      ErrorCPassword: null,
      phonenumber: "",
      isedittextinput: false,
      city: "",
      state: "",
      tag: "#tag",
      displayname: "",
      pincode: null,
      ErrorPincode: null,
      ErrorAddress: null,
      address: "",
      token: null,
      imagePath: null,
      chnageimage: false,
      phonenumber: null,
      base64: null,
      // iseditname: false,
      // iseditpassword: false,
      // iseditcity: false,
      // iseditstate: false,
      // username: "niraljain@gmail.com",
      // password: "1234",
      // firstname: "minal",
    };
  }
  managePasswordVisibility = () => {
    this.setState({ isShowPassword: !this.state.isShowPassword });
  };
  onAddressChange = (address) => {
    this.setState({ address });
  };
  onUsernameChange = (username) => {
    this.setState({ username });
  };

  onPasswordChange = (password) => {
    this.setState({ password });
  };
  onFirstNameChange = (firstname) => {
    // let value = firstname;
    // value = value.replace(/[^A-Za-z]/gi, "");
    this.setState({ firstname });
  };
  onPincodeChange = (pincode) => {
    let value = pincode;
    value = value.replace(/[^0-9]/gi, "");
    this.setState({ pincode: value });
  };
  onCityChange = (city) => {
    this.setState({ city });
  };
  onStateChange = (state) => {
    // let value = state;
    // value = value.replace(/[^A-Za-z]/gi, "");
    this.setState({ state });
  };
  onDisplayNameChange = (displayname) => {
    this.setState({ displayname });
  };
  onPhoneChange = (phonenumber) => {
    this.setState({ phonenumber });
  };
  onPress = () => this.ActionSheet.show();
  ImageGallery = async () => {
    setTimeout(
      function () {
        ImagePicker.openPicker({
          width: 300,
          height: 400,
          cropping: true,
          includeBase64: true,
          multiple: false,
          compressImageQuality: 0.5,
        }).then(
          (image) => {
            // console.log(image.data);
            this.setState({
              base64: image.data,
              fileName:
                Platform.OS === "ios" ? image.filename : "images" + new Date(),
              imagePath: image.path,
              chnageimage: true,
            });
          },
          () => this.uploadImage()
        );
      }.bind(this),
      1000
    );
  };
  ImageCamera = () => {
    setTimeout(
      function () {
        ImagePicker.openCamera({
          width: 300,
          height: 400,
          cropping: true,
          includeBase64: true,
          multiple: false,
          compressImageQuality: 0.5,
        }).then(
          (image) => {
            // console.log(image);
            this.setState({
              base64: image.data,
              fileName:
                Platform.OS === "ios" ? image.filename : "images" + new Date(),
              imagePath: image.path,
              chnageimage: true,
            });
          },
          () => this.uploadImage()
        );
      }.bind(this),
      1000
    );
  };
  Validation = () => {
    const { password, firstname, state, pincode, address, phonenumber, city } =
      this.state;
    this.setState({ isLoading: false });
    // debugger;
    const invalidFields = [];
    if (!firstname) {
      invalidFields.push("firstname");
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
    if (!state) {
      invalidFields.push("state");

      this.setState({ ErrorStateName: "State is required" });
    } else {
      this.setState({ ErrorStateName: null });
    }
    if (!address) {
      invalidFields.push("address");

      this.setState({ ErrorAddress: "Address is required" });
    } else {
      this.setState({ ErrorAddress: null });
    }
    if (!city) {
      invalidFields.push("city");

      this.setState({ ErrorCity: "City is required" });
    } else {
      this.setState({ ErrorCity: null });
    }
    // if (!username) {
    //   invalidFields.push("username");
    //   this.setState({ ErrorUserName: "Email address is required" });
    // } else {
    //   console.log("else");
    //   this.setState({ ErrorUserName: null });
    // }
    // if (!tag) {
    //   this.setState({ ErrorTags: "Name is required" });
    // } else {
    //   this.setState({ ErrorTags: null });
    // }

    // if (!displayname) {
    //   invalidFields.push("displayname");
    //   this.setState({ ErrorDisplayname: "Display Name is required" });
    // } else {
    //   this.setState({ ErrorDisplayname: null });
    // }
    // if (!cpassword) {
    //   invalidFields.push("ErrorCPassword");
    //   this.setState({ ErrorCPassword: "Confirm Password is required" });
    // } else {
    //   this.setState({ ErrorCPassword: null });
    // }
    // if (cpassword != password) {
    //   invalidFields.push("ErrorCPassword2");
    //   this.setState({
    //     ErrorCPassword2: "Confirm Password and Password does not match",
    //   });
    // } else {
    //   this.setState({ ErrorCPassword2: null });
    // }
    if (!phonenumber) {
      invalidFields.push("ErrorPhoneNumber");
      this.setState({ ErrorPhoneNumber: "Phone Number is required" });
    } else {
      this.setState({ ErrorPhoneNumber: null });
    }
    if (!pincode) {
      invalidFields.push("ErrorPhoneNumber");
      this.setState({ ErrorPincode: "Pincode is required" });
    } else {
      this.setState({ ErrorPincode: null });
    }
    if (phonenumber && phonenumber.length != 10) {
      invalidFields.push("ErrorPhoneNumber");
      this.setState({ ErrorPhoneDigit: "Phone Number required 10 digits" });
    } else {
      this.setState({ ErrorPhoneDigit: null });
    }
    // let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    // if (reg.test(username) === false && username) {
    //   invalidFields.push("ErrorUserEmail");
    //   this.setState({ ErrorUserEmail: "Please enter valid email" });
    // } else {
    //   this.setState({ ErrorUserEmail: null });
    // }
    return invalidFields.length > 0;
  };
  componentDidMount = async () => {
    this._unsubscribe = this.props.navigation.addListener("focus", () => {
      this.onGetUserData();
    });

    //
  };
  onGetUserData = async () => {
    this.setState({ isLoading: true });
    let data = {
      Type: 2,
    };
    console.log(data, this.props.token);
    await userprofile(data, this.props.token)
      .then((res) => {
        console.log("res:123", res[0][0]);
        this.setState({
          username: res[0][0].User_Email,
          firstname: res[0][0].User_Name,
          password: res[0][0].User_Password,
          address: res[0][0].User_Address,
          city: res[0][0].User_City,
          state: res[0][0].User_Country,
          pincode: res[0][0].User_Zip,
          imagePath: res[0][0].User_Image_Path,
          phonenumber: res[0][0].User_Phone,
          // displayname: res[0][0].User_Name,
          // tag: res[0][0].User_Name,
          isLoading: false,
        });
        this.props.setProfile(res[0][0]);
      })
      .catch((error) => {
        if (error.response) {
          console.log("responce_error", error.response);
          this.setState({ isLoading: false });
        } else if (error.request) {
          this.setState({ isLoading: false });
          console.log("request error", error.request);
        } else if (error) {
          alert("Server Error");
          this.setState({ isLoading: false });
        }
      });
  };
  onSetUserData = async () => {
    // alert("hiiii");
    const {
      password,
      firstname,
      state,
      address,
      city,
      pincode,
      username,
      phonenumber,
      base64,
      imagePath,
    } = this.state;
    let data;
    const validate = this.Validation();
    console.log("validate", validate);
    if (!validate) {
      this.setState({ isLoading: true });
      if (this.state.chnageimage) {
        console.log("im in iffff");
        data = {
          Type: 2,
          User_Email: username,
          User_Name: firstname,
          User_Password: password,
          User_Address: address,
          User_City: city,
          User_Country: state,
          User_Zip: pincode,
          User_Phone: phonenumber,
          User_Image_Path: "data:image/png;base64, " + base64,
          User_IsActive: 1,
        };
      } else {
        console.log("im in eleseesee");
        data = {
          Type: 2,
          User_Email: username,
          User_Name: firstname,
          User_Password: password,
          User_Address: address,
          User_City: city,
          User_Country: state,
          User_Zip: pincode,
          User_Phone: phonenumber,
          User_IsActive: 1,
        };
      }
      uploadImage = async () => {
        const { base64 } = this.state;
        let data = JSON.stringify({
          Type: 6,
          User_Image_Path_Base64: "data:image/png;base64, " + base64,
        });
        await registerStoreImage(data, this.props.token)
          .then((res) => {
            console.log("res:", res);
            // this.setState({
            //   ...this.state,
            //   // imagePath:
            //   })
          })
          .catch((error) => {
            if (error.request) {
              console.log(error.request);
            } else if (error.responce) {
              console.log(error.responce);
            } else {
              console.log(error);
            }
          });
      };
      console.log("datadatadata", data);
      await userprofileupdate(data, this.props.token)
        .then((res) => {
          console.log("res:123", res);
          this.setState({
            isedittextinput: false,
            isLoading: false,
          });
          this.onGetUserData();
        })
        .catch((error) => {
          if (error.response) {
            console.log("responce_error", error.response);
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
      displayname,
      ErrorFirstName,
      firstname,
      ErrorTags,
      state,
      ErrorStateName,
      ErrorCPassword2,
      iseditstate,
      iseditname,
      iseditemail,
      iseditpassword,
      ErrorCity,
      city,
      pincode,
      isedittextinput,
      tag,
      ErrorPhoneDigit,
      ErrorPhoneNumber,
      ErrorPincode,
      ErrorAddress,
      address,
      phonenumber,
      imagePath,
    } = this.state;
    // console.log("imagePath", imagePath);
    return (
      <SafeAreaView>
        <HeaderArrow
          back={true}
          drawer={false}
          title={"MY PROFILE"}
          navigation={this.props.navigation}
        />
        <Spinner visible={isLoading} />

        <ScrollView keyboardShouldPersistTaps="always" style={{}}>
          <View style={{ marginBottom: 200 }}>
            {/* <Spinner visible={isLoading} /> */}
            <View
              style={{
                // backgroundColor: "pink",
                justifyContent: "center",
                alignItems: "center",
                paddingVertical: 10,
                flexDirection: "row",
              }}
            >
              <View>
                <TouchableOpacity
                  onPress={() => this.onPress()}
                  style={{
                    // backgroundColor: "pink",
                    position: "absolute",
                    zIndex: 1000,
                    right: 0,
                    bottom: 0,
                  }}
                >
                  <FontAwesome name="edit" size={20} />
                </TouchableOpacity>
                <Avatar.Image
                  source={{
                    uri: this.state.imagePath
                      ? this.state.imagePath
                      : "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Unknown_person.jpg/1200px-Unknown_person.jpg",
                  }}
                  size={90}
                />
              </View>
              <ActionSheet
                ref={(o) => (this.ActionSheet = o)}
                title={
                  <Text style={{ color: "#000", fontSize: 18 }}>
                    Profile Photo
                  </Text>
                }
                options={options}
                cancelButtonIndex={0}
                destructiveButtonIndex={4}
                useNativeDriver={true}
                onPress={(index) => {
                  if (index === 0) {
                    // cancel action
                  } else if (index === 1) {
                    this.ImageGallery();
                  } else if (index === 2) {
                    this.ImageCamera();
                  }
                }}
              />
              <View style={{ position: "absolute", top: 0, right: 10 }}>
                <TouchableOpacity
                  onPress={() =>
                    this.setState({
                      isedittextinput: true,
                    })
                  }
                >
                  <Text
                    style={{
                      textDecorationLine: "underline",
                      color: "#4169e1",
                    }}
                  >
                    Edit Profile
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={{ marginHorizontal: 20 }}>
              <View>
                <View>
                  <Text
                    style={{
                      marginTop: 5,
                      marginRight: 30,
                      fontWeight: "bold",
                    }}
                  >
                    EMAIL
                  </Text>
                  <View
                    style={{
                      // backgroundColor: 'pink',
                      borderBottomColor: "lightgray",
                      borderBottomWidth: 1,
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      // marginHorizontal: 10,
                    }}
                  >
                    <MaterialCommunityIcons
                      name="email"
                      size={20}
                      // style={{ marginLeft: 20 }}
                      color="#4169e1"
                    />
                    <TextInput
                      placeholder="Email ID"
                      editable={iseditemail}
                      keyboardType="email-address"
                      placeholderTextColor="gray"
                      style={{
                        width: "85%",
                        paddingLeft: 20,
                        //   backgroundColor: "red",
                        height: 50,
                      }}
                      onChangeText={this.onUsernameChange}
                      value={username}
                    />
                    {/* <TouchableOpacity
                      onPress={() =>
                        this.setState({
                          iseditemail: true,
                        })
                      }
                    >
                      <FontAwesome name="edit" size={20} />
                    </TouchableOpacity> */}
                  </View>
                  <View style={{ width: "90%" }}>
                    {ErrorUserName && (
                      <Text
                        style={{ color: "red", marginTop: 5, marginRight: 30 }}
                      >
                        {ErrorUserName}
                      </Text>
                    )}
                  </View>
                  <View style={{ width: "90%" }}>
                    {ErrorUserEmail && (
                      <Text
                        style={{ color: "red", marginTop: 5, marginRight: 30 }}
                      >
                        {ErrorUserEmail}
                      </Text>
                    )}
                  </View>
                </View>
                <View>
                  <Text
                    style={{
                      marginTop: 15,
                      marginRight: 30,
                      fontWeight: "bold",
                    }}
                  >
                    PASSWORD
                  </Text>
                  <View
                    style={{
                      // backgroundColor: 'pink',
                      borderBottomColor: "lightgray",
                      borderBottomWidth: 1,
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      //   marginTop: 20,
                    }}
                  >
                    <MaterialCommunityIcons
                      name="lock"
                      size={20}
                      style={{ marginLeft: 20 }}
                      color="#4169e1"
                    />
                    <TextInput
                      value={password}
                      editable={isedittextinput}
                      placeholder="Password"
                      placeholderTextColor="gray"
                      onChangeText={this.onPasswordChange}
                      style={{
                        width: "85%",
                        paddingLeft: 20,
                        //   backgroundColor: "#fff",
                        height: 50,
                      }}
                      secureTextEntry={isShowPassword}
                    />
                    {/* {!iseditpassword && (
                      <TouchableOpacity
                        onPress={() =>
                          this.setState({
                            iseditpassword: true,
                          })
                        }
                      >
                        <FontAwesome name="edit" size={20} />
                      </TouchableOpacity>
                    )} */}
                    {/* {iseditpassword && ( */}
                    <TouchableOpacity
                      onPress={() => this.managePasswordVisibility()}
                    >
                      {isShowPassword ? (
                        <FontAwesome name="eye" size={20} />
                      ) : (
                        <FontAwesome name="eye-slash" size={20} />
                      )}
                    </TouchableOpacity>
                    {/* )} */}
                  </View>
                  <View style={{ width: "90%" }}>
                    {ErrorPassword && (
                      <Text
                        style={{ color: "red", marginTop: 5, marginRight: 30 }}
                      >
                        {ErrorPassword}
                      </Text>
                    )}
                  </View>
                  <View style={{ width: "90%" }}>
                    {ErrorCPassword2 && (
                      <Text
                        style={{ color: "red", marginTop: 5, marginRight: 30 }}
                      >
                        {ErrorCPassword2}
                      </Text>
                    )}
                  </View>
                </View>
                <View style={{ marginTop: 15 }}>
                  <Text
                    style={{
                      marginRight: 30,
                      fontWeight: "bold",
                    }}
                  >
                    NAME
                  </Text>
                  <View
                    style={{
                      // backgroundColor: 'pink',
                      borderBottomColor: "lightgray",
                      borderBottomWidth: 1,
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      //
                    }}
                  >
                    <MaterialCommunityIcons
                      name="account-circle"
                      size={20}
                      // style={{ marginLeft: 20 }}
                      color="#4169e1"
                    />
                    <TextInput
                      placeholder="Name"
                      style={{
                        width: "85%",
                        paddingLeft: 20,
                        height: 50,
                      }}
                      onChangeText={this.onFirstNameChange}
                      value={firstname}
                      editable={isedittextinput}
                      // onEndEditing={() =>
                      //   this.setState({
                      //     iseditname: false,
                      //   })
                      // }
                    />
                    {/* <TouchableOpacity
                      onPress={() =>
                        this.setState({
                          iseditname: true,
                        })
                      }
                    >
                      <FontAwesome name="edit" size={20} />
                    </TouchableOpacity> */}
                  </View>
                  <View style={{ width: "90%" }}>
                    {ErrorFirstName && (
                      <Text
                        style={{ color: "red", marginTop: 5, marginRight: 30 }}
                      >
                        {ErrorFirstName}
                      </Text>
                    )}
                  </View>
                </View>

                <View style={{ marginTop: 15 }}>
                  <Text
                    style={{
                      marginRight: 30,
                      fontWeight: "bold",
                    }}
                  >
                    ADDRESS
                  </Text>
                  <View
                    style={{
                      // backgroundColor: 'pink',
                      borderBottomColor: "lightgray",
                      borderBottomWidth: 1,
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      //
                    }}
                  >
                    <EvilIcons
                      name="location"
                      size={30}
                      // style={{ marginLeft: 20 }}
                      color="#4169e1"
                    />
                    <TextInput
                      placeholder="Address"
                      style={{
                        width: "85%",
                        paddingLeft: 13,
                        height: 90,
                      }}
                      multiline={true}
                      numberOfLines={5}
                      onChangeText={this.onAddressChange}
                      value={address}
                      editable={isedittextinput}
                    />
                    {/* <TouchableOpacity
                      onPress={() =>
                        this.setState({
                          iseditdisplayname: true,
                        })
                      }
                    >
                      <FontAwesome name="edit" size={20} />
                    </TouchableOpacity> */}
                  </View>
                  <View style={{ width: "90%" }}>
                    {ErrorAddress && (
                      <Text
                        style={{
                          color: "red",
                          marginTop: 5,
                          marginRight: 30,
                        }}
                      >
                        {ErrorAddress}
                      </Text>
                    )}
                  </View>
                </View>

                <View style={{ marginTop: 15 }}>
                  <Text
                    style={{
                      marginRight: 30,
                      fontWeight: "bold",
                    }}
                  >
                    CITY
                  </Text>
                  <View
                    style={{
                      borderBottomColor: "lightgray",
                      borderBottomWidth: 1,
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      //
                    }}
                  >
                    <MaterialCommunityIcons
                      name="domain"
                      size={20}
                      // style={{ marginLeft: 20 }}
                      color="#4169e1"
                    />
                    <TextInput
                      placeholder="City"
                      style={{
                        width: "85%",
                        paddingLeft: 20,
                        height: 50,
                      }}
                      onChangeText={this.onCityChange}
                      value={city}
                      editable={isedittextinput}
                      // onEndEditing={() =>
                      //   this.setState({
                      //     iseditcity: false,
                      //   })
                      // }
                    />
                    {/* <TouchableOpacity
                      onPress={() =>
                        this.setState({
                          iseditcity: true,
                        })
                      }
                    >
                      <FontAwesome name="edit" size={20} />
                    </TouchableOpacity> */}
                  </View>
                  <View style={{ width: "90%" }}>
                    {ErrorCity && (
                      <Text
                        style={{ color: "red", marginTop: 5, marginRight: 30 }}
                      >
                        {ErrorCity}
                      </Text>
                    )}
                  </View>
                </View>
                <View style={{ marginTop: 15 }}>
                  <Text
                    style={{
                      marginRight: 30,
                      fontWeight: "bold",
                    }}
                  >
                    STATE
                  </Text>
                  <View
                    style={{
                      // backgroundColor: "pink",
                      borderBottomColor: "lightgray",
                      borderBottomWidth: 1,
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      //
                    }}
                  >
                    <MaterialCommunityIcons
                      name="bank-outline"
                      size={20}
                      // style={{ marginLeft: 20 }}
                      color="#4169e1"
                    />
                    <TextInput
                      placeholder="State"
                      style={{
                        width: "85%",
                        paddingLeft: 20,
                        height: 50,
                      }}
                      onChangeText={this.onStateChange}
                      value={state}
                      editable={isedittextinput}
                    />
                    {/* <TouchableOpacity
                      onPress={() =>
                        this.setState({
                          iseditstate: true,
                        })
                      }
                    >
                      <FontAwesome name="edit" size={20} />
                    </TouchableOpacity> */}
                  </View>
                  <View style={{ width: "90%" }}>
                    {ErrorStateName && (
                      <Text
                        style={{ color: "red", marginTop: 5, marginRight: 30 }}
                      >
                        {ErrorStateName}
                      </Text>
                    )}
                  </View>
                </View>
                <View style={{ marginTop: 15 }}>
                  <Text
                    style={{
                      marginRight: 30,
                      fontWeight: "bold",
                    }}
                  >
                    PINCODE
                  </Text>
                  <View
                    style={{
                      // backgroundColor: 'pink',
                      borderBottomColor: "lightgray",
                      borderBottomWidth: 1,
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      //
                    }}
                  >
                    <EvilIcons
                      name="location"
                      size={30}
                      // style={{ marginLeft: 20 }}
                      color="#4169e1"
                    />
                    <TextInput
                      placeholder="XYZ"
                      style={{
                        width: "85%",
                        paddingLeft: 20,
                        height: 50,
                      }}
                      onChangeText={this.onPincodeChange}
                      value={pincode}
                      editable={isedittextinput}
                    />
                    {/* <TouchableOpacity
                      onPress={() =>
                        this.setState({
                          iseditdisplayname: true,
                        })
                      }
                    >
                      <FontAwesome name="edit" size={20} />
                    </TouchableOpacity> */}
                  </View>
                  <View style={{ width: "90%" }}>
                    {ErrorPincode && (
                      <Text
                        style={{ color: "red", marginTop: 5, marginRight: 30 }}
                      >
                        {ErrorPincode}
                      </Text>
                    )}
                  </View>
                </View>
                <View style={{ marginTop: 15 }}>
                  <Text
                    style={{
                      marginRight: 30,
                      fontWeight: "bold",
                    }}
                  >
                    CONTACT NUMBER
                  </Text>
                  <View
                    style={{
                      // backgroundColor: 'pink',
                      borderBottomColor: "lightgray",
                      borderBottomWidth: 1,
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      //
                    }}
                  >
                    <Ionicons
                      name="call-outline"
                      size={25}
                      // style={{ marginLeft: 20 }}
                      color="#4169e1"
                    />
                    <TextInput
                      placeholder="Contact Number"
                      keyboardType={"number-pad"}
                      maxLength={10}
                      style={{
                        width: "85%",
                        paddingLeft: 20,
                        height: 50,
                      }}
                      onChangeText={this.onPhoneChange}
                      value={phonenumber}
                      editable={isedittextinput}
                    />
                  </View>
                  <View style={{ width: "90%" }}>
                    {ErrorPhoneDigit && (
                      <Text
                        style={{ color: "red", marginTop: 5, marginRight: 30 }}
                      >
                        {ErrorPhoneDigit}
                      </Text>
                    )}
                  </View>
                  <View style={{ width: "90%" }}>
                    {ErrorPhoneNumber && (
                      <Text
                        style={{ color: "red", marginTop: 5, marginRight: 30 }}
                      >
                        {ErrorPhoneNumber}
                      </Text>
                    )}
                  </View>
                </View>
                {/* <View style={{ marginTop: 15 }}>
                  <Text
                    style={{
                      marginRight: 30,
                      fontWeight: "bold",
                    }}
                  >
                    TAGES
                  </Text>
                  <View
                    style={{
                      // backgroundColor: 'pink',
                      borderBottomColor: "lightgray",
                      borderBottomWidth: 1,
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      //
                    }}
                  >
                    <EvilIcons
                      name="tag"
                      size={30}
                      style={{ marginLeft: 20 }}
                      color="#4169e1"
                    />
                    <TextInput
                      placeholder="MY TAG ,SPECIAL"
                      style={{
                        width: "85%",
                        paddingLeft: 20,
                        height: 50,
                      }}
                      onChangeText={this.onTagChange}
                      value={tag}
                      editable={isedittextinput}
                    />
                    <TouchableOpacity
                      onPress={() =>
                        this.setState({
                          isedittag: true,
                        })
                      }
                    >
                      <FontAwesome name="edit" size={20} />
                    </TouchableOpacity>
                  </View>
                  <View style={{ width: "90%" }}>
                    {ErrorTags && (
                      <Text
                        style={{ color: "red", marginTop: 5, marginRight: 30 }}
                      >
                        {ErrorTags}
                      </Text>
                    )}
                  </View>
                </View>
                <View style={{ marginTop: 15 }}>
                  <Text
                    style={{
                      marginRight: 30,
                      fontWeight: "bold",
                    }}
                  >
                    DISPLAY NAME
                  </Text>
                  <View
                    style={{
                      // backgroundColor: 'pink',
                      borderBottomColor: "lightgray",
                      borderBottomWidth: 1,
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      //
                    }}
                  >
                    <EvilIcons
                      name="tag"
                      size={30}
                      style={{ marginLeft: 20 }}
                      color="#4169e1"
                    />
                    <TextInput
                      placeholder="XYZ"
                      style={{
                        width: "85%",
                        paddingLeft: 20,
                        height: 50,
                      }}
                      onChangeText={this.onDisplayNameChange}
                      value={displayname}
                      editable={isedittextinput}
                    />
                    <TouchableOpacity
                      onPress={() =>
                        this.setState({
                          iseditdisplayname: true,
                        })
                      }
                    >
                      <FontAwesome name="edit" size={20} />
                    </TouchableOpacity>
                  </View>
                  <View style={{ width: "90%" }}>
                    {ErrorDisplayname && (
                      <Text
                        style={{ color: "red", marginTop: 5, marginRight: 30 }}
                      >
                        {ErrorDisplayname}
                      </Text>
                    )}
                  </View>
                </View> */}

                <View
                  // onPress={() => this.onSetUserData()}
                  style={{
                    marginTop: 30,
                    flexDirection: "row",
                    justifyContent: "flex-end",
                  }}
                >
                  <CustomComponent2
                    onPress={() => this.onSetUserData()}
                    // next={true}
                    title={"SAVE"}
                  />

                  {/* <View
                    style={{
                      backgroundColor: "#FF7614",
                      borderRadius: 50,
                      padding: 10,
                      width: "35%",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        color: "#fff",
                        fontWeight: "bold",
                        fontSize: 17,
                      }}
                    >
                      SAVE
                    </Text>
                  </View> */}
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}
const mapStateToProps = (state, ownProps) => ({
  token: state.authReducer.token,
  profile: state.profileReducer.profile,
});

const mapDispatchToProps = {
  setToken,
  setProfile,
};
export default connect(mapStateToProps, mapDispatchToProps)(EditProfile);
