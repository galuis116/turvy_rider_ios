import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  BackHandler,
  StatusBar,
  Platform,
  Linking,
  TextInput,
  TouchableHighlight,
  Keyboard,
} from "react-native";
//import * as Permissions from 'expo-permissions';
import MapView, { Marker, Polyline, Callout } from "react-native-maps";
import * as Location from "expo-location";
import Animated from "react-native-reanimated";
import BottomSheet from "reanimated-bottom-sheet";
import { Button, Divider } from "react-native-paper";
import { Col, Row, Grid } from "react-native-easy-grid";
import { Rating, AirbnbRating } from "react-native-ratings";
import {
  EvilIcons,
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome5,
  Feather,
  AntDesign,
} from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Input } from "react-native-elements";
import { showMessage } from "react-native-flash-message";
import FlashMessage from "react-native-flash-message";
//custom files
import GradientButton from "../Riders/GradientButton";
import { DOMAIN } from "../Constant";
import { stylesinp } from "../Components/Support";

const { width, height } = Dimensions.get("window");

export default class RiderRating extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inprocessing: 0,
      riderRating: 5,
      tipVal: 0,
      accessTokan: "",
      driverId: "",
      showBottomSheet: 1,
      screenHeight: ["100%", "85%", "65%", "45%", "0%"],
      rateError: "",
      rateSuccess: "",
      feedbackText: "",
      showCustom: 0,
      bookingresponse: {},
      bookingdriver: {},
      driveravatar: "",
      selectedvehiclefare: 0,
      selectsurcharge: 0,
      finalCost: 0,
      distancetravel: 0,
      waypointslnglat: [],
      is_tips: false,
      tip_amount: [],
      start_time: "",
      end_time: "",
      rating_driver: "",
      active: "",
      //   emptyWhatwrong:
    };
    this.myRefbt = React.createRef();
  }

  UNSAFE_componentWillUnmount() {
    // this.keyboardDidHideListener.remove();
  }

  async componentDidMount() {
    /*await AsyncStorage.getItem('driverId').then((value) => {           
            if(value != '' && value !== null){
                this.setState({driverId:value})
            }
        })
           
           */
    console.log(this.props.route.params.bookingresponse);
    // alert(this.props.route.params.selectsurcharge);
    //alert(this.props.route.params.selectedvehiclefare);
    let finalCost =
      parseFloat(this.props.route.params.selectsurcharge) +
      parseFloat(this.props.route.params.selectedvehiclefare);
    finalCost = finalCost.toFixed(2);
    let distancetravel = parseFloat(this.props.route.params.distancetravel);
    let is_tips = await AsyncStorage.getItem("is_tips");
    let tip_amount = await AsyncStorage.getItem("tip_amount");
    let tip_amount_array = tip_amount.split(",");
    console.log("TIPS AMOUNT ARRAY ", this.props.route.params.bookingdriver);
    // alert(is_tips);
    let driveravatar =
      "https://www.turvy.net/" + this.props.route.params.bookingdriver.avatar;
    this.setState({
      bookingresponse: this.props.route.params.bookingresponse,
      bookingdriver: this.props.route.params.bookingdriver,
      selectedvehiclefare: this.props.route.params.selectedvehiclefare,
      selectsurcharge: this.props.route.params.selectsurcharge,
      finalCost: finalCost,
      distancetravel: distancetravel,
      waypointslnglat: this.props.route.params.waypointslnglat,
      is_tips: is_tips,
      tip_amount: tip_amount_array,
      driveravatar: driveravatar,
      start_time: this.props.route.params.start_time,
      end_time: this.props.route.params.end_time,
    });

    // this.keyboardDidHideListener = Keyboard.addListener(
    //   "keyboardDidHide",
    //   () => {
    //     if (this.myRefbt.current) {
    //       this.myRefbt.current.snapTo(2);
    //     }
    //   }
    // );

    await AsyncStorage.getItem("accesstoken").then((value) => {
      if (value != "" && value !== null) {
        this.setState({
          accessTokan: value,
        });
      }
    });
    this.setState({ rateError: "" });
    this.getRiderTime();
    this.getDriverRating();
  }

  ratingCompleted = (rating) => {
    console.log(rating);
    //	inprocessing:1,
    if (rating == 5) this.myRefbt.current.snapTo(2);
    this.setState({
      riderRating: rating,
    });
  };

  async getRiderTime() {
    await AsyncStorage.getItem("accesstoken").then((value) => {
      fetch(
        "https://www.turvy.net/api/rider/requestbookstatus/" +
          this.state.bookingresponse.id,
        {
          method: "GET",
          headers: new Headers({
            Authorization: "Bearer " + value,
            "Content-Type": "application/json",
          }),
        }
      )
        .then((response) => response.json())
        .then((json) => {
          //console.log("get status if driver accept");
          //console.log(json);

          if (json.status == 1) {
            //console.log(json.data.booking.start_time)
            //console.log(json.data.booking.end_time)
            this.setState({
              start_time: json.data.endTime,
              end_time: json.data.startTime,
            });
          }
        })
        .catch((error) => console.error(error));
    });
  }

  async getDriverRating() {
    await AsyncStorage.getItem("accesstoken").then((value) => {
      console.log("BOKING INFO", this.state.bookingresponse.id);
      fetch(
        "https://www.turvy.net/api/rider/driverRating/" +
          this.state.bookingdriver.id,
        {
          method: "GET",
          headers: new Headers({
            Authorization: "Bearer " + value,
            "Content-Type": "application/json",
          }),
        }
      )
        .then((response) => response.json())
        .then((json) => {
          if (json.status == 1) {
            //console.log(json.data.booking.start_time)
            //console.log("GET RATING",json.data)
            this.setState({
              rating_driver: json.data,
            });
          }
        })
        .catch((error) => console.error(error));
    });
  }

  async submit() {
    //alert(this.state.riderRating);
    if (this.state.riderRating <= 0) {
      this.setState({ rateError: "Please provide rating." });
      return false;
    }

    if (this.state.feedbackText.trim() === "") {
      //this.setState({rateError:'Please provide your feedback'});
      //return false;
    }

    //(Number) = book_id
    await fetch(
      DOMAIN + "api/rider/book/feedback/" + this.state.bookingresponse.id,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Bearer " + this.state.accessTokan,
        },
        body: JSON.stringify({
          rate: this.state.riderRating,
          comment: this.state.feedbackText,
          option: this.state.active,
        }),
      }
    )
      .then(function (response) {
        return response.json();
      })
      .then((result) => {
        // this.myRefbt.current.snapTo(2);
        if (result.status === 1) {
          //this.setState({screenHeight:height/3})
          this.setState({ rateSuccess: result.message });
          setTimeout(() => {
            this.setState({ showBottomSheet: 0 });
            this.props.navigation.replace("BookMain");
          }, 3000);
        }
      });

    if (this.state.tipVal > 0) {
      await fetch(
        DOMAIN + "api/rider/book/payment/" + this.state.bookingresponse.id,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: "Bearer " + this.state.accessTokan,
          },
          body: JSON.stringify({
            payment_method_id: 1,
            type: "TIP",
            amount: this.state.tipVal,
          }),
        }
      )
        .then(function (response) {
          return response.json();
        })
        .then((res) => {
          console.log(res);
        });
    }
  }

  renderSuccess = () => (
    <>
      <View
        style={{
          backgroundColor: "white",
          padding: 15,
          height: "100%",
          margin: 10,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.23,
          shadowRadius: 2.62,
          elevation: 4,
          borderRadius: 10,
        }}
      >
        <Grid>
          <Row
            style={{
              height: 200,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 19, color: "green" }}>
              {this.state.rateSuccess}
            </Text>
          </Row>
        </Grid>
      </View>
    </>
  );

  renderContent = () => (
    <>
      <View
        style={{
          backgroundColor: "white",
          padding: 15,
          height: "100%",
          margin: 10,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.23,
          shadowRadius: 2.62,
          elevation: 4,
          borderRadius: 10,
        }}
      >
        {this.state.inprocessing == 0 ? (
          <Grid>
            <Row style={{ height: 30 }}>
              <Col>
                <Ionicons name="arrow-back" size={24} color="transparent" />
              </Col>
              <Col>
                <Text style={{ fontSize: 19, textAlign: "center" }}>
                  You Arrived
                </Text>
              </Col>
              <Col style={{ alignItems: "flex-end" }}>
                <Ionicons
                  name="close"
                  size={24}
                  color="black"
                  onPress={() => {
                    this.props.navigation.replace("BookMain");
                  }}
                />
              </Col>
            </Row>
            <Divider style={{ marginBottom: 5, marginTop: 10 }} />
            <Row style={{ height: 60 }}>
              <Col size={6}>
                <View
                  style={{
                    alignContent: "center",
                    justifyContent: "center",
                    flex: 1,
                    flexDirection: "row",
                  }}
                >
                  <Row
                    style={{
                      flex: 1,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Col style={{ width: 60 }}>
                      {this.state.driveravatar &&
                      this.state.driveravatar != null ? (
                        <Image
                          source={{ uri: this.state.driveravatar }}
                          style={{
                            alignItems: "center",
                            width: 50,
                            height: 50,
                            borderRadius: 5,
                          }}
                        />
                      ) : (
                        <Image
                          source={{
                            uri: "https://www.turvy.net/images/no-person.png",
                          }}
                          style={{
                            alignItems: "center",
                            width: 50,
                            height: 50,
                            borderRadius: 5,
                          }}
                        />
                      )}
                    </Col>
                    <Col style={{ width: 110 }}>
                      <Text>{this.state.bookingdriver.name}</Text>
                      <View style={{ flexDirection: "row" }}>
                        <Ionicons name="ios-star" size={16} color="#FFAA01" />
                        <Text> {this.state.rating_driver}</Text>
                      </View>
                    </Col>
                    <Col>
                      <Text style={{ fontSize: 12, color: "gray" }}>
                        Final Cost
                      </Text>
                      <Text style={{ fontSize: 12, fontWeight: "bold" }}>
                        A$ {this.state.finalCost}
                      </Text>
                    </Col>
                    <Col>
                      <Text style={{ fontSize: 12, color: "gray" }}>
                        Distance Travel
                      </Text>
                      <Text style={{ fontSize: 12, fontWeight: "bold" }}>
                        {this.state.distancetravel} km
                      </Text>
                    </Col>
                  </Row>
                </View>
              </Col>
            </Row>
            <Divider style={{ marginBottom: 5, marginTop: 5 }} />
            <Row style={{ height: 40 }}>
              <Col size={12} style={{ padding: 6 }}>
                <Text>TRIP</Text>
              </Col>
            </Row>
            <Row style={{ height: 50 }}>
              <Col
                size={2}
                style={{
                  justifyContent: "center",
                  alignContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    alignSelf: "center",
                    backgroundColor: "#135AA8",
                    width: 15,
                    height: 15,
                    borderRadius: 30,
                  }}
                ></View>
                <View
                  style={{
                    flex: 1,
                    width: 1,
                    height: "30%",
                    borderStyle: "solid",
                    borderRadius: 1,
                    borderColor: "black",
                    borderWidth: 1,
                  }}
                ></View>
              </Col>
              <Row size={12}>
                <Col size={8}>
                  <Text>{this.state.bookingresponse.origin}</Text>
                </Col>
                <Col size={2}>
                  <Text style={{ fontSize: 13, color: "grey" }}>
                    {this.state.start_time}
                  </Text>
                </Col>
              </Row>
            </Row>
            {Object.keys(this.state.waypointslnglat).length > 0
              ? this.state.waypointslnglat.map((item, key) => {
                  return (
                    <Row style={{ height: 30 }}>
                      <Col
                        size={2}
                        style={{
                          justifyContent: "center",
                          alignContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <View
                          style={{
                            alignSelf: "center",
                            backgroundColor: "#135AA8",
                            width: 15,
                            height: 15,
                            borderRadius: 30,
                          }}
                        ></View>
                        <View
                          style={{
                            flex: 1,
                            width: 1,
                            height: "30%",
                            borderStyle: "solid",
                            borderRadius: 1,
                            borderColor: "black",
                            borderWidth: 1,
                          }}
                        ></View>
                      </Col>
                      <Row size={12}>
                        <Col size={8}>
                          <Text numberOfLines={1}>{item.stopname}</Text>
                        </Col>
                        <Col size={2}>
                          <Text style={{ fontSize: 13, color: "grey" }}></Text>
                        </Col>
                      </Row>
                    </Row>
                  );
                })
              : null}
            <Row style={{ height: 40, marginLeft: -2, marginTop: -15 }}>
              <Col size={2}>
                <Button icon="square" color={"#000000"}></Button>
              </Col>
              <Row size={12}>
                <Col size={8}>
                  <Text style={{ paddingTop: 8 }}>
                    {this.state.bookingresponse.destination}
                  </Text>
                </Col>
                <Col size={2}>
                  <Text style={{ fontSize: 13, color: "grey", paddingTop: 10 }}>
                    {this.state.end_time}
                  </Text>
                </Col>
              </Row>
            </Row>
            <Divider style={{ marginBottom: 5, marginTop: 5 }} />
            <Row>
              <Col size={12}>
                <Row
                  style={{
                    height: 200,
                    display: "flex",
                    alignContent: "center",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Col size={12}>
                    <Text
                      style={{
                        textAlign: "center",
                        fontWeight: "bold",
                        marginBottom: 10,
                        fontSize: 16,
                      }}
                    >
                      How was your driver?
                    </Text>
                    <AirbnbRating
                      count={5}
                      reviews={[
                        "Terrible",
                        "Bad",
                        "Good",
                        "Very Good",
                        "Amazing",
                      ]}
                      defaultRating={this.state.riderRating}
                      size={30}
                      onFinishRating={this.ratingCompleted}
                      showRating={false}
                    />
                    {this.state.riderRating < 5 ? (
                      <Row>
                        <Col>
                          <Text
                            style={{
                              fontSize: 20,
                              marginVertical: 10,
                              textAlign: "center",
                            }}
                          >
                            What went wrong?
                          </Text>
                          {/* <Row>
                          <Col size={12}> */}
                          <TextInput
                            placeholder="Tell us what went wrong"
                            blurOnSubmit={false}
                            returnKeyType={"go"}
                            style={styles.textInput}
                            value={this.state.active}
                            onFocus={(e) => {
                              this.myRefbt.current.snapTo(0);
                            }}
                            onBlur={(e) => {
                              this.myRefbt.current.snapTo(2);
                            }}
                            multiline={true}
                            scrollEnabled={true}
                            numberOfLines={50}
                            underlineColorAndroid={"transparent"}
                            autoCapitalize={"none"}
                            autoCorrect={false}
                            textAlignVertical="top"
                            onChangeText={(value) => {
                              this.setState({
                                active: value,
                              });
                            }}
                          />
                          {/* <View style={{ alignItems: "center" }}>
                            <Text style={{ color: "red" }}>
                              {this.state.emptyWhatwrong}
                            </Text>
                          </View> */}
                        </Col>
                        {/* </Col>
                        </Row> */}
                      </Row>
                    ) : null}
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <TouchableOpacity
                      onPress={() => this.rateDriver()}
                      style={{
                        backgroundColor: "#000",
                        alignItems: "center",
                        paddingVertical: 10,
                        height: 44,
                      }}
                    >
                      <Text style={{ color: "#ffffff", fontSize: 18 }}>
                        Rate Driver
                      </Text>
                    </TouchableOpacity>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Grid>
        ) : (
          <Grid>
            <Row style={{ height: 50 }}>
              <Col>
                <Ionicons
                  name="arrow-back"
                  size={24}
                  color="black"
                  onPress={() => {
                    this.setState({ inprocessing: 0 });
                    this.myRefbt.current.snapTo(2);
                  }}
                />
              </Col>
              <Col>
                <Text style={{ fontSize: 19, textAlign: "center" }}>
                  Awesome!
                </Text>
              </Col>
              <Col style={{ alignItems: "flex-end" }}>
                <Ionicons
                  name="close"
                  size={24}
                  color="black"
                  onPress={() => this.setState({ showBottomSheet: 0 })}
                />
              </Col>
            </Row>
            <Row style={{ height: 40 }}>
              <Col>
                {this.state.riderRating === 1 ? (
                  <Text style={{ fontSize: 15, textAlign: "center" }}>
                    You rated {this.state.bookingdriver.name}{" "}
                    {this.state.riderRating} star
                  </Text>
                ) : (
                  <Text style={{ fontSize: 15, textAlign: "center" }}>
                    You rated {this.state.bookingdriver.name}{" "}
                    {this.state.riderRating} stars
                  </Text>
                )}
              </Col>
            </Row>
            <Row style={{ height: 60 }}>
              <Col size={12}>
                <AirbnbRating
                  count={5}
                  defaultRating={this.state.riderRating}
                  size={35}
                  isDisabled={true}
                  showRating={false}
                  selectedColor={"#FFAA01"}
                />
              </Col>
            </Row>
            <Row style={{ height: 110 }}>
              <Col size={12}>
                <TextInput
                  placeholder="Say something about  services?"
                  blurOnSubmit={false}
                  returnKeyType={"go"}
                  value={this.state.feedbackText}
                  style={styles.textInput}
                  onFocus={(e) => {
                    this.myRefbt.current.snapTo(0);
                  }}
                  onBlur={(e) => {
                    // this.myRefbt.current.snapTo(2);
                  }}
                  multiline={true}
                  scrollEnabled={true}
                  numberOfLines={50}
                  underlineColorAndroid={"transparent"}
                  autoCapitalize={"none"}
                  autoCorrect={false}
                  textAlignVertical="top"
                  onChangeText={(value) => {
                    this.setState({ feedbackText: value, rateError: "" });
                  }}
                />
                <View style={{ alignItems: "center" }}>
                  <Text style={{ color: "red" }}>{this.state.rateError}</Text>
                </View>
              </Col>
            </Row>
            {this.state.is_tips && this.state.is_tips == 1 ? (
              <>
                <Row style={{ height: 40 }}>
                  <Col size={12} style={{ padding: 6 }}>
                    <Text style={{ textAlign: "center", fontSize: 16 }}>
                      Add a tip for {this.state.bookingdriver.name}
                    </Text>
                  </Col>
                </Row>
                <Row
                  style={{
                    height: 50,
                    alignContent: "center",
                    justifyContent: "center",
                    marginHorizontal: 10,
                  }}
                >
                  {Object.keys(this.state.tip_amount).length > 0 &&
                    this.state.tip_amount.map((item, index) => {
                      return (
                        <Col>
                          <TouchableOpacity
                            onPress={() => {
                              this.setState({ tipVal: item });
                            }}
                          >
                            <View
                              style={[
                                styles.tipBox,
                                this.state.tipVal === item
                                  ? {
                                      backgroundColor: "#114875",
                                      borderColor: "#114875",
                                    }
                                  : { borderColor: "#114875" },
                              ]}
                            >
                              <Text
                                style={
                                  this.state.tipVal === item
                                    ? { textAlign: "center", color: "#FFF" }
                                    : { textAlign: "center", color: "#114875" }
                                }
                              >
                                ${item}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        </Col>
                      );
                    })}
                </Row>
                <Row
                  style={{
                    height: 50,
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: 10,
                  }}
                >
                  {this.state.showCustom ? (
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <View style={{ width: 120, marginHorizontal: 10 }}>
                        <Input
                          onFocus={(e) => {
                            this.myRefbt.current.snapTo(0);
                          }}
                          onBlur={(e) => {
                            // this.myRefbt.current.snapTo(2);
                          }}
                          placeholder="Add Amount"
                          inputStyle={styles.custInput}
                          keyboardType="number-pad"
                          onChangeText={(value) => {
                            this.setState({ tipVal: value });
                          }}
                          value={this.state.tipVal}
                          inputContainerStyle={{
                            borderBottomWidth: 0,
                            width: 120,
                            marginTop: 28,
                          }}
                        />
                      </View>
                      <View>
                        <Ionicons
                          name="close"
                          size={24}
                          color="black"
                          onPress={() =>
                            this.setState({ showCustom: 0, tipVal: 0 })
                          }
                        />
                      </View>
                    </View>
                  ) : (
                    <TouchableOpacity
                      onPress={() => this.setState({ showCustom: 1 })}
                    >
                      <View
                        style={[
                          styles.tipBox,
                          {
                            paddingHorizontal: 10,
                            borderColor: "#114875",
                            height: 40,
                          },
                        ]}
                      >
                        <Text style={{ textAlign: "center", color: "#114875" }}>
                          Custom Amount
                        </Text>
                      </View>
                    </TouchableOpacity>
                  )}
                </Row>
              </>
            ) : (
              <></>
            )}
            <Row>
              <Col size={4}></Col>
              <Col size={4}>
                <View
                  style={{
                    paddingBottom: 20,
                    borderRadius: 40,
                    paddingTop: 20,
                  }}
                >
                  <TouchableOpacity
                    style={styles.contentBtn}
                    onPress={() => {
                      this.submit();
                    }}
                  >
                    <GradientButton title="Submit" />
                  </TouchableOpacity>
                </View>
              </Col>
              <Col size={4}></Col>
            </Row>
          </Grid>
        )}
      </View>
    </>
  );

  optionPress = (active) => {
    this.setState({
      active: active,
    });
  };

  rateDriver = () => {
    if (this.state.active == "" && this.state.riderRating < 5) {
      this.refs.fmemptywhatwrong.showMessage({
        message: "Please input what went wrong",
        type: "danger",
        color: "#ffffff", // text color
        hideOnPress: true,
        animated: true,
        duration: 5000,
        icon: "danger",
        floating: true,
        statusBarHeight: false,
        style: {
          alignContent: "center",
          justifyContent: "center",
          marginTop: 20,
          alignItems: "center",
          zIndex: 20000,
        },
      });
      return;
    }
    this.setState({
      inprocessing: 1,
    });
    this.myRefbt.current.snapTo(2);
  };

  render() {
    return (
      <>
        <FlashMessage
          ref="fmemptywhatwrong"
          position={{ top: 90, left: 10, right: 10 }}
          style={{ position: "absolute", borderRadius: 2, zIndex: 30000 }}
        />
        {this.state.showBottomSheet ? (
          <BottomSheet
            snapPoints={this.state.screenHeight}
            initialSnap="2"
            borderRadius={20}
            ref={this.myRefbt}
            renderContent={
              this.state.rateSuccess !== ""
                ? this.renderSuccess
                : this.renderContent
            }
            overdragResistanceFactor={0}
            enabledManualSnapping={false}
            enabledContentTapInteraction={false}
            enabledContentGestureInteraction={false}
            enabledBottomClamp={true}
          />
        ) : (
          <></>
        )}
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: Dimensions.get("window").width,
    height: "100%",
  },
  tinyLogo: {
    alignContent: "center",
    height: 50,
    flex: 1,
    flexDirection: "row",
  },
  servicesbox: {
    flexDirection: "column",
    flex: 1,
    width: 150,
    height: 150,
    backgroundColor: "#e5e5e5",
    borderWidth: 1,
    borderColor: "#e5e5e5",
    padding: 10,
    margin: 10,
    alignItems: "center",
    borderRadius: 10,
    justifyContent: "center",
  },
  servicebocimage: {
    width: "100%",
    aspectRatio: 1 * 1.4,
    resizeMode: "contain",
  },
  textInput: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    fontSize: 16,
    marginHorizontal: 0,
    padding: 10,
    height: 80,
  },
  tipBox: {
    fontWeight: "bold",
    justifyContent: "center",
    alignContent: "center",
    height: 50,
    borderWidth: 1,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  contentBtn: {
    backgroundColor: "#2270b8",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    borderRadius: 50,
  },
  custInput: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "gray",
    fontSize: 16,
    marginHorizontal: 10,
    padding: 5,
    width: 120,
    textAlign: "center",
  },
  radioBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#CCC",
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 50,
  },
});
