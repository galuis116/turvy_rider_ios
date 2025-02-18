import React from "react";
import { StatusBar } from "expo-status-bar";
import {
  Provider as PaperProvider,
  Button,
  Avatar,
  Caption,
  Surface,
  IconButton,
  Colors,
  Appbar,
} from "react-native-paper";
import {
  View,
  ScrollView,
  Picker,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
  Platform,
  PermissionsAndroid,
  Alert,
} from "react-native";
import { styles, theme, DOMAIN } from "../Riders/Constant";
import { Input } from "react-native-elements";
import { AntDesign, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Divider } from "react-native-elements";
import { Col, Row, Grid } from "react-native-easy-grid";
import Spinner from "react-native-loading-spinner-overlay";
import Svg, { Path } from "react-native-svg";
import RNFetchBlob from "rn-fetch-blob";
import { debug } from "./Constant";
const fileUrl =
  "https://www.techup.co.in/wp-content/uploads/2020/01/techup_logo_72-scaled.jpg";

export default class TripReceipt extends React.Component {
  constructor(props) {
    super(props);
    (this.state = {
      trips: {},
      accessTokan: "",
      pageno: 1,
      tripTime: {
        arrivalTime: "",
        pickupTime: "",
      },
      spinner: false,
      loading: false,
      selectedTrip: {},
      surgeinfo: {},
      downloadfile: "",
    }),
      (this.onRefListView = React.createRef());
  }

  componentDidMount() {
    const { navigation } = this.props;
    console.log("reciept================", debug(this.props.route.params));
    if (this.props.route.params.selectedTrip) {
      let surgeinfo = {};
      if (this.props.route.params.selectedTrip.surgeinfo) {
        surgeinfo = JSON.parse(this.props.route.params.selectedTrip.surgeinfo);
        surgeinfo.nsw_ctp_charge = surgeinfo.nsw_ctp_charge.toFixed(2);
        surgeinfo.fuel_surge_charge = surgeinfo.fuel_surge_charge.toFixed(2);
        surgeinfo.gst_amt = surgeinfo.gst_amt.toFixed(2);
      }
      this.setState(
        {
          spinner: false,
          selectedTrip: this.props.route.params.selectedTrip,
          surgeinfo: surgeinfo,
        },
        () => {
          if (this.state.surgeinfo) {
          } else {
            this.setState({
              surgeinfo: {},
            });
          }
          //console.log("Surcharge INFO",this.state.selectedTrip.surgeinfo);
          //let surgeinfo = JSON.parse(this.state.selectedTrip.surgeinfo);
          //console.log("Surcharge INFO",surgeinfo.nsw_ctp_charge);
        }
      );
    }
    //this.getMyRider();
  }

  gotopdf = async (item) => {
    //console.log("TRIP DATA",this.state.selectedTrip);
    // Function to check the platform
    // If Platform is Android then check for permissions.
    /* try {
			         const granted =   await PermissionsAndroid.request(
			          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
			          {
			            title: 'Storage Permission Required',
			            message:
			              'Application needs access to your storage to download File',
			          }
			        );
							
			      } catch (err) {
			        // To handle permission related exception
			        console.log("++++"+err);
			      }
			      */
    await AsyncStorage.getItem("accesstoken").then((value) => {
      //alert(granted);
      console.log("ACCESS TOKEN ", value);
      console.log("ORDER ID  TOKEN ", this.state.selectedTrip.id);
      console.log(this.state.selectedTrip.id);
      fetch(
        "https://www.turvy.net/api/rider/get_receipt/" +
          this.state.selectedTrip.id,
        {
          method: "GET",
          headers: {
            Authorization: "Bearer " + value,
            "Content-Type": "application/json",
          },
        }
      )
        .then(function (response) {
          return response.json();
        })
        .then((result) => {
          console.log("in GET PDF RECEPIT ", result);
          if (result.data.file) {
            if (Platform.OS === "ios") {
              this.downloadFile(result.data.file);
            } else {
              this.downloadFile(result.data.file);
              console.log("Storage Permission Granted.");
              /*if (granted === PermissionsAndroid.RESULTS.GRANTED) {
			          // Start downloading
			         
			        } else {
			          // If permission denied then show alert
			          Alert.alert('Error','Storage Permission Not Granted');
			        }
			     */
            }
          }

          //setMyPaymentsData(result.data);
        })
        .catch(function (error) {
          // console.error(error);
          Alert.alert(error); // Using this line
        });
    });
  };

