import React, { useEffect, useState } from "react";
import Qs from "qs";
import { StatusBar } from "expo-status-bar";
import { FontAwesome, FontAwesome5, Octicons } from "@expo/vector-icons";

import {
  Provider as PaperProvider,
  // Button,
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
  TouchableHighlight,
  TouchableOpacity,
  Image,
  FlatList,
} from "react-native";
import { styles, theme, DOMAIN, PrimaryColor } from "../Riders/Constant";
import { Input } from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { Divider } from "react-native-elements";
import { Col, Row, Grid } from "react-native-easy-grid";
import Spinner from "react-native-loading-spinner-overlay";
import { AppBar, TextInput, Button } from "react-native-paper";
import {
  EvilIcons,
  MaterialCommunityIcons,
  Ionicons,
  Entypo,
  MaterialIcons,
  AntDesign,
} from "@expo/vector-icons";
import debounce from "lodash.debounce";
import FlashMessage, { showMessage } from "react-native-flash-message";

export default class SaveAddress extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showSwtichRider: false,
      profiledat: {},
      rider: {},
      searchRiderResults: [],
      searchRiderText: "",
      riders: [],
      me: {},
      avatar: DOMAIN + "images/no-person.png",
      step: 1,
      locationcur: {},
      sourceLocation: {},
      latitudecur: -33.8688,
      longitudecur: 151.2195,
      curlocatdesc: "",
      latitudeDelta: 0.0943,
      longitudeDelta: 0.0934,
      origin: {},
      destination: {},
      pickup: "",
      destinationto: "",
      stateText: "",
      results: {},
      forsourdest: "source",
      snaptoval: ["50 %", "40%", "0%"],
      spinneron: false,
      initialSnap: 2,
      drivernear: [],
      loadMap: false,
      textInput: [],
      inputData: [],
      rewardpoints: 0,
      search_radius: 10,
      accesstoken: "",
      messagecount: 0,
      addressList: {},
      showSaveAddressBottomSheet: false,
      savingProcess: 1,
      saveAddressText: "",
      saveAddressName: "",
      main_address: "",
      saveAddressLocation: "",
      secondary_address: "",
      savedAddressList: [],
    };
  }

  componentDidMount() {
    console.log("saveaddress", this.props.route.params.addressList);
    this.getSavedAddrsses();
    this.setState({
      addressList: this.props.route.params.addressList,
      latitudecur: this.props.route.params.latitudecur,
      longitudecur: this.props.route.params.longitudecur,
    });
  }

  async getSavedAddrsses() {
    await AsyncStorage.getItem("accesstoken").then((value) => {
      //alert(value);
      //console.log(value);
      this.setState({ spinneron: true });
      fetch("https://www.turvy.net/api/rider/getSavedRiderAddress", {
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
          console.log("SavedAddress_INFO ", json.data);
          this.setState({ spinneron: false });
          let result = json.data;
          if (json.status == 1) {
            //alert(result.point);
            //let point = result;
            //results.push(this.state.addressList);
            //results:result,
            this.setState({
              savedAddressList: result,
            });
          }
        })
        .catch((error) => {
          this.setState({ spinneron: false });
          console.error(error);
        });
    });
  }

  rightIconD = () => (
    <TextInput.Icon
      name="close"
      color={"#3f78ba"}
      onPress={() => this.setState({ saveAddressName: "" })}
    />
  );

  _getFlatList = () => {
    const keyGenerator = () => Math.random().toString(36).substr(2, 10);
    // console.log("", this.state.results);
    if (this.state.saveAddressText !== "") {
      //console.log("IN IF FLATLIST ",this.state.results)
      return (
        <FlatList
          nativeID="result-list-id"
          scrollEnabled={true}
          disableScrollViewPanResponder={true}
          data={this.state.results}
          keyExtractor={keyGenerator}
          renderItem={({ item, index }) => this._renderRow(item, index, 1)}
        />
      );
    } else if (Object.keys(this.state.addressList).length > 0) {
      //alert("IN ELSE");
      //console.log("IN ELSE FLATLIST ",this.state.addressList)
      return (
        <FlatList
          nativeID="result-list-id1"
          scrollEnabled={true}
          disableScrollViewPanResponder={true}
          data={this.state.addressList}
          keyExtractor={keyGenerator}
          renderItem={({ item, index }) => this._renderRow(item, index, 1)}
        />
      );
    }
    //console.log("BEFORE NULL RETURN ",this.state.addressList)
    return null;
  };

  _onPressAddressSave = async () => {
    this.setState({ spinneron: true });
    await AsyncStorage.getItem("accesstoken").then((value) => {
      let optionchose = this.state.saveAddressName;
      fetch("https://www.turvy.net/api/rider/addRiderAddress", {
        method: "POST",
        headers: new Headers({
          Authorization: "Bearer " + value,
          "Content-Type": "application/json",
        }),
        body: JSON.stringify({
          main_address: this.state.main_address,
          address: this.state.secondary_address,
          coordinates: this.state.saveAddressLocation,
          addresastype: optionchose,
        }),
      })
        .then((response) => {
          return response.json();
        })
        .then((json) => {
          console.log(json);
          if (json.status == 1) {
            this.setState({ spinneron: false });
            setInterval(() => {
              this.setState({ savingProcess: 1 });
            }, 3000);

            this.getSavedAddrsses();
            this.refs.fmMessage.showMessage({
              message: "Location added to Saved Places",
              type: "success",
              color: "#ffffff", // text color
              hideOnPress: true,
              animated: true,
              duration: 2500,
              icon: "danger",
              floating: true,
              statusBarHeight: false,
              style: {
                alignContent: "center",
                justifyContent: "center",
                marginTop: 30,
                alignItems: "center",
              },
            });
          }
        })
        .catch((error) => {
          this.setState({ spinneron: false });
          console.error(error);
        });
    });
  };
  _onPress = (rowData, option) => {
    // console.log("------------------", rowData);
    if (option == 1)
      if (this.state.saveAddressText == "") {
        const destination = {
          latitude: Number(rowData.latitude),
          longitude: Number(rowData.longitude),
        };
        this.setState({
          main_address: rowData.structured_formatting.main_text,
          secondary_address: rowData.structured_formatting.secondary_text,
          saveAddressLocation: destination,
          savingProcess: 3,
        });
      } else {
        const request = new XMLHttpRequest();
        request.timeout = 1000;
        request.onreadystatechange = () => {
          if (request.readyState !== 4) return;

          if (request.status === 200) {
            const responseJSON = JSON.parse(request.responseText);
            if (responseJSON.status === "OK") {
              console.log("IN IF address selected");
              const details = responseJSON.result;
              console.log(details);

              const destination = {
                latitude: details.geometry.location.lat,
                longitude: details.geometry.location.lng,
              };
              this.setState({
                main_address: rowData.structured_formatting.main_text,
                secondary_address: rowData.description,
                saveAddressLocation: destination,
                savingProcess: 3,
              });
            } else {
              console.log("IN ELSE  address selected");
              const destination = {
                latitude: Number(rowData.latitude),
                longitude: Number(rowData.longitude),
              };
              this.setState({
                main_address: rowData.structured_formatting.main_text,
                secondary_address: rowData.description,
                saveAddressLocation: destination,
                savingProcess: 3,
              });
            }
          } else {
            console.warn(
              "google places autocomplete: request could not be completed or has been aborted"
            );
          }
        };
        console.log("Data BEFORE LIST");
        const query = {
          key: "AIzaSyAr2ESV30J7hFsOJ5Qjaa96u9ADSRX6_Sk",
          language: "en",
          types: ["geocode", "locality"],
        };
        const url = "https://maps.googleapis.com/maps/api";
        request.open(
          "GET",
          `${url}/place/details/json?` +
            Qs.stringify({
              key: query.key,
              placeid: rowData.place_id,
              language: query.language,
            })
        );

        request.withCredentials = true;
        request.send();
      }
    else {
      this.props.navigation.navigate("BookMain", {
        selectedSavedAddress: rowData,
      });
    }
  };

  _renderRow = (rowData = {}, index, option) => {
    //console.log("index ROW DATA ",index);
    return (
      <ScrollView
        scrollEnabled={true}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        style={{ paddingHorizontal: 10 }}
      >
        <TouchableHighlight
          underlayColor={"#c8c7cc"}
          style={{ width: "100%" }}
          onPress={() => this._onPress(rowData, option)}
        >
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              backgroundColor: "#fff",
              borderBottomWidth: 1,
              borderBottomColor: "#ccc",
              alignItems: "center",
            }}
          >
            <View
              style={{
                width: 43,
                padding: 10,
              }}
            >
              {option == 1 ? (
                <FontAwesome name="location-arrow" size={24} color="grey" />
              ) : (
                <MaterialCommunityIcons
                  name="briefcase"
                  size={24}
                  color="grey"
                />
              )}
            </View>
            <View style={{ padding: 10 }}>
              {this._renderRowData(rowData, index, option)}
            </View>
          </View>
        </TouchableHighlight>
      </ScrollView>
    );
  };

  _renderRowData = (rowData, index, option) => {
    return <>{this._renderDescription(rowData, option)}</>;
  };

  _renderDescription = (rowData, option) => {
    //console.log("INITAL MEMORY ADDREESS",rowData);
    //return rowData.description || rowData.formatted_address || rowData.name;
    return (
      <>
        <View style={{ flex: 1, flexDirection: "row" }}>
          <Text numberOfLines={2}>
            {" "}
            {option == 1
              ? rowData.structured_formatting.main_text
              : rowData.savedname}
          </Text>
        </View>
        <View style={{ flex: 1, flexDirection: "row" }}>
          <Text
            multiline={true}
            numberOfLines={2}
            style={{
              fontSize: 12,
              width: 280,
            }}
          >
            {" "}
            {option == 1
              ? rowData.structured_formatting.secondary_text
              : rowData.structured_formatting.main_text}
          </Text>
        </View>
      </>
    );
  };

  debounceLog = debounce((text) => this._request(text), 200);
  _request = (text) => {
    if (text) {
      const request = new XMLHttpRequest();
      //_requests.push(request);
      request.timeout = 1000;
      //request.ontimeout = props.onTimeout;
      request.onreadystatechange = () => {
        //console.log(request);
        if (request.readyState !== 4) {
          return;
        }

        if (request.status === 200) {
          const responseJSON = JSON.parse(request.responseText);
          if (typeof responseJSON.predictions !== "undefined") {
            // if (_isMounted === true) {
            /*const results =
              props.nearbyPlacesAPI === 'GoogleReverseGeocoding'
                ? _filterResultsByTypes(
                    responseJSON.predictions,
                    props.filterReverseGeocodingByTypes,
                  )
                : responseJSON.predictions;
					*/
            //const results = '';
            console.log(responseJSON);
            //results.push(this.state.addressList);
            const results = responseJSON.predictions;

            //console.log("SAVED Address List",this.state.addressList);
            console.log("GET List", results);
            //
            this.setState({
              results: results,
            });
            //_results = results;
            //setDataSource(buildRowsFromResults(results));
            // }
          }
          if (typeof responseJSON.error_message !== "undefined") {
            /*if (!props.onFail)
              console.warn(
                'google places autocomplete: ' + responseJSON.error_message,
              );
            else {
              props.onFail(responseJSON.error_message);
            }
            */
          }
        } else {
          // console.warn("google places autocomplete: request could not be completed or has been aborted");
        }
      };

      let query = {
        key: "AIzaSyAr2ESV30J7hFsOJ5Qjaa96u9ADSRX6_Sk",
        language: "en",
        radius: 50000,
        location: this.state.latitudecur + "," + this.state.longitudecur,
        types: ["geocode", "locality"],
      };
      const url = "https://maps.googleapis.com/maps/api";
      request.open(
        "GET",
        `${url}/place/autocomplete/json?&input=` +
          encodeURIComponent(text) +
          "&" +
          Qs.stringify(query)
      );
      console.log("query", Qs.stringify(query));
      request.withCredentials = true;
      request.send();
    }
  };

  render() {
    const keyGenerator = () => Math.random().toString(36).substr(2, 10);
    return (
      <>
        <PaperProvider theme={theme}>
          <ScrollView
            style={{
              backgroundColor: "white",
              //   padding: 16,
            }}
          >
            <Spinner
              visible={this.state.spinneron}
              color="#FFF"
              overlayColor="rgba(0, 0, 0, 0.5)"
            />
            {this.state.savingProcess == 1 && (
              <>
                <Appbar.Header
                  style={{ backgroundColor: "white" }}
                  mode="small"
                >
                  <Appbar.BackAction
                    onPress={() => {
                      this.props.navigation.navigate("BookMain");
                    }}
                  />
                  <Appbar.Content
                    title="Choose a place"
                    style={{ marginLeft: 0, paddingLeft: 0 }}
                  />
                </Appbar.Header>
                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    margin: 20,
                  }}
                  onPress={() => this.setState({ savingProcess: 2 })}
                >
                  <View>
                    <Text
                      style={{
                        fontSize: 18,
                        color: PrimaryColor,
                        fontWeight: "bold",
                      }}
                    >
                      Add Saved Place
                    </Text>
                    <Text style={{ fontSize: 16 }}>
                      Get to your favourite destination faster
                    </Text>
                  </View>
                  <View>
                    <MaterialCommunityIcons
                      size={26}
                      color={PrimaryColor}
                      name={"chevron-right"}
                    />
                  </View>
                </TouchableOpacity>
                <FlatList
                  nativeID="result-list-id2"
                  scrollEnabled={true}
                  disableScrollViewPanResponder={true}
                  data={this.state.savedAddressList}
                  keyExtractor={keyGenerator}
                  renderItem={({ item, index }) =>
                    this._renderRow(item, index, 2)
                  }
                />
              </>
            )}
            {this.state.savingProcess == 2 && (
              <>
                <Appbar.Header
                  style={{ backgroundColor: "white", marginBottom: 5 }}
                  mode="small"
                >
                  <Appbar.BackAction
                    onPress={() => this.setState({ savingProcess: 1 })}
                  />
                  <Appbar.Content
                    title="Add place"
                    style={{ marginLeft: 0, paddingLeft: 0 }}
                  />
                </Appbar.Header>
                <TextInput
                  // ref={(input) => {
                  //   this.dropoffTextInput = input;
                  // }}
                  placeholder="Enter an address"
                  placeholderTextColor="grey"
                  underlineColor={"transparent"}
                  outlineColor="transparent"
                  selectionColor="#C0C0C0"
                  value={this.state.saveAddressText}
                  theme={{
                    roundness: 0,
                    colors: {
                      primary: "#fff",
                      underlineColor: "transparent",
                    },
                  }}
                  onChangeText={(val) => {
                    this.setState({
                      saveAddressText: val,
                    });
                    this.debounceLog(val);
                  }}
                  onFocus={(e) => {
                    // this.saveAddressbt.current.snapTo(1);
                  }}
                  style={{
                    backgroundColor: "#dfe6f2",
                    height: 38,
                    borderRadius: 0,
                    paddingVertical: 5,
                    paddingHorizontal: 10,
                    marginLeft: 63,
                    marginVertical: 10,
                    fontSize: 15,
                    marginVertical: 5,
                    width: "100%",
                  }}
                />
                {this._getFlatList()}
              </>
            )}
            {this.state.savingProcess == 3 && (
              <>
                <Appbar.Header
                  style={{ backgroundColor: "white" }}
                  mode="small"
                >
                  <Appbar.BackAction
                    onPress={() => this.setState({ savingProcess: 2 })}
                  />
                  <Appbar.Content
                    title="Save place"
                    style={{ marginLeft: 0, paddingLeft: 0 }}
                  />
                </Appbar.Header>
                <View style={{ padding: 15 }}>
                  <View>
                    <Text
                      style={{
                        paddingHorizontal: 5,
                        marginVertical: 5,
                        color: PrimaryColor,
                      }}
                    >
                      Name
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <TextInput
                        placeholder="e.g. My home"
                        placeholderTextColor="grey"
                        underlineColor={"transparent"}
                        outlineColor="transparent"
                        selectionColor="#C0C0C0"
                        value={this.state.saveAddressName}
                        theme={{
                          roundness: 0,
                          colors: {
                            primary: "#fff",
                            underlineColor: "transparent",
                          },
                        }}
                        onChangeText={(val) => {
                          this.setState({
                            saveAddressName: val,
                          });
                        }}
                        onFocus={(e) => {}}
                        style={{
                          backgroundColor: "transparent",
                          height: 38,
                          borderRadius: 0,
                          borderBottomWidth: 1,
                          paddingVertical: 5,
                          paddingHorizontal: 10,
                          fontSize: 15,
                          flex: 1,
                          marginBottom: 5,
                        }}
                        // right={this.rightIconD()}
                      />
                      <TouchableOpacity
                        onPress={(e) => {
                          this.setState({
                            saveAddressName: "",
                          });
                        }}
                      >
                        <AntDesign
                          name="closecircle"
                          size={24}
                          color={PrimaryColor}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View>
                    <Text
                      style={{
                        paddingHorizontal: 5,
                        marginVertical: 5,
                        color: PrimaryColor,
                      }}
                    >
                      Address
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <TextInput
                        placeholder="Address"
                        placeholderTextColor="grey"
                        underlineColor={"transparent"}
                        outlineColor="transparent"
                        selectionColor="#C0C0C0"
                        value={this.state.main_address}
                        theme={{
                          roundness: 0,
                          colors: {
                            primary: "#fff",
                            underlineColor: "transparent",
                          },
                        }}
                        onChangeText={(val) => {
                          this.setState({
                            main_address: val,
                          });
                        }}
                        onFocus={(e) => {}}
                        style={{
                          backgroundColor: "transparent",
                          height: 38,
                          borderRadius: 0,
                          borderBottomWidth: 1,
                          paddingVertical: 5,
                          paddingHorizontal: 10,
                          fontSize: 15,
                          flex: 1,
                          marginBottom: 5,
                        }}
                        // right={this.rightIconD()}
                      />
                      <MaterialCommunityIcons
                        size={24}
                        color={PrimaryColor}
                        name={"chevron-right"}
                      />
                    </View>
                  </View>
                  <Button
                    mode="contained"
                    color={"#135AA8"}
                    uppercase={false}
                    labelStyle={{ fontSize: 20 }}
                    style={{ marginVertical: 20 }}
                    onPress={() => this._onPressAddressSave()}
                  >
                    Save place
                  </Button>
                </View>
              </>
            )}
          </ScrollView>
        </PaperProvider>
        <FlashMessage ref="fmMessage" position="top" />
      </>
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
