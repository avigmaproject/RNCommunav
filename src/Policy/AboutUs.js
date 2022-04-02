import React, { Component } from "react";
import {
  SafeAreaView,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import Spinner from "react-native-loading-spinner-overlay";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import HeaderArrow from "../CustomComponent/HeaderArrow";
import AntDesign from "react-native-vector-icons/AntDesign";

export default class AboutUs extends Component {
  render() {
    return (
      <SafeAreaView style={{ backgroundColor: "#fff", height: "100%" }}>
        <ScrollView>
          {/* <Spinner visible={isLoading} /> */}
          <HeaderArrow
            back={true}
            drawer={false}
            navigation={this.props.navigation}
          />
          <View
            style={{
              marginBottom: 100,
              backgroundColor: "#F7F7F7",
              // marginHorizontal: 20,
              padding: 20,
            }}
          >
            <View
              style={{
                // backgroundColor: "pink",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 20,
                }}
              >
                {" "}
                ABOUT US{" "}
              </Text>
            </View>
            <View
              style={{
                // backgroundColor: "pink",
                alignItems: "center",
                marginTop: 20,
              }}
            >
              <Image
                style={{ width: 200, height: 50 }}
                resizeMode="stretch"
                source={require("../../assets/Images/communiv/logo.png")}
              />
              <View style={{ flexDirection: "row" }}>
                <AntDesign name="star" size={20} color="#FD9D26" />
                <AntDesign name="star" size={20} color="#FD9D26" />
                <AntDesign name="star" size={20} color="#FD9D26" />
                <AntDesign name="star" size={20} color="#FD9D26" />
                <AntDesign name="star" size={20} color="#FD9D26" />
              </View>
            </View>
            <View
              style={{
                padding: 10,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ textAlign: "center", lineHeight: 20 }}>
                Communa-V is an application that goes the community a voice. It
                allows community member to write reviews or make a complaint to
                the local police department based on interactions with officers.
                Users will be given a QR code from the police officer who
                responded to their call for service to leave a review or make a
                complaint. We calculate and assign an overall rating based on
                the feedback submitted by our users. This application also gives
                officers the opportunity to be displayed in a position light,
                with the positive reviews highlighting their strong
                communication skills, empathy, interpersonal skills, and
                devotion to serve the community. Purpose We aim to increase law
                enforcement accountability and transparency by providing a
                platform for citizens to view and contribute data. We want every
                community member to be treated the same, by providing superior
                customer service. This application will help move policing in
                the right direction. Many law enforcement agencies focus on the
                criminals and high crime areas. They forget about the victims
                and the community members who support and need police services.
                Motivation This project was started in response to the events
                that have unfolded over the past couple of years regarding law
                enforcement. The public needs a platform that will hold officers
                accountable and police officers need a platform showing how
                dedicated they are to protect and serve. We created this project
                to give them the platform they need.
              </Text>
              <Text style={{ lineHeight: 50 }}>
                Contact :- T.beaufort@live.com
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}
