import React, { Component } from "react";
import { Text, View, SafeAreaView, ScrollView, Image } from "react-native";
import Header from "../CustomComponent/Header";
import HeaderArrow from "../CustomComponent/HeaderArrow";
import LibraryCustom from "../CustomComponent/LibraryCustom";
export default class Library extends Component {
  render() {
    return (
      <SafeAreaView
        style={{
          backgroundColor: "#F7F7F7",
          height: "100%",
          flex: 1,
        }}
      >
        <View>
          {/* <Header
            search={true}
            notification={true}
            navigation={this.props.navigation}
          /> */}
          <HeaderArrow
            back={true}
            drawer={false}
            navigation={this.props.navigation}
            title={"LIBRARY"}
          />
          <ScrollView>
            <View style={{ marginBottom: 100 }}>
              <LibraryCustom
                text={"HAZARD"}
                image={require("../../assets/Images/communiv/library/library/icon-1.png")}
              />
              <LibraryCustom
                text={"SAFE SYSTEM OF WORK"}
                image={require("../../assets/Images/communiv/library/library/icon-2.png")}
              />
              <LibraryCustom
                text={"RISK MANAGEMENT"}
                image={require("../../assets/Images/communiv/library/library/icon-3.png")}
              />
              <LibraryCustom
                text={"TRAINING NEED"}
                image={require("../../assets/Images/communiv/library/library/icon-4.png")}
              />
              <LibraryCustom
                text={"HEALTH AND SAFETY UPDATES"}
                image={require("../../assets/Images/communiv/library/library/icon-5.png")}
              />
              <LibraryCustom
                text={"ACCIDENTS INVESTIGATION"}
                image={require("../../assets/Images/communiv/library/library/icon-6.png")}
              />
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }
}
