import React from "react";
import { View, Text } from "react-native";
import Login from "../Auth/Login";
import SignUp from "../Auth/SignUp";
import ForgotPassword from "../Auth/ForgotPassword";
import ResetPassword from "../Auth/ResetPassword";
import SuccessPage from "../Auth/SuccessPage";
import DrawerScreen from "../Navigation/DrawerScreen";
import { createStackNavigator } from "@react-navigation/stack";
const Stack = createStackNavigator();

export default function MyStack() {
  return (
    <Stack.Navigator headerMode={"none"}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="SuccessPage" component={SuccessPage} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen name="ResetPassword" component={ResetPassword} />
      <Stack.Screen name="Home" component={DrawerScreen} />
    </Stack.Navigator>
  );
}
