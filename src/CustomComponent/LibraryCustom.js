import React, { Component } from "react";
import { Text, View, Image, TouchableOpacity } from "react-native";

export default class LibraryCustom extends Component {
  render() {
    return (
      <TouchableOpacity
        onPress={this.props.onPress}
        style={{
          backgroundColor: "white",
          marginHorizontal: 20,
          borderRadius: 20,
          flexDirection: "row",
          //   justifyContent: "center",
          alignItems: "center",
          padding: this.props.padding,
          marginTop: 20,
        }}
      >
        <View style={{}}>
          <Image
            style={{ width: 60, height: 65 }}
            resizeMode="stretch"
            source={this.props.image}
          />
        </View>
        <View style={{ marginHorizontal: "10%" }}>
          <Text style={{ fontWeight: "bold" }}>{this.props.text}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}
