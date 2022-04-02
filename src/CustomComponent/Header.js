import React, { Component } from "react";
import { Text, View, Image, TouchableOpacity } from "react-native";
import Feather from "react-native-vector-icons/Feather";
import Ionicons from "react-native-vector-icons/Ionicons";

export default class Header extends Component {
  render() {
    return (
      <View>
        <View
          style={{
            height: 50,
            backgroundColor: "#F6F6F6",
            width: "100%",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* //navigation.openDrawer(); */}

          <TouchableOpacity
            style={{
              // backgroundColor: "orange",
              width: "20%",
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => this.props.navigation.toggleDrawer()}
          >
            <Feather name="align-left" size={30} />
          </TouchableOpacity>
          <View
            style={{
              marginTop: 20,
              // backgroundColor: "red",
              width: "60%",
              alignItems: "center",
              // alignSelf: "center",
            }}
          >
            <Image
              style={{ width: 200, height: 50 }}
              resizeMode="stretch"
              source={require("../../assets/Images/communiv/logo.png")}
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              // backgroundColor: "pink",
              width: "20%",
              justifyContent: this.props.search ? "space-around" : "center",
            }}
          >
            {this.props.search && (
              <TouchableOpacity onPress={this.props.onPress}>
                {/* //</View>{this.props.notification} */}
                <Feather name="search" size={30} />
              </TouchableOpacity>
            )}

            {this.props.notification && (
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate("Notification")}
              >
                {/* //</View>{this.props.notification} */}
                <Ionicons name="notifications" size={30} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    );
  }
}
