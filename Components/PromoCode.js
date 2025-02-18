import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Alert,
  ScrollView,
  TextInput,
  Button,TouchableHighlight,BackHandler } from 'react-native';
import { theme, DOMAIN} from '../Riders/Constant';
import {Provider as PaperProvider, Checkbox ,Appbar} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Spinner from 'react-native-loading-spinner-overlay';
import FlashMessage , { showMessage, hideMessage }  from "react-native-flash-message";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Col, Row, Grid } from "react-native-easy-grid";
import RadioButton from "react-native-animated-radio-button";
import { compareAsc, format } from 'date-fns';


class PromoCode extends React.Component {
	constructor(props) {
	    super(props); 
	    this.state = {
	    	promoCode:'',
	    	checked:'',      
			data: [
				{id:'TUR-100', title: "10% Off on the base rate on your next rental", image:"https://img.icons8.com/clouds/100/000000/groups.png", valid:'Valid to 09/12/2021'},
				{id:'TUR-200', title: "10% Off on the base rate on your next rental", image:"https://img.icons8.com/color/100/000000/real-estate.png", valid:'Valid to 09/12/2021'},
				{id:'TUR-300', title: "10% Off on the base rate on your next rental", image:"https://img.icons8.com/color/100/000000/find-matching-job.png", valid:'Valid to 09/12/2021'},
			],
			isLoading:false,
			promocodeList:{},
			selectedPromo:{},
			bookingresponse:{},
			selectedvehiclefare:0,
		   selectedprcperunit:0,
         selectedminprc:0,
			messagesuccess:'',
			selectedvehicle:{},	
			 origin:{},
         destination:{},
         duration:'',
         distance:'',
         latitudedest:'',
         longitudedest:'',
         latitudecur:'', 
         longitudecur:'',
	    };
	    
	   this.myReffls = React.createRef();
	   this.backPressSubscriptions = new Set();
	   this.onGoBackCallback = this.onGoBackCallback.bind(this);
	}

	componentDidMount(){
   	const {navigation,state} = this.props;
   	
      // for andriod BackHandler
      BackHandler.addEventListener('hardwareBackPress', this.onGoBackCallback);
      navigation.addListener('gestureEnd', this.onGoBackCallback);
   	this.getPromocode();
   	//console.log(this.props.route.params.selectedvehicle);
   	if(this.props.route.params.selectedvehicle){
      	this.setState({ 
             selectedvehicle:this.props.route.params.selectedvehicle,
             origin:this.props.route.params.origin,
             destination:this.props.route.params.destination,
             latitudedest:this.props.route.params.latitudedest,
             longitudedest:this.props.route.params.longitudedest,
             latitudecur:this.props.route.params.latitudecur, 
             longitudecur:this.props.route.params.longitudecur,
             selectedvehiclefare:this.props.route.params.selectedvehiclefare,
             bookingresponse:this.props.route.params.bookingresponse,
             selectedprcperunit:this.props.route.params.selectedprcperunit,
             selectedminprc:this.props.route.params.selectedminprc,
        });
      }
   }
   
   componentWillUnmount() {
      //this.unsubscribe();
      BackHandler.removeEventListener('hardwareBackPress', this.onGoBackCallback);
   }
   
   onGoBackCallback(){
      console.log('Android hardware back button pressed and iOS back gesture ended');
     return true;
   }
   
