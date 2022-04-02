import React, { Component } from "react";
import {
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Image,
  StyleSheet,
  FlatList,
} from "react-native";
import HeaderArrow from "../CustomComponent/HeaderArrow";
import StarRating from "react-native-star-rating";
import AntDesign from "react-native-vector-icons/AntDesign";
import CustomButton from "../CustomComponent/CustomButton";
import { connect } from "react-redux";
import { Item } from "react-native-paper/lib/typescript/components/List/List";
import { Avatar } from "react-native-paper";
import { getofficerdata } from "../utils/apiconfig";
import Spinner from "react-native-loading-spinner-overlay";

class OfficerDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      officerdata: [],
      id: null,
      batchnumber: null,
      starCount: null,
      aboutme: null,
      imagePath: null,
      ratings: [],
      isLoading: false,
      racetype: [],
      race: 0,
      racename: null,
    };
  }
  componentDidMount() {
    this.focusListener = this.props.navigation.addListener(
      "focus",
      async () => {
        this.getOfficer();
      }
    );
  }

  getOfficer = async () => {
    this.setState({ isLoading: true, ratings: [], race: null, racename: null });
    if (this.props.officer.Off_Pkey) {
      let data = {
        Off_Pkey: this.props.officer.Off_Pkey,
        Type: 4,
      };
      console.log(data);
      await getofficerdata(data, this.props.token)
        .then((res) => {
          console.log("res:getOfficer ", res);
          this.setState({
            batchnumber: res[0][0].Off_BadgeNumber,
            starCount: res[0][0].Off_Rating,
            aboutme: res[0][0].Off_MySelf,
            imagePath: res[0][0].Off_Image_Path,
            ratings: res[0][0].Ratings,
            race: res[0][0].Off_RaceType,
            racename: res[0][0].Race_Name,
            isLoading: false,
          });
        })
        .catch((error) => {
          if (error.response) {
            this.setState({ isLoading: false });
            console.log("responce_error", error.response);
          } else if (error.request) {
            this.setState({ isLoading: false });
            console.log("request error", error.request);
          } else if (error) {
            console.log("error", error);
            this.setState({ isLoading: false });
          }
        });
    } else {
      this.getOfficer();
    }
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
          <HeaderArrow
            back={true}
            drawer={false}
            navigation={this.props.navigation}
            // title={"LIBRARY"}
          />
          <ScrollView>
            <Spinner visible={this.state.isLoading} />
            <View style={{ marginBottom: 100 }}>
              <View
                style={{
                  width: 110,
                  height: 110,
                  borderColor: "blue",
                  borderWidth: 1,
                  borderRadius: 80,
                  justifyContent: "center",
                  alignItems: "center",
                  alignSelf: "center",
                }}
              >
                {this.props.officer.Off_Image_Path ? (
                  <Avatar.Image
                    source={{
                      uri: this.props.officer.Off_Image_Path,
                    }}
                    size={90}
                  />
                ) : (
                  <Image
                    style={{
                      width: 100,
                      height: 100,
                      borderRadius: 80,
                    }}
                    resizeMode="stretch"
                    source={require("../../assets/Images/communiv/library/home-screen/icon-3.png")}
                  />
                )}
              </View>
              <View
                style={{
                  marginTop: 30,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "#4169e1", fontSize: 20 }}>
                  {this.props.officer.Off_BadgeNumber
                    ? this.props.officer.Off_BadgeNumber
                    : "XXXXXXXX"}
                </Text>
                <Text style={{ textAlign: "center", lineHeight: 40 }}>
                  Military experience
                </Text>

                <StarRating
                  disabled={true}
                  maxStars={5}
                  rating={this.props.officer.Off_Rating}
                  starSize={20}
                  emptyStarColor={"#FD9D26"}
                  fullStarColor={"#FD9D26"}
                  selectedStar={(rating) => this.onStarRatingPress1(rating)}
                />
              </View>

              <View style={{ paddingHorizontal: 30, paddingVertical: 20 }}>
                <View style={{ flexDirection: "row" }}>
                  <Text style={styles.title}>Officer </Text>
                  <Text
                    style={{
                      ...styles.title,
                      textTransform: "capitalize",
                      color: "#4169e1",
                    }}
                  >
                    {this.props.officer.Off_Name}
                  </Text>
                </View>
                <View style={{ flexDirection: "row" }}>
                  <Text style={styles.title}>
                    Law- enforcement Experience:{" "}
                  </Text>
                  <Text
                    style={{
                      ...styles.title,
                      textTransform: "capitalize",
                      color: "#4169e1",
                    }}
                  >
                    {this.props.officer.Off_Law_Enc_Exp} Year
                  </Text>
                </View>

                <View style={{ flexDirection: "row" }}>
                  <Text style={styles.title}>Military Experience: </Text>
                  <Text
                    style={{
                      ...styles.title,
                      textTransform: "capitalize",
                      color: "#4169e1",
                    }}
                  >
                    {this.props.officer.Off_Military_Exp} Year
                  </Text>
                </View>
                <View style={{ flexDirection: "row" }}>
                  <Text style={styles.title}>Race Name: </Text>
                  <Text
                    style={{
                      ...styles.title,
                      textTransform: "capitalize",
                      color: "#4169e1",
                    }}
                  >
                    {this.state.racename}
                  </Text>
                </View>
                <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                  <Text style={styles.title}>About Me: </Text>
                  <Text
                    style={{
                      ...styles.title,
                      textTransform: "capitalize",
                      color: "#4169e1",
                      // lineHeight: 20,
                    }}
                  >
                    {this.props.officer.Off_MySelf}
                  </Text>
                </View>
              </View>

              <View
                style={{
                  borderBottomColor: "lightgray",
                  borderBottomWidth: 2,
                  marginHorizontal: 20,
                  marginBottom: 10,
                }}
              />
              <View>
                {this.state.ratings.length > 0 ? (
                  <View>
                    <FlatList
                      data={this.state.ratings}
                      inverted
                      renderItem={({ item, index }) => {
                        return (
                          <View
                            style={{
                              backgroundColor: "#fff",
                              marginHorizontal: 10,
                              borderRadius: 20,
                              elevation: 9,
                              marginBottom: 20,
                            }}
                          >
                            <View
                              style={{
                                justifyContent: "space-between",
                                flexDirection: "row",
                                paddingHorizontal: 20,
                                paddingVertical: 10,
                              }}
                            >
                              <Text
                                style={{ color: "#4169e1", fontWeight: "bold" }}
                              >
                                {item.Name}
                              </Text>
                              <View style={{ flexDirection: "row" }}>
                                <StarRating
                                  disabled={true}
                                  maxStars={5}
                                  rating={item.Rat_Average}
                                  starSize={20}
                                  emptyStarColor={"#FD9D26"}
                                  fullStarColor={"#FD9D26"}
                                  selectedStar={(rating) =>
                                    this.onStarRatingPress1(rating)
                                  }
                                />
                              </View>
                            </View>
                            <View
                              style={{
                                borderTopWidth: 1,
                                borderTopColor: "lightgray",
                              }}
                            ></View>
                            <View style={{ padding: 20 }}>
                              <Text style={{ lineHeight: 20 }}>
                                {item.Rat_Comment}
                              </Text>
                            </View>
                          </View>
                        );
                      }}
                      keyExtractor={(item) => item.offuc_PkeyID}
                    />
                  </View>
                ) : (
                  <View
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      marginTop: 10,
                      marginBottom: 10,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 30,
                        fontWeight: "bold",
                        color: "#4169e1",
                      }}
                    >
                      No Review
                    </Text>
                  </View>
                )}
              </View>
              {/* // this.state.ratings.map((item) => {
                //   return (
                //     <View
                //       style={{
                //         backgroundColor: "#fff",
                //         marginHorizontal: 10,
                //         borderRadius: 20,
                //         elevation: 9,
                //         marginTop: 20,
                //       }}
                //     >
                //       <View
                //         style={{
                //           justifyContent: "space-between",
                //           flexDirection: "row",
                //           paddingHorizontal: 20,
                //           paddingVertical: 10,
                //         }}
                //       >
                //         <Text style={{ color: "#4169e1", fontWeight: "bold" }}>
                //           {item.Name}
                //         </Text>
                //         <View style={{ flexDirection: "row" }}>
                //           <StarRating
                //             disabled={true}
                //             maxStars={5}
                //             rating={item.Rat_Average}
                //             starSize={20}
                //             emptyStarColor={"#FD9D26"}
                //             fullStarColor={"#FD9D26"}
                //             selectedStar={(rating) =>
                //               this.onStarRatingPress1(rating)
                //             }
                //           />
                //         </View>
                //       </View>
                //       <View
                //         style={{
                //           borderTopWidth: 1,
                //           borderTopColor: "lightgray",
                //         }}
                //       ></View>
                //       <View style={{ padding: 20 }}>
                //         <Text style={{ lineHeight: 20 }}>
                //           {item.Rat_Comment}
                //         </Text>
                //       </View>
                //     </View>
                //   );
                // })
                 */}

              <View>
                <View
                  style={{ justifyContent: "center", alignItems: "center" }}
                >
                  <CustomButton
                    onPress={() =>
                      this.props.navigation.navigate("TermsAndCondition", {
                        show: true,
                      })
                    }
                    title={"Select Officer"}
                    width={"40%"}
                  />
                  {/* <TouchableOpacity
                    // onPress={() => this.onPressLogin()}
                    onPress={() =>
                      this.props.navigation.navigate("OffierType")
                    }
                    style={{
                      backgroundColor: "#4169e1",
                      width: "40%",
                      alignItems: "center",
                      justifyContent: "center",
                      paddingVertical: 15,
                      borderRadius: 5,
                      marginTop: 20,
                    }}
                  >
                    <Text
                      style={{
                        color: "#fff",
                        fontWeight: "bold",
                        fontSize: 16,
                      }}
                    >
                      Select Officer
                    </Text>
                  </TouchableOpacity> */}
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }
}
const mapStateToProps = (state, ownProps) => ({
  officer: state.officerReducer.officer,
  token: state.authReducer.token,
});
const styles = StyleSheet.create({
  title: {
    lineHeight: 30,
    fontWeight: "bold",
    fontSize: 15,
  },
});

export default connect(mapStateToProps)(OfficerDetail);
