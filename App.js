import React, { Component, useEffect } from "react";
import { StatusBar, StyleSheet, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import MyStack from "./src/Navigation/MyStack";
import Drawer from "./src/Navigation/DrawerScreen";
import linking from "./src/Linking/Linking";
import { NativeBaseProvider } from "native-base";
import { Provider, useDispatch, useSelector } from "react-redux";
import { PersistGate } from "redux-persist/lib/integration/react";
import store, { persistor } from "./src/store";
import messaging from "@react-native-firebase/messaging";
import dynamicLinks from "@react-native-firebase/dynamic-links";
import { setNotification } from "./src/store/action/Notification/action";
import { navigationRef } from "./src/Navigation/RootNavigation";

const MyStatusBar = ({ backgroundColor, ...props }) => (
  <View style={[styles.statusBar, { backgroundColor }]}>
    <StatusBar translucent backgroundColor={backgroundColor} {...props} />
  </View>
);
function App({ navigation }) {
  const user = useSelector((state) => state.authReducer.loggedin);
  useEffect(() => {
    configurePushNotifications();
    Pushmessage();
    return () => {
      configurePushNotifications();
      Pushmessage();
    };
  });
  const Pushmessage = () => {
    this.notificationListener = messaging().onMessage(async (remoteMessage) => {
      const notification = remoteMessage.notification;
      console.log("notification", notification);
      console.log("remoteMessage", remoteMessage);

      // alert(notification);
      if (notification) {
        // dispatch(setNotification(notification));
        // Alert.alert(notification.title, notification.body, [
        //   {
        //     text: "OK",
        //     onPress: () => {
        //       alert(notification.body);
        //     },
        //     style: "cancel",
        //   },
        // ]);
      }
    });
  };
  const configurePushNotifications = async () => {
    try {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    } catch (error) {}
  };

  return (
    <NativeBaseProvider>
      <MyStatusBar
        backgroundColor="#fff"
        barStyle="light-content"
        animated={true}
      />
      <NavigationContainer linking={linking}>
        {!user ? <MyStack /> : <Drawer />}
      </NavigationContainer>
    </NativeBaseProvider>
  );
}
const AppWrapper = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  );
};
export default AppWrapper;
const STATUSBAR_HEIGHT = StatusBar.currentHeight;
const APPBAR_HEIGHT = Platform.OS === "ios" ? 44 : 56;

const styles = StyleSheet.create({
  statusBar: {
    height: STATUSBAR_HEIGHT,
  },
  appBar: {
    backgroundColor: "#fff",
    height: APPBAR_HEIGHT,
  },
});
