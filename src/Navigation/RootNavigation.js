import * as React from "react";
import { StackActions } from "@react-navigation/routers";

export const navigationRef = React.createRef();

export function navigate(name) {
  navigationRef.current &&
    navigationRef.current.dispatch(StackActions.push(name));
}
