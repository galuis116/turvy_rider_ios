import React, { useEffect, useState, useRef } from "react";
import {
  Provider as PaperProvider,
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
  Button,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  StatusBar,
} from "react-native";
import { styles, theme, DOMAIN } from "../Riders/Constant";
import { Input } from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FlashMessage from "react-native-flash-message";
import { showMessage, hideMessage } from "react-native-flash-message";
import { useNavigation } from "@react-navigation/native";
import Spinner from "react-native-loading-spinner-overlay";

export default class Support extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      accessTokan: "",
      yourName: "",
      yourEmail: "",
      yourPhone: "",
      accessTokan: "",
      query: "",
      spinner: false,
    };
  }

  componentDidMount() {
    this.getAccessToken();
  }

  getAccessToken = async () => {
    await AsyncStorage.getItem("accesstoken").then((value) => {
      if (value != "" && value !== null) {
        //	alert(this.state.accessTokan);
        fetch(DOMAIN + "api/rider/profile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: "Bearer " + value,
          },
        })
          .then(function (response) {
            return response.json();
          })
          .then((result) => {
            console.log("PROFILE DETAILS", result);
            const data = result.data;
            //setRiderId(data.id);
            let name = data.first_name + " " + data.last_name;

            this.setState({
              yourName: name,
              yourPhone: data.mobile,
              yourEmail: data.email,
            });
          });
      }
    });
  };

  displayMessage = async () => {
    if (this.state.query == "") {
      this.refs.fmLocalIntstance.showMessage({
        message: "Please input your query!",
        type: "danger",
        color: "#ffffff", // text color
        hideOnPress: true,
        animated: true,
        duration: 5000,
        icon: "danger",
      });
      return;
    }
    this.setState({
      spinner: true,
    });
    await AsyncStorage.getItem("accesstoken").then((value) => {
      if (value != "" && value !== null) {
        fetch("https://www.turvy.net/api/rider/supportSave", {
          method: "POST",
          headers: new Headers({
            Authorization: "Bearer " + value,
            "Content-Type": "application/json",
          }),
          body: JSON.stringify({
            query: this.state.query,
          }),
        })
          .then((response) => {
            return response.json();
          })
          .then((result) => {
            console.log("RESPONSE ", result);

            if (result.status == 1) {
              this.setState({
                query: "",
                yourName: "",
                yourPhone: "",
                yourEmail: "",
                spinner: false,
              });
              this.refs.fmLocalIntstance.showMessage({
                message: "Your query successfully submited!",
                type: "default",
                backgroundColor: "mediumseagreen", // background color
                color: "#ffffff", // text color
                hideOnPress: true,
                animated: true,
                duration: 5000,
                icon: "success",
              });
            } else {
            }
          });
      }
    });
  };

  render() {
    //'First name is required'
    return (
      <>
        <Spinner
          visible={this.state.spinner}
          color="#FFF"
          overlayColor="rgba(0, 0, 0, 0.5)"
        />
        <Appbar.Header style={{ backgroundColor: "#fff" }}>
          <Appbar.BackAction onPress={() => this.props.navigation.goBack()} />
          <Appbar.Content title="Support" />
        </Appbar.Header>
        <ScrollView
          style={{ backgroundColor: "aliceblue" }}
          keyboardShouldPersistTaps="handled"
        >
          <View>
            <Surface style={stylesBg.surface}>
              <View style={{ flex: 1, borderRadius: 10 }}>
                <View style={{ flexDirection: "row" }}>
                  <Input
                    placeholder="Your Name"
                    value={this.state.yourName}
                    inputStyle={stylesinp.textBox}
                    inputContainerStyle={styles.inputContainerStyle}
                    onChangeText={(value) => {
                      this.setState({ yourName: value });
                    }}
                  />
                </View>
                <View>
                  <Input
                    placeholder="Your Email"
                    value={this.state.yourEmail}
                    inputStyle={stylesinp.textBox}
                    inputContainerStyle={styles.inputContainerStyle}
                    onChangeText={(value) => {
                      this.setState({ yourEmail: value });
                    }}
                  />
                </View>
                <View>
                  <Input
                    placeholder="Phone"
                    value={this.state.yourPhone}
                    inputStyle={stylesinp.textBox}
                    inputContainerStyle={styles.inputContainerStyle}
                    onChangeText={(value) => {
                      this.setState({ yourPhone: value });
                    }}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <TextInput
                    placeholder="Your Comment"
                    blurOnSubmit={false}
                    returnKeyType={"go"}
                    style={stylesinp.textInput}
                    multiline={true}
                    scrollEnabled={true}
                    numberOfLines={10}
                    underlineColorAndroid={"transparent"}
                    autoCapitalize={"none"}
                    autoCorrect={false}
                    textAlignVertical="top"
                    onChangeText={(value) => {
                      this.setState({ query: value });
                    }}
                    value={this.state.query}
                  />
                </View>
                <View style={{ padding: 12 }}></View>
                <Button
                  title="Submit"
                  color={"#135AA8"}
                  onPress={() => this.displayMessage()}
                />
              </View>
            </Surface>
          </View>
        </ScrollView>
        <FlashMessage
          ref="fmLocalIntstance"
          position={{ top: 90, left: 10, right: 10 }}
        />
      </>
    );
  }
}

