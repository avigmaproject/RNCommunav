import React, { useState, useEffect } from "react";
import { View, StyleSheet, Share, TouchableOpacity } from "react-native";
import {
  useTheme,
  Avatar,
  Title,
  Caption,
  Paragraph,
  Drawer,
  Text,
  TouchableRipple,
  Switch,
} from "react-native-paper";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { userprofile, getofficerprofile } from "../utils/apiconfig";
import { connect } from "react-redux";
import { setToken, signout, setUserType } from "../store/action/auth/action";
import { setProfile } from "../store/action/Profile/action";
import { useDispatch, useSelector } from "react-redux";
import { LoginManager, LoginButton } from "react-native-fbsdk";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import Octicons from "react-native-vector-icons/Octicons";

// import Share from "react-native-share";

// const shareOptions = {
//   title: "Share image to instastory",
//   social: Share.Social.INSTAGRAM_STORIES,
// };

export default function DrawerContant({ navigation, props }) {
  const dispatch = useDispatch();

  const usertype = useSelector((state) => state.authReducer.usertype);
  const token = useSelector((state) => state.authReducer.token);
  const profile = useSelector((state) => state.profileReducer.profile);

  const [isLoading, setisLoading] = useState(false);
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState("");
  const onGetOfficerData = async () => {
    setisLoading(true);
    let data = {
      Type: 2,
    };
    // console.log(data, token);
    if (usertype) {
      console.log("im in officer function");
      await getofficerprofile(data, token)
        .then((res) => {
          // console.log("res:officer", res[0][0]);
          setName(res[0][0].Off_Name);
          setPhoto(res[0][0].Off_Image_Path);
          dispatch(setProfile(res[0][0]));
        })
        .catch((error) => {
          if (error.response) {
            console.log("responce_error", error.response);
            setisLoading(false);
          } else if (error.request) {
            setisLoading(false);
            console.log("request error", error.request);
          } else if (error) {
            console.log("Server Error officer");
            setisLoading(false);
          }
        });
    }
  };
  const onGetUserData = async () => {
    setisLoading(true);
    let data = {
      Type: 2,
    };

    if (!usertype) {
      // console.log("im in user function");

      await userprofile(data, token)
        .then((res) => {
          // console.log("res:user", res[0][0]);
          setName(res[0][0].User_Name);
          setPhoto(res[0][0].User_Image_Path);
          dispatch(setProfile(res[0][0]));
        })
        .catch((error) => {
          if (error.response) {
            console.log("responce_error", error.response);
            setisLoading(false);
          } else if (error.request) {
            setisLoading(false);
            console.log("request error in user", error.request);
          } else if (error) {
            console.log("Server Error user");
            setisLoading(false);
          }
        });
    }
  };
  ShareOpen = async () => {
    try {
      const result = await Share.share({
        message:
          "React Native | A framework for building native apps using React",
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log(result.activityType);
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
    // Share.open(shareOptions)
    //   .then((res) => {
    //     console.log(res);
    //   })
    //   .catch((err) => {
    //     err && console.log(err);
    //   });
  };
  const onLogout = () => {
    LoginManager.logOut();
    GoogleSignin.signOut();
    dispatch(setProfile([]));
    dispatch(signout());
    dispatch(setUserType(false));
  };
  useEffect(() => {
    if (usertype) {
      onGetOfficerData();
    } else {
      onGetUserData();
    }
    return () => {};
  });
  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props}>
        <View style={styles.drawerContent}>
          <View style={styles.userInfoSection}>
            <View style={{ flexDirection: "row", marginTop: 15 }}>
              <Avatar.Image
                source={{
                  uri: photo
                    ? photo
                    : "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Unknown_person.jpg/1200px-Unknown_person.jpg",
                }}
                size={70}
              />
              <View
                style={{
                  marginLeft: 15,
                  flexDirection: "column",
                  // backgroundColor: "pink",
                  width: "50%",
                }}
              >
                <Title style={styles.title}>{name}</Title>

                {/* <TouchableOpacity onPress={() => onLogout()}>
                  <Caption style={styles.caption}>Logout</Caption>
                </TouchableOpacity> */}
              </View>
            </View>
          </View>
          <Drawer.Section
            style={{
              ...styles.drawerSection,
              borderTopColor: "#f4f4f4",
              borderTopWidth: 1,
            }}
          >
            {usertype ? (
              <DrawerItem
                icon={({ color, size }) => (
                  <Icon name="home" color={"#4169e1"} size={size} />
                )}
                label={({ color, size }) => (
                  <Text style={{ color: "black" }}>Home</Text>
                )}
                onPress={() => {
                  navigation.navigate("CallList");
                }}
              />
            ) : (
              <DrawerItem
                icon={({ color, size }) => (
                  <Icon name="home" color={"#4169e1"} size={size} />
                )}
                label={({ color, size }) => (
                  <Text style={{ color: "black" }}>Home</Text>
                )}
                onPress={() => {
                  navigation.navigate("Home");
                }}
              />
            )}
            {usertype ? (
              <DrawerItem
                icon={({ color, size }) => (
                  <Icon name="account" color={"#4169e1"} size={size} />
                )}
                label={({ color, size }) => (
                  <Text style={{ color: "black" }}>Profile</Text>
                )}
                onPress={() => {
                  navigation.navigate("Profile");
                }}
              />
            ) : (
              <DrawerItem
                icon={({ color, size }) => (
                  <Icon name="account" color={"#4169e1"} size={size} />
                )}
                label={({ color, size }) => (
                  <Text style={{ color: "black" }}>Profile</Text>
                )}
                onPress={() => {
                  navigation.navigate("EditProfile");
                }}
              />
            )}
            <DrawerItem
              icon={({ color, size }) => (
                <Icon name="bell" color={"#4169e1"} size={size} />
              )}
              label={({ color, size }) => (
                <Text style={{ color: "black" }}>Notification</Text>
              )}
              onPress={() => {
                navigation.navigate("Notification");
              }}
            />
            {/* {usertype && (
              <DrawerItem
                icon={({ color, size }) => (
                  // <Octicons name="primitive-dot" color={"#4169e1"} size={30} />

                  <Ionicons name="settings" color={"#4169e1"} size={size} />
                )}
                label={({ color, size }) => (
                  <Text style={{ color: "black" }}>Setting</Text>
                )}
                onPress={() => {
                  navigation.navigate("Setting");
                }}
              />
            )} */}
            {/* {usertype && ( */}
            <DrawerItem
              icon={({ color, size }) => (
                <Octicons
                  name="primitive-dot"
                  color={"#4169e1"}
                  size={35}
                  style={{
                    // backgroundColor: "pink",
                    marginLeft: 5,
                  }}
                />
              )}
              label={({ color, size }) => (
                <Text style={{ color: "black", marginLeft: 2 }}>
                  My Reviews
                </Text>
              )}
              onPress={() => {
                navigation.navigate("Reviews");
              }}
            />
            {/* )} */}
            {!usertype && (
              <DrawerItem
                icon={({ color, size }) => (
                  <Icon name="qrcode-scan" color={"#4169e1"} size={size} />
                )}
                label={({ color, size }) => (
                  <Text style={{ color: "black" }}>QR Code Scan</Text>
                )}
                onPress={() => {
                  navigation.navigate("Barcode");
                }}
              />
            )}
            {usertype && (
              <DrawerItem
                icon={({ color, size }) => (
                  <Ionicons name="document" color={"#4169e1"} size={size} />
                )}
                label={({ color, size }) => (
                  <Text style={{ color: "black" }}>Call List</Text>
                )}
                onPress={() => {
                  navigation.navigate("CallList");
                }}
                labelStyle={{ color: "black" }}
              />
            )}
            {!usertype && (
              <DrawerItem
                icon={({ color, size }) => (
                  <Ionicons name="document" color={"#4169e1"} size={size} />
                )}
                label={({ color, size }) => (
                  <Text style={{ color: "black" }}>Privacy Policy</Text>
                )}
                onPress={() => {
                  navigation.navigate("TermsAndCondition", { show: false });
                }}
                labelStyle={{ color: "black" }}
              />
            )}
            {/* </Drawer.Section> */}
            <View style={{ paddingLeft: 20 }}>
              <Text style={{ fontWeight: "bold", fontSize: 15 }}>ABOUT</Text>
            </View>
            {/* <Drawer.Section style={styles.drawerSection}> */}
            <DrawerItem
              icon={({ color, size }) => (
                <Icon name="account-plus" color={"#4169e1"} size={size} />
              )}
              label={({ color, size }) => (
                <Text style={{ color: "black" }}>Invite Friends</Text>
              )}
              onPress={() => {
                this.ShareOpen();
              }}
            />
            {/* <DrawerItem
              icon={({ color, size }) => (
                <Icon name="account-plus" color={"#4169e1"} size={size} />
              )}
              label={({ color, size }) => (
                <LoginButton onLogoutFinished={() => onLogout()} />
              )}
            /> */}
            <DrawerItem
              icon={({ color, size }) => (
                <Icon
                  name="information-variant"
                  color={"#4169e1"}
                  size={size}
                />
              )}
              label={({ color, size }) => (
                <Text style={{ color: "black" }}>About</Text>
              )}
              onPress={() => {
                navigation.navigate("AboutUs");
              }}
            />
            {!usertype && (
              <DrawerItem
                icon={({ color, size }) => (
                  <Icon name="star" color={"#4169e1"} size={size} />
                )}
                label={({ color, size }) => (
                  <Text style={{ color: "black" }}>Complaints</Text>
                )}
                onPress={() => {
                  navigation.navigate("ReviewForm", {
                    editable: false,
                    type: "1",
                  });
                }}
              />
            )}
            {/* {!usertype && (
              <DrawerItem
                icon={({ color, size }) => (
                  <Icon name="star" color={"#4169e1"} size={size} />
                )}
                label={({ color, size }) => (
                  <Text style={{ color: "black" }}>QR Code</Text>
                )}
                onPress={() => {
                  navigation.navigate("QRcode");
                }}
              />
            )} */}
            <DrawerItem
              icon={({ color, size }) => (
                <Ionicons name="documents" color={"#4169e1"} size={size} />
              )}
              label={({ color, size }) => (
                <Text style={{ color: "black" }}>Terms and Conditions</Text>
              )}
              onPress={() => {
                navigation.navigate("TermsAndCondition", { show: false });
              }}
              style={{}}
            />
            <DrawerItem
              icon={({ color, size }) => (
                <Ionicons name="log-out" color={"#4169e1"} size={size} />
              )}
              label={({ color, size }) => (
                <Text style={{ color: "black" }}>Logout</Text>
              )}
              onPress={() => {
                onLogout();
              }}
              style={{}}
            />
          </Drawer.Section>
        </View>
      </DrawerContentScrollView>
      <Drawer.Section style={styles.bottomDrawerSection}>
        <DrawerItem label="V.1.1.0.0   |   Copy Right 2021" />
      </Drawer.Section>
    </View>
  );
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  userInfoSection: {
    paddingLeft: 20,
  },
  title: {
    fontSize: 16,
    marginTop: 3,
    fontWeight: "bold",
    color: "#E7742B",
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
  },
  row: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
  },
  paragraph: {
    fontWeight: "bold",
    marginRight: 3,
  },
  drawerSection: {
    marginTop: 15,
  },
  bottomDrawerSection: {
    // marginBottom: 15,
  },
  preference: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});

