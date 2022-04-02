import React, { Component } from "react";
import {
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TextInput,
  Image,
  TouchableOpacity,
} from "react-native";
import HeaderArrow from "../CustomComponent/HeaderArrow";
// import { RadioButton } from "react-native-paper";
// import RadioButton from "react-native-radio-buttons-group";
import StarRating from "react-native-star-rating";
import Spinner from "react-native-loading-spinner-overlay";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import {
  getfilterdata,
  getagencylist,
  complaintrewiewform,
  getofficerlist,
  getofficerdata,
} from "../utils/apiconfig";
import { connect, ReactReduxContext } from "react-redux";
import { Select, Radio } from "native-base";
import CustomButton from "../CustomComponent/CustomButton";
import { setToken } from "../store/action/auth/action";
import { setProfile } from "../store/action/Profile/action";
import AntDesign from "react-native-vector-icons/AntDesign";

class ReviewForm extends Component {
  constructor() {
    super();
    this.state = {
      // firstname: "minal",
      // gender: "1",
      // type: "1",
      // selectedBranch: "1",
      // isLoading: false,
      // race: "",
      // phonenumber: "32342342",
      // empathetic: "2",
      // professionalism: "1",
      // knowledgeable: "2",
      // understaning: "3",
      // comment: "Comment",
      // officerid: "1",
      // agencyid: "1",
      // note: "Note",
      // racetype: [],
      firstname: "",
      gender: "1",
      type: "1",
      isLoading: false,
      race: "",
      phonenumber: null,
      empathetic: "",
      professionalism: "",
      knowledgeable: "",
      understaning: "",
      comment: "",
      officerid: "1",
      agencyid: "1",
      note: "",
      racetype: [],
      officerdata: [],
      officerlist: [],
      agencydata: [],
      editable: false,
      ErrorAgencyid: null,
      ErrorFirstName: null,
      ErrorGender: null,
      ErrorRace: null,
      ErrorOfficerid: null,
      ErrorPhone: null,
    };
  }

  componentDidMount = async () => {
    this.focusListener = this.props.navigation.addListener(
      "focus",
      async () => {
        this.setState({
          agencyid: "",
          race: "",
          officerid: "",
          ErrorAgencyid: null,
          ErrorFirstName: null,
          ErrorGender: null,
          ErrorRace: null,
          ErrorOfficerid: null,
          ErrorPhone: null,
          ErrorPhoneDigit: null,
          ErrorProfessionalism: null,
          ErrorEmpathetic: null,
          ErrorKnowledgeable: null,
          ErrorUnderstaning: null,
          ErrorComment: null,
          agencyid: "",
          race: "",
          officerid: "",
          firstname: null,
          professionalism: 0,
          knowledgeable: 0,
          understaning: 0,
          empathetic: 0,
          comment: null,
          note: null,
          phonenumber: null,
        });
        console.log("dadadadda", this.props.route.params);
        await this.GetFilterData();
        await this.GetAgencyDetail();
        const { officerdata } = this.props.route.params;
        const { officer } = this.props.route.params;
        if (officerdata) {
          this.setState({
            type: this.props.route.params.type,
            editable: this.props.route.params.editable,
            officerdata,
            agencyid: officerdata.Off_Ag_Pkey.toString(),
            officerid: officerdata.Off_Pkey,
            race: officerdata.Off_RaceType,
          });
        } else if (officer) {
          this.setState({
            type: this.props.route.params.type,
            editable: this.props.route.params.editable,
            officerid: officer.Offuc_Off_PkeyID,
            agencyid: officer.Ag_Pkey.toString(),
            race: officer.Off_RaceType,
          });
        } else {
          this.setState({
            type: this.props.route.params.type,
            agencyid: "",
            race: "",
            officerid: "",
            firstname: null,
            professionalism: 0,
            knowledgeable: 0,
            understaning: 0,
            empathetic: 0,
            comment: null,
            note: null,
            phonenumber: null,
          });
        }
        await this.getOfficer();
      }
    );
  };

