import { StatusBar } from 'expo-status-bar';
import debounce from 'lodash.debounce';
import React from "react";
import { StyleSheet, Text, View,Dimensions,Image ,FlatList,ScrollView, TouchableOpacity,TouchableHighlight,Keyboard,KeyboardAvoidingView, Alert,Linking} from 'react-native';
import { TextInput, Appbar, Title, Paragraph, Button } from 'react-native-paper';
//import * as Permissions from 'expo-permissions';
import MapView , { Marker, Circle  }from 'react-native-maps';
// install using npm --legacy-peer-deps  install react-native-maps-directions
import MapViewDirections from 'react-native-maps-directions';
import * as Location from 'expo-location';

import { EvilIcons } from '@expo/vector-icons'; 
import Animated from 'react-native-reanimated';

import { Col, Row, Grid } from "react-native-easy-grid";
import { FontAwesome ,FontAwesome5,Entypo,Feather,AntDesign,Ionicons } from '@expo/vector-icons'; 

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {theme, DOMAIN} from '../Riders/Constant';
import BottomSheet from 'reanimated-bottom-sheet';
const imageveh = require('../assets/images/driver-veh-images_60.png');

const { width, height } = Dimensions.get('window');
import * as firebase from "firebase";
import "firebase/firestore";
import apiKeys from '../config/keys';

if (!firebase.apps.length) {
    console.log('Connected with Firebase')
    firebase.initializeApp(apiKeys.firebaseConfig);
}

const db = firebase.firestore();


const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0043;
const SCREENHEIGHT = height*.50;
const DEVICE_WIDTH = width;
const DEVICE_HEIGHT = height;		

const stylesArray = [
  {
    "featureType": "road.highway",
    "stylers": [
      { "color": "#7E96BC" }
    ]
  },{
    "featureType": "road.arterial",
    "elementType": "geometry",
    "stylers": [
      { "color": "#FEFEFE" }
    ]
  },
	{
	"featureType": "water",
    "stylers": [
      { "color": "#8ABFE5"  }
    ]
	},
	{
	"featureType": "landscape.natural",
    "stylers": [
      { "color": "#EBECEF"  }
    ]
	},
	{
	"featureType": "landscape.natural.landcover",
    "stylers": [
      { "color": "#C9E7D2"  }
    ]
	},
	{
	"featureType": "all",
	  "elementType": "labels.icon",
    "stylers": [
      { "visibility": "off" }
    ]
	}
]



export default class BookingMap extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            step:1,
            locationcur:{},
            radius:40,
            sourceLocation:{},
            latitudecur:-33.8688,
            longitudecur:151.2195,
            latitudedest:'',
            longitudedest:'',
            curlocatdesc:'',
            latitudeDelta: 0.0043,
            longitudeDelta: 0.0034,
            origin:{},
            destination:{},
            pickup:'',
            destinationto:'',
            stateText:'',
            results:{},
            forsourdest:'source',
            accessTokan:'',
            avatar:'',
            name:'',
             distance:0,
             duration:0,
             bookrequest:{},
             display:true,
             departed:false,
             waypointslnglat:[],
             mapfitdone:false,
             endcomplete:false,
        };
        this.myRefbt = React.createRef();
        this.mapView = null;    
        this.myinterval = React.createRef();
        this.myinterval2 = React.createRef();
    }
   
    async intialLoad() {
    	let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            setErrorMsg('Permission to access location was denied');
            return;
        }
