import React, { Component } from "react";
import {
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TextInput,
  Image,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Dimensions,
  FlatList,
  Platform,
} from "react-native";
// import Modal from "react-native-modal";

import { List, Paragraph, Checkbox, Card, Avatar } from "react-native-paper";
import Header from "../CustomComponent/Header";
import CustomComponent2 from "../CustomComponent/CustomComponent2";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Entypo from "react-native-vector-icons/Entypo";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import AntDesign from "react-native-vector-icons/AntDesign";
import StarRating from "react-native-star-rating";
import {
  getfilterdata,
  getofficerlist,
  postfilterdata,
} from "../utils/apiconfig";
import Geocoder from "react-native-geocoding";
import { setLatitude, setLongitude } from "../store/action/Location/action";
import { setOfficer } from "../store/action/Officer/action";

import { connect } from "react-redux";
import Spinner from "react-native-loading-spinner-overlay";
import { Radio, Icon } from "native-base";

const { height } = Dimensions.get("window");
const modalMargin = height / 15;
const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;
// Platform.OS === "ios"
//   ? Dimensions.get("window").height
//   : require("react-native-extra-dimensions-android").get(
//       "REAL_WINDOW_HEIGHT"
//     );
class OfficerList extends Component {
  constructor(props) {
    super(props);
    this.userNameInputRef = React.createRef();

    this.state = {
      starCount: 5,
      filterModal: false,
      arrow2: false,
      arrow3: false,
      arrow4: false,
      arrow5: false,
      arrow6: false,
      arrow7: false,
      arrow8: false,
      expandededreview: false,
      expandededtraining: false,
      expandededmilitry: false,
      expandededlaw: false,
      expanded: false,
      expandedbadge: false,
      expandededucation: false,
      badgenumber: [],
      racetype: [],
      education: [],
      category: [],
      form: [],
      formatted_address: null,
      reviewsstatus: false,
      lawenforcementexp: [
        { id: 1, exp: "0-5" },
        { id: 2, exp: "5-10" },
        { id: 3, exp: "10-15" },
        { id: 4, exp: "15-20" },
        { id: 5, exp: "20+" },
      ],
      militry: [
        { id: 1, militry: "0-5", name: "five" },
        { id: 2, militry: "5-10", name: "ten" },
        { id: 3, militry: "10-15", name: "fifteen" },
        { id: 4, militry: "15-20", name: "twenty" },
        { id: 5, militry: "20+", name: "twentyplus" },
      ],
      reviews: [
        { id: 1, reviews: "1", name: "onereviews" },
        { id: 2, reviews: "2", name: "tworeviews" },
        { id: 3, reviews: "3", name: "threereviews" },
        { id: 4, reviews: "4", name: "fourreviews" },
        { id: 5, reviews: "5", name: "fivereviews" },
      ],
      Race_DTOs: [],
      BadgeNumber_DTOs: [],
      Education_DTOs: [],
      Category_DTOs: [],
      Law_DTOs: [],
      Militry_DTOs: [],
      Reviews_DTOs: [],
      FinalData: [],
      officerdata: [],
      isLoading: false,
      id: null,
      Filter_Value: [],
      laweselected: null,
      militryselected: null,
      finallaw: null,
      finalmilitry: null,
      finalrace: null,
      Law_value: null,
      showBar: false,
      searchInput: "",
      backupdata: [],
    };
  }
  componentDidMount = async () => {
    const unsubscribe = await this.props.navigation.addListener(
      "focus",
      async (e) => {
        if (this.userNameInputRef.current) {
          this.userNameInputRef.current.focus();
        }
        console.log("route.params", this.props.route.params.show);
        await this.getAddress(), await this.GetFilterData();
        this.setState(
          {
            id: this.props.route.params.id,
            showBar: this.props.route.params.show,
          },
          () => this.GetOfficerDetail()
        );
        // this.GetFilterData();
        // this.getAddress();
      }
    );
  };
  searchFilterFunction = (text) => {
    // Check if searched text is not blank
    if (text) {
      // Inserted text is not blank
      // Filter the masterDataSource and update FilteredDataSource
      const newData = this.state.officerdata.filter(function (item) {
        // Applying filter for the inserted text in search bar
        // return console.log("hii", item);
        if (item.Off_Name) {
          const itemData = item.Off_Name
            ? item.Off_Name.toUpperCase()
            : "".toUpperCase();
          const textData = text.toUpperCase();
          return itemData.indexOf(textData) > -1;
        }
      });
      console.log("hiiiii", newData);
      this.setState({
        officerdata: newData,
      });
    } else {
      this.setState({
        officerdata: this.state.backupdata,
      });
    }
  };
  GetFilterData = async () => {
    this.setState({ isLoading: true });
    let data = {
      Type: 1,
    };
    // console.log(data);
    await getfilterdata(data)
      .then((res) => {
        // console.log("res: ", JSON.stringify(res));
        // console.log("res:GetFilterData", res[0]);
        this.setState(
          {
            badgenumber: res[0].BadgeNumber_DTOs,
            racetype: res[0].Race_DTOs,
            education: res[0].Education_DTOs,
            category: res[0].Category_DTOs,
          },
          () => this.stateUpdate()
        );

        this.setState({ isLoading: false });
      })
      .catch((error) => {
        if (error.response) {
          this.setState({ isLoading: false });
          console.log("responce_error", error.response);
        } else if (error.request) {
          this.setState({ isLoading: false });
          console.log("request error", error.request);
        } else if (error) {
          alert("Server Error");
          this.setState({ isLoading: false });
        }
      });
  };
  getAddress = async () => {
    // console.log("hiiii123122", this.props.longitude[1], this.props.latitude[1]);
    // this.setState({ isLoading: true });
    Geocoder.init("AIzaSyCJDORIshFYTnm0p5geFHPcJy7YBlQTuKA", {
      language: "en",
    }); // set the language
    await Geocoder.from(this.props.latitude[1], this.props.longitude[1])
      .then((json) => {
        // console.log("address json", json);
        var addressComponent = json.results[0].formatted_address;

        this.setState({
          formatted_address: addressComponent,
        });
        this.setState({ isLoading: false });
        console.log("addressComponent", addressComponent);
      })
      .catch((error) => {
        alert(error.message);
        console.log(error.message);
      });
  };
  stateUpdate = () => {
    this.setState({ isLoading: false });
    this.state.badgenumber.map((item, index) => {
      this.setState({
        [item.BadgeNumber.toString()]: false,
      });
    });

    this.state.racetype.map((item) => {
      this.setState({
        [item.Race_Name.toString()]: false,
      });
    });

    this.state.education.map((item, index) => {
      this.setState({
        [item.Education]: false,
      });
    });
    this.state.category.map((item, index) => {
      this.setState({
        [item.Cat_Pkey.toString()]: false,
      });
    });
    this.state.lawenforcementexp.map((item) => {
      this.setState({
        [item.exp]: false,
      });
    });
    this.state.militry.map((item) => {
      this.setState({
        [item.name.toString()]: false,
      });
    });
    this.state.reviews.map((item) => {
      this.setState({
        [item.name.toString()]: false,
      });
    });
  };
  Clear = () => {
    this.state.badgenumber.map((item, index) => {
      this.setState({
        [item.BadgeNumber.toString()]: false,
      });
    });

    this.state.racetype.map((item) => {
      this.setState({
        [item.Race_Name.toString()]: false,
      });
    });

    this.state.education.map((item, index) => {
      this.setState({
        [item.Education]: false,
      });
    });
    this.state.category.map((item, index) => {
      this.setState({
        [item.Cat_Pkey.toString()]: false,
      });
    });
    this.state.lawenforcementexp.map((item) => {
      this.setState({
        [item.exp]: false,
      });
    });
    this.state.militry.map((item) => {
      this.setState({
        [item.name.toString()]: false,
      });
    });
    this.state.reviews.map((item) => {
      this.setState({
        [item.name.toString()]: false,
      });
    });
    this.setState({
      laweselected: null,
      militryselected: null,
      Reviews_DTOs: [],
      Category_DTOs: [],
      Race_DTOs: [],
      Education_DTOs: [],
      BadgeNumber_DTOs: [],
      finallaw: "",
      finalmilitry: "",
    });
  };

