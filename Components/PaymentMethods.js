import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Alert,
  ScrollView,
  TextInput,
  Button,
  BackHandler,
  StatusBar,
} from "react-native";
import { RadioButton, Checkbox, Appbar } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome, AntDesign, Entypo } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Col, Row, Grid } from "react-native-easy-grid";
import FlashMessage, {
  showMessage,
  hideMessage,
} from "react-native-flash-message";
const imagegpay = require("../assets/images/gpay.png");
const imagegstripe = require("../assets/images/credit-card_1.png");
const imagewallet = require("../assets/images/wallet-icon-transparent.png");

class PaymentMethods extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: "",
      data: [
        {
          id: "Strip",
          title: "Credit & Debit Card",
          icon: "cc-stripe",
          color: "#646ede",
          size: 40,
          image: imagegstripe,
          width: 47,
          height: 26,
        },
        {
          id: "Paypal",
          title: "Paypal",
          icon: "cc-paypal",
          color: "#0095d7",
          size: 40,
          image: "",
        },
        {
          id: "Gpay",
          title: "GPay",
          icon: "gpay",
          color: "#0095d7",
          size: 40,
          image: imagegpay,
          width: 47,
          height: 35,
        },
        {
          id: "Rewardpoints",
          title: "Reward Points",
          icon: "money",
          color: "#ffaa02",
          size: 48,
          image: "",
        },
        {
          id: "Wallet",
          title: "Wallet",
          icon: "google-wallet",
          color: "#000",
          size: 30,
          image: imagewallet,
          width: 47,
          height: 26,
        },
      ],
      origin: {},
      destination: {},
      latitudecur: -33.8688,
      longitudecur: 151.2195,
      latitudedest: "",
      longitudedest: "",
      selectedvehicle: {},
      bookingresponse: {},
      selectedprcperunit: 0,
      selectedminprc: 0,
      selectedvehiclefare: 0,
      waypointslnglat: [],
      scheduledate: "",
      is_schedule: 0,
      selectedcancelchr: 0,
      selectsurcharge: 0,
      rewardpoints: 0,
      walletamount: 0,
      selectSurInfo: {},
      dedeuctinfo: {},
      previousprewardpoint: 0,
      distance: 0,
    };
    this.onGoBackCallback = this.onGoBackCallback.bind(this);
  }

  componentDidMount() {
    const { navigation, state } = this.props;
    console.log(this.props);
    BackHandler.addEventListener("hardwareBackPress", this.onGoBackCallback);
    navigation.addListener("gestureEnd", this.onGoBackCallback);
    this.getrewards();
    this.unsubscribe = navigation.addListener("focus", () => {
      BackHandler.addEventListener("hardwareBackPress", this.onGoBackCallback);
      navigation.addListener("gestureEnd", this.onGoBackCallback);
    });
    this.unsubscribeblur = navigation.addListener("blur", () => {
      BackHandler.removeEventListener(
        "hardwareBackPress",
        this.onGoBackCallback
      );
    });

    console.log("selcted INFO", this.props.route.params.selectSurInfo);
    if (this.props.route.params.selectedvehicle) {
      this.setState({
        selectedvehicle: this.props.route.params.selectedvehicle,
        origin: this.props.route.params.origin,
        destination: this.props.route.params.destination,
        latitudedest: this.props.route.params.latitudedest,
        longitudedest: this.props.route.params.longitudedest,
        latitudecur: this.props.route.params.latitudecur,
        longitudecur: this.props.route.params.longitudecur,
        selectedvehiclefare: this.props.route.params.selectedvehiclefare,
        bookingresponse: this.props.route.params.bookingresponse,
        selectedprcperunit: this.props.route.params.selectedprcperunit,
        selectedminprc: this.props.route.params.selectedminprc,
        waypointslnglat: this.props.route.params.waypointslnglat,
        scheduledate: this.props.route.params.scheduledate,
        is_schedule: this.props.route.params.is_schedule,
        selectedcancelchr: this.props.route.params.selectedcancelchr,
        selectsurcharge: this.props.route.params.selectsurcharge,
        selectSurInfo: this.props.route.params.selectSurInfo,
        distance: this.props.route.params.distance,
      });
    }
  }

  UNSAFE_componentWillUnmount() {
    this.unsubscribe();
    this.unsubscribeblur();
    //BackHandler.removeEventListener('hardwareBackPress', this.onGoBackCallback);
  }

  onGoBackCallback() {
    console.log(
      "Android hardware back button pressed and iOS back gesture ended"
    );
    this.props.navigation.replace("BookMain", this.state);
    return true;
  }

  async getrewards() {
    await AsyncStorage.getItem("accesstoken").then((value) => {
      fetch("https://www.turvy.net/api/rider/riderrewardpoints", {
        method: "GET",
        headers: new Headers({
          Authorization: "Bearer " + value,
          "Content-Type": "application/json",
        }),
      })
        .then((response) => {
          return response.json();
        })
        .then((json) => {
          console.log("REWARDS INFO ", json.data);
          let result = json.data;
          if (json.status == 1) {
            //alert(result.point);
            let point = result.point;
            let reamingant = 0;
            if (json.tranasctionamnt) {
              reamingant = json.tranasctionamnt.total_amount;
            }

            this.setState(
              {
                rewardpoints: result.point,
                walletamount: reamingant,
              },
              () => {
                //alert("BEFORE SET");
                //AsyncStorage.setItem('rewardpoints', result.point);
                this.setReward(result.point);
              }
            );
          }
        })
        .catch((error) => {
          console.error(error);
        });
    });
  }

  async setReward(point) {
    AsyncStorage.setItem("rewardpoints", JSON.stringify(point)).then(() => {
      //alert("SET item ");
    });
  }

  async getPayment() {
    //alert(this.state.checked)
    switch (this.state.checked) {
      case "Strip":
        //BackHandler.removeEventListener('hardwareBackPress', this.onGoBackCallback);
        this.props.navigation.navigate("AddCard", this.state);
        break;
      case "Paypal":
        //alert("paypal ")
        // BackHandler.removeEventListener('hardwareBackPress', this.onGoBackCallback);
        this.props.navigation.navigate("PaypalPayment", this.state);
        break;
      case "Rewardpoints":
        // alert('cash')
        let amount = this.props.route.params.selectedvehiclefare;
        let rewardpointamount = parseFloat(this.state.rewardpoints) * 0.2;
        let fullamount =
          parseFloat(amount) +
          parseFloat(this.props.route.params.selectsurcharge);

        if (rewardpointamount < fullamount) {
          //alert("Points are not enough , need more reward points to pay!");
          this.refs.fmLocalIntstance.showMessage({
            message:
              "You don't have enough point to pay, need more reward points!",
            type: "danger",
            icon: "danger",
            autoHide: false,
            style: {
              alignItems: "center",
              justifyContent: "center",
            },
          });

          return;
        }

        let remaingamount =
          parseFloat(rewardpointamount) -
          (parseFloat(amount) +
            parseFloat(this.props.route.params.selectsurcharge));
        //alert(remaingamount*15);
        //return;

        await AsyncStorage.getItem("accesstoken").then((value) => {
          console.log(value);
          //this.props.route.params
          fetch(
            "https://www.turvy.net/api/rider/book/payment/" +
              this.state.bookingresponse.id,
            {
              method: "POST",
              headers: new Headers({
                Authorization: "Bearer " + value,
                "Content-Type": "application/json",
              }),
              body: JSON.stringify({
                payment_method_id: 3,
                type: "Book",
                amount: this.props.route.params.selectedvehiclefare,
                surge_charge: this.props.route.params.selectsurcharge,
                selectSurInfo: this.props.route.params.selectSurInfo,
                gstcalcultated: this.props.route.params.gstcalcultated,
                distance: this.props.route.params.distance,
              }),
            }
          )
            .then((response) => response.json())
            .then((json) => {
              console.log("payment Response", json);
              //console.log("Payment successful ", paymentIntent);
              this.deductrewards(remaingamount, this.state.rewardpoints);

              //hideMessage()

              /*if(json.status == 1){
				      		 this.setState({                                        
					         	isLoading:false,
				    				vehborder:'red',
				    				bookingresponse:json.data
					         });
				      		this.props.navigation.navigate('PromoCode',this.state)
				      	}
				      	*/
            })
            .catch((error) => console.error(error));
        });

        //this.props.navigation.navigate('BookProcess',this.state)
        break;
      case "Wallet":
        //alert("here in wallet");
        let wamount = this.props.route.params.selectedvehiclefare;
        // let rewardpointamount = parseFloat(this.state.rewardpoints)*0.20;
        let wfullamount =
          parseFloat(wamount) +
          parseFloat(this.props.route.params.selectsurcharge);
        let walletamount = this.state.walletamount;
        //alert("WALLET AMIUNT "+walletamount );
        //alert("TRIP AMIUNT "+wfullamount);
        if (walletamount < wfullamount) {
          //alert("Points are not enough , need more reward points to pay!");
          this.refs.fmLocalIntstance.showMessage({
            message:
              "You don't have enough amount to pay in wallet , pay with out option!",
            type: "danger",
            icon: "danger",
            autoHide: false,
            style: {
              alignItems: "center",
              justifyContent: "center",
            },
          });

          return;
        }

        await AsyncStorage.getItem("accesstoken").then((value) => {
          console.log(value);
          //this.props.route.params
          fetch(
            "https://www.turvy.net/api/rider/book/payment/" +
              this.state.bookingresponse.id,
            {
              method: "POST",
              headers: new Headers({
                Authorization: "Bearer " + value,
                "Content-Type": "application/json",
              }),
              body: JSON.stringify({
                payment_method_id: 4,
                type: "Book",
                amount: this.props.route.params.selectedvehiclefare,
                surge_charge: this.props.route.params.selectsurcharge,
                selectSurInfo: this.props.route.params.selectSurInfo,
                gstcalcultated: this.props.route.params.gstcalcultated,
                distance: this.props.route.params.distance,
              }),
            }
          )
            .then((response) => response.json())
            .then((json) => {
              console.log("payment Response", json);
              console.log("AMOUNT USED ", wfullamount);
              this.deductWalletamount(wfullamount);

              //hideMessage()

              /*if(json.status == 1){
				      		 this.setState({                                        
					         	isLoading:false,
				    				vehborder:'red',
				    				bookingresponse:json.data
					         });
				      		this.props.navigation.navigate('PromoCode',this.state)
				      	}
				      	*/
            })
            .catch((error) => console.error(error));
        });

        break;
      default:
        this.refs.fmLocalIntstance.showMessage({
          message: "Please choose payment method!",
          type: "danger",
          icon: "danger",
          autoHide: false,
          style: {
            alignItems: "center",
            justifyContent: "center",
          },
        });
    }
  }

  async deductWalletamount(amountused) {
    await AsyncStorage.getItem("accesstoken").then((value) => {
      //console.log(value);
      //console.log("TOKEN",value);
      fetch("https://www.turvy.net/api/rider/deductwalletamount", {
        method: "POST",
        headers: new Headers({
          Authorization: "Bearer " + value,
          "Content-Type": "application/json",
        }),
        body: JSON.stringify({
          amountused: amountused,
        }),
      })
        .then((response) => response.json())
        .then((json) => {
          //console.log("WALLET DEDCUT Response",json);
          if (json.status == 1) {
            if (this.state.is_schedule == 1) {
              this.props.navigation.replace("bookingSchedule", this.state);
            } else {
              this.props.navigation.replace("BookProcess", this.state);
            }
          }
        });
    });
  }

  async deductrewards(remaingamount, previousprewardpoint) {
    await AsyncStorage.getItem("accesstoken").then((value) => {
      //console.log(value);

      fetch("https://www.turvy.net/api/rider/deductrewards", {
        method: "POST",
        headers: new Headers({
          Authorization: "Bearer " + value,
          "Content-Type": "application/json",
        }),
        body: JSON.stringify({
          remaingamount: remaingamount,
        }),
      })
        .then((response) => response.json())
        .then((json) => {
          console.log("DEDCUT Response", json);
          if (json.status == 1) {
            this.setState({
              dedeuctinfo: json.data,
              previousprewardpoint: previousprewardpoint,
            });

            let point = Number(json.data.point);
            //alert(point);
            AsyncStorage.setItem("rewardpoints", JSON.stringify(point)).then(
              () => {
                //alert("SET item ");
                if (this.state.is_schedule == 1) {
                  this.props.navigation.replace("bookingSchedule", this.state);
                } else {
                  this.props.navigation.replace("BookProcess", this.state);
                }
              }
            );
          }
        });
    });
  }

  render() {
    return (
      <>
        <Appbar.Header style={{ backgroundColor: "#FFF" }}>
          <Entypo
            name="menu"
            style={{
              color: "#111",
              fontSize: 22,
              paddingLeft: 15,
              textAlign: "left",
            }}
            color="#111"
            onPress={() => this.props.navigation.toggleDrawer()}
          />
          <Appbar.Content
            title="Payment"
            titleStyle={{ textAlign: "center", alignContent: "center" }}
          />
        </Appbar.Header>
        <View style={styles.container}>
          <FlashMessage ref="fmLocalIntstance" position="top" />
          <Text
            style={{ marginLeft: 20, fontWeight: "bold", letterSpacing: 2 }}
          >
            PAYMENT METHODS
          </Text>
          <FlatList
            style={styles.contentList}
            columnWrapperStyle={styles.listContainer}
            data={this.state.data}
            renderItem={({ item }) => {
              return (
                <TouchableOpacity
                  style={[
                    styles.card,
                    {
                      borderWidth: 2,
                      borderColor:
                        this.state.checked === item.id
                          ? "#2270b8"
                          : "transparent",
                    },
                  ]}
                  onPress={() => this.setState({ checked: item.id })}
                >
                  <Grid>
                    <Row size={100}>
                      <Col size={3}>
                        {item.icon === "gpay" ||
                        item.icon === "cc-stripe" ||
                        item.icon == "google-wallet" ? (
                          <Image
                            style={{ width: item.width, height: item.height }}
                            source={item.image}
                          />
                        ) : (
                          <FontAwesome
                            name={item.icon}
                            color={item.color}
                            size={item.size}
                          />
                        )}
                      </Col>
                      <Col
                        size={8}
                        style={{
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Text style={styles.title}>{item.title}</Text>
                      </Col>
                      <Col size={1}>
                        {this.state.checked === item.id ? (
                          <Checkbox
                            style={styles.radio}
                            value={item.id}
                            status={
                              this.state.checked === item.id
                                ? "checked"
                                : "unchecked"
                            }
                            color="#598cc3"
                            uncheckedColor="#598cc3"
                            onPress={() => this.setState({ checked: item.id })}
                          />
                        ) : (
                          <></>
                        )}
                      </Col>
                    </Row>
                    <Row>
                      <Col size={3}></Col>
                      <Col size={9}>
                        {item.icon === "money" ? (
                          <Text
                            style={{ color: "#598cc3", fontWeight: "bold" }}
                          >
                            {this.state.rewardpoints} reward points available.
                          </Text>
                        ) : null}
                        {item.icon === "google-wallet" ? (
                          <Text
                            style={{ color: "#598cc3", fontWeight: "bold" }}
                          >
                            A$ {this.state.walletamount} amount available in
                            wallet.
                          </Text>
                        ) : null}
                      </Col>
                    </Row>
                  </Grid>
                </TouchableOpacity>
              );
            }}
          />
          <View style={styles.btnBox}>
            <TouchableOpacity
              style={styles.contentBtn}
              onPress={() => this.getPayment()}
            >
              <LinearGradient
                style={styles.priBtn}
                colors={["#2270b8", "#74c0ee"]}
                end={{ x: 1.2, y: 1 }}
              >
                <Text style={styles.priBtnTxt}>Done</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </>
    );
  }
}
export default PaymentMethods;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
    backgroundColor: "#FFF",
  },
  contentList: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  contentBtn: {
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  cardContent: {
    flex: 3,
    justifyContent: "center",
    alignItems: "center",
  },
  ImgOut: {
    flex: 1,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 45,
    borderWidth: 1,
    borderColor: "#ebf0f7",
  },
  card: {
    elevation: 1,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: "white",
    flexDirection: "row",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
  },

  title: {
    fontSize: 20,
    alignSelf: "flex-start",
    color: "#135aa8",
    paddingRight: 10,
    letterSpacing: 1.2,
    fontWeight: "bold",
  },
  valRed: {
    alignItems: "flex-end",
    flex: 1,
  },
  radio: {
    paddingRight: 1,
  },
  priBtn: {
    flex: 1,
    padding: 15,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 45,
  },
  priBtnTxt: {
    color: "#FFF",
    fontSize: 16,
    textTransform: "uppercase",
    letterSpacing: 2,
  },
  btnBox: {
    backgroundColor: "#FFF",
    padding: 20,
  },
  addIconBox: {
    backgroundColor: "#2270b8",
    marginRight: 15,
    borderRadius: 5,
  },
  addIcon: {
    paddingLeft: 12,
    paddingRight: 12,
    paddingTop: 5,
    paddingBottom: 5,
  },
});