// class DrawerContant extends Component {
//   constructor() {
//     super();
//     this.state = {
//       name: null,
//       imagePath: null,
//     };
//   }
//   ShareOpen = async () => {
//     try {
//       const result = await Share.share({
//         message:
//           "React Native | A framework for building native apps using React",
//       });

//       if (result.action === Share.sharedAction) {
//         if (result.activityType) {
//           console.log(result.activityType);
//           // shared with activity type of result.activityType
//         } else {
//           // shared
//         }
//       } else if (result.action === Share.dismissedAction) {
//         // dismissed
//       }
//     } catch (error) {
//       alert(error.message);
//     }
//     // Share.open(shareOptions)
//     //   .then((res) => {
//     //     console.log(res);
//     //   })
//     //   .catch((err) => {
//     //     err && console.log(err);
//     //   });
//   };
//   componentDidMount = async () => {
//     console.log(this.props, "propssss");
//     // this.focusListener = navigation.addListener("focus", () => {
//     console.log("drawerContent", this.props.usertype);

//     if (this.props.usertype) {
//       console.log("im officer");
//       this.onGetOfficerData();
//     } else {
//       console.log("im user");
//       this.onGetUserData();
//     }
//     // });
//   };
//   // componentWillUnmount() {
//   //   this.focusListener();
//   // }
//   onGetOfficerData = async () => {
//     this.setState({ isLoading: true });
//     let data = {
//       Type: 2,
//     };