  BadgeNumber = () => <View>{this.categoryBadge()}</View>;
  Race = () => <View>{this.category()}</View>;
  Education = () => <View>{this.categoryEducation()}</View>;
  Law_Enforcement_exp = () => <View>{this.categoryLaw()}</View>;
  Milltary_Exp = () => <View>{this.categoryMilitry()}</View>;
  Training = () => <View style={{}}>{this.categoryTraining()}</View>;
  Reviews = () => <View>{this.categoryReviws()}</View>;

  EducationAdd(txt, status, key) {
    console.log(key);
    const found = this.state.Education_DTOs.find(
      (element) => element.Education_Value === key
    );

    console.log("found", found);
    this.setState({
      [key]: !status,
    });
    if (!found) {
      const data = {
        Education_Value: key,
      };
      this.setState({
        Education_DTOs: [...this.state.Education_DTOs, data],
      });
      // this.state.Race_DTOs.push(data);
    } else {
      this.setState({
        Education_DTOs: this.state.Education_DTOs.filter(
          (p) => p.Education_Value != key
        ),
      });
    }
  }
  TrainingAdd(txt, status, key) {
    this.setState({
      [key]: !status,
    });
    const found = this.state.Category_DTOs.find(
      (element) => element.Cat_Value === key
    );

    if (!found) {
      const data = {
        Cat_Value: key,
      };
      this.setState({
        Category_DTOs: [...this.state.Category_DTOs, data],
      });
      // this.state.Race_DTOs.push(data);
    } else {
      this.setState({
        Category_DTOs: this.state.Category_DTOs.filter(
          (p) => p.Cat_Value != key
        ),
      });
    }
  }

