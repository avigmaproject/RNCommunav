import React, { Component } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import Entypo from "react-native-vector-icons/Entypo";
export default class SocialLogin extends Component {
  render() {
    return (
      <View style={{ alignItems: "center" }}>
        <View style={{ marginTop: 30, marginBottom: 10 }}>
          <Text style={{ color: "#4169e1", fontWeight: "bold" }}>
            OR Connect with
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            width: "30%",
            // backgroundColor: "red",
            justifyContent: "space-around",
          }}
        >
          <TouchableOpacity
            onPress={this.props.onPressFacebook}
            style={{
              borderColor: "#39579B",
              borderWidth: 2,
              borderRadius: 50,
              padding: 3,
            }}
          >
            <Entypo name="facebook-with-circle" size={40} color={"#39579B"} />
          </TouchableOpacity>
          {/* <TouchableOpacity
            onPress={this.props.onPressTwitter}
            style={{
              borderColor: "#3F99FE",
              borderWidth: 2,
              borderRadius: 50,
              padding: 3,
            }}
          >
            <Entypo name="twitter-with-circle" size={40} color={"#3F99FE"} />
          </TouchableOpacity> */}
          <TouchableOpacity
            onPress={this.props.onPressGmail}
            style={{
              borderColor: "#DC4B38",
              borderWidth: 2,
              borderRadius: 50,
              padding: 3,
            }}
          >
            <Entypo name="google--with-circle" size={40} color={"#DC4B38"} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
