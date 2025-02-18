import { StatusBar } from 'expo-status-bar';
import React from "react";
import { StyleSheet, Text, View,Dimensions,Image,ScrollView ,TouchableOpacity,ActivityIndicator,BackHandler} from 'react-native';
//import * as Permissions from 'expo-permissions';
import MapView , { Marker , Polyline ,Callout }from 'react-native-maps';
import * as Location from 'expo-location';
import MapViewDirections from 'react-native-maps-directions';
import GooglePlacesInput from './GooglePlacesInput';
import { EvilIcons,Ionicons,MaterialCommunityIcons } from '@expo/vector-icons'; 
const imagemarker = require('../assets/location-pin-2965.png');
import Animated from 'react-native-reanimated';
import BottomSheet from 'reanimated-bottom-sheet';
import { Button,Divider } from 'react-native-paper';
import { Col, Row, Grid } from "react-native-easy-grid";
import SmartLoader from './SmartLoader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Spinner from 'react-native-loading-spinner-overlay';
const { width, height } = Dimensions.get('window');

import SwipeButton from 'rn-swipe-button';

const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0043;
const SCREENHEIGHT = height*.80;
//console.log("height");
//console.log(SCREENHEIGHT);

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


export default class BookDetails1 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        	step:1,
        	locationcur:{},
        	sourceLocation:{},
        	latitudecur:-33.8688,
        	longitudecur:151.2195,
         latitudedest:'',
        	longitudedest:'',
        	destlocatdesc:'',
         latitudeDelta: 0.0043,
         longitudeDelta: 0.0034,
         origin:{},
         destination:{},
         duration:'',
         servicetypes:[],
         selectedvehicle:{},
         inprocessing:0,
         isLoading:false,
         display:false,
         distance:'',
         bookingresponse:{},
         selectedvehicle:{},
         selectedvehiclefare:0,
         	selectedprcperunit:0,
         selectedminprc:0,
    };
    this.mapView = null;
    
   }
   
    componentDidMount(){
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
             selectedvehiclefare:this.props.route.params.selectedvehiclefare,
              selectedprcperunit:this.props.route.params.selectedprcperunit,
             selectedminprc:this.props.route.params.selectedminprc,
             
        });
        //console.log(this.props.route.params.selectedvehiclefare);
      }
      
   	this.intialLoad();
  		this.unsubscribe =  navigation.addListener("focus",() => {
  			this.setState({ 
             selectedvehicle:this.props.route.params.selectedvehicle,
             inprocessing:0,
         });
  			this.intialLoad();
  		});			
  } // end of function
   
   componentWillUnmount() {
    this.unsubscribe();
  }
    
  async _onPressDone(){
  		this.setState({
  			inprocessing:1,
  			isLoading:false,
  		},()=>{
    		this.props.navigation.navigate('BookProcess',this.state);
    	});	
  }

	swipicon =() =>{
		return(<Ionicons name="ios-close-outline" size={40} color="black" />)
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
    {this.state.inprocessing == 0 ? 
   	( <Grid >
   			<Row style={{height:120}}>
   			<Col size={4}>
   			</Col>
   			<Col size={4} style={{width:150,height:120,alignItems:'center'}}>
   				<Image
			        source={{uri:"https://www.turvy.net/"+this.state.selectedvehicle.image}}
			        style={styles.servicebocimage}
			         />
         		</Col>
         	<Col size={4}>
   			</Col>
   			</Row>
   			<Row style={{height:40}}>
   			<Col size={12}>
   				<Text style={{textAlign:'center',color:'#135AA8',fontSize:16}}>{this.state.selectedvehicle.name}</Text>
   			</Col>
   			</Row>
            <Row style={{height:35}}>
            	<Col size={6} ><Text style={{fontWeight:'bold'}}>Approximate Fare</Text></Col>
            	<Col size={3}><Text><Divider style={{color:'#000',flex:1}} /></Text></Col>
            	<Col size={3}><Text style={{fontWeight:'bold'}}>${this.state.selectedvehiclefare}</Text></Col>
            </Row>
             <Row style={{height:35}}>
            	<Col size={6}><Text  style={{fontWeight:'bold'}}>Approximate dis.</Text></Col>
            	<Col size={3}></Col>
            	<Col size={3}><Text style={{fontWeight:'bold'}}>{ this.state.distance ? this.state.distance : '' }km</Text></Col>
            </Row>
            <Row style={{height:35}}>
            	<Col size={6}><Text style={{fontWeight:'bold'}}>Cost/Km</Text></Col>
            	<Col size={3}></Col>
            	<Col size={3}><Text style={{fontWeight:'bold'}}>${this.state.selectedprcperunit}/km</Text></Col>
            </Row>
             <Row style={{height:40}}>
            	<Col size={6}><Text style={{fontWeight:'bold'}}>Cost/Min</Text></Col>
            	<Col size={3}></Col>
            	<Col size={3}><Text style={{fontWeight:'bold'}}>${this.state.selectedminprc}</Text></Col>
            </Row>
            <Row style={{height:40}}>
   			<Col size={12}>
   				<Button  mode="contained" color={'#135AA8'} onPress={() => this._onPressDone()}>
				    Done
				 	</Button>
   			</Col>
   			</Row>
   			 <Row style={{height:40}}>
   			<Col size={12}>
   				<Text style={{textDecorationLine: 'underline',padding:10}}>Tap to change payment option</Text>
   			</Col>
   			</Row>
   			<Row style={{height:100,}}>
   			<Col>
   				
   			</Col>
   			</Row>
       </Grid>)
       :
       (
       	<Grid >
   			<Row style={{height:120,justifyContent:'center',alignContent:'center'}}>
   			<Col size={12}>
   			    <ActivityIndicator size="large" color="#0000ff" />
   			</Col>
   			</Row>
   			<Row style={{height:50,}}>
   			<Col size={12} >
   			    <View style={{ alignItems: 'center' }}><Text style={{fontWeight:'bold',fontSize:20,textAlign:'center'}}>We are processing your Booking ......</Text></View>
   			</Col>
   			</Row>
   			<Row style={{height:50,}}>
   			<Col size={12}>
   			    <View style={{ alignItems: 'center' }}><Text style={{textAlign:'center'}}>Your ride will start soon!</Text></View>
   			</Col>
   			</Row>
   			<Row style={{height:100,}}>
   			<Col>
   			<SwipeButton
                        containerStyles={{borderWidth:1,borderColor:'silver',color:'grey',padding:2}}
            height={50}
            onSwipeFail={() => console.log('Incomplete swipe!')}
            onSwipeStart={() => console.log('Swipe started!')}
            onSwipeSuccess={() =>
              console.log('Submitted successfully!')
            }
            railBackgroundColor="silver"  
            railBorderColor="silver"
            railStyles={{
              backgroundColor: '#44000088',
              borderWidth:1,
              borderColor: 'silver',
              color:'grey',
            }}

            thumbIconBackgroundColor="#FFFFFF"
            titleColor='grey'
            title="Slide to Cancel"
            thumbIconComponent={this.swipicon}
            thumbIconStyles={{
            	borderWidth:0,
            }}
            railFillBackgroundColor="#FFFFFF"
          />
   			</Col>
   			</Row>
   		</Grid>
       )
      } 
    </View>
   </>
  );   
  
  
  async intialLoad() {
  	
  	  
     let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
    
    }
    
  render() {
  
  	 return (
	    <View style={styles.container}>
	    <StatusBar backgroundColor="#fff" barStyle="light-content"/>
	    <Spinner
          visible={this.state.isLoading}
          color='#FFF'
          overlayColor='rgba(0, 0, 0, 0.5)'
        />
        <TouchableOpacity
   style={{
       borderWidth:1,
       borderColor:'rgba(0,0,0,0.2)',
		position: 'absolute',
	    width: 60,
	    height: 60,
	    top: 50,
	    left: 10,
	    zIndex: 10,
       alignItems:'center',
       justifyContent:'center',
       backgroundColor:'#fff',
       borderRadius:50,
     }}
     onPress={() => this.props.navigation.toggleDrawer()}
 		>
	    <MaterialCommunityIcons name="reorder-horizontal" size={40} color="black"  />
     </TouchableOpacity>
      <MapView style={styles.map}
       region={{
         latitude: this.state.latitudecur,
         longitude: this.state.longitudecur,
         latitudeDelta: this.state.latitudeDelta,
         longitudeDelta: this.state.longitudeDelta,
       }}
        customMapStyle={stylesArray}  
               ref={c => this.mapView = c}
        onRegionChangeComplete ={ (e) => {
  				
  }}
    
       >	
    <>
     <Marker
       key={'sourcekey'}
      coordinate={{latitude:this.state.latitudecur, longitude:this.state.longitudecur}} 
     
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
        <View style={{alignItems: 'center',
    justifyContent: 'center',width:'30%',height:'100%',backgroundColor:'#135AA8'}}>
         <Text style={{color:'#fff',textAlign:'center'}}>{this.state.duration} min</Text>
        </View>
         <View  style={{alignItems: 'center',
    justifyContent:'center',width:'70%'}}>
         <Text
   	    numberOfLines={1}
          style={{
            position: "absolute",
            color: "#000705",
            fontWeight: "bold",
            textAlign: "center",
            fontSize: 12,
          }}
        >My Location</Text>
        </View>
   	  
    </View>
    <Image
        style={styles.tinyLogo}
        source={imagemarker} />
    </Marker>
   
    
    { this.state.latitudedest != '' && this.state.longitudedest != '' ?
       (
       
       	<Marker
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
   	    numberOfLines={1}
          style={{
            position: "absolute",
            color: "#000705",
            fontWeight: "bold",
            textAlign: "center",
            fontSize: 12,
           
          }}
        >{this.state.destlocatdesc}</Text>
        </View>
    </View>
    <Image
        style={styles.tinyLogo}
        source={imagemarker} />
   
    </Marker>
       ) :
       (
       <></>
       )
     
     }
     
    { Object.keys(this.state.origin).length > 0 && Object.keys(this.state.destination).length > 0 ?
    (
    <>
    	<MapViewDirections
    	region={'AU'}
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
              // find amount to display 

             const  distancecal = distance/2;
		        const circumference = 40075;
		        //const oneDegreeOfLatitudeInMeters = 111.32 * 1000;
		        const oneDegreeOfLatitudeInMeters = distancecal*4;
		        const angularDistance = distancecal/circumference;

        		  const latitudeDelta = distancecal / oneDegreeOfLatitudeInMeters;
        		const longitudeDelta = Math.abs(Math.atan2(
                Math.sin(angularDistance)*Math.cos(this.state.latitudedest),
                Math.cos(angularDistance) - Math.sin(this.state.latitudedest) * Math.sin(this.state.latitudedest)))

              console.log(duration);
              this.setState({
              	duration:duration,
              	distance:distance,
              	isLoading:false,
              	display:true
              },()=>{
    				this.mapView.fitToCoordinates(result.coordinates, {
                edgePadding: {
                  right: (width / 20),
                  bottom: (height / 2.5),
                  left: (width / 20),
                  top: (height / 12),
                },
                   animated: true,
              });
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
   </>
  </MapView>
  { this.state.display ? (
  <BottomSheet
        snapPoints={[SCREENHEIGHT]}
        borderRadius={20}
        renderContent={this.renderContent}
        overdragResistanceFactor={0}
        enabledManualSnapping={false}
         enabledContentTapInteraction={false}
        enabledContentGestureInteraction={false}
      />)
      :(
      	<Text></Text>
      )
    }
  </View>	
	  );
   }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: Dimensions.get('window').width,
    height: '100%',
  },
  tinyLogo:{
  	alignContent:'center',
  	height:50,
  	flex:1,
  	flexDirection:'row'
  },
  servicesbox:{
  	flexDirection:'column',
 	flex:1,
 	width:150,
 	height:150,
 	backgroundColor:'#e5e5e5',
 	borderWidth:1,
 	borderColor:'#e5e5e5',
 	padding:10,
 	margin:10,
 	alignItems:'center',
 	borderRadius:10,
 	justifyContent:'center'
  },
  servicebocimage:{
    width: '100%',
    height: '100%',
    aspectRatio: 1 * 1.4,
	 resizeMode: 'contain'
	}
});
