import React, { Component } from "react";
import {
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import HeaderArrow from "../CustomComponent/HeaderArrow";
import StarRating from "react-native-star-rating";
import CustomComponent2 from "../CustomComponent/CustomComponent2";
import { getofficerdata } from "../utils/apiconfig";
import Spinner from "react-native-loading-spinner-overlay";
import { connect } from "react-redux";
import { Avatar } from "react-native-paper";

class SubmitOfficer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      starCount: 5,
      link: null,
      id: null,
      isLoading: false,
      batchnumber: null,
      aboutme: "",
      imagePath: null,
      officerdata: {
        starCount: 5,
        link: null,
        id: null,
        isLoading: false,
        batchnumber: null,
        aboutme: "",
        imagePath: null,
      },
    };
  }
  componentDidMount = async () => {
    const unsubscribe = await this.props.navigation.addListener(
      "focus",
      async (e) => {
        console.log("editablelinklink", this.props.route.params.link);
        const { url } = this.props.route.params.link;
        console.log("url at submitofficer", url);
        this.setState({ link: this.props.route.params.link.url });
        const spliturl = url.split("/");
        console.log("spliturl", spliturl[4]);
        this.setState(
          {
            id: spliturl[4],
          },
          () => this.getOfficer()
        );
      }
    );
  };
  onHandleSubmitReview = () => {
    this.props.navigation.navigate("ReviewForm", {
      type: "2",
      officerdata: this.state.officerdata,
      editable: true,
    });
  };
  onHandleSubmitComplain = () => {
    this.props.navigation.navigate("ReviewForm", {
      type: "1",
      officerdata: this.state.officerdata,
      editable: true,
    });
  };

  getOfficer = async () => {
    this.setState({ isLoading: true });
    if (this.state.id) {
      let data = {
        Off_Pkey: this.state.id, // 1, // this.state.id,
        // Off_Ag_Pkey: 0, //this.state.id,
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
            officerdata: res[0][0],
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
    console.log(this.state.officerdata);
    return (
      <SafeAreaView
        style={{
          backgroundColor: "#F7F7F7",
          height: "100%",
          flex: 1,
        }}
      >
        <Spinner visible={this.state.isLoading} />

        <View>
          {/* <Header
          search={true}
          notification={true}
          navigation={this.props.navigation}
        /> */}
          <HeaderArrow
            back={true}
            drawer={false}
            navigation={this.props.navigation}
            // title={"LIBRARY"}
          />
          <ScrollView>
            <View style={{ marginBottom: 100 }}>
              <View
                style={{
                  // backgroundColor: "pink",
                  // width: "20%",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    width: 110,
                    height: 110,
                    borderColor: "blue",
                    borderWidth: 1,
                    borderRadius: 80,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {this.state.imagePath ? (
                    <Avatar.Image
                      source={{
                        uri: this.state.imagePath,
                      }}
                      size={100}
                    />
                  ) : (
                    // <Image
                    //   style={{
                    //     width: 100,
                    //     height: 100,
                    //     borderRadius: 50,
                    //   }}
                    //   resizeMode="stretch"
                    //   source={{ uri: this.state.imagePath }}
                    // />
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
                    {this.state.batchnumber}
                  </Text>
                  <Text style={{ textAlign: "center", lineHeight: 40 }}>
                    Military experience
                  </Text>

                  <StarRating
                    disabled={true}
                    maxStars={5}
                    rating={this.state.starCount}
                    starSize={20}
                    emptyStarColor={"#FD9D26"}
                    fullStarColor={"#FD9D26"}
                    selectedStar={(rating) => this.onStarRatingPress1(rating)}
                  />
                </View>
                <View style={{ padding: 20, height: 150, width: "70%" }}>
                  <ScrollView>
                    <Text style={{ lineHeight: 20 }}>
                      {this.state.aboutme}
                      {/* Lorem ipsum dolor sit amet, consectetur adipiscing
                    elit.Curabitur at nisl maximus, facilisis nibh vitae,
                    consecteturmi. Etiam tempus ultrices dolor a consequat. */}
                    </Text>
                  </ScrollView>
                </View>
              </View>
              <View
                style={
                  {
                    // justifyContent: "center",
                    // alignItems: "center",
                    // backgroundColor: "pink",
                  }
                }
              >
                <CustomComponent2
                  justifyContent2={"center"}
                  justifyContent={"center"}
                  width={"60%"}
                  width2={"100%"}
                  title={"Write a Review"}
                  alignItems={"center"}
                  onPress={() => this.onHandleSubmitReview()}
                />
                <View style={{ marginTop: 20 }}>
                  <CustomComponent2
                    justifyContent={"center"}
                    justifyContent2={"center"}
                    alignItems={"center"}
                    width={"60%"}
                    width2={"100%"}
                    title={"Submit a Complaint"}
                    onPress={() => this.onHandleSubmitComplain()}
                  />
                </View>
                {/* <TouchableOpacity
                  onPress={() => this.props.navigation.navigate("ReviewForm")}
                  style={{
                    backgroundColor: "#FD8519",
                    padding: 20,
                    borderRadius: 40,
                    marginBottom: 20,
                  }}
                >
                  <Text style={{ color: "#fff", fontWeight: "bold" }}>
                    Write a Review
                  </Text>
                </TouchableOpacity> */}
                {/* <TouchableOpacity
                  onPress={() => this.props.navigation.navigate("ReviewForm")}
                  style={{
                    backgroundColor: "#FD8519",
                    padding: 20,
                    borderRadius: 40,
                  }}
                >
                  <Text style={{ color: "#fff", fontWeight: "bold" }}>
                    Submit a complain
                  </Text>
                </TouchableOpacity> */}
              </View>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }
}
const mapStateToProps = (state, ownProps) => ({
  token: state.authReducer.token,
});

const mapDispatchToProps = {
  // setToken,
};
export default connect(mapStateToProps, mapDispatchToProps)(SubmitOfficer);
