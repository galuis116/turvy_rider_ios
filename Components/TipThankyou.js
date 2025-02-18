import React, {Component} from 'react'
import { View, StyleSheet, Text } from 'react-native'
import { moderateScale } from 'react-native-size-matters'
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button } from 'react-native-paper';
import Pusher from 'pusher-js/react-native';
import { DOMAIN, PUSHER_API} from '../Riders/Constant';
import Modal from 'react-native-modal';
export default class TipThankyou extends Component{
    constructor(props){
        super(props);
        this.state = {
            amount:0,
            driverName:'',
            tipModel:false,
            res:{},
            accessTokan:''
        }
    }

    async componentDidMount() {
     
			
        await AsyncStorage.getItem('accesstoken').then((value) => {
            if(value != '' && value !== null){
                this.setState({accessTokan: value})
            }
        })

        var pusher1 = new Pusher(PUSHER_API.APP_KEY, {
          cluster: PUSHER_API.APP_CLUSTER
        });

        var channel1 = pusher1.subscribe('turvy-channel');
        channel1.bind('tip_thanks_event', this.isRideTipToDriver);

        
    }

    isRideTipToDriver = async (data) => {
    	//alert("here in tip");
        console.log('tip Thank you data',data)
        //console.log('tip booking id',this.state.book_id)
			//
         await AsyncStorage.getItem('rider_id').then((value) => {
            console.log('rider_id',value);
            if(value != '' && value !== null && data.rider_id == value){
            	
                this.setState({
                    tipModel:true,
                    res:data,
                })
                setTimeout(()=>{
                    this.setState({
                        tipModel:false,
                    })
                }, 10000);
                
            } 
        });
        
         await AsyncStorage.getItem('accesstoken').then((value) => {
  			//console.log("SYANC TOEN");
			//console.log(value);
			if(value != '' && value != null){
		
            fetch('https://www.turvy.net/api/rider/getunreadmessages',{
		     	  	method: 'GET', 
				   headers: new Headers({
				     'Authorization': 'Bearer '+value, 
				     'Content-Type': 'application/json'
				   }), 
				   })
		      .then((response) => response.json())
		      .then((json) =>{ 
		        console.log("MESSAGE COUNT ",json);
		      //alert(json.data.count);
		         AsyncStorage.setItem('messagecount', JSON.stringify(json.data.count));
		         
		   	}).catch((error) => console.error(error));
		     } 	
			})
			
        
    }
   

    render(){
        return(
            <Modal 
                isVisible={this.state.tipModel}
                backdropOpacity={0.5}
                animationIn="zoomInDown"
                animationOut="zoomOutDown"
                animationInTiming={600}
                animationOutTiming={400}                    
            >
                <View style={tipstyles.container}>
                    <View style={tipstyles.subContainer}>
                        <View style={tipstyles.tickBox}>
                            <MaterialIcons name="check-circle" size={moderateScale(30)} color="white" />
                        </View>
                        <Text style={tipstyles.name}> {this.state.res.driver_name} say thank you for a tip. </Text>
                        <Text style={tipstyles.amount}>Thank you for a tip</Text>
                    </View>
                </View>
            </Modal>
        )
    }
}

const tipstyles = StyleSheet.create({
    container:{
        position:'absolute',
        width:'100%',
        height:moderateScale(200),
        top:'5%',
        zIndex:100,
        backgroundColor:'transparent',
        padding:moderateScale(10)
    },
    subContainer:{
        width:'100%',
        height:'100%',
        borderRadius:moderateScale(5),
        backgroundColor:'#fff',
        elevation:8,
        alignItems:'center',
        justifyContent:'space-between',
        padding:moderateScale(10)
    },
    tickBox:{
        width:moderateScale(50),
        height:moderateScale(50),
        borderRadius:moderateScale(50),
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#5ead97'
    },
    name:{
        fontSize:moderateScale(20),
        color:'#636363'
    },
    amount: {
        color:'#5ead97',
        fontSize:moderateScale(25),
        fontWeight:'700'
    },
    text:{
        fontSize:moderateScale(20),
        color:'#5ead97',
    }
})