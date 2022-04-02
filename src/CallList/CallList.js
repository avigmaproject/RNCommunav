import React, { Component } from "react";
import { Text, View, ScrollView, FlatList, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import HeaderArrow from "../CustomComponent/HeaderArrow";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { calllist } from "../utils/apiconfig";
import { connect } from "react-redux";
import Spinner from "react-native-loading-spinner-overlay";
import moment from "moment";

class CallList extends Component {
  constructor() {
    super();
    this.state = {
      calldetail: [],
      isLoading: false,
      refreshing: true,
    };
  }
  componentDidMount = async () => {
    const unsubscribe = await this.props.navigation.addListener(
      "focus",
      (e) => {
        this.GetCallData();
      }
    );
  };
  GetCallData = async () => {
    // console.log("hiiiiiiiiiiiiiii");
    this.setState({ isLoading: true });
    let data = {
      Type: 4,
      Offuc_IsActive: true,
      // offuc_PkeyID: 9,
    };
    console.log(data);
    await calllist(data, this.props.token)
      .then((res) => {
        console.log("res:call detail2312", res[0]);
        this.setState({
          calldetail: res[0],
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
  onRefresh = () => {
    this.setState({ refreshing: true });
    this.GetCallData();
  };
  render() {
    return (
      <SafeAreaView>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh}
            />
          }
        >
          <HeaderArrow
            back={false}
            drawer={true}
            title={"TODAY'S CALL LIST"}
            navigation={this.props.navigation}
          />
          {/* <Spinner visible={isLoading} /> */}
          <View style={{ marginBottom: 100 }}>
            <Spinner visible={this.state.isLoading} />
            {this.state.calldetail.length > 0 ? (
              <View>
                <FlatList
                  data={this.state.calldetail}
                  inverted
                  renderItem={({ item, index }) => {
                    return (
                      <View
                        style={{
                          backgroundColor: "#fff",
                          marginHorizontal: 10,
                          justifyContent: "center",
                          alignItems: "center",
                          borderRadius: 20,
                          paddingVertical: 5,
                          marginTop: 5,
                        }}
                      >
                        <View
                          style={{
                            backgroundColor: "#F7F7F7",
                            marginHorizontal: 20,
                            width: "90%",
                            paddingVertical: 20,
                            borderRadius: 20,
                            paddingLeft: 20,
                            elevation: 8,
                            marginVertical: 10,
                          }}
                        >
                          <Text
                            style={{
                              color: "#4169e1",
                              textTransform: "capitalize",
                            }}
                          >
                            {item.User_Name}
                          </Text>

                          <View style={{ flexDirection: "row" }}>
                            <MaterialIcons
                              name="location-pin"
                              size={20}
                              color="#4169e1"
                              style={{ marginRight: 5 }}
                            />
                            <Text style={{ width: "70%" }}>
                              {item.Offuc_Short_Address
                                ? item.Offuc_Short_Address
                                : "Not Available"}
                            </Text>
                          </View>
                          <Text style={{ color: "lightgray" }}>
                            {moment(item.Offuc_dt_Calldatetime).fromNow()}
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
                  No Call List
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}
const mapStateToProps = (state, ownProps) => ({
  token: state.authReducer.token,
});

export default connect(mapStateToProps)(CallList);
