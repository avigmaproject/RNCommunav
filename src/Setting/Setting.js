import React, { Component } from "react";
import {
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Keyboard,
} from "react-native";
import HeaderArrow from "../CustomComponent/HeaderArrow";
import InputView from "../CustomComponent/InputView";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import Spinner from "react-native-loading-spinner-overlay";
import { Avatar } from "react-native-paper";
import { ActionSheetCustom as ActionSheet } from "react-native-actionsheet";
import ImagePicker from "react-native-image-crop-picker";
import {
  getofficerprofile,
  updateofficerprofile,
  getfilterdata,
} from "../utils/apiconfig";
import { connect } from "react-redux";
import { setToken } from "../store/action/auth/action";
import CustomComponent2 from "../CustomComponent/CustomComponent2";
import { Select } from "native-base";
import QRCode from "react-native-qrcode-svg";
import dynamicLinks from "@react-native-firebase/dynamic-links";
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

class Setting extends Component {
  constructor() {
    super();
    this.state = {
      isShowPassword: true,
      username: null,
      password: null,
      username: "",
      password: "",
      firstname: "",
      cpassword: "",
      ErrorStateName: null,
      ErrorUserName: null,
      ErrorPassword: null,
      ErrorUserEmail: null,
      ErrorFirstName: null,
      ErrorTags: null,
      clientid: 2,
      role: 2,
      isLoading: false,
      grant_type: "password",
      access_token: "",
      forceLocation: true,
      highAccuracy: true,
      currentLatitude: 0,
      currentLongitude: 0,
      showLocationDialog: false,
      msgtoken: null,
      checked: "first",
      ErrorCPassword: null,
      phonenumber: "",
      iseditname: false,
      iseditemail: false,
      iseditpassword: false,
      iseditcity: false,
      isedittag: false,
      isedittextinput: true,
      badge: "",
      law: "",
      iseditdisplayname: false,
      city: null,
      state: null,
      tag: null,
      displayname: null,
      imagePath: null,
      address: "",
      race: "race",
      education: "",
      ErrorEducation: null,
      training: "",
      ErrorTraining: null,
      aboutme: "",
      chnageimage: false,
      base64: null,
      officerid: null,
      link: null,
      racetype: [],
      raceid: "",
      iseditbadge: false,
      ErrorQualification: null,
      agencyid: null,
      gender: null,

      // username: "niraljain@gmail.com",
      // password: "1234",
      // firstname: "minal",
    };
  }