  BadgeNumberAdd(txt, status, key) {
    console.log(key);
    const found = this.state.BadgeNumber_DTOs.find(
      (element) => element.Badge_Value === key
    );

    console.log("found", found);
    this.setState({
      [key]: !status,
    });
    if (!found) {
      const data = {
        Badge_Value: key,
      };
      this.setState({
        BadgeNumber_DTOs: [...this.state.BadgeNumber_DTOs, data],
      });
      // this.state.Race_DTOs.push(data);
    } else {
      this.setState({
        BadgeNumber_DTOs: this.state.BadgeNumber_DTOs.filter(
          (p) => p.Badge_Value != key
        ),
      });
    }
  }
  checkBoxBadgeNumber = (txt, status, key) => (
    // console.log("txt, status, key", txt, status, key);
    <TouchableOpacity
      style={{
        flexDirection: "row",
        alignItems: "center",
        // justifyContent: "space-between",
        // backgroundColor: "red",
      }}
      onPress={() => this.BadgeNumberAdd(txt, status, key)}
    >
      <View
        style={{
          flexDirection: "row",
          // backgroundColor: "pink",
          width: Platform.OS === "ios" ? "87%" : "85%",
        }}
      >
        <AntDesign
          name="caretright"
          size={20}
          color={"#4369DD"}
          style={{ marginRight: 20 }}
        />
        <Text style={{ color: "gray" }}>{txt}</Text>
      </View>
      <View pointerEvents="none">
        <Checkbox status={status ? "checked" : "unchecked"} color={"#FD9D26"} />
      </View>
    </TouchableOpacity>
  );
  RaceType(txt, status, key) {
    console.log("race type", txt, key);
    const found = this.state.Race_DTOs.find(
      (element) => element.Race_Value === txt
    );
    console.log("found", found);
    this.setState({
      [key]: !status,
    });
    if (!found) {
      const data = {
        Race_Value: txt,
      };
      this.setState({
        Race_DTOs: [...this.state.Race_DTOs, data],
      });
      // this.state.Race_DTOs.push(data);
    } else {
      this.setState({
        Race_DTOs: this.state.Race_DTOs.filter((p) => p.Race_Value != key),
      });
    }
  }
  // Law_Enforcement_expAdd(txt, status, key) {
  //   console.log("hiiiii", txt, status, key);
  //   // const found = this.state.Law_DTOs.find(
  //   //   (element) => element.Law_Value === key
  //   // );
  //   // console.log("found", found);
  //   this.setState({
  //     [key]: !status,
  //   });
  //   const data = {
  //     Law_Value: key,
  //   };
  //   this.setState({
  //     Law_DTOs: data,
  //   });
  //   console.log("Law_DTOs", this.state.Law_DTOs);
  //   // if (!found) {

