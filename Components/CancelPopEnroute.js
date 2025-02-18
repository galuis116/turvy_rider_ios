import { StatusBar } from 'expo-status-bar';
import React from "react";
import { StyleSheet, Text, View,Dimensions,Image,ScrollView ,TouchableOpacity,ActivityIndicator,BackHandler,Modal} from 'react-native';
//import * as Permissions from 'expo-permissions';
import MapView , { Marker , Polyline ,Callout }from 'react-native-maps';
import * as Location from 'expo-location';
import MapViewDirections from 'react-native-maps-directions';
import GooglePlacesInput from './GooglePlacesInput';
import { EvilIcons,Ionicons,MaterialCommunityIcons,FontAwesome5,Entypo } from '@expo/vector-icons'; 
const imagemarker = require('../assets/location-pin-2965.png');
import Animated from 'react-native-reanimated';
import BottomSheet from 'reanimated-bottom-sheet';
import { Button } from 'react-native-paper';
import { Col, Row, Grid } from "react-native-easy-grid";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Spinner from 'react-native-loading-spinner-overlay';
import FlashMessage , { showMessage, hideMessage }  from "react-native-flash-message";
const { width, height } = Dimensions.get('window');
import TopBar from "./TopBar";


export default class CancelPopEnroute extends React.Component {
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
         selectedcancelchr:0,
         chargecancel:false,
         dedeuctinfo:{},
         previousprewardpoint:0,
         spinneron:false,
    };

    this.mapView = null;
    
   }
   
    componentDidMount(){
   	 console.log(this.props.route.params.bookingresponse);
   	 this.setState({
   	 	bookingresponse : this.props.route.params.bookingresponse,
   	 	selectedcancelchr:this.props.route.params.selectedcancelchr,
   	 	dedeuctinfo:this.props.route.params.dedeuctinfo,
   	 	previousprewardpoint:this.props.route.params.previousprewardpoint,
   	 });
   	 this.getbookingStatus();
    } // end of function
   
	async getbookingStatus(){
		 await AsyncStorage.getItem('accesstoken').then((value) => {
  		 	//alert('https://turvy.net/api/rider/requestbookstatus/'+this.state.bookingresponse.id);
      	fetch('https://www.turvy.net/api/rider/requestbookstatus/'+this.state.bookingresponse.id,{
     	  	method: 'GET', 
		   headers: new Headers({
		     'Authorization': 'Bearer '+value, 
		     'Content-Type': 'application/json'	
		   }),
		   })
      .then((response) => response.json())
      .then((json) =>{ 
      	console.log("get status if driver accept");
      	console.log(json);
      	
      	if(json.message == 'not assigned'){
      		this.setState({
      	  	chargecancel:false,
      	  });
      	}else{
      	  this.setState({
      	  	chargecancel:true
      	  })
      	}
      });      	
	  });
	} // end if    
	
   componentWillUnmount() {
    //this.unsubscribe();
  }
    async _onPressCancel(){
      // console.log("on cancel press");
       //console.log(this.state.bookingresponse);
       this.setState({
       	spinneron:true,
       });
      let  value = await AsyncStorage.getItem('accesstoken');
    if(value ){
      	let feeapp = 0 ;
      	let rempoint  = 0;
      	let amountdud =0;
      	if(this.state.dedeuctinfo){
      		rempoint  = parseInt(this.state.previousprewardpoint)-parseInt(this.state.dedeuctinfo.point);
      		amountdud = this.state.dedeuctinfo.amount;
      	}
      	
      	if(this.state.chargecancel){
      		feeapp = this.props.route.params.selectedcancelchr;
      	}
      	
		//console.log("Fees",this.state.dedeuctinfo);
		//console.log("Fee VALUE ",feeapp);
		//console.log("Fee amountdud=====",amountdud, 'rempoint======',rempoint);
		
		AsyncStorage.setItem('last_booking_id','');
		
      	fetch('https://www.turvy.net/api/rider/book/cancel/'+this.state.bookingresponse.id,{
     	  	method: 'POST', 
		   headers: new Headers({
		     'Authorization': 'Bearer '+value, 
		     'Content-Type': 'application/json'
		   }),
		    body:JSON.stringify({
	 				'fee' : feeapp,
	 				'amount':amountdud,
	 				'point':rempoint,
	 				'payfull':'yes'
	 			}) 
		   })
      .then((response) =>{
      	return response.json();
      	}).then((json) =>{ 
      	console.log("NEAR BY DRIVER");
      	console.log(json);
      	  this.setState({
	       	spinneron:false,
	       });
      	if(json.status == 1){
      		this.refs.fmLocalIntstance.showMessage({
           message: 'Your request cancelled!',
           type: "default",
           backgroundColor: "#135AA8", 
           autoHide:false,
           style:{
           		margin:20,
           		borderRadius:10,
           		alignItems:'center',
           		justifyContent:'center'
           },
        	 });
        	  
        	  //await sleep(2000) //wait 5 seconds
        	 // console.log(1);
			   setTimeout(function(){
			   	  if(this.refs.fmLocalIntstance){
			   	  	this.refs.fmLocalIntstance.hideMessage();
			   	  }
      			 this.props.navigation.replace('BookMain');
			    }.bind(this), 1000);
			  console.log(2);
      	}
     	})
      	.catch((error) => console.error(error));
		
    }
}
  
  
   
    
  
  render() {
  
  	 return (
	    <>
	    <StatusBar backgroundColor="#fff" barStyle="light-content"/>
	      	<Spinner
					visible={this.state.spinneron}
					color='#FFF'
					overlayColor='rgba(0, 0, 0, 0.5)'
				/>
	   <View style={styles.modalbox}>
	          <FlashMessage ref="fmLocalIntstance" position={{top:80, left:10,right:10}} style={{borderRadius:2}}  />
          <Grid >
          	<Row size={40}>
          		<Col>
          		
          		</Col>
          	</Row>
          	<Row size={60}>
          		<Col  style={{justifyContent:'center',alignContent:'center',alignItems:'center'}}>
          			<View style={styles.mainmodal}>
							<Grid >
								<Row size={30}  >
									<Col  style={{justifyContent:'center',alignContent:'center',alignItems:'center'}}>
										<FontAwesome5 name="exclamation-triangle" size={50} color="#FFAA01" />
									</Col>
								</Row>
								<Row size={20}  >
									<Col  style={{justifyContent:'center',alignContent:'center',alignItems:'center'}}>
										<Text>You are en route to the destination.</Text>
										<Text>You are sure to cancel?</Text>
										<Text style={{color:'#A10015'}}>Full trip fare will be charged</Text>			
									</Col>
								</Row>
								
								<Row size={15}  >
									<Col  style={{justifyContent:'center',alignContent:'center',alignItems:'center'}}>
									<Button  mode="contained" color={'#135AA8'} onPress={() => this._onPressCancel()}>
										    Cancel Ride
								    </Button>
									</Col>
								</Row>
							</Grid>
						</View>
          		</Col>
          	</Row>
          	<Row size={10} style={{marginTop:10}}>
          		<Col style={{justifyContent:'center',alignContent:'center',alignItems:'center'}}>
          			<View style={styles.mainmodal}>
							<Grid >
								<Row size={40}  >
									<Col  style={{justifyContent:'center',alignContent:'center',alignItems:'center'}}>
									<TouchableOpacity
							        style={styles.button}
							        onPress={() => this.props.handlerCallCancel()}
							       >
							        <Text>Don't Cancel Ride </Text>
							      </TouchableOpacity>
									</Col>
								</Row>
							</Grid>
						</View>
          		</Col>
          	</Row>
          	<Row size={10} style={{marginTop:10}}>
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
	},
	mainmodal:{width:'90%',
	backgroundColor:'#fff',
	flex:1,
	shadowColor: "#000",
 			borderRadius:10,
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,},
	modalbox:{
  		position: 'absolute',
  		top: 0, 
  		bottom: 0, 
  		left: 0, 
  		right: 0,
   	backgroundColor: "rgba(255,255,255,0.5)"
}, menubox:{
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
	     yellow:{color:'#fec557'},
		btnSmall:{
		backgroundColor:'#3f78ba',
		borderWidth:5,
		borderColor:'#FFF',
		fontSize:50,
		shadowColor: '#000',
	},
});
