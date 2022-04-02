import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { useDispatch, useSelector } from "react-redux";

import DrawerContant from "../Navigation/DrawerContant";
import Home from "../Home/Home";
import Profile from "../Profile/Profile";
import EditProfile from "../Profile/EditProfile";
import TermsAndCondition from "../Policy/TermsAndCondition";
import CallList from "../CallList/CallList";
import AboutUs from "../Policy/AboutUs";
import Library from "../Library/Library";
import Reviews from "../Reviews/Reviews";
import OfficerList from "../OfficerList/OfficerList";
import ReviewForm from "../Reviews/ReviewForm";
import Notification from "../Notification/Notification";
import Setting from "../Setting/Setting";
import SuccessPage1 from "../Home/SuccessPage1";
import OfficerDetail from "../OfficerList/OfficerDetail";
import SubmitOfficer from "../OfficerList/SubmitOfficer";
import OffierType from "../OfficerList/OffierType";
import Barcode from "../Barcode/Barcode";
import QRcode from "../Barcode/QRcode";

const Drawer = createDrawerNavigator();

export default DrawerScreen = () => {
  const user = useSelector((state) => state.authReducer.usertype);
  console.log("offieeroruserselection123", user);
  return (
    <Drawer.Navigator drawerContent={(props) => <DrawerContant {...props} />}>
      {user ? (
        <Drawer.Screen name="CallList" component={CallList} />
      ) : (
        <Drawer.Screen name="Home" component={Home} />
      )}
      <Drawer.Screen name="SuccessPage1" component={SuccessPage1} />
      <Drawer.Screen name="Reviews" component={Reviews} />
      <Drawer.Screen name="OffierType" component={OffierType} />
      <Drawer.Screen name="Barcode" component={Barcode} />
      <Drawer.Screen name="QRcode" component={QRcode} />
      <Drawer.Screen name="OfficerDetail" component={OfficerDetail} />
      <Drawer.Screen name="SubmitOfficer" component={SubmitOfficer} />
      <Drawer.Screen name="Profile" component={Profile} />
      <Drawer.Screen name="ReviewForm" component={ReviewForm} />
      <Drawer.Screen name="OfficerList" component={OfficerList} />
      <Drawer.Screen name="Setting" component={Setting} />
      <Drawer.Screen name="Library" component={Library} />
      <Drawer.Screen name="AboutUs" component={AboutUs} />
      <Drawer.Screen name="Notification" component={Notification} />
      <Drawer.Screen name="EditProfile" component={EditProfile} />
      <Drawer.Screen name="TermsAndCondition" component={TermsAndCondition} />
    </Drawer.Navigator>
  );
};