//     // console.log(data, this.props.token);
//     if (this.props.usertype) {
//       console.log("im in officer function");
//       await getofficerprofile(data, this.props.token)
//         .then((res) => {
//           console.log("res:officer", res[0][0]);
//           this.setState({
//             name: res[0][0].Off_Name,
//             imagePath: res[0][0].Off_Image_Path,
//           });
//           this.props.setProfile(res[0][0]);
//         })
//         .catch((error) => {
//           if (error.response) {
//             console.log("responce_error", error.response);
//             this.setState({ isLoading: false });
//           } else if (error.request) {
//             this.setState({ isLoading: false });
//             console.log("request error", error.request);
//           } else if (error) {
//             alert("Server Error officer");
//             this.setState({ isLoading: false });
//           }
//         });
//     }
//   };
//   onGetUserData = async () => {
//     this.setState({ isLoading: true });
//     let data = {
//       Type: 2,
//     };

//     // console.log(data, this.props.token);
//     if (!this.props.usertype) {
//       console.log("im in user function");

//       await userprofile(data, this.props.token)
//         .then((res) => {
//           // console.log("res:user", res[0][0]);
//           this.setState({
//             name: res[0][0].User_Name,
//             imagePath: res[0][0].User_Image_Path,
//           });
//           this.props.setProfile(res[0][0]);
//         })
//         .catch((error) => {
//           if (error.response) {
//             console.log("responce_error", error.response);
//             this.setState({ isLoading: false });
//           } else if (error.request) {
//             this.setState({ isLoading: false });
//             console.log("request error in user", error.request);
//           } else if (error) {
//             alert("Server Error user");
//             this.setState({ isLoading: false });
//           }
//         });
//     }
//   };
//   onLogout = () => {
//     this.props.setProfile([]);
//     this.props.signout();
//     this.props.setUserType(false);
//   };
//   render() {
//     const { profile, usertype } = this.props;
//     console.log("usertype", usertype);
//     return (
//       <View style={{ flex: 1 }}>
//         <DrawerContentScrollView {...this.props}>
//           <View style={styles.drawerContent}>
//             <View style={styles.userInfoSection}>
//               <View style={{ flexDirection: "row", marginTop: 15 }}>
//                 <Avatar.Image
//                   source={{
//                     uri: this.state.imagePath
//                       ? this.state.imagePath
//                       : "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Unknown_person.jpg/1200px-Unknown_person.jpg",
//                   }}
//                   size={70}
//                 />
//                 <View style={{ marginLeft: 15, flexDirection: "column" }}>
//                   <Title style={styles.title}>{this.state.name}</Title>

