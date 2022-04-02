import React, { Component } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Feather from "react-native-vector-icons/Feather";

export default class HeaderArrow extends Component {
  render() {
    return (
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
        {this.props.back && (
          <TouchableOpacity
            onPress={() => this.props.navigation.goBack()}
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
        )}
        {this.props.home && (
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
        )}
        {this.props.drawer && (
          <TouchableOpacity
            style={{
              width: "15%",
              alignItems: "center",
              justifyContent: "center",
              padding: 8,
              position: "absolute",
              left: 15,
            }}
            onPress={() => this.props.navigation.toggleDrawer()}
          >
            <Feather name="align-left" size={30} />
          </TouchableOpacity>
        )}
        <View>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>
            {this.props.title}
          </Text>
        </View>
      </View>
    );
  }
}
