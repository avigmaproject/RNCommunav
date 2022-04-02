import React, { Component } from "react";
import { Text, View } from "react-native";
import QRCode from "react-native-qrcode-svg";

export default class QRcode extends Component {
  render() {
    return (
      <View>
        <QRCode value="https://communv.page.link/barcoder" />
      </View>
    );
  }
}