export const stylesinp = StyleSheet.create({
  textInput: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ddd",
    fontSize: 16,
    paddingHorizontal: 20,
    marginHorizontal: 0,
    padding: 20,
    marginTop: 8,
    height: 150,
    width: 280,
    paddingLeft: 20,
    marginLeft: 10,
    marginRight: 10,
  },

  textBox: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ddd",
    fontSize: 16,
    paddingHorizontal: 20,
    marginHorizontal: 0,
    padding: 10,
    marginTop: 8,
    height: 10,
  },
});

const stylesBg = StyleSheet.create({
  surface: {
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
    margin: 15,
    borderRadius: 5,
  },
});

/*const navigation = useNavigation();
  	const [accessTokan, setAccessTokan] = useState('');
  const [supportData, setSupportData] = useState('');
  const [yourName, setYourName] = useState('');
  const [yourEmail, setYourEmail] = useState('');
  const [yourPhone, setYourPhone] = useState('');
    const fmLocalIntstance = React.createRef();

useEffect(() => {
		
		getAccessToken()
		//console.log(accessTokan)

		//alert(accessTokan)

		fetch(DOMAIN+'api/rider/profile',{
            method: 'GET',
            headers : {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer '+accessTokan
            }
        }).then(function (response) {
            return response.json();
        }).then( (result)=> {
            console.log(result);
            const data = result.data
            //setRiderId(data.id);
            let name = data.first_name+" "+data.last_name;
            setYourName(name)
            setYourPhone(data.mobile)
            setYourEmail(data.email)
           
        })
	});
	
async function getAccessToken(){

		await AsyncStorage.getItem('accesstoken').then((value) => {			
			if(value != '' && value !== null){
				setAccessTokan(value)
			}
		})

	}
 
    //'First name is required'
return (<PaperProvider theme={theme}>
<StatusBar backgroundColor="#fff" barStyle="light-content"/>
   <Appbar.Header style={{backgroundColor:'#fff'}}>
   <Appbar.BackAction onPress={() => navigation.goBack()} />
   <Appbar.Content title="Support" />
  </Appbar.Header>
          <ScrollView style={{ backgroundColor: "aliceblue"}}>
			<View  >
        <Surface style={stylesBg.surface}>
        <View style={{ flex: 1, borderRadius:10 }}>
	      <View style={{ flexDirection:'row'}} >
	          <Input placeholder='Your Name' value={yourName}  inputStyle={stylesinp.textBox} inputContainerStyle={styles.inputContainerStyle}  onChangeText={value => setYourName(value)} />
	      </View>
      <View>
        <Input placeholder='Your Email' value={yourEmail}  inputStyle={stylesinp.textBox} inputContainerStyle={styles.inputContainerStyle}  onChangeText={value => setYourEmail(value)} />
      </View>
      <View>
        <Input placeholder='Phone' value={yourPhone}  inputStyle={stylesinp.textBox} inputContainerStyle={styles.inputContainerStyle}  onChangeText={value => setYourPhone(value)} />
      </View>
			<View style={{ flex: 1 }}>
			<TextInput
			        placeholder="Your Comment"
			        blurOnSubmit={false}
			        returnKeyType={"go"}
			        style={stylesinp.textInput}
			        multiline={true}
			        scrollEnabled={true}
			        numberOfLines={10}
			        underlineColorAndroid={"transparent"}
			        autoCapitalize={"none"}
			        autoCorrect={false}
			        textAlignVertical = "top"
			
			/>
			</View>
        <View style={{ padding:12}}></View>
            <Button title="Submit"  color={'#135AA8'} onPress={()=>displayMessage()} />
       </View>
  </Surface>
</View>
    </ScrollView>
        <FlashMessage ref={fmLocalIntstance} position={{top:80, left:10,right:10}} />
    </PaperProvider>)
}


const displayMessage = () => {

 fmLocalIntstance.showMessage({
  message: "Your comment successfully submited!",
  type: "default",
  backgroundColor: "mediumseagreen", // background color
  color: "#ffffff", // text color
  hideOnPress:true,
  animated:true,
  duration:5000,
  icon:'success'
});


}


 
const stylesinp = StyleSheet.create({
 textInput: {
        borderRadius: 5,
        borderWidth: 1,
        borderColor:'#ddd',
        fontSize: 16,
        paddingHorizontal: 20,
        marginHorizontal: 0,
        padding: 20,
        marginTop: 8,
        height: 150,
     width:280,
        paddingLeft:20,
        marginLeft:10,
        marginRight:10
    },



 textBox: {
        borderRadius: 5,
        borderWidth: 1,
        borderColor:'#ddd',
        fontSize: 16,
        paddingHorizontal: 20,
        marginHorizontal: 0,
        padding: 10,
        marginTop: 8,
        height: 10

    },



});



const stylesBg = StyleSheet.create({
  surface: {
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    margin:15,
    borderRadius:5


  },
});
*/