  sendEmail = async (item) => {
    await AsyncStorage.getItem("accesstoken").then((value) => {
      //alert(granted);
      fetch(
        "https://www.turvy.net/api/rider/send_receipt/" +
          this.state.selectedTrip.id,
        {
          method: "GET",
          headers: {
            Authorization: "Bearer " + value,
            "Content-Type": "application/json",
          },
        }
      )
        .then(function (response) {
          return response.json();
        })
        .then((result) => {
          console.log("in GET Email RECEPIT ", result);
        });
    });
  };

  downloadFile = (pdf_file) => {
    // Get today's date to add the time suffix in filename
    let date = new Date();
    // File URL which we want to download
    let FILE_URL = pdf_file;
    // Function to get extention of the file url
    let file_ext = this.getFileExtention(FILE_URL);

    file_ext = "." + file_ext[0];

    // config: To get response by passing the downloading related options
    // fs: Root directory path to download
    const { config, fs } = RNFetchBlob;
    let RootDir = fs.dirs.PictureDir;
    let options = {
      fileCache: true,
      addAndroidDownloads: {
        path:
          RootDir +
          "/file_" +
          Math.floor(date.getTime() + date.getSeconds() / 2) +
          file_ext,
        description: "downloading file...",
        notification: true,
        // useDownloadManager works with Android only
        useDownloadManager: true,
      },
    };
    config(options)
      .fetch("GET", FILE_URL)
      .then((res) => {
        // Alert after successful downloading
        console.log("res -> ", JSON.stringify(res));
        alert("File Downloaded Successfully.");
      });
  };

  getFileExtention = (fileUrl) => {
    return /[.]/.exec(fileUrl) ? /[^.]+$/.exec(fileUrl) : undefined;
  };
  getseatcost = () => {
    if (this.state.surgeinfo.baby_seat_charge > 0) {
      return (
        <Row
          size={24}
          style={{ justifyContent: "center", alignItems: "center" }}
        >
          <Col size={8}>
            <Text>Baby Seat Charge </Text>
          </Col>
          <Col size={4}>
            <Text style={{ textAlign: "right" }}>
              A${this.state.surgeinfo.baby_seat_charge}
            </Text>
          </Col>
        </Row>
      );
    } else if (this.state.surgeinfo.pet_charge > 0) {
      return (
        <Row
          size={24}
          style={{ justifyContent: "center", alignItems: "center" }}
        >
          <Col size={8}>
            <Text>Pet Charge</Text>
          </Col>
          <Col size={4}>
            <Text style={{ textAlign: "right" }}>
              A${this.state.surgeinfo.pet_charge}
            </Text>
          </Col>
        </Row>
      );
    } else {
      return null;
    }
  };
  getwaitingcharge = () => {
    if (this.state.surgeinfo.hasOwnProperty("waiting_charge")) {
      return (
        <Row
          size={24}
          style={{ justifyContent: "center", alignItems: "center" }}
        >
          <Col size={8}>
            <Text>Waiting Charge</Text>
          </Col>
          <Col size={4}>
            <Text style={{ textAlign: "right" }}>
              A${this.state.surgeinfo.waiting_charge}
            </Text>
          </Col>
        </Row>
      );
    } else {
      return null;
    }
  };

