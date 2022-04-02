import React, { Component } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  Linking,
  StyleSheet,
} from "react-native";
import QRCodeScanner from "react-native-qrcode-scanner";
import { SafeAreaView } from "react-native-safe-area-context";
import HeaderArrow from "../CustomComponent/HeaderArrow";

export default class Barcode extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      takingPic: false,
    };
  }
  onSuccess = async (link) => {
    console.log("barcodelink", link);
    Linking.openURL(link.data);
  };

  render() {
    return (
      <QRCodeScanner
        onRead={this.onSuccess}
        // flashMode={RNCamera.Constants.FlashMode.torch}
        topContent={
          <View style={{ width: "100%", height: "100%" }}>
            <HeaderArrow
              back={true}
              drawer={false}
              navigation={this.props.navigation}
            />
          </View>
        }
        // bottomContent={
        //   <TouchableOpacity
        //     onPress={() => this.props.navigation.navigate("Home")}
        //     style={styles.buttonTouchable}
        //   >
        //     <Text style={styles.buttonText}>OK. Got it!</Text>
        //   </TouchableOpacity>
        // }
      />
    );
  }
}
const styles = StyleSheet.create({
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: "#777",
  },
  textBold: {
    fontWeight: "500",
    color: "#000",
  },
  buttonText: {
    fontSize: 21,
    color: "rgb(0,122,255)",
  },
  buttonTouchable: {
    padding: 16,
  },
});
