import React, { Component } from "react";
import {
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import Header from "../CustomComponent/Header";
import CustomComponent2 from "../CustomComponent/CustomComponent2";
import HeaderArrow from "../CustomComponent/HeaderArrow";

import Pharegraph from "../CustomComponent/Pharegraph";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Entypo from "react-native-vector-icons/Entypo";
import LinearGradient from "react-native-linear-gradient";

export default class TermsAndCondition extends Component {
  constructor() {
    super();
    this.state = {
      toggleCheckBox: true,
      show: false,
    };
  }
  componentDidMount = () => {
    console.log("showwww", this.props.route.params.show);
    this.setState({ show: this.props.route.params.show });
  };
  render() {
    // console.log(this.state.toggleCheckBox);
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
            search={false}
            notification={true}
            navigation={this.props.navigation}
            notification={() => this.props.navigation.navigate("Notification")}
          /> */}
          <HeaderArrow
            back={false}
            home={true}
            drawer={false}
            navigation={this.props.navigation}
          />
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <Text style={{ fontSize: 20, fontWeight: "bold", padding: 20 }}>
              TERMS AND CONDITIONS
            </Text>
          </View>
          <ScrollView>
            <View style={{ marginBottom: 200 }}>
              <ScrollView
                style={{
                  backgroundColor: "#EEEEEEEE",
                  marginHorizontal: 10,
                  borderRadius: 10,
                  padding: 10,
                  marginBottom: 20,
                }}
              >
                <View style={{ marginBottom: 20, flex: 1 }}>
                  <View>
                    <Pharegraph
                      data={
                        "To knowingly give a false report as to the commission of any crime to any law-enforcement official with intent to mislead"
                      }
                    />
                    <Pharegraph
                      data={
                        "To knowingly, with the intent to mislead a law-enforcement agency, cause another to give a false report to any law-enforcement official by publicly simulating a violation of Chapter 4 (§ 18.2-30 et seq.) or Chapter 5 (§ 18.2-77 et seq.); or"
                      }
                    />
                    <Pharegraph
                      data={
                        "Without just cause and with intent to interfere with the operations of any law-enforcement official, to call or summon any law-enforcement official by telephone or other means, including engagement or activation of an automatic emergency alarm. Violation of the provisions of this section shall be punishable as a Class 1 misdemeanour."
                      }
                    />
                    <Pharegraph
                      data={
                        "Code 1950, § 18.1-401; 1960, c. 358; 1975, cc. 14, 15; 1996, cc. 753, 815; 2019, cc. 471, 498."
                      }
                    />
                  </View>
                </View>
              </ScrollView>
              {this.state.show && (
                <View>
                  <View style={{ marginHorizontal: 10 }}>
                    <View
                      style={{
                        flexDirection: "row",
                        // justifyContent: "space-between",
                        alignItems: "center",
                        // backgroundColor: "pink",
                        width: "70%",
                        marginBottom: 40,
                      }}
                    >
                      <View style={{ backgroundColor: "#fff" }}>
                        {this.state.toggleCheckBox ? (
                          <TouchableOpacity
                            onPress={() =>
                              this.setState({
                                toggleCheckBox: !this.state.toggleCheckBox,
                              })
                            }
                          >
                            <Image
                              style={{
                                width: 20,
                                height: 20,
                              }}
                              resizeMode="stretch"
                              source={require("../../assets/Images/communiv/non-emergency/selected.png")}
                            />
                          </TouchableOpacity>
                        ) : (
                          <TouchableOpacity
                            onPress={() =>
                              this.setState({
                                toggleCheckBox: !this.state.toggleCheckBox,
                              })
                            }
                          >
                            <Image
                              style={{
                                width: 20,
                                height: 20,
                              }}
                              resizeMode="stretch"
                              source={require("../../assets/Images/icons/checkbox.png")}
                            />
                          </TouchableOpacity>
                        )}
                      </View>
                      <View style={{ marginLeft: "5%" }}>
                        <Text>I agree the terms and conditions</Text>
                      </View>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        // backgroundColor: "pink",
                        justifyContent: "space-between",
                        marginTop: 20,
                      }}
                    >
                      <CustomComponent2
                        onPress={() =>
                          this.props.navigation.navigate("OfficerDetail")
                        }
                        justifyContent={"space-between"}
                        toggleCheckBox={false}
                        back={true}
                        title={"BACK"}
                      />
                      {this.state.toggleCheckBox && (
                        <CustomComponent2
                          onPress={() =>
                            this.props.navigation.navigate("OffierType")
                          }
                          justifyContent={"space-between"}
                          // toggleCheckBox={!this.state.toggleCheckBox}
                          next={true}
                          title={"NEXT"}
                        />
                      )}
                    </View>
                  </View>
                </View>
              )}
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }
}