//                   <TouchableOpacity onPress={() => this.onLogout()}>
//                     <Caption style={styles.caption}>Logout</Caption>
//                   </TouchableOpacity>
//                 </View>
//               </View>
//             </View>

//             <Drawer.Section
//               style={{
//                 ...styles.drawerSection,
//                 borderTopColor: "#f4f4f4",
//                 borderTopWidth: 1,
//               }}
//             >
//               {usertype ? (
//                 <DrawerItem
//                   icon={({ color, size }) => (
//                     <Icon name="home" color={"#4169e1"} size={size} />
//                   )}
//                   label={({ color, size }) => (
//                     <Text style={{ color: "black" }}>Home</Text>
//                   )}
//                   onPress={() => {
//                     this.props.navigation.navigate("CallList");
//                   }}
//                 />
//               ) : (
//                 <DrawerItem
//                   icon={({ color, size }) => (
//                     <Icon name="home" color={"#4169e1"} size={size} />
//                   )}
//                   label={({ color, size }) => (
//                     <Text style={{ color: "black" }}>Home</Text>
//                   )}
//                   onPress={() => {
//                     this.props.navigation.navigate("Home");
//                   }}
//                 />
//               )}
//               {usertype ? (
//                 <DrawerItem
//                   icon={({ color, size }) => (
//                     <Icon name="account" color={"#4169e1"} size={size} />
//                   )}
//                   label={({ color, size }) => (
//                     <Text style={{ color: "black" }}>Profile</Text>
//                   )}
//                   onPress={() => {
//                     this.props.navigation.navigate("Profile");
//                   }}
//                 />
//               ) : (
//                 <DrawerItem
//                   icon={({ color, size }) => (
//                     <Icon name="account" color={"#4169e1"} size={size} />
//                   )}
//                   label={({ color, size }) => (
//                     <Text style={{ color: "black" }}>Profile</Text>
//                   )}
//                   onPress={() => {
//                     this.props.navigation.navigate("EditProfile");
//                   }}
//                 />
//               )}
//               <DrawerItem
//                 icon={({ color, size }) => (
//                   <Icon name="bell" color={"#4169e1"} size={size} />
//                 )}
//                 label={({ color, size }) => (
//                   <Text style={{ color: "black" }}>Notification</Text>
//                 )}
//                 onPress={() => {
//                   this.props.navigation.navigate("Notification");
//                 }}
//               />
//               {usertype && (
//                 <DrawerItem
//                   icon={({ color, size }) => (
//                     // <Octicons name="primitive-dot" color={"#4169e1"} size={30} />