  //   //   // this.state.Race_DTOs.push(data);
  //   // } else {
  //   //   this.setState({
  //   //     Law_DTOs: this.state.Law_DTOs.filter((p) => p.Law_Value != key),
  //   //   });
  //   // }
  // }
  MilitryAdd(txt, status, key) {
    console.log("hiiiii", txt, status, key);
    const found = this.state.Militry_DTOs.find(
      (element) => element.Militry_Value === txt
    );
    console.log("found", found);
    this.setState({
      [key]: !status,
    });
    if (!found) {
      const data = {
        Militry_Value: txt,
      };
      this.setState({
        Militry_DTOs: [...this.state.Militry_DTOs, data],
      });
      // this.state.Race_DTOs.push(data);
    } else {
      this.setState({
        Militry_DTOs: this.state.Militry_DTOs.filter(
          (p) => p.Militry_Value != txt
        ),
      });
    }
  }
  ReviewsAdd(txt, status, key) {
    console.log("hiiiii", txt, status, key);
    const found = this.state.Reviews_DTOs.find(
      (element) => element.Reviews_Value === txt
    );
    console.log("found", found);
    this.setState({
      [key]: !status,
    });
    if (!found) {
      const data = {
        Reviews_Value: txt,
      };
      this.setState({
        Reviews_DTOs: [...this.state.Reviews_DTOs, data],
      });
      // this.state.Race_DTOs.push(data);
    } else {
      this.setState({
        Reviews_DTOs: this.state.Reviews_DTOs.filter(
          (p) => p.Reviews_Value != key
        ),
      });
    }
  }
  checkBoxRace = (txt, status, key) => (
    // console.log("txt, status, key", txt, status, key);
    <TouchableOpacity
      style={{
        flexDirection: "row",
        alignItems: "center",
        // justifyContent: "space-between",
        // backgroundColor: "pink",
      }}
      onPress={() => this.RaceType(txt, status, key)}
    >
      <View
        style={{
          flexDirection: "row",
          // backgroundColor: "pink",
          width: Platform.OS === "ios" ? "87%" : "85%",
        }}
      >
        <AntDesign
          name="caretright"
          size={20}
          color={"#4369DD"}
          style={{ marginRight: 20 }}
        />
        <Text style={{ color: "gray" }}>{key}</Text>
      </View>
      <View pointerEvents="none">
        <Checkbox status={status ? "checked" : "unchecked"} color={"#FD9D26"} />
      </View>
    </TouchableOpacity>
  );
  checkBoxEducation = (txt, status, key) => (
    // console.log("txt, status, key", txt, status, key);
    <TouchableOpacity
      style={{
        flexDirection: "row",
        alignItems: "center",
        // justifyContent: "space-between",
        // backgroundColor: "pink",
      }}
      onPress={() => this.EducationAdd(txt, status, key)}
    >
      <View
        style={{
          flexDirection: "row",
          // backgroundColor: "pink",
          width: Platform.OS === "ios" ? "87%" : "85%",
        }}
      >
        <AntDesign
          name="caretright"
          size={20}
          color={"#4369DD"}
          style={{ marginRight: 20 }}
        />
        <Text style={{ color: "gray" }}>{txt}</Text>
      </View>
      <View pointerEvents="none">
        <Checkbox status={status ? "checked" : "unchecked"} color={"#FD9D26"} />
      </View>
    </TouchableOpacity>
  );
  // checkBoxLaw = (txt, status, key) => (
  //   // console.log("txt, status, key", txt, status, key);
  //   <TouchableOpacity
  //     style={{
  //       flexDirection: "row",
  //       alignItems: "center",
  //       justifyContent: "space-between",
  //       // backgroundColor: "pink",
  //     }}
  //     onPress={() => this.Law_Enforcement_expAdd(txt, status, key)}
  //   >
  //     <View
  //       style={{
  //         flexDirection: "row",
  //         // backgroundColor: "pink",
  //         width: "80%",
  //       }}
  //     >
  //       <AntDesign
  //         name="caretright"
  //         size={20}
  //         color={"#4369DD"}
  //         style={{ marginRight: 20 }}
  //       />
  //       <Text>{txt}</Text>
  //     </View>
  //     <View pointerEvents="none">
  //       <Checkbox status={status ? "checked" : "unchecked"} color={"#FD9D26"} />
  //     </View>
  //   </TouchableOpacity>
  // );
  checkBoxTraining = (txt, status, key) => (
    // console.log("txt, status, key", txt, status, key);
    <TouchableOpacity
      style={{
        flexDirection: "row",
        alignItems: "center",
        // justifyContent: "space-between",
        // backgroundColor: "pink",
      }}
      onPress={() => this.TrainingAdd(txt, status, key)}
    >
      <View
        style={{
          flexDirection: "row",
          // backgroundColor: "pink",
          width: Platform.OS === "ios" ? "87%" : "85%",
        }}
      >
        <AntDesign
          name="caretright"
          size={20}
          color={"#4369DD"}
          style={{ marginRight: 20 }}
        />
        <Text style={{ color: "gray", width: "83%" }}>{txt}</Text>
      </View>
      <View pointerEvents="none">
        <Checkbox status={status ? "checked" : "unchecked"} color={"#FD9D26"} />
      </View>
    </TouchableOpacity>
  );
  checkBoxMilltary_Exp = (txt, status, key) => (
    // console.log("txt, status, key", txt, status, key);
    <TouchableOpacity
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        // backgroundColor: "pink",
      }}
      onPress={() => this.MilitryAdd(txt, status, key)}
    >
      <View
        style={{
          flexDirection: "row",
          // backgroundColor: "pink",
          width: Platform.OS === "ios" ? "82%" : "70%",
        }}
      >
        <AntDesign
          name="caretright"
          size={20}
          color={"#4369DD"}
          style={{ marginRight: 20 }}
        />
        <Text style={{ color: "gray" }}>{txt}</Text>
      </View>
      <View pointerEvents="none">
        <Checkbox status={status ? "checked" : "unchecked"} color={"#FD9D26"} />
      </View>
    </TouchableOpacity>
  );
  checkBoxReviews = (txt, status, key) => (
    // console.log("txt, status, key", txt, status, key);
    <TouchableOpacity
      style={{
        flexDirection: "row",
        alignItems: "center",
        // justifyContent: "space-between",
        // backgroundColor: "pink",
      }}
      onPress={() => this.ReviewsAdd(txt, status, key)}
    >
      <View
        style={{
          flexDirection: "row",
          // backgroundColor: "pink",
          width: "85%",
        }}
      >
        <AntDesign
          name="caretright"
          size={20}
          color={"#4369DD"}
          style={{ marginRight: 20 }}
        />
        <Text style={{ color: "gray" }}>{txt}</Text>
      </View>
      <View pointerEvents="none">
        <Checkbox status={status ? "checked" : "unchecked"} color={"#FD9D26"} />
      </View>
    </TouchableOpacity>
  );
  handlePress = () =>
    this.setState({
      expanded: !this.state.expanded,
      arrow2: !this.state.arrow2,
    });

  category = () => (
    <List.Section>
      <List.Accordion
        expanded={this.state.expanded}
        onPress={this.handlePress}
        titleStyle={{ color: "gray" }}
        title="Race"
        style={{
          backgroundColor: "#fff",
          borderTopColor: "lightgray",
          borderTopWidth: 1,
          borderBottomColor: "lightgray",
          borderBottomWidth: 1,
        }}
        left={(props) => (
          <Image
            style={{
              width: 30,
              height: 30,
              marginLeft: 18,
            }}
            resizeMode="stretch"
            source={require("../../assets/Images/communiv/library/popup/icon-2.png")}
          />
        )}
        right={(props) => (
          <View>
            {this.state.arrow2 ? (
              <AntDesign name="caretdown" size={20} color={"#B9C7FE"} />
            ) : (
              <AntDesign name="caretup" size={20} color={"#B9C7FE"} />
            )}
          </View>
        )}
      >
        <View>
          {this.state.racetype.map((item) => {
            return this.checkBoxRace(
              item.Race_PkeyID,
              this.state[item.Race_Name],
              item.Race_Name.toString()
            );
          })}
        </View>
      </List.Accordion>
    </List.Section>
  );
  handlePressBadge = () =>
    this.setState({
      expandedbadge: !this.state.expandedbadge,
      arrow3: !this.state.arrow3,
    });
  categoryBadge = () => (
    <List.Section>
      <List.Accordion
        expanded={this.state.expandedbadge}
        onPress={this.handlePressBadge}
        titleStyle={{ color: "gray" }}
        title="Badge Number"
        style={{
          backgroundColor: "#fff",
          borderTopColor: "lightgray",
          borderTopWidth: 1,
          borderBottomColor: "lightgray",
          borderBottomWidth: 1,
        }}
        left={(props) => (
          <Image
            style={{
              width: 25,
              height: 25,
              marginLeft: 20,
            }}
            resizeMode="stretch"
            source={require("../../assets/Images/communiv/library/popup/icon-1.png")}
          />
        )}
        right={(props) => (
          <View>
            {this.state.arrow3 ? (
              <AntDesign name="caretdown" size={20} color={"#B9C7FE"} />
            ) : (
              <AntDesign name="caretup" size={20} color={"#B9C7FE"} />
            )}
          </View>
        )}
      >
        {/* <View style={{ backgroundColor: "pink" }}> */}
        {this.state.badgenumber.map((item, index) => {
          return this.checkBoxBadgeNumber(
            item.BadgeNumber,
            this.state[item.BadgeNumber],
            item.BadgeNumber.toString()
          );
        })}
        {/* </View> */}
      </List.Accordion>
    </List.Section>
  );
  handlePressEducation = () =>
    this.setState({
      expandededucation: !this.state.expandededucation,
      arrow4: !this.state.arrow4,
    });
  categoryEducation = () => (
    <List.Section>
      <List.Accordion
        expanded={this.state.expandededucation}
        onPress={this.handlePressEducation}
        titleStyle={{ color: "gray" }}
        title="Education"
        style={{
          backgroundColor: "#fff",
          borderTopColor: "lightgray",
          borderTopWidth: 1,
          borderBottomColor: "lightgray",
          borderBottomWidth: 1,
        }}
        left={(props) => (
          <Image
            style={{
              width: 30,
              height: 30,
              marginLeft: 20,
            }}
            resizeMode="stretch"
            source={require("../../assets/Images/communiv/library/popup/icon-3.png")}
          />
        )}
        right={(props) => (
          <View>
            {this.state.arrow4 ? (
              <AntDesign name="caretdown" size={20} color={"#B9C7FE"} />
            ) : (
              <AntDesign name="caretup" size={20} color={"#B9C7FE"} />
            )}
          </View>
        )}
      >
        <View>
          {this.state.education.map((item, index) => {
            return this.checkBoxEducation(
              item.Education,
              this.state[item.Education],
              item.Education
            );
          })}
        </View>
      </List.Accordion>
    </List.Section>
  );
  handlePressLaw = () =>
    this.setState({
      expandededlaw: !this.state.expandededlaw,
      arrow5: !this.state.arrow5,
    });
  categoryLaw = () => (
    <List.Section>
      <List.Accordion
        expanded={this.state.expandededlaw}
        onPress={this.handlePressLaw}
        titleStyle={{ color: "gray" }}
        title="Law-enforcement Experience"
        style={{
          backgroundColor: "#fff",
          borderTopColor: "lightgray",
          borderTopWidth: 1,
          borderBottomColor: "lightgray",
          borderBottomWidth: 1,
        }}
        left={(props) => (
          <Image
            style={{
              width: 28,
              height: 28,
              marginLeft: 20,
            }}
            resizeMode="stretch"
            source={require("../../assets/Images/communiv/library/popup/icon-4.png")}
          />
        )}
        right={(props) => (
          <View>
            {this.state.arrow5 ? (
              <AntDesign name="caretdown" size={20} color={"#B9C7FE"} />
            ) : (
              <AntDesign name="caretup" size={20} color={"#B9C7FE"} />
            )}
          </View>
        )}
      >
        {this.state.lawenforcementexp.map((item) => {
          return (
            <View>
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  width: "98%",
                  justifyContent: "space-between",
                  alignItems: "center",
                  // backgroundColor: "pink",
                  paddingRight: 5,
                }}
                onPress={() =>
                  this.setState({
                    laweselected: item.exp,
                  })
                }
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <AntDesign
                    name="caretright"
                    size={20}
                    color={"#4369DD"}
                    style={{ marginRight: 10 }}
                  />
                  <Text
                    style={{
                      fontSize: 15,
                      textAlign: "center",
                      lineHeight: 30,
                      color: "gray",
                    }}
                  >
                    {item.exp}
                  </Text>
                </View>

                {this.state.laweselected === item.exp ? (
                  Platform.OS === "ios" ? (
                    <AntDesign name="check" color="#FD9D26" size={25} />
                  ) : (
                    <MaterialCommunityIcons
                      name="checkbox-marked"
                      size={25}
                      color="#FD9D26"
                    />
                  )
                ) : Platform.OS === "ios" ? null : (
                  <MaterialCommunityIcons
                    name="checkbox-blank-outline"
                    size={22}
                    color={"gray"}
                  />
                )}
              </TouchableOpacity>
              {/* <Radio.Group
                size="sm"
                colorScheme="blue"
                name="myRadioGroup"
                value={this.state.law}
                onChange={(nextValue) => {
                  this.setState({
                    law: nextValue,
                  });
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    backgroundColor: "pink",
                    width: "90%",
                  }}
                >
                  <Radio
                    icon={<Icon as={<AntDesign name="check" />} />}
                    value={item.exp}
                    my={1}
                    // style={{ width: 1 }}
                  >
                    {item.exp}
                  </Radio>
                </View>
              </Radio.Group> */}
            </View>
          );
          // return this.checkBoxLaw(
          //   item.exp,
          //   this.state[item.exp],
          //   item.exp.toString()
          // );
        })}
      </List.Accordion>
    </List.Section>
  );
  handlePressMilitry = () =>
    this.setState({
      expandededmilitry: !this.state.expandededmilitry,
      arrow6: !this.state.arrow6,
    });
  categoryMilitry = () => (
    <List.Section>
      <List.Accordion
        expanded={this.state.expandededmilitry}
        onPress={this.handlePressMilitry}
        titleStyle={{ color: "gray" }}
        title="Military experience"
        style={{
          backgroundColor: "#fff",
          borderTopColor: "lightgray",
          borderTopWidth: 1,
          borderBottomColor: "lightgray",
          borderBottomWidth: 1,
        }}
        left={(props) => (
          <Image
            style={{
              width: 30,
              height: 30,
              marginLeft: 20,
            }}
            resizeMode="stretch"
            source={require("../../assets/Images/communiv/library/popup/icon-5.png")}
          />
        )}
        right={(props) => (
          <View>
            {this.state.arrow6 ? (
              <AntDesign name="caretdown" size={20} color={"#B9C7FE"} />
            ) : (
              <AntDesign name="caretup" size={20} color={"#B9C7FE"} />
            )}
          </View>
        )}
      >
        {this.state.militry.map((item) => {
          return (
            <View>
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  width: Platform.OS === "ios" ? "97%" : "97%",
                  justifyContent: "space-between",
                  alignItems: "center",
                  // backgroundColor: "pink",
                  paddingRight: 5,
                }}
                onPress={() =>
                  this.setState({
                    militryselected: item.militry,
                  })
                }
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <AntDesign
                    name="caretright"
                    size={20}
                    color={"#4369DD"}
                    style={{ marginRight: 10 }}
                  />
                  <Text
                    style={{
                      fontSize: 15,
                      textAlign: "center",
                      lineHeight: 30,
                      color: "gray",
                    }}
                  >
                    {item.militry}
                  </Text>
                </View>

                {this.state.militryselected === item.militry ? (
                  Platform.OS === "ios" ? (
                    <AntDesign name="check" color="#FD9D26" size={25} />
                  ) : (
                    <MaterialCommunityIcons
                      name="checkbox-marked"
                      size={25}
                      color="#FD9D26"
                    />
                  )
                ) : Platform.OS === "ios" ? null : (
                  <MaterialCommunityIcons
                    name="checkbox-blank-outline"
                    size={22}
                    color={"gray"}
                  />
                )}
              </TouchableOpacity>
              {/* <Radio.Group
                size="sm"
                colorScheme="blue"
                name="myRadioGroup"
                value={this.state.militryselected}
                onChange={(nextValue) => {
                  this.setState({
                    militryselected: nextValue,
                  });
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    // backgroundColor: "pink",
                    width: "90%",
                  }}
                >
                  <Radio
                    icon={<Icon as={<AntDesign name="check" />} />}
                    value={item.militry}
                    my={1}
                  >
                    {item.militry}
                  </Radio>
                </View>
              </Radio.Group> */}
            </View>
          );
          // return this.checkBoxMilltary_Exp(
          //   item.militry,
          //   this.state[item.name],
          //   item.name.toString()
          // );
        })}
      </List.Accordion>
    </List.Section>
  );
  handlePressTraining = () =>
    this.setState({
      expandededtraining: !this.state.expandededtraining,
      arrow7: !this.state.arrow7,
    });
  categoryTraining = () => (
    <List.Section>
      <List.Accordion
        expanded={this.state.expandededtraining}
        onPress={this.handlePressTraining}
        titleStyle={{ color: "gray" }}
        title="Special training/ qualification"
        style={{
          backgroundColor: "#fff",
          borderTopColor: "lightgray",
          borderTopWidth: 1,
          borderBottomColor: "lightgray",
          borderBottomWidth: 1,
          // height:70
        }}
        left={(props) => (
          <Image
            style={{
              width: 30,
              height: 30,
              marginLeft: 20,
            }}
            resizeMode="stretch"
            source={require("../../assets/Images/communiv/library/popup/icon-6.png")}
          />
        )}
        right={(props) => (
          <View>
            {this.state.arrow7 ? (
              <AntDesign name="caretdown" size={20} color={"#B9C7FE"} />
            ) : (
              <AntDesign name="caretup" size={20} color={"#B9C7FE"} />
            )}
          </View>
        )}
      >
        {this.state.category.map((item) => {
          return this.checkBoxTraining(
            item.Cat_Name,
            this.state[item.Cat_Pkey],
            item.Cat_Pkey.toString()
          );
        })}
      </List.Accordion>
    </List.Section>
  );
  handlePressReviews = () =>
    this.setState({
      expandededreview: !this.state.expandededreview,
      arrow8: !this.state.arrow8,
    });
  categoryReviws = () => (
    <List.Section>
      <List.Accordion
        expanded={this.state.expandededreview}
        onPress={this.handlePressReviews}
        titleStyle={{ color: "gray" }}
        title="Reviews"
        style={{
          backgroundColor: "#fff",
          borderTopColor: "lightgray",
          borderTopWidth: 1,
          borderBottomColor: this.state.arrow8 ? "#fff" : "lightgray",
          borderBottomWidth: 1,
        }}
        left={(props) => (
          <Image
            style={{
              width: 30,
              height: 20,
              marginLeft: 20,
            }}
            resizeMode="stretch"
            source={require("../../assets/Images/communiv/library/popup/icon-7.png")}
          />
        )}
        right={(props) => (
          <View>
            {this.state.arrow8 ? (
              <AntDesign name="caretdown" size={20} color={"#B9C7FE"} />
            ) : (
              <AntDesign name="caretup" size={20} color={"#B9C7FE"} />
            )}
          </View>
        )}
      >
        {this.state.reviews.map((item) => {
          return this.checkBoxReviews(
            item.reviews,
            this.state[item.name],
            item.name
          );
        })}
      </List.Accordion>
    </List.Section>
  );
  PostFilterData = async () => {
    this.setState({ isLoading: true });
    let data = {
      Type: 3,
      Law: this.state.finallaw ? JSON.stringify([this.state.finallaw]) : "",
      Militry: this.state.finalmilitry
        ? JSON.stringify([this.state.finalmilitry])
        : "",
      Race:
        this.state.Race_DTOs.length > 0
          ? JSON.stringify(this.state.Race_DTOs)
          : "",
      Education:
        this.state.Education_DTOs.length > 0
          ? JSON.stringify(this.state.Education_DTOs)
          : "",
      Badge:
        // JSON.stringify(this.state.BadgeNumber_DTOs),
        this.state.BadgeNumber_DTOs.length > 0
          ? JSON.stringify(this.state.BadgeNumber_DTOs)
          : "",
      Category:
        this.state.Category_DTOs.length > 0
          ? JSON.stringify(this.state.Category_DTOs)
          : "",
      Reviews:
        this.state.Reviews_DTOs.length > 0
          ? JSON.stringify(this.state.Reviews_DTOs)
          : "",
    };
    console.log("minal", data);
    // console.log(this.props.token);

    await postfilterdata(data, this.props.token)
      .then((res) => {
        console.log("postfilterdata", res);

        this.setState({ officerdata: res[0], isLoading: false });
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status == 500) {
            alert(error.response.data.Message);
          }
          this.setState({ isLoading: false });
          console.log("responce_error", error.response);
        } else if (error.request) {
          this.setState({ isLoading: false });
          console.log("request error", error.request);
        } else if (error) {
          console.log("Server Error");
          this.setState({ isLoading: false });
        }
      });
  };
  GetOfficerDetail = async () => {
    // console.log("this.state.id", this.state.id);
    this.setState({ isLoading: true });
    let data = {
      Type: 1,
      Cat_Pkey: this.state.id ? this.state.id : 0,
    };
    console.log(data, this.props.token);
    await getofficerlist(data, this.props.token)
      .then((res) => {
        console.log("officerdetaillll", res[0]);
        this.setState({
          backupdata: res[0],
          officerdata: res[0],
          isLoading: false,
        });
      })
      .catch((error) => {
        if (error.response) {
          this.setState({ isLoading: false });
          console.log("responce_error", error.response);
        } else if (error.request) {
          this.setState({ isLoading: false });
          console.log("request error", error.request);
        } else if (error) {
          console.log("Server Error");
          this.setState({ isLoading: false });
        }
      });
  };
  onHandleApplyFilter = async () => {
    if (await this.state.laweselected) {
      console.log("onHandleApplyFilter", this.state.laweselected);
      const LawData = {
        Law_value: this.state.laweselected,
      };

      this.setState(
        {
          finallaw: LawData,
        },
        () => console.log("statattavalue", this.state.finallaw)
      );
    }
    // } else {
    //   this.setState({
    //     finallaw: "",
    //   });
    // }
    if (await this.state.militryselected) {
      const MilitryData = {
        Militry_Value: this.state.militryselected,
      };
      this.setState({
        finalmilitry: MilitryData,
      });
    } else {
      this.setState({
        finalmilitry: "",
      });
    }

    // if (this.state.Race_DTOs.length > 1) {
    // const RaceData = {
    //   Race: this.state.Race_DTOs,
    // };
    //   this.setState({
    //     finalrace: this.state.Race_DTOs,
    //   });
    // } else {
    //   this.setState({
    //     finalrace: "",
    //   });
    // }

    //   this.state.FinalData.push(this.state.Race_DTOs);
    // }
    // if (this.state.Education_DTOs.length > 1) {
    //   this.state.FinalData.push(this.state.Education_DTOs);
    // }
    // if (this.state.BadgeNumber_DTOs.length > 1) {
    //   this.state.FinalData.push(this.state.BadgeNumber_DTOs);
    // }
    // if (this.state.Category_DTOs.length > 1) {
    //   this.state.FinalData.push(this.state.Category_DTOs);
    // }
    // if (this.state.Reviews_DTOs.length > 1) {
    //   this.state.FinalData.push(this.state.Reviews_DTOs);
    // }

    // console.log("FinalData", this.state.FinalData);
    // const stringfy = JSON.stringify(this.state.FinalData);
    // console.log("stringfy", stringfy);

    // this.setState(
    //   {
    //     Filter_Value: stringfy,
    //   },
    //   () => this.PostFilterData()
    // );
    this.PostFilterData();
    this.setState({
      filterModal: false,
      // FinalData: [],
      // Race_DTOs: [],
      // Category_DTOs: [],
      // Reviews_DTOs: [],
      // BadgeNumber_DTOs: [],
      // Education_DTOs: [],
      // Law_DTOs: [],
      // Militry_DTOs: [],
    });
  };
  renderImportModal = () => {
    return (
      <Modal
        animationType={"slide"}
        transparent={true}
        visible={this.state.filterModal}
      >
        <View
          style={{
            backgroundColor: "#ffffff",
            marginTop: modalMargin,
            flex: 1,
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
          }}
        >
          <View
            style={{
              marginTop: 30,
              //   paddingVertical: 10,
              //   backgroundColor: "pink",
              justifyContent: "space-between",
              flexDirection: "row",
              paddingHorizontal: 15,
            }}
          >
            <View style={{}}>
              <Text style={{ fontWeight: "bold" }}>Filter</Text>
            </View>
            <TouchableOpacity
              onPress={() =>
                this.setState({
                  filterModal: !this.state.filterModal,
                })
              }
            >
              <Entypo name="cross" size={20} />
            </TouchableOpacity>
          </View>
          <ScrollView>
            <View>
              {this.BadgeNumber()}
              {this.Race()}
              {this.Education()}
              {this.Law_Enforcement_exp()}
              {this.Milltary_Exp()}
              {this.Training()}
              {this.Reviews()}
            </View>
          </ScrollView>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginHorizontal: 20,
              marginTop: 20,
              marginBottom: 10,
            }}
          >
            <CustomComponent2
              onPress={() => this.Clear()}
              // next={true}
              title={"Clear"}
            />
            <CustomComponent2
              onPress={() => this.onHandleApplyFilter()}
              next={true}
              title={"Apply"}
            />
          </View>
        </View>
      </Modal>
    );
  };
  OpenModal = () => {
    this.setState({
      filterModal: true,
    });
  };
  SelectOfficer = (item) => {
    this.props.setOfficer(item);
    this.setState({
      searchInput: "",
      showBar: false,
    });
    // console.log("itemitemitemitem", item);
    this.props.navigation.navigate("OfficerDetail");
  };

  render() {
    console.log("state", this.state.showBar);
    return (
      <SafeAreaView
        style={{
          backgroundColor: "#F7F7F7",
          height: "100%",
          flex: 1,
        }}
      >
        <Spinner visible={this.state.isLoading} />

        <View>
          {this.state.showBar && (
            <View animation="slideInDown">
              <View
                style={{
                  backgroundColor: "white",
                  elevation: 18,
                  height: 60,
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <EvilIcons name="search" size={27} style={{ color: "#000" }} />
                <TextInput
                  placeholder="Search..."
                  placeholderTextColor={"#000"}
                  value={this.state.searchInput}
                  style={{
                    height: 50,
                    fontSize: 17,
                    width: "80%",
                    paddingLeft: 12,
                    color: "#000",
                  }}
                  onChangeText={(text) => {
                    this.setState({ searchInput: text });
                    this.searchFilterFunction(text);
                  }}
                  ref={this.userNameInputRef}
                  onFocus={() =>
                    this.userNameInputRef.current &&
                    this.userNameInputRef.current.focus()
                  }
                  autoFocus={true}
                />
                <TouchableOpacity
                  onPress={() =>
                    this.setState({
                      showBar: false,
                      searchInput: "",
                      officerdata: this.state.backupdata,
                    })
                  }
                >
                  <Entypo
                    name="circle-with-cross"
                    size={23}
                    style={{ color: "#000" }}
                  />
                </TouchableOpacity>
              </View>
            </View>
          )}
          {!this.state.showBar && (
            <Header
              onPress={() => this.setState({ showBar: true })}
              search={true}
              notification={true}
              navigation={this.props.navigation}
            />
          )}

          <ScrollView>
            <View style={{ marginBottom: 100 }}>
              <View
                style={{
                  flexDirection: "row",
                  //   justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#fff",
                  paddingLeft: 20,
                }}
              >
                <Ionicons name="location" size={30} />
                <TextInput
                  style={{ height: 50, paddingLeft: 10 }}
                  placeholder="My Current Location"
                  placeholderTextColor="gray"
                  editable={false}
                  // onChangeText={onChangeText}
                  value={this.state.formatted_address}
                />
              </View>
              <View
                style={{
                  //   backgroundColor: "pink",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 20,
                }}
              >
                <View>
                  <Text style={{ fontWeight: "bold", fontSize: 20 }}>
                    OFFICER LIST
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => this.OpenModal()}
                  style={{
                    position: "absolute",
                    right: 20,
                    backgroundColor: "#fff",
                    padding: 4,
                  }}
                >
                  <FontAwesome name="sliders" size={20} color={"#FD9D26"} />
                </TouchableOpacity>
              </View>
              <FlatList
                numColumns={2}
                data={this.state.officerdata}
                renderItem={({ item, index }) => (
                  <TouchableOpacity
                    onPress={() => this.SelectOfficer(item)}
                    style={{
                      marginHorizontal: 10,
                      marginTop: 70,
                      backgroundColor: "#fff",
                      borderRadius: 10,
                      borderWidth: 1,
                      borderColor: "blue",
                      padding: 20,
                      width: "45%",
                    }}
                  >
                    <View
                      style={{
                        width: 90,
                        height: 90,
                        borderRadius: 50,
                        borderColor: "blue",
                        borderWidth: 1,
                        position: "absolute",
                        top: -50,
                        right: "30%",
                        backgroundColor: "#fff",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {item.Off_Image_Path ? (
                        <Avatar.Image
                          source={{ uri: item.Off_Image_Path }}
                          size={85}
                        />
                      ) : (
                        // <Image
                        //   style={{
                        //     width: 85,
                        //     height: 85,
                        //     borderRadius: 50,
                        //   }}
                        //   resizeMode="stretch"
                        //   source={{ uri: item.Off_Image_Path }}
                        // />
                        <Image
                          style={{
                            width: 85,
                            height: 85,
                            borderRadius: 50,
                          }}
                          resizeMode="stretch"
                          source={require("../../assets/Images/communiv/library/home-screen/icon-3.png")}
                        />
                      )}
                    </View>
                    <View
                      style={{
                        marginTop: 30,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Text style={{ color: "#4169e1" }}>
                        {item.Off_BadgeNumber
                          ? item.Off_BadgeNumber
                          : "xxxxxxxxxxxx"}
                      </Text>
                      <StarRating
                        disabled={true}
                        maxStars={5}
                        rating={item.Off_Rating}
                        starSize={20}
                        emptyStarColor={"#FD9D26"}
                        fullStarColor={"#FD9D26"}
                        selectedStar={(rating) =>
                          this.onStarRatingPress1(rating)
                        }
                      />
                    </View>
                    <Text
                      style={{
                        textAlign: "center",
                        textTransform: "capitalize",
                      }}
                    >
                      {item.Off_Name}
                    </Text>
                  </TouchableOpacity>
                )}
                keyExtractor={(item) => item.Off_Pkey}
              />
            </View>
          </ScrollView>
          {this.renderImportModal()}
        </View>
      </SafeAreaView>
    );
  }
}
const mapStateToProps = (state, ownProps) => ({
  latitude: state.locationReducer.latitude,
  longitude: state.locationReducer.longitude,
  token: state.authReducer.token,
});

const mapDispatchToProps = {
  setLatitude,
  setLongitude,
  setOfficer,
};
export default connect(mapStateToProps, mapDispatchToProps)(OfficerList);