/*
        let location = await Location.getCurrentPositionAsync();
        //console.log(location.coords.latitude);
        //console.log(location.coords.longitude);
        const latitudeDelta = location.coords.latitude-location.coords.longitude;
        const longitudeDelta = latitudeDelta * ASPECT_RATIO;

        //  console.log(latitudeDelta);
        // console.log(longitudeDelta);

        const origin = {
        	latitude: location.coords.latitude, 
        	longitude: location.coords.longitude
        } 
      
        this.setState({
        	locationcur:location,
        	latitudecur:location.coords.latitude,
        	longitudecur:location.coords.longitude,
        	latitudeDelta:0.00176,
        	longitudeDelta:0.00176,
        	origin:origin,
        });
        //console.log(origin);

        if (location.coords) {
            const { latitude, longitude } = location.coords;
            let response = await Location.reverseGeocodeAsync({
                latitude,
                longitude,
            });
            //console.log(response);

            let address = '';
            for (let item of response) {
                //${item.street}, 
                let address = `${item.name}, ${item.postalCode}, ${item.city}`;
                // console.log(address);
                this.setState({
                	curlocatdesc:address,
                	pickup:address,
                });
            }
        }
        */
        AsyncStorage.getItem('accesstoken').then((value) => {           
            if(value != '' && value !== null){
                this.setState({
                    accessTokan:value
                });
            }
        })
        //alert(this.state.isOnline)
    } 
    
    async componentDidMount() {
    	const {navigation,state} = this.props;
    	    
      if(this.props.route.params.selectedvehicle){
      	this.setState({ 
             selectedvehicle:this.props.route.params.selectedvehicle,
             origin:this.props.route.params.origin,
             destination:this.props.route.params.destination,
             latitudedest:this.props.route.params.latitudedest,
             longitudedest:this.props.route.params.longitudedest,
             latitudecur:this.props.route.params.latitudecur, 
             longitudecur:this.props.route.params.longitudecur,
             bookingresponse:this.props.route.params.bookingresponse,
             rideinfoinprocess:this.props.route.params.rideinfoinprocess,
             bookingdriver:this.props.route.params.bookingdriver,
             waypointslnglat:this.props.route.params.waypointslnglat,
        },
        ()=>{
        	        /* const origin = {
		            	latitude: 21.11922760, 
		            	longitude:79.10470160
		            } 
      
		            this.setState({
		            	origin:origin
		            });
        	      */
        });
        
        this.myinterval = setInterval(() => {
        	//alert("")
        	if(this.state.endcomplete == false){
          	this.getrideEnd();
          	
          }
        }, 10000);
          	
         this.myinterval2 = setInterval(() => {
          	this.getDriverCoordinate();
        }, 10000); 	
         
          	  		
         /*	
        let locations = await Location.watchPositionAsync({ accuracy: Location.Accuracy.BestForNavigation, timeInterval: 10000, distanceInterval: 1 }, (pos) => {
	            console.log('cords:',pos.coords);
	             const { latitude, longitude } = pos.coords;
	             const origin = {
		            	latitude: latitude, 
		            	longitude:longitude	
		            } 	
		            this.setState({
		            	latitudecur:latitude,
		            	longitudecur:longitude,
		            	origin:origin
		            });
	            //console.log(driverId);
	        }); 
			*/
        //this.intialLoad()
    }
   }
    
  getDriverCoordinate = () =>{
  		 var docRef = db.collection("driver_locations").doc(JSON.stringify(this.props.route.params.bookingdriver.id));
                docRef.get().then((doc) => {
                    if (doc.exists) {
                        console.log("Document data INITAL 1 :", doc.data());
                        /*this.setState({driverLocation:doc.data().coordinates,
                        displaydriveloc:true},()=>{
					       	 console.log(" ORGIN SET INITAL "+JSON.stringify(this.state.driverLocation));      	
					         });
					         */
                    } else {
                        // doc.data() will be undefined in this case
                        console.log("No such document!");
                    }
                }).catch((error) => {
                    console.log("Error getting document:", error);
                });
     
  }
  getrideEnd =()=>{
   	//const bookId = this.state.bookingresponse.id;
   	db.collection('trip_path').where('bookingId','==',this.state.bookingresponse.id).where('status','==','close')
			  .get()
			  .then(querySnapshot => {
			    console.log('Total bOOKING STATUS: ', querySnapshot.size);
			    if(querySnapshot.size > 0){
			    	clearInterval(this.myinterval);
			    	clearInterval(this.myinterval2);
			    		this.setState({
				    		endcomplete:true,
				    	},()=>{
				    		this.setDriverPayment();
			       		this.props.navigation.replace('RideArriveDest',this.state);
				    	})
			      //this.props.navigation.replace('BookingMap',this.state);  
			    }																																																																																																																																															
			  });
  }
 
   
   UNSAFE_componentWillUnmount() {
    //this.unsubscribe();
    if(this.myinterval){
      clearInterval(this.myinterval);
    }
    if(this.settimeout){
   	 clearTimeout(this.settimeout);
    }
    if(this.myinterval2){
    	clearInterval(this.myinterval2);
    }
  }
    openDialScreen (){
    let number = '';
    if (Platform.OS === 'ios') {
      number = 'telprompt:${091123456789}';
    } else {
      number = 'tel:${091123456789}';
    }
    Linking.openURL(number);
  }
    
    

    async goOnline (){    
         AsyncStorage.getItem('accesstoken').then((value) => {           
            if(value != '' && value !== null){
            fetch(DOMAIN+'api/driver/online',{
            method: 'POST',
            headers : {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer '+value
            },
            body: JSON.stringify({
                "lat" : origin.latitude,
                "lng": origin.longitude
            })
        }).then(function (response) {
            return response.json();
        }).then( (result)=> {
            console.log(result);
            if(result.status === 1){
                this.setState({
                    isOnline:true,
                });
                this.props.navigation.navigate('TripPlaner');
                /*Alert.alert(
                    'Online Success',
                    result.message
                )*/
            }else{
                /*Alert.alert(
                    'Online Error',
                    result.message
                )*/
            }
        })
       }
      })
    }
    
   
    
      renderContent = () => (
    <>
    <View
      style={{
        backgroundColor: 'white',
        padding: 16,
        height: '100%',
        margin:10,
        shadowColor: "#000",
		  shadowOffset: {
				width: 0,
				height: 2,
			},
			shadowOpacity: 0.23,
			shadowRadius: 2.62,
			elevation: 4,
			borderRadius:10,
      }}
    >
  
    <Grid >   	
   			
   			<Row style={{height:100}}>
   				<Col size={5} style={{padding:10}}>
   				<View style={{borderWidth:1,borderColor:'silver',height:60,padding:10,borderRadius:8,backgroundColor:'#ccc'}}>
						{this.state.avatar && this.state.avatar != null ? 
							(<Image
				        source={{uri:"https://www.turvy.net/"+this.state.avatar}}
				        style={styles.servicebocimage}
				        Resizemode={'contain'}
				         />)
							:
							(<Image
				        source={{uri:"https://www.turvy.net/images/no-person.png"}}
				        style={styles.servicebocimage}
				        Resizemode={'contain'}
				         />)
						}
   					
   				</View>	
   				</Col>
   				<Col size={7} style={{padding:10}}>
   					
   					<Text style={{fontSize:20,fontWeight:'bold'}}>{this.state.name}</Text>
   				</Col>
   				
   			</Row>
   			<Row style={{height:80}}>
   				<Col size={4} style={{padding:6}}>
   					<View style={{flex:1,backgroundColor:'#7FFF00',alignItems:'center',justifyContent:'center'}} >
   					<TouchableOpacity onPress={() => this.openDialScreen()}>
   					<Feather name="phone-call" size={24} color="white" />
   					<Text style={{color:'#fff'}}>
   						Call
   					</Text>
   					</TouchableOpacity>
   					</View>
   				</Col>
   					<Col size={4} style={{padding:6}}>
   				<View style={{flex:1,backgroundColor:'#135AA8',alignItems:'center',justifyContent:'center'}}>
						<AntDesign name="message1" size={24} color="white" />
   					<Text style={{color:'#fff'}}>
   						Message
   					</Text>
   					</View>
   				</Col>
   				<Col size={4} style={{padding:6}}>
   				<View style={{flex:1,backgroundColor:'#ccc',alignItems:'center',justifyContent:'center'}}>
   					<AntDesign name="closecircleo" size={24} color="white" />
   					<Text style={{color:'#fff'}}>
   						Cancel
   					</Text>
   					</View>
   				</Col>
   			</Row>
   			<Row style={{height:60,paddingTop:15,paddingBottom:15,}}>
   			<Col size={12} style={{justifyContent:'center',alignContent:'center'}}>
   				 <Button  mode="contained" color={'#155aa8'} style={{fontWeight:'normal'}} onPress={() => this._onPressDepart()}>
				    Tap when departed
				  </Button>
				 </Col>
   			</Row>
   			<Row style={{height:30,padding:6}}>
   				<Col size={1}>
   					<View style={styles.inforound}>
   						<MaterialCommunityIcons name="information-variant" size={20} color="black" />
   					</View>
   				</Col>
   				<Col size={11}>
   				<Text>  Long press on image to zoom in</Text>
   				</Col>
   			</Row>
   		</Grid>
      
    </View>
   </>
  );

 setDriverPayment = async() =>{
     //console.log("DRIVER PAYMENT");
 	await AsyncStorage.getItem('accesstoken').then((value) => {
							//console.log(this.state.bookingdriver.id);
							//console.log('https://turvy.net/api/rider/driverrequestPayment/'+this.state.bookingresponse.id);
							//this.props.route.params
							fetch('https://www.turvy.net/api/rider/driverrequestPayment/'+this.state.bookingresponse.id,{
				     	  	method: 'POST', 
						   headers: new Headers({
						     'Authorization': 'Bearer '+value, 
						     'Content-Type': 'application/json'
						   }), 
						   body:JSON.stringify({
					 				'driver_id' : this.state.bookingdriver.id
					 			}) 
						   })
				      .then((response) => response.json())
				      .then((json) =>{ 
				      	console.log(json);
				      
				      	/*if(json.status == 1){
				      		 this.setState({                                        
					         	isLoading:false,
				    				vehborder:'red',
				    				bookingresponse:json.data
					         });
				      		this.props.navigation.navigate('PromoCode',this.state)
				      	}
				      	*/
				     	 }
				      )
				      .catch((error) => console.error(error));
				      })
 }
  
    render() {  	
        return (
            <>	 
                <KeyboardAvoidingView style={styles.container}  enabled={true} >
                    <View onLayout={(event) => {
                        var {x, y, width, height} = event.nativeEvent.layout;		  
                        const snapvals =[];
                        const point1 = height*0.7;
                        snapvals.push(point1);
                        const point2 = height*0.4;
                        snapvals.push(point2);
                        const point3 = height*0.2;
                        snapvals.push(point3);            
                        this.setState({
                        	snaptoval:snapvals,
                        });		  
                    }}>
                        <View>
                            <View
                                style={{
                                  alignItems: 'center',
                                  flexDirection:'row',                    
                                }}
                            >
                            <View style={{flexDirection:'row',width: '96%'}}>
                            </View>
                            </View>        
                        </View>
                        <View style={{flex:6}}>
                            <MapView style={styles.map}
                              ref={c => this.mapView = c}
                                initialRegion={{
                                 latitude: this.state.latitudecur,
                                 longitude: this.state.longitudecur,
                                  latitudeDelta:this.state.latitudeDelta,
                                 longitudeDelta:this.state.longitudeDelta,
                                }}
                                onRegionChangeComplete ={ (e) => {
                                //console.log(e);
                                }}
                               customMapStyle={stylesArray}  
                               
                            >
                             
      { this.state.latitudecur != '' && this.state.longitudecur != '' && Object.keys(this.state.origin).length > 0 ?
                                 ( 	<Marker.Animated
      coordinate={this.state.origin} 
      style={{ alignItems: "center"}} >
    
			 <Image
        style={styles.vehimage}
        source={imageveh} />
    </Marker.Animated>)
    :
    (<></>)
   }
    { this.state.latitudedest != '' && this.state.longitudedest != '' ?
       (
       	<Marker
       	tracksViewChanges={false}
      key={'destinationkey'}
      coordinate={{latitude:this.state.latitudedest, longitude:this.state.longitudedest}} 
      style={{ alignItems: "center"}} >
       <View  style={{
          alignItems: "center",
          borderColor:'#135AA8',
          borderWidth:1,
          width:150,
          backgroundColor:'#fff',
          height: 40,
          alignContent:'center',
          flex:1,
          flexDirection:'row'
        }}>
         <View  style={{alignItems: 'center',
    justifyContent:'center',width:'100%',padding:10}}>
    
         <Text
   	    numberOfLines={3}
          style={{
            position: "absolute",
            color: "#000705",
            fontWeight: "bold",
            textAlign: "center",
            fontSize: 12,
           
          }}
        >{this.state.bookingresponse.destination}</Text>
        </View>
   	  
    </View>
   	 <Entypo name="location-pin" size={40} color="red" />
    </Marker>
       ) :
       (
       <></>
       )
     }
    
    {Object.keys(this.state.waypointslnglat).length > 0 ?
    this.state.waypointslnglat.map((item, key) => {
    	return(
    		<MapView.Marker.Animated
  		coordinate={{latitude: item.latitude,longitude: item.longitude}} 
  		>
  		<Entypo name="stopwatch" size={24} color="#D23C2F" />
  		</MapView.Marker.Animated>	
    	)
	 }) 
	 :null
   }    
                                { Object.keys(this.state.origin).length > 0 && Object.keys(this.state.destination).length > 0 ?
    										(	
										    <>
										    	<MapViewDirections
										    	region={'AU'}
										    	 waypoints={this.state.waypointslnglat}
										    origin={this.state.origin}
										    destination={this.state.destination}
										    strokeWidth={5}
										    lineDashPattern={[1]}
										      strokeColor="#5588D9"
										      apikey="AIzaSyAr2ESV30J7hFsOJ5Qjaa96u9ADSRX6_Sk"
										      lineCap={'butt'}
										      lineJoin={'miter'}
										      onStart={(params) => {
										              console.log(`Started routing between "${params.origin}" and "${params.destination}"`);
										            }}
										      onReady={result => {
										      			//console.log(result);
										              //console.log(`Distance: ${result.distance} km`)
										              
										              console.log(`Duration: ${result.duration} min.`)
										              let duration = result.duration.toFixed();
										              let distance = result.distance;
										              if(duration == 0){
										              	
										              	 //this.state.bookingdriver.id
										                //this.props.navigation.navigate('RideArriveDest',this.state);
										              }	
										              
										              console.log(duration);
										              this.setState({
										              	duration:duration,
										              	distance:distance,
										              },()=>{
										              	if(this.state.mapfitdone == false){
										              		this.setState({
										              			mapfitdone:true,
										              		},()=>{
										              			this.mapView.fitToCoordinates(result.coordinates, {
												                edgePadding: {
												                   right:DEVICE_WIDTH*0.25,
														            left:DEVICE_WIDTH*0.25,
														            top:DEVICE_HEIGHT*0.25,
														            bottom:DEVICE_HEIGHT*0.25	,
												                },
												                   animated: true,
												              });
										              			
										              		})
										              		
										              	}
										    				
										    	     });
										              
										            }}
										  			/>
										  		</>
										    )
										    	:
										    	(
										    	<>
										    	</>
										    	)
										    }
    
                            </MapView>
                        </View>
                    </View>
                </KeyboardAvoidingView>	
                <View style={{position:'absolute',width:'100%',
  				height:200,top:'9%',left:'0%',zIndex:100,backgroundColor:'transparent',flex:1,flexDirection:'row'}}>
  			 <Grid>
  			 <Row style={{height:60,justifyContent:'center',alignContent:'center'}}>
				<Col size={4}>
					<TouchableOpacity
				   style={styles.menubox}
				     onPress={() => this.props.navigation.toggleDrawer()} >
				     <Entypo name="menu" size={40} color="#135aa8" />
		  			</TouchableOpacity>
				</Col>
				<Col size={4}>
					<View style={{alignItems:'center',}}>
                    <Button color="#FFF" mode="contained" labelStyle={styles.yellow} style={styles.btnSmall}>
                    <MaterialCommunityIcons size={14} name="cards-diamond" />22</Button>
                </View>
				</Col>
				<Col size={4} style={{alignItems:'flex-end', paddingRight:15}}>
				<TouchableOpacity
				   style={styles.serachbox}
				     onPress={() => console.log('serach')} >
				     <Ionicons name="ios-search-sharp" size={25} color="#135aa8" style={{fontWeight:'bold'}} />
		  			</TouchableOpacity>
				</Col>
			</Row>
		</Grid>
	</View>
	
            </>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    map: {
        flex: 1,
    },
    tinyLogo:{
        alignContent:'center',
        height:50,
        flex:1,
        flexDirection:'row'
    },
    circle:{
        alignItems:'center',justifyContent:'center',
        width: 10,
        height: 10,
        borderRadius: 10/2,
        backgroundColor:'#135AA8'
    },
    square:{
        width: 10,
        height: 10,
        backgroundColor:'#135AA8'
    },
    White: {color:'#FFFFFF'},
    labelStyle:{padding:2,color:'#FFF',fontSize:22},
    contentStyle:{paddingTop:5,paddingBottom:5,},
    btnGo:{backgroundColor:'#3f78ba',borderWidth:3,borderColor:'#FFF',borderRadius:100,fontSize:50, shadowColor: '#000',shadowOffset: { width: 40, height: 40 },shadowOpacity: 8.8,shadowRadius: 30,elevation: 50,
    },
    yellow:{color:'#fec557'},
    btnSmall:{backgroundColor:'#3f78ba',borderWidth:5,borderColor:'#FFF',fontSize:50,shadowColor: '#000',
    shadowOffset: { width: 40, height: 40 },shadowOpacity: 2.8,shadowRadius: 30,elevation: 50,},
    offIcon:{
        borderWidth:1,
        borderColor:'#ddd',
        padding:5,
        borderRadius:45,
        backgroundColor:'#FFF',
        color:'#FFF',
        elevation: 10,
    },
    offlineBtn:{      
        backgroundColor:"#ccc",
        justifyContent:'center',
        alignItems:'center',
        flexDirection:'row',    
        borderRadius:45,
    },
  menubox:{
	       borderWidth:1,
	       borderColor:'rgba(0,0,0,0.2)',
			position: 'absolute',
		    width: 45,
		    height: 45,
		    top: 0,
		    left: 10,
		    zIndex: 10,
	       alignItems:'center',
	       justifyContent:'center',
	       backgroundColor:'#fff',
	       shadowColor: "#000",
			shadowOffset: {
				width: 0,
				height: 3,
			},
			shadowOpacity: 0.27,
			shadowRadius: 4.65,
			
			elevation: 6,
	     },
	serachbox:{
		   borderWidth:0,
	       borderColor:'#135aa8',
		    width: 50,
		    height: 50,
	       alignItems:'center',
	       justifyContent:'center',
	       backgroundColor:'#fff',
	       borderRadius:25,
	        shadowColor: "#000",
			shadowOffset: {
				width: 0,
				height: 3,
			},
			shadowOpacity: 0.27,
			shadowRadius: 4.65,
			elevation: 6,
	},
yellow:{color:'#fec557'},
btnSmall:{
		backgroundColor:'#3f78ba',
		borderWidth:5,
		borderColor:'#FFF',
		fontSize:50,
		shadowColor: '#000',
	},
	searchSection:{
	 height:80,justifyContent:'center',alignContent:'center',backgroundColor:'#fff', shadowColor: "#000",
			shadowOffset: {
				width: 0,
				height: 3,
			},
			shadowOpacity: 0.27,
			shadowRadius: 4.65,
			elevation: 7,
	},vehimage:{
     width: 20,
    height:35,
	 alignSelf:'center'
	},
});