   async getPromocode(){
    	
	await AsyncStorage.getItem('accesstoken').then((value) => {
			console.log(value);
  fetch('https://www.turvy.net/api/rider/promocodes',{
	headers : {
	 'Authorization': 'Bearer '+value, 
	 'Content-Type': 'application/json'
		},}).then(function (response) {                   
	  return response.json();
	  }).then( (result)=> {
	  	console.log(result.data);
	  	this.setState({
	  		promocodeList:result.data
	  	});
	  //setMyTrips(result.data);
	});
	});
}

getcouponLabel= (item) =>{
	let  label =''+item.value;
	if(item.type == 2) {
		label +='% Off the base rate on your next rental';
	}else{
		label +=' Off the base rate on your next rental';
	}
	return label;
	
}

getdateFormated(item){
	
	let date = new Date(item.expired_at);
	date = format(date,'MM/dd/yyyy');
	return(date);

}

renderMessages(){
	return (<Text>gadfgfdsf hggg</Text>)
}
applypromocode(){
	 
	if(this.state.promoCode != ''){
		let matchcode = 0; 
		if(this.state.promocodeList.length > 0){
			this.state.promocodeList.map((item,index)=>{
				//console.log(item);
				
				if(item.code == this.state.promoCode){
					console.log("IN MAP MATCH");
					let matchcode = 1; 
					this.setState({
					  selectedPromo: item,
					},()=>{
						this.refs.fmLocalIntstance.showMessage({
						  message: "PromoCode applied  Successfully!",
						  type: "default",
						  backgroundColor: "mediumseagreen", // background color
						  color: "#ffffff", // text color
						  hideOnPress:true,
						  animated:true,
						  duration:5000,
						  icon:'success',
						
				   });
					});
					
				}
				 
			});
		}
	}else{
			this.refs.fmLocalIntstance.showMessage({
						  message: "Please enter vaild promocode!",
						  type: "danger",
						  color: "#ffffff", // text color
						  hideOnPress:true,
						  animated:true,
						  duration:5000,
						  icon:'danger'
					});
	}
}
  //console.log(this.props)
    	getCode = () =>{
    		console.log(this.state.selectedPromo);
    		this.setState({isLoading:false},()=>{
    			//this.props.navigation.navigate('PaymentMethods',this.state)
    			 this.props.navigation.navigate('PaymentMethods',this.state)
    		});
    	}
    	    
	render() {
        return (
       <PaperProvider theme={theme} style={{flex:1}}>
            <FlashMessage ref="fmLocalIntstance" position="top" style={{marginTop:100,borderRadius:2}}  />   
  	  <StatusBar backgroundColor="#fff" barStyle="light-content"/>
  	   <Spinner
          visible={this.state.isLoading}
          color='#FFF'
          overlayColor='rgba(0, 0, 0, 0.5)'
        />
        	<View >
  	  		 <Appbar.Header style={{backgroundColor:'#fff'}}>
      		   <Appbar.BackAction onPress={() => this.props.navigation.goBack()} />
        			<Appbar.Content title="Add Promo Code" />
             </Appbar.Header>
	  		</View>
	  		  
        	<View style={styles.container}>
             
        		<View style={styles.contentForm}>
        			<TextInput 
						placeholder="Enter your Promo code"
						style={styles.promoInp}
						value={this.state.promoCode}
						onChangeText={(val)=> this.setState({promoCode:val})}
				    />
				    <TouchableOpacity 				        
						style={styles.promoBtn} onPress={() => this.applypromocode()} >
						<Text style={styles.promoBtnTxt}>APPLY</Text>
				    </TouchableOpacity>
				 
        		</View>
        		{this.state.messagesuccess ? (
        		<View style={styles.contentForm}>
        	 <Grid style={{height:20}}>
        		<Row style={{height:20}}>
        			<Col><Text style={{textAlign:'center',color:'#008000'}}>{this.state.messagesuccess}</Text></Col>
        		</Row>
        		</Grid></View>):(<></>)
        		}
        
		        <FlatList 
		          style={styles.contentList}
		          columnWrapperStyle={styles.listContainer}
		          data={this.state.promocodeList}		          
		          renderItem={({item}) => {
		          return (
		            <TouchableOpacity style={styles.card} onPress={() => this.setState({checked:item.id,selectedPromo:item})}>
		            	<Grid>
		            		<Row style={{justifyContent:'center',alignContent:'center',alignSelf:'center',flex:1,flexDirection:'row',padding:10}}>
		            			<Col size={3} >
		            				 <View style={{width: 80,height: 80,borderRadius: 80 / 2,backgroundColor:'#EFFCFE',justifyContent:'center',alignContent:'center',alignSelf:'center',flex:1,margin:10,}}>
											{item.type == 2 ? 	            				 	
		            				 	( <MaterialCommunityIcons name="brightness-percent" size={35} color="#135AA8" style={{textAlign:'center'}} /> )
		            				 	:
		            				 	(<MaterialCommunityIcons name="cash" size={35} color="#135AA8" style={{textAlign:'center'}}/>)
		            				 	}	
		            				  </View>
		            			</Col>
		            			<Col size={1}>
		            			<View style={{width:1,flex:1,flexDirection:'column',borderWidth:1,borderColor:'#ccc',borderStyle:'dotted', borderRadius: 1,}}>
		            			</View>
		            			</Col>
		            			<Col size={6}>
		            				<Text style={{fontWeight:'bold',fontSize:17,}}>{this.getcouponLabel(item)}</Text>
		            				<Text style={{color:'#9C9EB6',paddingTop:10}}>Valid to {this.getdateFormated(item)}</Text>
		            				<View style={{alignItems:'flex-end'}}>
		            				<RadioButton 
		            				innerBackgroundColor={'#135AA8'}
		            				innerContainerStyle={{color:'#135AA8'}}
		            				 style={{
									    borderRadius: 8,
									    borderWidth: 3,
									    borderColor: "#135AA8",
									    height:30,
									    width:30,
									  }}
			                		value={item.id} 
			                		isActive={ this.state.checked === item.id ? true : false }
			                		onPress={() => this.setState({checked:item.id,selectedPromo:item})}
			                	/>
			                	</View>
		            			</Col>
		            		</Row>
		            	</Grid>
		            	
		              	
		            </TouchableOpacity>
		        )}}/>
		        <View style={styles.btnBox}>
		        	<TouchableOpacity style={styles.contentBtn} onPress={this.getCode}>
			        	<LinearGradient  
			        		style={styles.priBtn}       
	        				colors={['#135aa8', '#46a5dd']}
	        				end={{ x: 1.2, y: 1 }}>				        
					        	<Text style={styles.priBtnTxt}>Use This Code</Text>
				        </LinearGradient>
			        </TouchableOpacity>
		    	</View>  
		    	<View style={{paddingTop:20,paddingBottom:10,backgroundColor:'#fff',justifyContent:'center',alignContent:'center'}}>
		    	
		    	<TouchableHighlight onPress={()=>{ this.props.navigation.navigate('PaymentMethods',this.state) }}   underlayColor="transparent"><Text style={[styles.textBlue,{textAlign:'center'}]}> Skip for now</Text></TouchableHighlight>
		    	
		    	</View>  
		    </View>
		    </PaperProvider>
        );

    }    

}

