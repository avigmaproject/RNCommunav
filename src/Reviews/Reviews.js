import React, { Component } from "react";
import { Text, View, SafeAreaView, ScrollView, FlatList } from "react-native";
import HeaderArrow from "../CustomComponent/HeaderArrow";
import AntDesign from "react-native-vector-icons/AntDesign";
import { getrating } from "../utils/apiconfig";
import { connect } from "react-redux";
import StarRating from "react-native-star-rating";
import Spinner from "react-native-loading-spinner-overlay";

class Reviews extends Component {
  constructor() {
    super();
    this.state = {
      review: [],
      isLoading: false,
    };
  }
  componentDidMount = async () => {
    const unsubscribe = await this.props.navigation.addListener(
      "focus",
      (e) => {
        this.GetRatingData();
      }
    );
  };
  GetRatingData = async () => {
    console.log("this.props.usertype", this.props.usertype);
    this.setState({ isLoading: true });
    let data;
    if (this.props.usertype) {
      data = {
        Type: 4,
      };
    } else {
      data = {
        Type: 5,
      };
    }

    console.log(data, this.props.token);
    await getrating(data, this.props.token)
      .then((res) => {
        console.log("res:Review", res);
        this.setState({
          review: res[0],
        });

        this.setState({ isLoading: false, refreshing: false });
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
  render() {
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
          <HeaderArrow
            back={true}
            drawer={false}
            navigation={this.props.navigation}
            title={"MY REVIEWS"}
          />
          <ScrollView>
            {this.state.review.length > 0 ? (
              <View style={{ marginBottom: 100 }}>
                <FlatList
                  data={this.state.review}
                  // inverted
                  renderItem={({ item, index }) => {
                    return (
                      <View
                        style={{
                          backgroundColor: "#fff",
                          marginHorizontal: 10,
                          borderRadius: 20,
                          elevation: 9,
                          // marginTop: 10,
                          marginVertical: 5,
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
                            style={{
                              color: "#4169e1",
                              fontWeight: "bold",
                              textTransform: "capitalize",
                            }}
                          >
                            {!this.props.usertype ? "Officer " : ""}
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
                  marginTop: 50,
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
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }
}
const mapStateToProps = (state, ownProps) => ({
  token: state.authReducer.token,
  profile: state.profileReducer.profile,
  usertype: state.authReducer.usertype,
});

export default connect(mapStateToProps)(Reviews);