  onHandleChange = (key, value) => {
    this.setState({
      ...this.state,
      [key]: value,
    });
  };
  onEditiChange = (editedValue, state) => {
    console.log("hiii", editedValue, state);
    this.setState({
      ...this.state,
      [editedValue]: state,
    });
  };
  onGetUserData = async () => {
    this.setState({ isLoading: true });
    let data = {
      Type: 2,
    };
    console.log("minaldataofficer", data, this.props.token);
    await getofficerprofile(data, this.props.token)
      .then((res) => {
        console.log("res:setting", res[0][0]);
        this.setState(
          {
            username: res[0][0].Off_Email,
            firstname: res[0][0].Off_Name,
            password: res[0][0].Off_Password,
            address: res[0][0].Off_Address,
            city: res[0][0].Off_City,
            state: res[0][0].Off_State,
            pincode: res[0][0].Off_Zip,
            imagePath: res[0][0].Off_Image_Path,
            phonenumber: res[0][0].Off_Phone,
            badge: res[0][0].Off_BadgeNumber,
            raceid: res[0][0].Off_RaceType.toString(),
            education: res[0][0].Off_Education,
            law: res[0][0].Off_Law_Enc_Exp.toString(),
            aboutme: res[0][0].Off_MySelf,
            training: res[0][0].Off_Training,
            military: res[0][0].Off_Military_Exp.toString(),
            officerid: res[0][0].Off_Pkey,
            qualification: res[0][0].Off_Qualification,
            agencyid: res[0][0].Off_Ag_Pkey,
            gender: res[0][0].Off_Gender.toString(),
            isLoading: false,
          },
          () => this.generateLink()
        );
        // this.props.setProfile(res[0][0]);
      })
      .catch((error) => {
        if (error.response) {
          console.log("responce_error", error.response);
          this.setState({ isLoading: false });
        } else if (error.request) {
          this.setState({ isLoading: false });
          console.log("request error", error.request);
        } else if (error) {
          // alert("Server Error");
          this.setState({ isLoading: false });
        }
      });
  };
  componentDidMount = async () => {
    this._unsubscribe = this.props.navigation.addListener("focus", () => {
      this.GetFilterData();
      this.onGetUserData();
    });
  };
  GetFilterData = async () => {
    this.setState({ isLoading: true });
    let data = {
      Type: 1,
    };
    // console.log(data);
    await getfilterdata(data)
      .then((res) => {
        console.log("res:234234 ", res[0]);
        this.setState({
          racetype: res[0].Race_DTOs,
        });

        this.setState({ isLoading: false });
      })
      .catch((error) => {
        if (error.response) {
          this.setState({ isLoading: false });
          console.log("responce_error", error.response);
        } else if (error.request) {
          this.setState({ isLoading: false });
          console.log("request error", error.request);
        } else if (error) {
          console.log("Server Error");
          this.setState({ isLoading: false });
        }
      });
  };
  onSetUserData = async () => {
    const {
      password,
      firstname,
      address,
      username,
      base64,
      imagePath,
      race,
      badge,
      education,
      law,
      military,
      training,
      aboutme,
      officerid,
      raceid,
      qualification,
      agencyid,
      gender,
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
          Off_Email: username,
          Off_Name: firstname,
          Off_Password: password,
          Off_Address: address,
          Off_BadgeNumber: badge,
          Off_RaceType: parseInt(raceid),
          Off_Education: education,
          Off_Law_Enc_Exp: law,
          Off_Military_Exp: military,
          Off_Training: training,
          Off_MySelf: aboutme,
          Off_Image_Base64: "data:image/png;base64, " + base64,
          Off_Pkey: officerid,
          Off_Qualification: qualification,
          Off_Ag_Pkey: agencyid,
          Off_Gender: gender,
        };
      } else {
        console.log("im in eleseesee");
        data = {
          Type: 2,
          Off_Email: username,
          Off_Name: firstname,
          Off_Password: password,
          Off_Address: address,
          Off_Image_Path: imagePath,
          Off_BadgeNumber: badge,
          Off_RaceType: parseInt(raceid),
          Off_Education: education,
          Off_Law_Enc_Exp: law,
          Off_Military_Exp: military,
          Off_Training: training,
          Off_MySelf: aboutme,
          Off_Pkey: officerid,
          Off_Qualification: qualification,
          Off_Ag_Pkey: agencyid,
          Off_Gender: gender,
        };
      }

