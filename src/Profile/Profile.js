import React, { Component } from "react";
import {
  SafeAreaView,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
} from "react-native";
import Spinner from "react-native-loading-spinner-overlay";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import StarRating from "react-native-star-rating";
import HeaderArrow from "../CustomComponent/HeaderArrow";
import { getofficerprofile, getfilterdata } from "../utils/apiconfig";
import { Select } from "native-base";
import { connect } from "react-redux";
import { setToken } from "../store/action/auth/action";
import { Avatar } from "react-native-paper";
import QRCode from "react-native-qrcode-svg";
import dynamicLinks from "@react-native-firebase/dynamic-links";
const DATA = [
  {
    id: "1",
    Cat_Name: "Approachable",
  },
  {
    id: "2",
    Cat_Name: "Able to form good relationships",
  },
  {
    id: "3",
    Cat_Name: "Effective organisational skills",
  },
  {
    id: "4",
    Cat_Name: "Skills",
  },
  {
    id: "5",
    Cat_Name: "Interpersonal Skills",
  },
];
class Profile extends Component {
  constructor() {
    super();
    this.state = {
      username: null,
      firstname: null,
      password: null,
      address: null,
      city: null,
      state: null,
      pincode: null,
      imagePath: null,
      phonenumber: null,
      badge: null,
      race: null,
      education: null,
      law: null,
      aboutme: null,
      training: null,
      companyname: null,
      military: null,
      starCount: 5,
      isLoading: false,
      color: ["#2F35FE", "#CB1444", "#5D26A1", "#962174", "#BD7709"],
      racetype: null,
      officer_Categorie: [],
      qualification: null,
      training: null,
      link: null,
    };
  }
  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener("focus", () => {
      this.GetFilterData();
      this.onGetUserData();
    });
  }
  GetFilterData = async () => {
    this.setState({ isLoading: true });
    let data = {
      Type: 1,
    };
    // console.log(data);
    await getfilterdata(data)
      .then((res) => {
        console.log("res:Profilegetfilterdata", res[0].Race_DTOs);
        // console.log("res:GetFilterData", res[0]);
        this.setState({
          racetype: res[0].Race_DTOs,
          // race: res[0].Race_DTOs[0].Race_PkeyID,
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
  onGetUserData = async () => {
    this.setState({ isLoading: true });
    let data = {
      Type: 2,
    };
    console.log("minaldataofficer", data, this.props.token);
    await getofficerprofile(data, this.props.token)
      .then((res) => {
        console.log("res:profile23445", res, res[0][0]);
        this.setState({ isLoading: false });

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
            race: res[0][0].Off_RaceType.toString(),
            education: res[0][0].Off_Education,
            law: res[0][0].Off_Law_Enc_Exp,
            aboutme: res[0][0].Off_MySelf,
            military: res[0][0].Off_Military_Exp,
            companyname: res[0][0].Off_CompanyName,
            starCount: res[0][0].Off_Rating,
            officer_Categorie: res[0][0].officer_Categorie,
            training: res[0][0].Off_Training,
            qualification: res[0][0].Off_Qualification,
            isLoading: false,
            officerid: res[0][0].Off_Pkey,
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
  generateLink = async () => {
    this.setState({ isLoading: true });

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
    // const link = await dynamicLinks().buildLink({

    //   link: `https://communv.page.link/jainminals@gmail.com`,
    //   domainUriPrefix: "https://communv.page.link",
    // });
    console.log(link);
    this.setState({ link, isLoading: false });
  };
  render() {
    const { isLoading, color, starCount, officer_Categorie } = this.state;
    console.log(officer_Categorie);
    return (
      <SafeAreaView style={{ backgroundColor: "#fff", height: "100%" }}>
        <ScrollView>
          {/* <Spinner visible={isLoading} /> */}
          <View style={{ marginBottom: 100 }}>
            <HeaderArrow
              back={true}
              drawer={false}
              title={"MY PROFILE"}
              navigation={this.props.navigation}
            />
            {/* <View
              style={{
                // marginHorizontal: 20,
                // backgroundColor: "pink",
                flexDirection: "row",
                height: 60,
                justifyContent: "center",
                alignItems: "center",
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
                  position: "absolute",
                  left: 20,
                }}
              >
                <FontAwesome name="chevron-left" size={20} color="#fff" />
              </TouchableOpacity>
              <View>
                <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                  My Profile
                </Text>
              </View>
            </View> */}
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate("Setting")}
              style={{
                justifyContent: "flex-end",
                flexDirection: "row",
                paddingHorizontal: 20,
                elevation: 20,
              }}
            >
              <Text
                style={{ textDecorationLine: "underline", color: "#4169e1" }}
              >
                Edit Profile
              </Text>
            </TouchableOpacity>
            <View
              style={{
                marginHorizontal: 20,
                marginTop: 20,
                flexDirection: "row",
                // backgroundColor: "pink",
              }}
            >
              <View
                style={{
                  width: 95,
                  height: 95,
                  borderRadius: 50,
                  borderColor: "blue",
                  borderWidth: 1,
                  // padding: 5,
                  backgroundColor: "#fff",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Avatar.Image
                  source={{
                    uri: this.state.imagePath
                      ? this.state.imagePath
                      : "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Unknown_person.jpg/1200px-Unknown_person.jpg",
                  }}
                  size={90}
                />
              </View>
              <View style={{ marginLeft: 20, justifyContent: "space-evenly" }}>
                <Text style={{ color: "#4169e1", fontSize: 18 }}>
                  {this.state.badge}
                </Text>
                <Text>Military Experience</Text>
                <StarRating
                  disabled={true}
                  maxStars={5}
                  rating={starCount}
                  starSize={20}
                  emptyStarColor={"#FD9D26"}
                  fullStarColor={"#FD9D26"}
                  selectedStar={(rating) => this.onStarRatingPress1(rating)}
                />
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                marginHorizontal: 20,
                marginTop: 20,
                // backgroundColor: "pink",
              }}
            >
              <View>
                <Text
                  style={{ fontWeight: "bold", fontSize: 15, marginRight: 10 }}
                >
                  Company Name:
                </Text>
              </View>
              <View>
                <Text style={{}}>{this.state.companyname}</Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                marginHorizontal: 20,
                marginTop: 20,
                // backgroundColor: "pink",
              }}
            >
              <View>
                <Text
                  style={{ fontWeight: "bold", fontSize: 15, marginRight: 10 }}
                >
                  Badge Number:
                </Text>
              </View>
              <View>
                <Text style={{}}> {this.state.badge}</Text>
              </View>
            </View>
            <View
              style={{
                // flexDirection: "row",
                marginHorizontal: 20,
                marginTop: 8,
              }}
            >
              {this.state.racetype && this.state.race && (
                <View
                  style={{
                    flexDirection: "row",
                    // backgroundColor: "pink",
                    alignItems: "center",
                    justifyContent: "space-between",
                    // marginTop: 5,
                  }}
                >
                  <Text
                    style={{
                      // marginRight: 30,
                      fontWeight: "bold",
                      fontSize: 15,
                    }}
                  >
                    Race:
                  </Text>
                  <View>
                    <Select
                      dropdownIcon
                      variant="unstyled"
                      isDisabled={true}
                      style={{
                        fontSize: 14,
                        color: "black",
                        backgroundColor: "#ffffffff",
                      }}
                      selectedValue={this.state.race}
                      minWidth={"100%"}
                      accessibilityLabel="Select your Race type"
                      placeholder="Select Race Type"
                      onValueChange={(itemValue) =>
                        this.setState({
                          race: itemValue,
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
                </View>
              )}
            </View>
            <View
              style={{
                flexDirection: "row",
                marginHorizontal: 20,
                marginTop: 8,
                // backgroundColor: "pink",
              }}
            >
              <View>
                <Text
                  style={{ fontWeight: "bold", fontSize: 15, marginRight: 10 }}
                >
                  Education Qualification:
                </Text>
              </View>
              <View>
                <Text style={{}}>{this.state.education}</Text>
              </View>
            </View>

            <View
              style={{
                flexDirection: "row",
                marginHorizontal: 20,
                marginTop: 20,
                // backgroundColor: "pink",
              }}
            >
              <View>
                <Text
                  style={{ fontWeight: "bold", fontSize: 15, marginRight: 10 }}
                >
                  Law- enforcement Experience:
                </Text>
              </View>
              <View>
                <Text style={{}}>{this.state.law} Year</Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                marginHorizontal: 20,
                marginTop: 20,
                // backgroundColor: "pink",
              }}
            >
              <View>
                <Text
                  style={{ fontWeight: "bold", fontSize: 15, marginRight: 10 }}
                >
                  Military Experience :
                </Text>
              </View>
              <View>
                <Text style={{}}>{this.state.military} Year</Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                marginHorizontal: 20,
                marginTop: 20,
                width: "100%",
                marginRight: 20,
                // backgroundColor: "pink",
              }}
            >
              <View style={{ width: "45%" }}>
                <Text
                  style={{ fontWeight: "bold", fontSize: 15, marginRight: 10 }}
                >
                  Special Training / Qualification :
                </Text>
              </View>
              <View style={{ width: "45%" }}>
                <Text style={{}}>
                  {this.state.training}
                  {this.state.qualification && this.state.training && (
                    <Text> /</Text>
                  )}
                  {this.state.qualification}
                </Text>
              </View>
            </View>
            <View
              style={{
                marginHorizontal: 20,
                marginTop: 20,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  marginTop: 10,
                }}
              >
                {this.state.officer_Categorie &&
                  this.state.officer_Categorie.map((item, index) => {
                    return (
                      <View
                        style={{
                          padding: 10,
                          borderRadius: 30,
                          marginTop: 5,
                          backgroundColor: color[index % color.length],
                          marginRight: 10,
                        }}
                      >
                        <Text style={{ color: "#fff" }}>{item.Cat_Name}</Text>
                      </View>
                    );
                  })}
                {/* <FlatList
                  data={this.state.officer_Categorie}
                  renderItem={({ item, index }) => (
                    <View style={{ flexDirection: "row" }}>
                      <View
                        style={{
                          padding: 10,
                          borderRadius: 30,
                          marginTop: 5,
                          backgroundColor: color[index % color.length],
                        }}
                      >
                        <Text style={{ color: "#fff" }}>{item.Cat_Name}</Text>
                      </View>
                    </View>
                  )}
                  keyExtractor={(item) => item.OffcC_Cat_Pkey}
                /> */}
              </View>
            </View>
            <View
              style={{
                height: 50,
                // backgroundColor: "pink",
                marginTop: 10,
                justifyContent: "center",
                // paddingLeft: 20,
                marginHorizontal: 20,
                borderBottomColor: "gray",
                borderBottomWidth: 1,
              }}
            >
              <Text style={{ fontWeight: "bold" }}>About Me</Text>
            </View>
            <View style={{ marginHorizontal: 20, marginTop: 10 }}>
              <Text style={{ lineHeight: 25 }}>{this.state.aboutme}</Text>
            </View>
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {this.state.link && (
                <View>
                  <QRCode value={this.state.link} />
                </View>
              )}
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
export default connect(mapStateToProps, mapDispatchToProps)(Profile);