export default PromoCode;	

const styles = StyleSheet.create({
	container:{
    flex:1,
    //backgroundColor:"#e4e4e4"
  },
  contentForm:{
  	backgroundColor:"#FFF",
  	marginBottom:10,
  	padding:20,
  	flexDirection:'row',
  },
  contentList:{
    flex:1,
    backgroundColor:"#FFF",
    paddingTop:10
  },
  contentBtn:{  	
  	backgroundColor:"#FFF",
  	justifyContent:'center',
    alignItems:'center',
    flexDirection:'row',
  	  
  },
  cardContent: {
    marginLeft:20,
    marginTop:10
  },
  ImgOut:{
  	borderStyle: 'dashed',
    borderRightWidth: 1,
    padding: 7,
    borderColor:"#ebf0f7",
    borderRadius: 1,
  },
  image:{
    width:90,
    height:90,
    borderRadius:45,
    borderWidth:1,
    borderColor:"#ebf0f7",    
  },

  card:{
    elevation: 2,
    marginLeft: 20,
    marginRight: 20,
    marginTop:10,
    marginBottom:10,
    backgroundColor:"white",    
    flexDirection:'row',
    borderRadius:5,    
  },

  title:{
    fontSize:16,
    flex:1,
    alignSelf:'center',
    color:"#000",
    fontWeight:'bold',
    width:200,
    paddingRight:10
  },
  valid:{
    fontSize:14,        
    color:"#ccc",
    flex:1
  },
  promoInp:{
  	borderWidth:1,
  	padding:8,
  	borderRadius:5,
  	backgroundColor:'#f7f5f6',  	
  	marginRight:10,
  	flex:2,
  	borderColor:'#d9d9d9'  	
  },
  promoBtn:{
  	flex:1,   	
  	backgroundColor:'#598cc3',
  	justifyContent:'center',
    alignItems:'center',
    borderRadius:5,    
  },
  promoBtnTxt:{
  	color:'#fff'
  },
  valRed:{  	
    alignItems:'center',
  	flexDirection:'row',
  },
  radio:{  	
  	paddingRight:1,
  	borderRadius:10,  	
  },
  priBtn:{  	  	
  	flex:1,
  	padding:15,  	
  	justifyContent:'center',
    alignItems:'center',
    borderRadius:45,    
  },
  priBtnTxt:{
  	color:'#FFF',
  	fontSize:16,
  	textTransform: 'uppercase',
  	letterSpacing: 2
  },
  btnBox:{  	
  	backgroundColor:'#FFF',
  	padding:20
  },
   textBlue: {color:'#135AA8',fontWeight:'bold'},
  textUnique:{fontSize:10},


});