      console.log("datatatata", data);
      await updateofficerprofile(data, this.props.token)
        .then((res) => {
          console.log("res:123", res);
          this.setState({
            // isedittextinput: false,
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
            // alert("Server Error");
            this.setState({ isLoading: false });
          }
        });
    }
  };
  generateLink = async () => {
    this.setState({ isLoading: true });
    console.log(
      "generateLink",
      `https://communv.page.link/form/${this.state.officerid}`
    );
    const link = await dynamicLinks().buildShortLink({
      link: `https://communv.page.link/form/${this.state.officerid}`,
      domainUriPrefix: "https://communv.page.link",
      ios: {
        bundleId: "com.avigma.communv",
        appStoreId: "1579823021",
        fallbackUrl:
          "https://apps.apple.com/us/app/com.avigma.communv/id15798230213",
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
    this.setState({ link, isLoading: false });
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
        }).then((image) => {
          console.log(image.data);
          this.setState({
            base64: image.data,
            fileName:
              Platform.OS === "ios" ? image.filename : "images" + new Date(),
            imagePath: image.path,
            chnageimage: true,
          });
        });
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
        }).then((image) => {
          console.log(image);
          this.setState({
            base64: image.data,
            fileName:
              Platform.OS === "ios" ? image.filename : "images" + new Date(),
            imagePath: image.path,
            chnageimage: true,
          });
        });
      }.bind(this),
      1000
    );
  };
  Validation = () => {
    const {
      password,
      firstname,
      training,
      military,
      address,
      badge,
      race,
      law,
      education,
    } = this.state;
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
    if (!address) {
      invalidFields.push("address");
      this.setState({ ErrorAddress: "Address is required" });
    } else {
      this.setState({ ErrorAddress: null });
    }
    if (!race) {
      invalidFields.push("race");
      this.setState({ ErrorRace: "Race is required" });
    } else {
      this.setState({ ErrorRace: null });
    }

    if (!badge) {
      invalidFields.push("badge");
      this.setState({ ErrorBadge: "Bagde Number is required" });
    } else {
      this.setState({ ErrorBadge: null });
    }
    if (!training) {
      invalidFields.push("training");
      this.setState({ ErrorTraining: "Training is required" });
    } else {
      this.setState({ ErrorTraining: null });
    }
    if (!military) {
      invalidFields.push("military");
      this.setState({ ErrorMilitary: "Military Experience is required" });
    } else {
      this.setState({ ErrorMilitary: null });
    }
    if (!law) {
      invalidFields.push("law");
      this.setState({ ErrorLaw: " Law-enforcement Experience is required" });
    } else {
      this.setState({ ErrorLaw: null });
    }
    if (!education) {
      invalidFields.push("education");
      this.setState({ ErrorEducation: " Education is required" });
    } else {
      this.setState({ ErrorEducation: null });
    }
    return invalidFields.length > 0;
  };
  managePasswordVisibility = () => {
    this.setState({ isShowPassword: !this.state.isShowPassword });
  };
  render() {
    const {
      isLoading,
      username,
      password,
      ErrorPassword,
      ErrorUserName,
      ErrorUserEmail,
      ErrorFirstName,
      firstname,
      ErrorAboutME,
      ErrorBadge,
      ErrorCPassword2,
      iseditemail,
      iseditbadge,
      address,
      isedittextinput,
      law,
      raceid,
      military,
      badge,
      aboutme,
      ErrorAddress,
      ErrorMilitary,
      ErrorLaw,
      education,
      ErrorEducation,
      isShowPassword,
      training,
      ErrorTraining,
      ErrorQualification,
      qualification,
      gender,
    } = this.state;
    return (
      <SafeAreaView>
        <HeaderArrow
          back={true}
          drawer={false}
          title={"EDIT PROFILE"}
          navigation={this.props.navigation}
        />
        <Spinner visible={isLoading} />

        <ScrollView keyboardShouldPersistTaps="always" style={{}}>
          <View style={{ marginBottom: 200 }}>
            <View
              style={{
                // backgroundColor: "pink",
                justifyContent: "space-between",
                // alignItems: "center",
                paddingVertical: 10,
                flexDirection: "row",
                marginHorizontal: 20,
              }}
            >
              <View
                style={{
                  // backgroundColor: "red",
                  width: "25%",
                }}
              >
                <TouchableOpacity onPress={() => this.onPress()}>
                  <Avatar.Image
                    source={{
                      uri: this.state.imagePath
                        ? this.state.imagePath
                        : "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Unknown_person.jpg/1200px-Unknown_person.jpg",
                    }}
                    size={90}
                  />
                </TouchableOpacity>
                {/* <View style={{ marginTop: 20 }}>
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
                </View> */}
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
              </View>
              {this.state.link && (
                <View>
                  <QRCode value={this.state.link} />
                </View>
              )}
            </View>
            <View style={{ marginHorizontal: 20 }}>
              <InputView
                title={"Email"}
                image={require("../../assets/Images/communiv/emergency/officer-setting/icon-1.png")}
                placeholder={"Email ID"}
                editable={iseditemail}
                // onEndEditing={() =>
                //   this.onEditiChange("isedittextinput", false)
                // }
                value={username}
                // editChange={() => this.onEditiChange("iseditemail", true)}
                error={ErrorUserName}
                error2={ErrorUserEmail}
                // onChangeText={(text) => this.onHandleChange("username", text)}
                height={50}
                icon={false}
              />
              <InputView
                title={"Password"}
                image={require("../../assets/Images/communiv/emergency/officer-setting/icon-2.png")}
                placeholder={"Password"}
                editable={false}
                managePasswordVisibility={() => this.managePasswordVisibility()}
                value={password}
                // editChange={() => this.onEditiChange("isedittextinput", true)}
                error={ErrorPassword}
                error2={ErrorCPassword2}
                secureTextEntry={isShowPassword}
                // onChangeText={(text) => this.onHandleChange("password", text)}
                height={50}
                icon={true}
              />
              <InputView
                title={"Name"}
                image={require("../../assets/Images/communiv/emergency/officer-setting/icon-3.png")}
                placeholder={"Name"}
                editable={isedittextinput}
                // onEndEditing={() =>
                //   this.onEditiChange("isedittextinput", false)
                // }
                value={firstname}
                editChange={() => this.onEditiChange("isedittextinput", true)}
                error={ErrorFirstName}
                onChangeText={(text) => this.onHandleChange("firstname", text)}
                height={50}
                icon={false}
              />
              {this.state.gender && (
                <View style={{ marginTop: 20 }}>
                  <Text
                    style={{
                      marginRight: 30,
                      fontWeight: "bold",
                    }}
                  >
                    Gender
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      // backgroundColor: "pink",
                      alignItems: "center",
                      justifyContent: "space-between",
                      // marginTop: 5,
                      borderBottomColor: "lightgray",
                      borderBottomWidth: 1,
                      paddingLeft: 15,
                    }}
                  >
                    <Image
                      style={{ width: 15, height: 18 }}
                      resizeMode="stretch"
                      source={require("../../assets/Images/communiv/emergency/officer-setting/icon-3.png")}
                    />
                    <View>
                      <Select
                        dropdownIcon
                        variant="unstyled"
                        isDisabled={!isedittextinput ? true : false}
                        style={{
                          fontSize: 13,
                          color: !isedittextinput ? "gray" : "black",
                        }}
                        selectedValue={gender.toString()}
                        minWidth={"90%"}
                        accessibilityLabel="Select your Gender"
                        placeholder="Select your Gender"
                        onValueChange={(itemValue) =>
                          this.setState({
                            gender: itemValue,
                          })
                        }
                        _selectedItem={{
                          bg: "#4169e1",
                          // endIcon: nu,
                        }}
                      >
                        <Select.Item label={"Male"} value={"1"} />
                        <Select.Item label={"Female"} value={"2"} />
                        <Select.Item label={"Other"} value={"3"} />
                      </Select>
                    </View>
                  </View>
                </View>
              )}

              <InputView
                title={"Address"}
                image={require("../../assets/Images/communiv/emergency/officer-setting/icon-4.png")}
                placeholder={"Address"}
                editable={isedittextinput}
                // onEndEditing={() =>
                //   this.onEditiChange("isedittextinput", false)
                // }
                value={address}
                editChange={() => this.onEditiChange("isedittextinput", true)}
                error={ErrorAddress}
                onChangeText={(text) => this.onHandleChange("address", text)}
                height={50}
                icon={false}
              />
              {this.state.racetype && (
                <View style={{ marginTop: 20 }}>
                  <Text
                    style={{
                      marginRight: 30,
                      fontWeight: "bold",
                    }}
                  >
                    Race
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      // backgroundColor: "pink",
                      alignItems: "center",
                      justifyContent: "space-between",
                      // marginTop: 5,
                      borderBottomColor: "lightgray",
                      borderBottomWidth: 1,
                      paddingLeft: 15,
                    }}
                  >
                    <Image
                      style={{ width: 20 }}
                      resizeMode="stretch"
                      source={require("../../assets/Images/communiv/emergency/officer-setting/icon-5.png")}
                    />
                    <View>
                      <Select
                        dropdownIcon
                        variant="unstyled"
                        isDisabled={!isedittextinput ? true : false}
                        style={{
                          fontSize: 13,
                          color: !isedittextinput ? "gray" : "black",
                        }}
                        selectedValue={raceid}
                        minWidth={"90%"}
                        accessibilityLabel="Select your Race type"
                        placeholder="Select Race Type"
                        onValueChange={(itemValue) =>
                          this.setState({
                            raceid: itemValue,
                          })
                        }
                        _selectedItem={{
                          bg: "#4169e1",
                          // endIcon: nu,
                        }}
                      >
                        {this.state.racetype.map((item) => {
                          return (
                            <Select.Item
                              label={item.Race_Name}
                              value={item.Race_PkeyID.toString()}
                            />
                          );
                        })}
                      </Select>
                    </View>
                    {/* <TouchableOpacity
                      onPress={() => this.onEditiChange("isedittextinput", false)}
                    >
                      <FontAwesome name="edit" size={20} />
                    </TouchableOpacity> */}
                  </View>
                </View>
              )}
              {/* <InputView
                title={"Race"}
                image={require("../../assets/Images/communiv/emergency/officer-setting/icon-5.png")}
                placeholder={"Race"}
                editable={isedittextinput}
                onEndEditing={() => this.onEditiChange("isedittextinput", false)}
                value={race}
                editChange={() => this.onEditiChange("isedittextinput", true)}
                error={ErrorRace}
                onChangeText={(text) => this.onHandleChange("race", text)}
                height={50}
              /> */}
              <InputView
                title={"Badge Number"}
                image={require("../../assets/Images/communiv/emergency/officer-setting/icon-6.png")}
                placeholder={"XXXXXXXXXXXXXXXXX"}
                editable={iseditbadge}
                // onEndEditing={() =>
                //   this.onEditiChange("isedittextinput", false)
                // }
                value={badge}
                editChange={() => this.onEditiChange("iseditbadge", true)}
                error={ErrorBadge}
                onChangeText={(text) => this.onHandleChange("badge", text)}
                height={50}
                icon={false}
              />
              {/* <InputView
                title={"Badge Number"}
                image={require("../../assets/Images/communiv/emergency/officer-setting/icon-6.png")}
                placeholder={"XXXXXXXXXXXXXXXXX"}
                editable={isedittextinput}
                onEndEditing={() => this.onEditiChange("isedittextinput", false)}
                value={badge}
                editChange={() => this.onEditiChange("isedittextinput", true)}
                error={ErrorBadge}
                onChangeText={(text) => this.onHandleChange("badge", text)}
              /> */}
              <InputView
                title={"Education"}
                image={require("../../assets/Images/communiv/emergency/officer-setting/icon-7.png")}
                placeholder={"Education"}
                editable={isedittextinput}
                // onEndEditing={() =>
                //   this.onEditiChange("isedittextinput", false)
                // }
                value={education}
                editChange={() => this.onEditiChange("isedittextinput", true)}
                error={ErrorEducation}
                onChangeText={(text) => this.onHandleChange("education", text)}
                height={50}
                icon={false}
              />
              <InputView
                title={"Law-enforcement Experience"}
                image={require("../../assets/Images/communiv/emergency/officer-setting/icon-8.png")}
                placeholder={"Law-enforcement Experience"}
                editable={isedittextinput}
                // onEndEditing={() =>
                //   this.onEditiChange("isedittextinput", false)
                // }
                value={law}
                editChange={() => this.onEditiChange("isedittextinput", true)}
                error={ErrorLaw}
                onChangeText={(text) => this.onHandleChange("law", text)}
                height={50}
                icon={false}
              />
              <InputView
                title={"Military Experience"}
                image={require("../../assets/Images/communiv/emergency/officer-setting/icon-9.png")}
                placeholder={"Military Experience"}
                editable={isedittextinput}
                // onEndEditing={() =>
                //   this.onEditiChange("isedittextinput", false)
                // }
                value={military}
                editChange={() => this.onEditiChange("isedittextinput", true)}
                error={ErrorMilitary}
                onChangeText={(text) => this.onHandleChange("military", text)}
                height={50}
                icon={false}
              />
              <InputView
                title={"Training"}
                image={require("../../assets/Images/communiv/emergency/officer-setting/icon-10.png")}
                placeholder={"Training"}
                editable={isedittextinput}
                // onEndEditing={() =>
                //   this.onEditiChange("isedittextinput", false)
                // }
                value={training}
                editChange={() => this.onEditiChange("isedittextinput", true)}
                error={ErrorTraining}
                onChangeText={(text) => this.onHandleChange("training", text)}
                height={50}
                icon={false}
              />
              <InputView
                title={"Qualification"}
                image={require("../../assets/Images/communiv/emergency/officer-setting/icon-10.png")}
                placeholder={"Qualification"}
                editable={isedittextinput}
                // onEndEditing={() =>
                //   this.onEditiChange("isedittextinput", false)
                // }
                value={qualification}
                editChange={() => this.onEditiChange("isedittextinput", true)}
                error={ErrorQualification}
                onChangeText={(text) =>
                  this.onHandleChange("qualification", text)
                }
                height={50}
                icon={false}
              />
              <InputView
                title={"About Me"}
                // image={require("../../assets/Images/communiv/emergency/officer-setting/icon-9.png")}
                placeholder={"About me"}
                editable={isedittextinput}
                // onEndEditing={() =>
                //   this.onEditiChange("isedittextinput", false)
                // }
                value={aboutme}
                editChange={() => this.onEditiChange("isedittextinput", true)}
                error={ErrorAboutME}
                onChangeText={(text) => this.onHandleChange("aboutme", text)}
                multiline={true}
                noofline={5}
                height={100}
                icon={false}
              />
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
});

const mapDispatchToProps = {
  setToken,
};
export default connect(mapStateToProps, mapDispatchToProps)(Setting);