//                     <Ionicons name="settings" color={"#4169e1"} size={size} />
//                   )}
//                   label={({ color, size }) => (
//                     <Text style={{ color: "black" }}>Setting</Text>
//                   )}
//                   onPress={() => {
//                     this.props.navigation.navigate("Setting");
//                   }}
//                 />
//               )}
//               {!usertype && (
//                 <DrawerItem
//                   icon={({ color, size }) => (
//                     <Octicons
//                       name="primitive-dot"
//                       color={"#4169e1"}
//                       size={35}
//                       style={{
//                         // backgroundColor: "pink",
//                         marginLeft: 5,
//                       }}
//                     />
//                   )}
//                   label={({ color, size }) => (
//                     <Text style={{ color: "black", marginLeft: 2 }}>
//                       My Reviews
//                     </Text>
//                   )}
//                   onPress={() => {
//                     this.props.navigation.navigate("Reviews");
//                   }}
//                 />
//               )}
//               {!usertype && (
//                 <DrawerItem
//                   icon={({ color, size }) => (
//                     <Ionicons name="book" color={"#4169e1"} size={size} />
//                   )}
//                   label={({ color, size }) => (
//                     <Text style={{ color: "black" }}>Barcode Scan</Text>
//                   )}
//                   onPress={() => {
//                     this.props.navigation.navigate("Barcode");
//                   }}
//                 />
//               )}
//               {usertype && (
//                 <DrawerItem
//                   icon={({ color, size }) => (
//                     <Ionicons name="document" color={"#4169e1"} size={size} />
//                   )}
//                   label={({ color, size }) => (
//                     <Text style={{ color: "black" }}>Call List</Text>
//                   )}
//                   onPress={() => {
//                     this.props.navigation.navigate("CallList");
//                   }}
//                   labelStyle={{ color: "black" }}
//                 />
//               )}
//               {!usertype && (
//                 <DrawerItem
//                   icon={({ color, size }) => (
//                     <Ionicons name="document" color={"#4169e1"} size={size} />
//                   )}
//                   label={({ color, size }) => (
//                     <Text style={{ color: "black" }}>Privacy Policy</Text>
//                   )}
//                   onPress={() => {
//                     this.props.navigation.navigate("TermsAndCondition");
//                   }}
//                   labelStyle={{ color: "black" }}
//                 />
//               )}
//               {/* </Drawer.Section> */}
//               <View style={{ paddingLeft: 20 }}>
//                 <Text style={{ fontWeight: "bold", fontSize: 15 }}>ABOUT</Text>
//               </View>
//               {/* <Drawer.Section style={styles.drawerSection}> */}
//               <DrawerItem
//                 icon={({ color, size }) => (
//                   <Icon name="account-plus" color={"#4169e1"} size={size} />
//                 )}
//                 label={({ color, size }) => (
//                   <Text style={{ color: "black" }}>Invite Friends</Text>
//                 )}
//                 onPress={() => {
//                   this.ShareOpen();
//                 }}
//               />
//               <DrawerItem
//                 icon={({ color, size }) => (
//                   <Icon
//                     name="information-variant"
//                     color={"#4169e1"}
//                     size={size}
//                   />
//                 )}
//                 label={({ color, size }) => (
//                   <Text style={{ color: "black" }}>About</Text>
//                 )}
//                 onPress={() => {
//                   this.props.navigation.navigate("AboutUs");
//                 }}
//               />
//               <DrawerItem
//                 icon={({ color, size }) => (
//                   <Icon name="star" color={"#4169e1"} size={size} />
//                 )}
//                 label={({ color, size }) => (
//                   <Text style={{ color: "black" }}>Complaints</Text>
//                 )}
//                 onPress={() => {
//                   this.props.navigation.navigate("SubmitOfficer");
//                 }}
//               />
//               <DrawerItem
//                 icon={({ color, size }) => (
//                   <Ionicons name="documents" color={"#4169e1"} size={size} />
//                 )}
//                 label={({ color, size }) => (
//                   <Text style={{ color: "black" }}>Terms of use</Text>
//                 )}
//                 onPress={() => {
//                   this.props.navigation.navigate("TermsAndCondition");
//                 }}
//                 style={{}}
//               />
//             </Drawer.Section>
//           </View>
//         </DrawerContentScrollView>
//         <Drawer.Section style={styles.bottomDrawerSection}>
//           <DrawerItem label="V.1.1.0.0   |   Copy Right 2021" />
//         </Drawer.Section>
//       </View>
//     );
//   }
// }
// const styles = StyleSheet.create({
//   drawerContent: {
//     flex: 1,
//   },
//   userInfoSection: {
//     paddingLeft: 20,
//   },
//   title: {
//     fontSize: 16,
//     marginTop: 3,
//     fontWeight: "bold",
//     color: "#E7742B",
//   },
//   caption: {
//     fontSize: 14,
//     lineHeight: 14,
//   },
//   row: {
//     marginTop: 20,
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   section: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginRight: 15,
//   },
//   paragraph: {
//     fontWeight: "bold",
//     marginRight: 3,
//   },
//   drawerSection: {
//     marginTop: 15,
//   },
//   bottomDrawerSection: {
//     // marginBottom: 15,
//   },
//   preference: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     paddingVertical: 12,
//     paddingHorizontal: 16,
//   },
// });
// const mapStateToProps = (state, ownProps) => ({
//   token: state.authReducer.token,
//   profile: state.profileReducer.profile,
//   usertype: state.authReducer.usertype,
// });

// const mapDispatchToProps = {
//   setToken,
//   setProfile,
//   signout,
//   setUserType,
// };
// export default connect(mapStateToProps, mapDispatchToProps)(DrawerContant);
