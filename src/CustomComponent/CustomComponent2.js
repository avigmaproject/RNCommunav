import React, { Component } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Entypo from "react-native-vector-icons/Entypo";

export default class CustomComponent2 extends Component {
  render() {
    return (
      <TouchableOpacity
        style={{
          width: this.props.width2,
          // backgroundColor: "pink",
          justifyContent: this.props.justifyContent2,
          alignItems: this.props.alignItems,
        }}
        disabled={this.props.toggleCheckBox}
        onPress={this.props.onPress}
      >
        <LinearGradient
          colors={["#ff6e11", "#fb8217"]}
          style={{
            borderRadius: 50,
            paddingVertical: 10,
            paddingHorizontal: 20,
            flexDirection: "row",
            width: this.props.width,
            justifyContent: this.props.justifyContent,
          }}
        >
          {this.props.back ? (
            <View style={{ marginTop: 3 }}>
              <Entypo name="chevron-left" size={20} color={"#fff"} />
            </View>
          ) : null}
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              //   paddingLeft: 25,
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontWeight: "bold",
                fontSize: 17,
              }}
            >
              {this.props.title}
            </Text>
          </View>
          {this.props.next ? (
            <View style={{ marginTop: 3 }}>
              <Entypo name="chevron-right" size={20} color={"#fff"} />
            </View>
          ) : null}
        </LinearGradient>
      </TouchableOpacity>
    );
  }
}
