import React, { Component } from "react";
import {
  Text,
  View,
  ScrollView,
  TextInput,
  Image,
  TouchableOpacity,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import EvilIcons from "react-native-vector-icons/EvilIcons";
export default class InputView extends Component {
  render() {
    return (
      <View>
        <Text
          style={{
            marginTop: 15,
            marginRight: 30,
            fontWeight: "bold",
          }}
        >
          {this.props.title}
        </Text>
        <View
          style={{
            // backgroundColor: "pink",
            borderBottomColor: "lightgray",
            borderBottomWidth: 1,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            paddingLeft: 15,
          }}
        >
          <Image
            style={{ height: 18, width: 15 }}
            resizeMode={"stretch"}
            source={this.props.image}
          />
          {/* <MaterialCommunityIcons
            name={this.props.titleicon}
            size={20}
            //   style={{ marginRight: 20 }}
            color="#4169e1"
          /> */}
          <TextInput
            placeholder={this.props.placeholder}
            editable={this.props.editable}
            // keyboardType="email-address"
            placeholderTextColor="gray"
            onEndEditing={this.props.onEndEditing}
            style={{
              width: this.props.icon ? "90%" : "95%",
              paddingLeft: 20,
              // backgroundColor: "red",
              height: this.props.height,
            }}
            secureTextEntry={this.props.secureTextEntry}
            onChangeText={this.props.onChangeText}
            value={this.props.value}
            multiline={this.props.multiline}
            numberOfLines={this.props.noofline}
          />
          {this.props.icon && (
            <TouchableOpacity
              onPress={() => this.props.managePasswordVisibility()}
            >
              {this.props.secureTextEntry ? (
                <FontAwesome name="eye" size={20} />
              ) : (
                <FontAwesome name="eye-slash" size={20} />
              )}
            </TouchableOpacity>
          )}
        </View>
        <View style={{ width: "90%" }}>
          {this.props.error && (
            <Text style={{ color: "red", marginTop: 5, marginRight: 30 }}>
              {this.props.error}
            </Text>
          )}
        </View>
        <View style={{ width: "90%" }}>
          {this.props.error2 && (
            <Text style={{ color: "red", marginTop: 5, marginRight: 30 }}>
              {this.props.error2}
            </Text>
          )}
        </View>
      </View>
    );
  }
}
