import { StatusBar } from 'expo-status-bar';
import React from "react";
import { StyleSheet, Text, View } from 'react-native';
import {  Provider as PaperProvider,Button,Appbar,Surface , Caption} from 'react-native-paper';
//import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';
import { theme, DOMAIN} from '../Riders/Constant';
import { Col, Row, Grid } from "react-native-easy-grid";
import AsyncStorage from '@react-native-async-storage/async-storage';
const imagemarker = require('../assets/map-pin.png');

import { WebView } from 'react-native-webview';
import Image from 'react-native-image-progress';
import * as Progress from 'react-native-progress';
import * as firebase from "firebase";
import "firebase/firestore";
import * as geofirestore from 'geofirestore';
import apiKeys from '../config/keys';


if (!firebase.apps.length) {
    console.log('Connected with Firebase');
    firebase.initializeApp(apiKeys.firebaseConfig);
}

const db = firebase.firestore();
const firestore = firebase.firestore();

const GeoFirestore = geofirestore.initializeApp(firestore);
const geocollection = GeoFirestore.collection('driver_locations');

export default class Charity extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        	rewardpoints:0,
        	partnerinfo:{},
        	partner_income:0,
    };
   }
   
  componentDidMount(){
    this.getPartners();
  }
  
  async getPartners(){
  	await AsyncStorage.getItem('accesstoken').then((value) => {
  		console.log("ACCESS TOKEN ",value);	
  		console.log("charity ULR ",DOMAIN+'api/rider/ridercharity');
		 fetch(DOMAIN+'api/rider/ridercharity',{
			method: 'GET',
			headers : {
			 'Authorization': 'Bearer '+value, 
			 'Content-Type': 'application/json'
			}
 		}).then(function (response) {
 			return response.json();
  		}).then((result)=> {
  			if(result.status == 1){
  				//console.log("PARTNERS DATA",result);  			
	  			this.setState({
					partnerinfo:result.data,
					partner_income:result.partner_income,
				},()=>{
					console.log("rider Parnetr info 1",this.state.partnerinfo);
				});
  			}
  		
			
  			/*this.setState({
  				partners:result.data
  			});
  			*/
		});
	});
  }
    

  
  render() {
  	 return (
  	<PaperProvider theme={theme}>
  	  <StatusBar backgroundColor="#fff" barStyle="light-content"/>
  	  		 <Appbar.Header style={{backgroundColor:'#fff'}}>
      		  <Appbar.BackAction onPress={() => this.props.navigation.goBack()} />
        			<Appbar.Content title="Your Charity" />
            </Appbar.Header>
	    <View style={{flex:1,  marginTop:10 }} >
     		<Surface style={stylesBg.surface}>
          <Grid style={{flex:1, flexDirection:'column',width:'100%'}}>
          <Row size={50}>
          		<Col size={12}>
          			{this.state.partnerinfo.cdnimage ? 
						(<Image
			        source={{uri:this.state.partnerinfo.cdnimage}}
			        indicator={Progress.Circle}
					  indicatorProps={{
					    size: 40,
					    borderWidth: 0,
					    color: '#238BAF',
					    unfilledColor: 'rgba(200, 200, 200, 0.2)'
					  }}
			        style={{alignItems:'center', width:'100%',height:'100%'}}
			         />)
						:
						null
					}
          	  </Col>
          </Row>
          	<Row size={15} >
                  <Col size={12} >
                      <Text style={{ paddingTop:8,fontSize:21,color:'#3f78ba',fontWeight:'bold'}}>{this.state.partnerinfo.organization} </Text>
                  </Col>
              </Row>
              <Row size={15} >
                  <Col size={12}  >
                      <Text style={{ paddingTop:8,fontSize:19,color:'#3f78ba'}}>{this.state.partnerinfo.name} </Text>
                  </Col>
              </Row>
              <Row size={20}>
                  <Col size={6}>
                      <Text style={{ paddingTop:8,fontSize:16,fontWeight:'bold'}}>Partner's Income</Text>
                  </Col>
                  <Col size={6} >
                      <Text style={{ paddingTop:8,fontSize:16,color:'#3f78ba',fontWeight:'bold'}}>AU$ {this.state.partner_income}</Text>
                  </Col>
              </Row>
               
          </Grid> 
         </Surface>
      </View>
	    <View style={{flex:1,  marginTop:10 }} >
	    </View>
	  
	    </PaperProvider>
	  );
   }
}

const styles = StyleSheet.create({
  servicebocimage: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  labelstyle:{    
    fontSize:16,    
    textAlign:'left',
    marginTop:10,
    fontFamily: 'WuerthBook'
  },
  inputstyle:{
    color:'black',
    borderBottomColor:'#D9D5DC',
    borderBottomWidth:1,
    paddingBottom: 11,
    fontSize:16,
    fontFamily: 'WuerthBook'
  },
  bgImage: {
        resizeMode: "cover",
        justifyContent: "center",
        height:170,
    },
    text: {    
        color: "white",
        fontSize: 25,    
        textAlign: "center",         
    },
    overlay: {    
        justifyContent: "center",
        backgroundColor:'rgba(0,0,0,0.6)',
        height:170,
    },
    scItem:{
      borderRadius:50,
      borderWidth:1,
      marginTop:10,
      marginBottom:10,
      marginLeft:5,
      marginRight:5,
      backgroundColor:'#FFF',      
      height:35
    },
    scText:{color:'#000',fontSize:14},
    active:{      
      backgroundColor:'#7a49a5',            
    },
    actText:{color:'#FFF'},
    boxstyle:{
    	flex:1,
    	backgroundColor:'#fff',  
    	borderRadius:10,borderWidth: 1,
    	borderColor: '#fff',
    	padding:10,margin:20,
    	shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
    }
});

const stylesBg = StyleSheet.create({
  surface: {
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    margin:15,
    borderRadius:10,
    flex:1,
  },
});