  getcancellationcharge = () => {
    if (this.state.selectedTrip.cancellation_charge > 0) {
      return (
        <Row
          size={24}
          style={{ justifyContent: "center", alignItems: "center" }}
        >
          <Col size={8}>
            <Text>Cancellation Charge</Text>
          </Col>
          <Col size={4}>
            <Text style={{ textAlign: "right" }}>
              A${this.state.selectedTrip.cancellation_charge}
            </Text>
          </Col>
        </Row>
      );
    } else {
      return null;
    }
  };
  render() {
    return (
      <PaperProvider theme={theme}>
        <Spinner
          visible={this.state.spinner}
          color="#FFF"
          overlayColor="rgba(0, 0, 0, 0.5)"
        />
        <ScrollView>
          <View style={{ flex: 1, flexDirection: "row" }}>
            <Grid style={{ width: "100%" }}>
              <Row size={30} style={{ backgroundColor: "#c6daff" }}>
                <Col size={8}>
                  {this.state.selectedTrip.first_name &&
                  this.state.selectedTrip.last_name ? (
                    <Text
                      style={{ fontWeight: "bold", fontSize: 20, padding: 23 }}
                    >
                      Here's your receipt for your ride,{" "}
                      {this.state.selectedTrip.first_name}{" "}
                      {this.state.selectedTrip.last_name}
                    </Text>
                  ) : (
                    <Text
                      style={{ fontWeight: "bold", fontSize: 20, padding: 23 }}
                    >
                      Here's your receipt for your ride
                    </Text>
                  )}
                </Col>

                <Col size={4}></Col>
              </Row>
              <Row
                size={10}
                style={{
                  padding: 20,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Col size={4}>
                  <Text style={{ fontWeight: "bold", fontSize: 20 }}>
                    Total
                  </Text>
                </Col>
                <Col size={4}></Col>
                <Col size={4}>
                  <Text
                    style={{
                      fontWeight: "bold",
                      fontSize: 20,
                      textAlign: "right",
                    }}
                  >
                    A${this.state.selectedTrip.total}
                  </Text>
                </Col>
              </Row>
              <Row size={20} style={{ padding: 20 }}>
                <Col size={12}>
                  <View
                    style={{
                      borderWidth: 1,
                      borderColor: "#c6daff",
                      borderLeftWidth: 12,
                    }}
                  >
                    <Text style={{ padding: 10 }}>
                      Due to unanticipated tolls or surcharges on this trip , we
                      have adjusted your upfront fare to reflect the actually
                      incurred charges. please see receipt breakdown for
                      details.
                    </Text>
                  </View>
                </Col>
              </Row>
              <Row
                size={5}
                style={{
                  padding: 20,
                  justifyContent: "center",
                  alignItems: "center",
                  borderBottomWidth: 1,
                  borderBottomColor: "silver",
                }}
              >
                <Col size={8}>
                  <Text>Trip fare</Text>
                </Col>
                <Col size={4}>
                  <Text style={{ textAlign: "right" }}>
                    A${this.state.selectedTrip.subtotal}
                  </Text>
                </Col>
              </Row>
              {this.state.surgeinfo &&
              Object.keys(this.state.surgeinfo).length > 0 ? (
                <>
                  <Row
                    size={50}
                    style={{
                      padding: 20,
                      borderBottomWidth: 1,
                      borderBottomColor: "silver",
                    }}
                  >
                    <Col size={12}>
                      <Row size={20}>
                        <Col size={8}>
                          <Text style={{ fontWeight: "bold" }}>SubTotal</Text>
                        </Col>
                        <Col size={4}>
                          <Text
                            style={{ fontWeight: "bold", textAlign: "right" }}
                          >
                            A${this.state.selectedTrip.subtotal}
                          </Text>
                        </Col>
                      </Row>
                      <Row size={18}>
                        <Col size={8}>
                          <Text>Booking Fee</Text>
                        </Col>
                        <Col size={4}>
                          <Text style={{ textAlign: "right" }}>
                            A${this.state.surgeinfo.booking_charge}
                          </Text>
                        </Col>
                      </Row>
                      <Row size={18}>
                        <Col size={8}>
                          <Text>NSW CTP Charges</Text>
                        </Col>
                        <Col size={4}>
                          <Text style={{ textAlign: "right" }}>
                            A${this.state.surgeinfo.nsw_ctp_charge}
                          </Text>
                        </Col>
                      </Row>
                      <Row size={20}>
                        <Col size={8}>
                          <Text>NSW Government Passenger Service Levy </Text>
                        </Col>
                        <Col size={4}>
                          <Text style={{ textAlign: "right" }}>
                            A${this.state.surgeinfo.nsw_gtl_charge}
                          </Text>
                        </Col>
                      </Row>
                      <Row
                        size={24}
                        style={{
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Col size={8}>
                          <Text>Fuel SurCharge </Text>
                        </Col>
                        <Col size={4}>
                          <Text style={{ textAlign: "right" }}>
                            A${this.state.surgeinfo.fuel_surge_charge}
                          </Text>
                        </Col>
                      </Row>
                      {this.getwaitingcharge()}
                      {this.getcancellationcharge()}
                      {this.getseatcost()}
                      <Row
                        size={24}
                        style={{
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Col size={8}>
                          <Text>GST </Text>
                        </Col>
                        <Col size={4}>
                          <Text style={{ textAlign: "right" }}>
                            A${this.state.surgeinfo.gst_amt}
                          </Text>
                        </Col>
                      </Row>
                    </Col>
                  </Row>

                  <Row
                    size={5}
                    style={{ paddingHorizontal: 20, paddingVertical: 10 }}
                  >
                    <Col size={8}>
                      <Text>Total surge </Text>
                    </Col>
                    <Col size={4}>
                      <Text
                        style={{
                          fontWeight: "bold",
                          fontSize: 18,
                          textAlign: "right",
                        }}
                      >
                        A${this.state.selectedTrip.surge}
                      </Text>
                    </Col>
                  </Row>
                  {this.state.selectedTrip.tip_amt > 0 && (
                    <Row
                      size={5}
                      style={{
                        paddingHorizontal: 20,
                        paddingVertical: 10,
                        borderBottomWidth: 1,
                        borderBottomColor: "silver",
                      }}
                    >
                      <Col size={8}>
                        <Text>Tip </Text>
                      </Col>
                      <Col size={4}>
                        <Text
                          style={{
                            fontWeight: "bold",
                            fontSize: 18,
                            textAlign: "right",
                          }}
                        >
                          A${this.state.selectedTrip.tip_amt}
                        </Text>
                      </Col>
                    </Row>
                  )}
                </>
              ) : (
                <Row
                  size={12}
                  style={{
                    padding: 20,
                    borderBottomWidth: 1,
                    borderBottomColor: "silver",
                  }}
                >
                  <Col size={8}>
                    <Text>Total surge </Text>
                  </Col>
                  <Col size={4}>
                    <Text style={{ fontWeight: "bold", fontSize: 20 }}>
                      A${this.state.selectedTrip.surge}
                    </Text>
                  </Col>
                </Row>
              )}
              <Row size={10} style={{ paddingLeft: 20, paddingTop: 20 }}>
                <Col size={12}>
                  <Text style={{ fontSize: 20 }}>Amount Charged</Text>
                </Col>
              </Row>
              <Row size={10} style={{ padding: 20 }}>
                <Col size={8}>
                  <Text>{this.state.selectedTrip.paymenthod}</Text>
                </Col>
                <Col size={4}>
                  <Text
                    style={{
                      fontWeight: "bold",
                      fontSize: 20,
                      textAlign: "right",
                    }}
                  >
                    A${this.state.selectedTrip.total}
                  </Text>
                </Col>
              </Row>
              <Row size={5}>
                <Col
                  style={{
                    borderBottom: 1,
                    borderBottomColor: "#ccc",
                    borderWidth: 1,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      this.gotopdf();
                    }}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      padding: 10,
                    }}
                  >
                    <FontAwesome name="download" size={24} color="black" />
                    <Text style={{ paddingLeft: 10 }}>DownLoad</Text>
                  </TouchableOpacity>
                </Col>
              </Row>
              <Row size={5}>
                <Col>
                  <TouchableOpacity
                    onPress={() => {
                      this.sendEmail();
                    }}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      padding: 10,
                    }}
                  >
                    <MaterialIcons name="email" size={24} color="black" />
                    <Text style={{ paddingLeft: 10 }}>Send Email</Text>
                  </TouchableOpacity>
                </Col>
              </Row>
            </Grid>
          </View>
        </ScrollView>
      </PaperProvider>
    );
  }
}

const localStyle = StyleSheet.create({
  MainTablabel: {
    color: "silver",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    fontSize: 18,
  },
});

const stylesBg = StyleSheet.create({
  surface: {
    padding: 8,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    margin: 15,
    borderRadius: 10,
  },
});
