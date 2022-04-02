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
import FontAwesome from "react-native-vector-icons/FontAwesome";

export default class SuccessPage1 extends Component {
  componentDidMount = () => {
    console.log(this.props.route.params.text);
  };
  render() {
    return (
      <SafeAreaView
        style={{
          backgroundColor: "#fff",
          height: "100%",
          flex: 1,
        }}
      >
        <View>
          <View
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
              onPress={() => this.props.navigation.navigate("Home")}
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
          </View>
          <View
            style={{
              // backgroundColor: "pink",
              height: "75%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              style={{ width: 100, height: 100 }}
              resizeMode="stretch"
              source={require("../../assets/Images/communiv/emergency/check.png")}
            />
            <View
              style={{
                // backgroundColor: "pink",
                width: "60%",
                justifyContent: "center",
                alignItems: "center",
                marginTop: 20,
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  lineHeight: 20,
                  color: "#8CA3E5",
                  fontSize: 20,
                  fontWeight: "bold",
                }}
              >
                {this.props.route.params.text}
              </Text>
            </View>
            {this.props.login && (
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate("Login")}
                style={{ marginTop: 20 }}
              >
                <Text style={{ color: "#DDA84C" }}>Login Now</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </SafeAreaView>
    );
  }
}
