import React, { Component } from "react";
import { Text, View } from "react-native";

export default class Pharegraph extends Component {
  render() {
    return (
      <View
        style={{
          flexDirection: "row",
          //   justifyContent: "center",
          //   alignItems: "center",
          //   backgroundColor: "pink",
        }}
      >
        <View style={{}}>
          <Text style={{ fontWeight: "bold", fontSize: 24 }}>{"\u2022"}</Text>
        </View>
        <View style={{ marginTop: 6, width: "94%" }}>
          <Text
            style={{ flex: 1, paddingLeft: 5, color: "gray", fontSize: 15 }}
          >
            {this.props.data}
          </Text>
        </View>
      </View>
    );
  }
}
