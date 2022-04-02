import React, { Component } from "react";
import { Text, View, Image, TouchableOpacity } from "react-native";
export default class HomeIcon extends Component {
  render() {
    return (
      <TouchableOpacity
        onPress={this.props.onPress}
        style={{
          backgroundColor: "#fff",
          marginTop: 50,
          width: "50%",
          justifyContent: "center",
          alignItems: "center",
          marginRight: 10,
          borderRadius: 20,
        }}
      >
        <View style={{ position: "absolute", top: -30 }}>
          <Image
            style={{ width: 60, height: 73 }}
            resizeMode="stretch"
            source={this.props.image}
          />
        </View>
        <View
          style={{
            marginTop: 50,
            justifyContent: "center",
            alignItems: "center",
            paddingBottom: 10,
          }}
        >
          <Text style={{ fontSize: 16, textAlign: "center" }}>
            {this.props.text1}
          </Text>
          <Text style={{ fontSize: 16, textAlign: "center" }}>
            {this.props.text2}
          </Text>
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 20,
              color: "#4169e1",
              textAlign: "center",
            }}
          >
            {this.props.title}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}