  getOfficer = async () => {
    if (this.state.agencyid) {
      let data = {
        Off_Ag_Pkey: parseInt(this.state.agencyid)
          ? parseInt(this.state.agencyid)
          : 1,
        Type: 3,
      };
      // console.log(data);
      await getofficerdata(data, this.props.token)
        .then((res) => {
          // console.log("res:getOfficer ", res);
          this.setState({ officerlist: res[0], isLoading: false });
        })
        .catch((error) => {
          if (error.response) {
            this.setState({ isLoading: false });
            console.log("responce_error", error.response);
          } else if (error.request) {
            this.setState({ isLoading: false });
            console.log("request error", error.request);
          } else if (error) {
            console.log("error", error);
            this.setState({ isLoading: false });
          }
        });
    }
  };
  GetFilterData = async () => {
    this.setState({ isLoading: true });
    let data = {
      Type: 1,
    };
    await getfilterdata(data)
      .then((res) => {
        console.log("res:1223 ", JSON.stringify(res[0].Race_DTOs));
        this.setState({
          racetype: res[0].Race_DTOs,
        });

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
  Validation = () => {
    this.setState({ isLoading: false });
    // debugger;
    const invalidFields = [];

    if (!this.state.firstname) {
      invalidFields.push("firstname");
      this.setState({ ErrorFirstName: "Name is required." });
    } else {
      console.log("else");
      this.setState({ ErrorFirstName: null });
    }
    if (!this.state.gender) {
      invalidFields.push("gender");
      this.setState({ ErrorGender: "Gender is required." });
    } else {
      this.setState({ ErrorGender: null });
    }

    if (!this.state.race) {
      invalidFields.push("race");
      this.setState({ ErrorRace: "Please enter Race ID." });
    } else {
      this.setState({ ErrorRace: null });
    }
    if (!this.state.phonenumber) {
      invalidFields.push("phonenumber");
      this.setState({ ErrorPhone: "Please enter phone Number." });
    } else {
      this.setState({ ErrorPhone: null });
    }
    if (this.state.phonenumber && this.state.phonenumber.length < 10) {
      invalidFields.push("phonenumber");
      this.setState({ ErrorPhoneDigit: "Please enter 10 digit number" });
    } else {
      this.setState({ ErrorPhoneDigit: null });
    }
    if (!this.state.professionalism) {
      invalidFields.push("professionalism");
      this.setState({ ErrorProfessionalism: "Give Professionalism Rating." });
    } else {
      this.setState({ ErrorProfessionalism: null });
    }
    if (!this.state.empathetic) {
      invalidFields.push("empathetic");
      this.setState({ ErrorEmpathetic: "Give Empathetic Rating." });
    } else {
      this.setState({ ErrorEmpathetic: null });
    }
    if (!this.state.knowledgeable) {
      invalidFields.push("knowledgeable");
      this.setState({ ErrorKnowledgeable: "Give Knowledgeable Rating." });
    } else {
      this.setState({ ErrorKnowledgeable: null });
    }
    if (!this.state.understaning) {
      invalidFields.push("understaning");
      this.setState({ ErrorUnderstaning: "Give Understaning Rating." });
    } else {
      this.setState({ ErrorUnderstaning: null });
    }
    if (!this.state.comment) {
      invalidFields.push("comment");
      this.setState({ ErrorComment: "Please enter Comment." });
    } else {
      this.setState({ ErrorComment: null });
    }
    if (!this.state.agencyid) {
      invalidFields.push("agencyid");
      this.setState({ ErrorAgencyid: "Please Select Agency name" });
    } else {
      this.setState({ ErrorAgencyid: null });
    }
    if (!this.state.officerid) {
      invalidFields.push("officerid");
      this.setState({ ErrorOfficerid: "Please Select Officer name" });
    } else {
      this.setState({ ErrorOfficerid: null });
    }
    return invalidFields.length > 0;
  };
  onFirstNameChange = (firstname) => {
    // value = value.replace(/[^A-Za-z]/gi, "");
    // this.setState({ firstname: value });
    this.setState({ firstname });
  };
  onRaceChange = (race) => {
    this.setState({ race });
  };
  onCommentChange = (comment) => {
    this.setState({ comment });
  };
  onPhoneNumberChange = (phonenumber) => {
    const value = phonenumber.replace(/[^0-9]/gi, "");
    this.setState({ phonenumber: value });
  };
  onAddNoteChange = (note) => {
    this.setState({ note });
  };

  onStarRatingProf(rating) {
    this.setState({
      professionalism: rating,
    });
  }
  onStarRatingKnowledge(rating) {
    this.setState({
      knowledgeable: rating,
    });
  }
  onStarRatingUnderstanding(rating) {
    this.setState({
      understaning: rating,
    });
  }
  onStarRatingEmpathic(rating) {
    this.setState({
      empathetic: rating,
    });
  }
  GetAgencyDetail = async () => {
    this.setState({ isLoading: true });
    let data = {
      Type: 1,
    };
    console.log(data, this.props.token);
    await getagencylist(data, this.props.token)
      .then((res) => {
        // console.log("GetAgencyDetail", res[0]);
        this.setState({ agencydata: res[0], isLoading: false });
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
  onhandleReviweSubmit = async () => {
    // alert("hiiiiii");
    this.setState({ isLoading: true });
    const validate = this.Validation();
    console.log("validate", validate);
    if (!validate) {
      const {
        gender,
        type,
        firstname,
        race,
        professionalism,
        knowledgeable,
        understaning,
        empathetic,
        comment,
        officerid,
        agencyid,
        note,
        phonenumber,
      } = this.state;
      this.setState({ isLoading: true });
      let data = {
        Rat_Name: firstname,
        Rat_Gender: parseInt(gender),
        Rat_Race: race,
        Rat_Phone: phonenumber,
        Rat_Prof: professionalism,
        Rat_knowlede: knowledgeable,
        Rat_understanding: understaning,
        Rat_Empathetic: empathetic,
        Rat_Comment: comment,
        Rat_Agency_ID: agencyid,
        Rat_Off_ID: officerid,
        Rat_Type: parseInt(type),
        Rat_Add_Comment: note,
        Type: 1,
      };
      console.log("data", data);
      await complaintrewiewform(data, this.props.token)
        .then((res) => {
          console.log("res:1234567890 ", JSON.stringify(res));
          this.setState({
            isLoading: false,
            race: "1",
            agencyid: "1",
            officerid: "1",
          });
          if (type === "1") {
            this.props.navigation.navigate("SuccessPage1", {
              text: "Your Complaint Submitted Successfully",
              login: false,
            });
          } else if (type === "2") {
            this.props.navigation.navigate("SuccessPage1", {
              text: "Your Rewiew Submitted Successfully",
              login: false,
            });
          }
        })
        .catch((error) => {
          if (error.response) {
            console.log("responce_error", error.response);
            this.setState({ isLoading: false });
          } else if (error.request) {
            this.setState({ isLoading: false });
            console.log("request error", error.request);
          } else if (error) {
            alert("Server Error");
            this.setState({ isLoading: false });
          }
        });
      this.setState({ isLoading: false });

      // this.props.navigation.navigate("Home");
    }
  };

  render() {
    const {
      ErrorFirstName,
      gender,
      type,
      firstname,
      professionalism,
      knowledgeable,
      understaning,
      empathetic,
      comment,
      officerid,
      agencyid,
      phonenumber,
      note,
      isLoading,
      ErrorGender,
      ErrorRace,
      ErrorPhone,
      ErrorProfessionalism,
      ErrorEmpathetic,
      ErrorUnderstaning,
      ErrorKnowledgeable,
      ErrorComment,
      ErrorPhoneDigit,
      editable,
      ErrorAgencyid,
      ErrorOfficerid,
    } = this.state;
    console.log(type);
    return (
      <SafeAreaView
        style={{
          backgroundColor: "#FFF",
          height: "100%",
          flex: 1,
        }}
      >
        <View>
          <Spinner visible={isLoading} />

          <HeaderArrow
            back={false}
            home={true}
            drawer={false}
            navigation={this.props.navigation}
          />
          <ScrollView keyboardShouldPersistTaps="always">
            <View style={{ marginBottom: 300 }}>
              <View style={{ alignItems: "center" }}>
                <Text style={{ fontWeight: "bold", fontSize: 20 }}>
                  SUBMIT YOUR {type === "1" ? "COMPLAINT" : "REVIEW"}
                </Text>
              </View>
              <View
                style={{
                  marginHorizontal: 15,
                }}
              >
                <View
                  style={{
                    backgroundColor: "#F3F3F3",
                    marginTop: 10,
                  }}
                >
                  <TextInput
                    value={firstname}
                    placeholder="Enter Your Name"
                    placeholderTextColor="#A9A9A9"
                    onChangeText={this.onFirstNameChange}
                    style={{
                      width: "85%",
                      paddingLeft: 20,
                      height: 50,
                    }}
                  />
                </View>
                <View style={{ width: "90%" }}>
                  {ErrorFirstName && (
                    <Text
                      style={{ color: "red", marginTop: 5, marginRight: 30 }}
                    >
                      {ErrorFirstName}
                    </Text>
                  )}
                </View>
                <View style={{ marginTop: 15, marginBottom: 10 }}>
                  <Text style={{ color: "#4169e1", fontWeight: "bold" }}>
                    Your Gender
                  </Text>
                </View>
                <View>
                  <Radio.Group
                    size="sm"
                    colorScheme="blue"
                    name="myRadioGroup"
                    value={gender}
                    onChange={(nextValue) => {
                      this.setState({
                        gender: nextValue,
                      });
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        // backgroundColor: "pink",
                        width: "50%",
                      }}
                    >
                      <Radio value="1" my={1}>
                        Male
                      </Radio>
                      <Radio value="2" my={1}>
                        Female
                      </Radio>
                    </View>
                  </Radio.Group>
                </View>
                <View style={{ width: "90%" }}>
                  {ErrorGender && (
                    <Text
                      style={{ color: "red", marginTop: 5, marginRight: 30 }}
                    >
                      {ErrorGender}
                    </Text>
                  )}
                </View>
                {this.state.racetype && (
                  <View style={{ marginTop: 20 }}>
                    <View
                      style={{
                        flexDirection: "row",
                        // backgroundColor: "pink",
                        alignItems: "center",
                        backgroundColor: "#F3F3F3",
                      }}
                    >
                      <Select
                        dropdownIcon
                        isDisabled={editable}
                        color="red"
                        variant="unstyled"
                        style={{
                          borderWidth: 0,
                          fontSize: 14,
                          paddingLeft: 20,
                          color: "gray",
                          height: 50,
                        }}
                        selectedValue={this.state.race}
                        minWidth={300}
                        accessibilityLabel="Select your favorite programming language"
                        placeholder="Select Race Type"
                        onValueChange={(itemValue) =>
                          this.setState({
                            race: itemValue,
                          })
                        }
                        _selectedItem={{
                          bg: "#4169e1",
                          // endIcon: nu,
                        }}
                      >
                        {this.state.racetype.map((item) => {
                          return (
                            <Select.Item
                              label={item.Race_Name}
                              value={item.Race_PkeyID}
                            />
                          );
                        })}
                      </Select>
                    </View>
                  </View>
                )}
                <View style={{ width: "90%" }}>
                  {ErrorRace && (
                    <Text
                      style={{ color: "red", marginTop: 5, marginRight: 30 }}
                    >
                      {ErrorRace}
                    </Text>
                  )}
                </View>
                <View
                  style={{
                    backgroundColor: "#F3F3F3",
                    marginTop: 10,
                    marginBottom: 10,
                  }}
                >
                  <TextInput
                    value={phonenumber}
                    placeholder="Enter Phone No."
                    placeholderTextColor="#A9A9A9"
                    onChangeText={this.onPhoneNumberChange}
                    maxLength={10}
                    style={{
                      width: "85%",
                      paddingLeft: 20,
                      height: 50,
                    }}
                  />
                </View>
                <View style={{ width: "90%" }}>
                  {ErrorPhone && (
                    <Text
                      style={{ color: "red", marginTop: 5, marginRight: 30 }}
                    >
                      {ErrorPhone}
                    </Text>
                  )}
                </View>
                <View style={{ width: "90%" }}>
                  {ErrorPhoneDigit && (
                    <Text
                      style={{ color: "red", marginTop: 5, marginRight: 30 }}
                    >
                      {ErrorPhoneDigit}
                    </Text>
                  )}
                </View>
                <View style={{ marginVertical: 10 }}>
                  <Text style={{ color: "#4169e1", fontWeight: "bold" }}>
                    Rate the officer
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginVertical: 10,
                  }}
                >
                  <Text style={{ color: "gray" }}>Professionalism</Text>
                  <StarRating
                    disabled={false}
                    maxStars={5}
                    rating={professionalism}
                    starSize={20}
                    emptyStarColor={"#000"}
                    fullStarColor={"#FD9D26"}
                    selectedStar={(rating) => this.onStarRatingProf(rating)}
                  />
                </View>
                <View style={{ width: "90%" }}>
                  {ErrorProfessionalism && (
                    <Text
                      style={{ color: "red", marginTop: 5, marginRight: 30 }}
                    >
                      {ErrorProfessionalism}
                    </Text>
                  )}
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginVertical: 10,
                  }}
                >
                  <Text style={{ color: "gray" }}>Knowledgeable</Text>
                  <StarRating
                    disabled={false}
                    maxStars={5}
                    rating={knowledgeable}
                    starSize={20}
                    emptyStarColor={"#000"}
                    fullStarColor={"#FD9D26"}
                    selectedStar={(rating) =>
                      this.onStarRatingKnowledge(rating)
                    }
                  />
                </View>
                <View style={{ width: "90%" }}>
                  {ErrorKnowledgeable && (
                    <Text
                      style={{ color: "red", marginTop: 5, marginRight: 30 }}
                    >
                      {ErrorKnowledgeable}
                    </Text>
                  )}
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginVertical: 10,
                  }}
                >
                  <Text style={{ color: "gray" }}>Understanding</Text>
                  <StarRating
                    disabled={false}
                    maxStars={5}
                    rating={understaning}
                    starSize={20}
                    emptyStarColor={"#000"}
                    fullStarColor={"#FD9D26"}
                    selectedStar={(rating) =>
                      this.onStarRatingUnderstanding(rating)
                    }
                  />
                </View>
                <View style={{ width: "90%" }}>
                  {ErrorUnderstaning && (
                    <Text
                      style={{ color: "red", marginTop: 5, marginRight: 30 }}
                    >
                      {ErrorUnderstaning}
                    </Text>
                  )}
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginVertical: 10,
                  }}
                >
                  <Text style={{ color: "gray" }}>Empathetic</Text>
                  <StarRating
                    disabled={false}
                    maxStars={5}
                    rating={empathetic}
                    starSize={20}
                    emptyStarColor={"#000"}
                    fullStarColor={"#FD9D26"}
                    selectedStar={(rating) => this.onStarRatingEmpathic(rating)}
                  />
                </View>
                <View style={{ width: "90%" }}>
                  {ErrorEmpathetic && (
                    <Text
                      style={{ color: "red", marginTop: 5, marginRight: 30 }}
                    >
                      {ErrorEmpathetic}
                    </Text>
                  )}
                </View>
                <View
                  style={{
                    backgroundColor: "#F3F3F3",
                    marginTop: 10,
                  }}
                >
                  <TextInput
                    value={comment}
                    multiline={true}
                    numberOfLines={5}
                    placeholder="Write a review or make complaint"
                    placeholderTextColor="#A9A9A9"
                    onChangeText={this.onCommentChange}
                    style={{
                      width: "85%",
                      paddingLeft: 20,
                      height: 150,
                    }}
                  />
                </View>
                <View style={{ width: "90%" }}>
                  {ErrorComment && (
                    <Text
                      style={{ color: "red", marginTop: 5, marginRight: 30 }}
                    >
                      {ErrorComment}
                    </Text>
                  )}
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    // backgroundColor: "pink",
                    alignItems: "center",
                    backgroundColor: "#F3F3F3",
                    marginTop: 20,
                    justifyContent: "space-between",
                    paddingRight: 30,
                  }}
                >
                  {this.state.agencydata && (
                    <Select
                      isDisabled={editable}
                      dropdownIcon
                      variant="unstyled"
                      style={{
                        borderWidth: 0,
                        fontSize: 13.5,
                        color: "gray",
                        height: 50,
                      }}
                      selectedValue={agencyid}
                      minWidth={"90%"}
                      accessibilityLabel="Select your favorite programming language"
                      placeholder="Select Agency"
                      onValueChange={(itemValue) =>
                        this.setState(
                          {
                            agencyid: itemValue,
                          },
                          () => this.getOfficer()
                        )
                      }
                      _selectedItem={{
                        bg: "#4169e1", //   endIcon: <CheckIcon size={4} />,
                      }}
                    >
                      {this.state.agencydata.map((item) => {
                        return (
                          <Select.Item
                            label={item.Ag_Name}
                            value={item.Ag_Pkey.toString()}
                          />
                        );
                      })}
                    </Select>
                  )}

                  <AntDesign name="caretdown" size={20} color={"#B9C7FE"} />
                </View>
                <View style={{ width: "90%" }}>
                  {ErrorAgencyid && (
                    <Text
                      style={{ color: "red", marginTop: 5, marginRight: 30 }}
                    >
                      {ErrorAgencyid}
                    </Text>
                  )}
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    // backgroundColor: "pink",
                    alignItems: "center",
                    backgroundColor: "#F3F3F3",
                    marginTop: 20,
                    justifyContent: "space-between",
                    paddingRight: 30,
                  }}
                >
                  {this.state.officerlist && (
                    <Select
                      isDisabled={editable}
                      dropdownIcon
                      variant="unstyled"
                      style={{
                        borderWidth: 0,
                        fontSize: 13.5,
                        color: "gray",
                        height: 50,
                      }}
                      selectedValue={officerid}
                      minWidth={"90%"}
                      accessibilityLabel="Select your favorite programming language"
                      placeholder="Select Officer"
                      onValueChange={(itemValue) =>
                        this.setState({
                          officerid: itemValue,
                        })
                      }
                      _selectedItem={{
                        bg: "#4169e1", //   endIcon: <CheckIcon size={4} />,
                      }}
                    >
                      {this.state.officerlist.map((item) => {
                        return (
                          <Select.Item
                            label={item.Off_Name}
                            value={item.Off_Pkey}
                          />
                        );
                      })}
                    </Select>
                  )}

                  <AntDesign name="caretdown" size={20} color={"#B9C7FE"} />
                </View>
                <View style={{ width: "90%" }}>
                  {ErrorOfficerid && (
                    <Text
                      style={{ color: "red", marginTop: 5, marginRight: 30 }}
                    >
                      {ErrorOfficerid}
                    </Text>
                  )}
                </View>
                <View style={{ marginTop: 20 }}></View>
                <View
                  style={{
                    flexDirection: "row",
                    // backgroundColor: "pink",
                    alignItems: "center",
                    marginTop: 20,
                  }}
                >
                  <Text style={{ color: "#4169e1" }}>It is a</Text>
                  <Radio.Group
                    size="sm"
                    colorScheme="blue"
                    name="myRadioGroup"
                    value={type}
                    onChange={(nextValue) => {
                      this.setState({
                        type: nextValue,
                      });
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: "70%",
                        marginLeft: 20,
                        marginRight: 20,
                      }}
                    >
                      <Radio value="1" my={2}>
                        Complaint
                      </Radio>
                      <Radio value="2" my={2}>
                        Review
                      </Radio>
                    </View>
                  </Radio.Group>
                </View>
                <View
                  style={{
                    backgroundColor: "#F3F3F3",
                    marginTop: 10,
                  }}
                >
                  <TextInput
                    value={note}
                    multiline={true}
                    numberOfLines={5}
                    placeholder="Additional Notes"
                    placeholderTextColor="gray"
                    onChangeText={this.onAddNoteChange}
                    style={{
                      width: "85%",
                      paddingLeft: 20,
                      height: 150,
                    }}
                  />
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    marginTop: 20,
                    marginRight: 20,
                  }}
                >
                  <CustomButton
                    onPress={() => this.onhandleReviweSubmit()}
                    title={"Submit"}
                    width={"40%"}
                  />
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }
}
const mapStateToProps = (state, ownProps) => ({
  token: state.authReducer.token,
});

const mapDispatchToProps = {
  setToken,
};
export default connect(mapStateToProps, mapDispatchToProps)(ReviewForm);
