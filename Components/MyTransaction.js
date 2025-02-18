import React, {useEffect, useState} from 'react';
import {  Provider as PaperProvider, Button, Avatar, Caption, Surface, IconButton, Colors,Appbar} from 'react-native-paper';
import {View, ScrollView, Picker, Text, StyleSheet, TouchableOpacity, Image,StatusBar,ActivityIndicator,FlatList} from 'react-native';
import {styles, theme, DOMAIN} from '../Riders/Constant';
import { Input } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { Divider } from 'react-native-elements';
import { Col, Row, Grid } from "react-native-easy-grid";
import Spinner from 'react-native-loading-spinner-overlay';


export default class MyTransaction extends React.PureComponent {
  constructor(props) {
    super(props);
    
    this.state = {
        	step:1,
        	myPayments:'today',
        	paymentlist:{},
        	spinner:false,
        	pageno:1,
    }
  }
  
 componentDidMount(){
	const {navigation,state} = this.props;
		this.setState({
	 		spinner:true,
	 	});
	this.getMyPayments();
 }
 
  getMyPayments = async() => {
	
      //setMyPayments(itemValue);
	await AsyncStorage.getItem('accesstoken').then((value) => {
		
		//alert('https://www.turvy.net/api/rider/mytransaction/'+this.state.page_no);
	  fetch('https://www.turvy.net/api/rider/mytransaction/'+this.state.pageno,{
		method: 'GET',
		headers : {
			 'Authorization': 'Bearer '+value, 
			 'Content-Type': 'application/json'
			}
		  }).then(function (response) {
		  return response.json();
		  }).then( (result)=> {
		  console.log("TRANSACTION RESPONSE 1 ",result);
		
		  	if(this.state.paymentlist && this.state.paymentlist.length > 0){
			  			this.setState({
				  		paymentlist: [ ...this.state.paymentlist, ...result.data ],
				  		spinner:false,
				  	})
		  	}else{
		  	  this.setState({
		  		paymentlist: result.data,
		  		spinner:false,
			  	})
		  	}
		        //setMyPaymentsData(result.data);
		});
	});
 };
 
 handlerArr = () =>{
		//alert("Scroll end reach");
		//alert("PAGE NO "+this.state.pageno);
		    this.setState({
		    	pageno:this.state.pageno+1
		    },()=>{
		    	this.getMyPayments();
		    });
    }
    
    
 renderItem = (item) =>{
		console.log("ITEMS",item.item);
		return(<> 
	
      
<View style={{ padding:3}}></View>
<Divider orientation="vertical"  />
   <Grid style={{width:'100%',padding:10}}>
   <Row><Col size={12}><Caption style={{fontSize:14}} > {item.item.created_at}   </Caption></Col></Row>
   <Row size={10}>
   {item.item.pay_type == 'self_cancel' ?
    (<Col size={12}>
        <Text style={{fontSize:13,fontWeight:'bold'}}>You cancelled trip</Text>
    </Col>)
    :
    null
   }
   {item.item.pay_type == 'driver_cancel' ?
    (<Col size={12}>
        <Text style={{fontSize:13,fontWeight:'bold'}}>Driver cancelled your trip</Text>
    </Col>)
    :
    null
   }
     {item.item.pay_type == 'wallet_deduct' ?
    (<Col size={12}>
        <Text style={{fontSize:13,fontWeight:'bold'}} >Wallet amount you used</Text>
    </Col>)
    :
    null
   }
    </Row>
     <Row size={10}>
    <Col size={4}>
        
    </Col>
    <Col size={4}>
     {item.item.pay_type == 'wallet_deduct' || item.item.pay_type == 'self_cancel'  ?
    (<Col size={12}>
        <Text style={{fontSize:13,fontWeight:'bold',color:'#ff0000'}} >A${item.item.amount}</Text>
    </Col>)
    :
    (<Text style={{fontSize:13,fontWeight:'bold',color:'#228B22'}}>A${item.item.amount}</Text>)
   }
    
    </Col>
 	 <Col size={4}>
 	 <Text style={{fontSize:13,fontWeight:'bold'}}>A${item.item.total_amount}</Text>
    </Col>
    </Row>
</Grid>
      </>);
	}
   
   renderFooter = () =>{
			return(
			<View><ActivityIndicator size="large" color="#04b1fd"  /></View>
			)    	
    } 
  
  	render(){
  		return(<PaperProvider theme={theme}>
			<StatusBar backgroundColor="#fff" barStyle="light-content"/>
		   <Appbar.Header style={{backgroundColor:'#fff'}}>
		   <Appbar.BackAction onPress={() => this.props.navigation.goBack()} />
		   <Appbar.Content title="My Transaction" />
		  </Appbar.Header>
          <Spinner
					visible={this.state.spinner}
					color='#FFF'
					overlayColor='rgba(0, 0, 0, 0.5)'
				/>
     	{ this.state.paymentlist && Object.keys(this.state.paymentlist).length > 0 ?
        (
      <FlatList
        ref={this.onRefListView}
        data={this.state.paymentlist}
        keyboardShouldPersistTaps={true}
        renderItem={this.renderItem}
         keyExtractor={item => item.id}
		  onEndReachedThreshold={0.5}
        onEndReached={this.handlerArr}
        ListFooterComponent={this.renderFooter}
      />)
      :
      null
   }
  </PaperProvider>);
  	}
}

 
   
const localStyle = StyleSheet.create({
 
  MainTablabel: {
  color: 'silver',
  fontWeight:'bold',
    textAlign: "center",
    marginBottom: 10,
    fontSize: 18,
  },

surface: {
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    margin:15,
    borderRadius:10

  }

});

const stylesBg = StyleSheet.create({
  surface: {
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    margin:15,
    borderRadius:10

  },
});