import React, { Component } from "react";
import {
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Image,
  FlatList,
  TouchableOpacity,
} from "react-native";
import HeaderArrow from "../CustomComponent/HeaderArrow";
import StarRating from "react-native-star-rating";
import { calllist } from "../utils/apiconfig";
import { connect } from "react-redux";
import Spinner from "react-native-loading-spinner-overlay";
import moment from "moment";

class Notification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      calldetail: [],
      isLoading: false,
      show: false,
      id: null,
    };
  }
  componentDidMount() {
    this.GetCallData();
  }
  GetCallData = async () => {
    // console.log("hiiiiiiiiiiiiiii");
    this.setState({ isLoading: true });
    let data = {
      Type: 5,
    };
    console.log("GetCallData", data);
    await calllist(data, this.props.token)
      .then((res) => {
        console.log("res:call detail2312", res[0]);
        this.setState({
          calldetail: res[0],
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
          {/* <Header
          search={true}
          notification={true}
          navigation={this.props.navigation}
        /> */}
          <HeaderArrow
            back={true}
            drawer={false}
            navigation={this.props.navigation}
            title={"NOTIFICATION"}
          />
          <ScrollView>
            <View style={{ marginBottom: 100 }}>
              <View style={{ backgroundColor: "#fff", marginHorizontal: 10 }}>
                {/* <View
                  style={{
                    flexDirection: "row",
                    paddingTop: 20,
                    marginLeft: 20,
                  }}
                >
                  <Image
                    style={{ width: 25, height: 25, marginRight: 10 }}
                    resizeMode="stretch"
                    source={require("../../assets/Images/communiv/library/notification/icon-1.png")}
                  />
                  <Text>NOTIFICATION</Text>
                </View> */}
                <Spinner visible={this.state.isLoading} />
                {this.state.calldetail.length > 0 ? (
                  <View>
                    <FlatList
                      data={this.state.calldetail}
                      renderItem={({ item, index }) => {
                        return (
                          <View
                            style={{
                              backgroundColor: "#F7F7F7",
                              marginHorizontal: 20,
                              padding: 20,
                              borderRadius: 30,
                              marginVertical: 20,
                            }}
                          >
                            <TouchableOpacity
                              onPress={() =>
                                this.setState({
                                  id: item.offuc_PkeyID,
                                  show: !this.state.show,
                                })
                              }
                              style={{
                                flexDirection: "row",
                                justifyContent: "space-evenly",
                                backgroundColor: "#fff",
                                padding: 8,
                                marginBottom: 10,
                                borderRadius: 25,
                              }}
                            >
                              <View style={{}}>
                                <Text
                                  style={{
                                    color: "#4369DD",
                                    lineHeight: 30,
                                    fontWeight: "bold",
                                  }}
                                >
                                  Officer {item.User_Name}
                                </Text>
                                <Text>Your call is complete.</Text>
                              </View>
                              <Text style={{ lineHeight: 30 }}>
                                {moment(item.Offuc_dt_Calldatetime).fromNow()}
                              </Text>
                            </TouchableOpacity>
                            {this.state.id === item.offuc_PkeyID &&
                              this.state.show && (
                                <View>
                                  <View style={{ marginLeft: 20 }}>
                                    <Text>
                                      {moment(
                                        item.Offuc_dt_Calldatetime
                                      ).format("LL")}
                                    </Text>
                                  </View>
                                  <TouchableOpacity
                                    onPress={() =>
                                      this.props.navigation.navigate(
                                        "ReviewForm",
                                        {
                                          editable: true,
                                          officer: item,
                                          type: "2",
                                        }
                                      )
                                    }
                                    style={{
                                      flexDirection: "row",
                                      justifyContent: "flex-end",
                                      marginTop: 10,
                                    }}
                                  >
                                    <Text
                                      style={{
                                        color: "#4369DD",
                                        fontWeight: "bold",
                                        marginRight: 10,
                                      }}
                                    >
                                      Review the officer
                                    </Text>
                                  </TouchableOpacity>
                                </View>
                              )}
                          </View>
                        );
                      }}
                      keyExtractor={(item) => item.offuc_PkeyID}
                    />
                  </View>
                ) : (
                  <View
                    style={{
                      // justifyContent: "center",
                      alignItems: "center",
                      marginTop: 50,
                      height: 1000,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 30,
                        fontWeight: "bold",
                        color: "#4169e1",
                      }}
                    >
                      No New Notification
                    </Text>
                  </View>
                )}
                {/* <View
                  style={{
                    backgroundColor: "#F7F7F7",
                    marginHorizontal: 20,
                    padding: 20,
                    borderRadius: 30,
                    marginVertical: 20,
                    borderColor: "#FD8519",
                    borderWidth: 2,
                  }}
                >
                  <View
                    style={{
                      backgroundColor: "#FD8519",
                      height: 20,
                      width: 20,
                      borderRadius: 50,
                      position: "absolute",
                      right: 0,
                      top: -8,
                    }}
                  />

                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text style={{ color: "#FD8519" }}>ABCY</Text>
                    <Text>now</Text>
                  </View>
                  <View>
                    <Text>May 05,2021</Text>
                  </View>
                </View>
               
                <View
                  style={{
                    backgroundColor: "#F7F7F7",
                    marginHorizontal: 20,
                    padding: 20,
                    borderRadius: 30,
                    marginVertical: 20,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text style={{ color: "#4369DD" }}>ABCY</Text>
                    <Text>4:00pm</Text>
                  </View>
                  <View>
                    <Text>May 05,2021</Text>
                  </View>
                </View> */}
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

export default connect(mapStateToProps)(Notification);
