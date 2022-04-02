import React, { Component } from "react";
import { Text, View, TouchableOpacity } from "react-native";

export default class CustomButton extends Component {
  render() {
    return (
      <TouchableOpacity
        onPress={this.props.onPress}
        // onPress={() => this.props.navigation.navigate("Home")}
        style={{
          backgroundColor: "#4169e1",
          width: this.props.width,
          alignItems: "center",
          justifyContent: "center",
          paddingVertical: 15,
          borderRadius: 5,
          marginTop: 20,
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
          {this.props.title}
          {/* LOGIN */}
        </Text>
      </TouchableOpacity>
    );
  }
}
