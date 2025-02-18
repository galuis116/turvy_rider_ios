import React, {useEffect,useState} from 'react';
import {SafeAreaView, Text, StyleSheet, View, TouchableHighlight,Alert,ActivityIndicator,TouchableOpacity,StatusBar,NativeSyntheticEvent} from 'react-native';
import {  Button  } from 'react-native-paper';
import {  CodeField,  Cursor,  useBlurOnFulfill,  useClearByFocusCell,} from 'react-native-confirmation-code-field';
import { useNavigation } from '@react-navigation/native';
import {styles, DOMAIN} from './Constant';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import FlashMessage , { showMessage, hideMessage }  from "react-native-flash-message";
import OtpAutoFillViewManager from 'react-native-otp-auto-fill';
//import * as firebase from "firebase";
//import firestore from '@react-native-firebase/firestore';
//import auth from "@react-native-firebase/auth";
import { firebase } from '@react-native-firebase/app';
import '@react-native-firebase/auth';

import apiKeys from '../config/keys';
//npm audit fix --force

if (!firebase.apps.length) {
    console.log('Connected with Firebase');
    firebase.initializeApp(apiKeys.firebaseConfig);
}

const  StatusBarheight = StatusBar.currentHeight+30;

const stylesv = StyleSheet.create({
  root: {flex:1,alignItems: 'center',justifyContent: 'center'},
  title: {textAlign: 'center', fontSize: 30},
  codeFieldRoot: {marginTop: 10},
  cell: {    width: 40,    height: 40,    lineHeight: 38,    fontSize: 24,    borderWidth: 2,    marginLeft:5,    borderColor: '#00000030',    textAlign: 'center',  },
  focusCell: {    borderColor: '#000',  },
  countdown:{marginTop:20,marginBottom:20},
  textBlue: {color:'blue'},
  textUnique:{fontSize:10},
  verificationBox:{width:'75%',alignItems: 'center',justifyContent: 'center',},
heading:{textAlign:'center',fontSize:18},
blackbutton:{width:160,borderRadius:20,backgroundColor: '#3f78ba',marginTop:10,color:'#fff',alignItems: 'center',justifyContent: 'center',},
blackbuttonopacity:{width:160,borderRadius:20,backgroundColor: '#3f78ba',marginTop:10,color:'#fff',alignItems: 'center',justifyContent: 'center',opacity:0.5},
  textbutton:{color:'#fff',padding:15},
  h6:{fontWeight:'bold'},
   box: {
    width: 300,
    height: 55,
    marginVertical: 20,
    borderColor: 'red',
    borderWidth: 1,
  },
});

const CELL_COUNT = 6;

const Verification = ({ route }) => {
	
  const { phone, countrycode ,fromwhere,verificationId,code} = route.params;
  const [value, setValue] = useState(code);
  
  const [resendprocess,setResendprocess] = useState(false);
  const [coundown, setCoundown] = useState('0.05 sec left');
  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({value, setValue,});
   const [disabled, setDisabled] = useState(true);
   const [error, setError] = useState(true);
   const navigation = useNavigation();
   
   const [verification, setVerification] = React.useState(verificationId);   
   
    useEffect ( ()=>{
   	firebase.auth().onAuthStateChanged((user) => {	
   		console.log("STATUS user 2  ",user);
   		//alert(user);
		  //if (user) // user is verified and logged in
		});
			if(value.length == 6){
  			setDisabled(false);
  		}else{
  			setDisabled(true);
  		}
		//console.log("FB AUTH",firebase.auth.PhoneAuthProvider);
		const phonenew  = "+"+countrycode+''+phone;

   });
  	const sendData = async() => {
  		console.log(value);
  		console.log('+'+countrycode+''+phone);
  		console.log(fromwhere);
  		//return;
  		
  		if(fromwhere == 'registration'){
  			
  			try {
            const credential = firebase.auth.PhoneAuthProvider.credential(
              verificationId,
              value
            );
            await firebase.auth().signInWithCredential(credential).then(response => {
            	AsyncStorage.setItem('countrycode', countrycode);
	  				AsyncStorage.setItem('phone', phone).then(res => { 
	  					return navigation.navigate('Createaccount'); 
				   });
            }).catch(error => {
		        	console.log('Error getting document:', error.message);
		        	setError(error.message);
	        });
            
            //showMessage({ text: "Phone authentication successful 👍" });
          } catch (err) {
          	console.log(err);
            //showMessage({ text: `Error: ${err.message}`, color: "red" });
          }
          
  			/*fetch(DOMAIN+'api/rider/register/otp',{
				method: 'POST',
				headers : {
					'Content-Type': 'application/json',
					'Accept': 'application/json'
				},
	 			body: JSON.stringify({
	 				"phone" : '+'+countrycode+''+phone,
	 				'otp' : value
	 			})
	 		}).then(function (response) {
	 			return response.json();
	  		}).then( (result)=> {
	  				console.log(result);
	  				//return;
	  				if(result.status  == 1){
	  					try {
	  						//AsyncStorage.setItem('accesstoken', result.access_token);
	  						AsyncStorage.setItem('expires_at', result.expires_at);
	  						AsyncStorage.setItem('countrycode', countrycode);
	  						AsyncStorage.setItem('phone', phone).then(res => { 
        						return navigation.navigate('Createaccount'); 
   					   });
	  					   
	  					 } catch (error) {
						    console.log('AsyncStorage error: ' + error.message);
						 }
		
	  				}else{
	  					showMessage({
			           message: result.message,
			           type: "danger",
			          
			        	 });
	  				}
			});
			*/
			
  		}else{
  			try {
            const credential = firebase.auth.PhoneAuthProvider.credential(
              verificationId,
              value
            );
            await firebase.auth().signInWithCredential(credential).then(response => {
            	fetch(DOMAIN+'api/rider/login/otp',{
				method: 'POST',
				headers : {
					'Content-Type': 'application/json',
					'Accept': 'application/json'
				},
	 			body: JSON.stringify({
	 				"phone" : '+'+countrycode+''+phone,
	 			})
		 		}).then(function (response) {
		 			return response.json();
		  		}).then( (result)=> {
	  				console.log("OTP VERIFY RESULT",result);
	  				if(result.access_token  != ''){
	  					try {
	  						AsyncStorage.setItem('accesstoken', result.access_token);
	  						AsyncStorage.setItem('expires_at', result.expires_at);
	  						if(result.rider.avatar != '' || result.rider.avatar != null){
	  							AsyncStorage.setItem('avatar', DOMAIN+result.rider.avatar);
	  						}
	  						
	  						AsyncStorage.setItem('partner_id',  JSON.stringify(result.rider.partner_id));
	      		     AsyncStorage.setItem('rider_id', JSON.stringify(result.rider.id));
	  						AsyncStorage.setItem('countrycode', countrycode);
	  						AsyncStorage.setItem('phone', phone).then(res => { 
        						return navigation.replace('LocationEnableScreen'); 
   					   });
	  					   
	  					 } catch (error) {
						    console.log('AsyncStorage error: ' + error.message);
						 }
		
	  				}
			 });
            }).catch(error => {
		        	console.log('Error getting document:', error.message);
		        	setError(error.message);
	        });;
           
			   
			
            //showMessage({ text: "Phone authentication successful 👍" });
          } catch (err) {
          	console.log(err);
            //showMessage({ text: `Error: ${err.message}`, color: "red" });
          }

  		}
  		
		//return navigation.navigate('Createaccount');
  	}
  	const resendOtp = async () => {
		  
  	
  	setError('');
        let myPhone = '+'+countrycode+phone;
        
        try {
           setResendprocess(true);setDisabled(true);

            const confirmation = await firebase.auth().verifyPhoneNumber(myPhone).on('state_changed', (phoneAuthSnapshot) => {
                console.log('State: ', phoneAuthSnapshot.state);
                switch (phoneAuthSnapshot.state) {
                    // ------------------------
                    //  IOS AND ANDROID EVENTS
                    // ------------------------
                    case firebase.auth.PhoneAuthState.CODE_SENT: // or 'sent'
                        console.log('code sent');
                        //setCodesent(true);
                        // on ios this is the final phone auth state event you'd receive
                        // so you'd then ask for user input of the code and build a credential from it
                        // as demonstrated in the `signInWithPhoneNumber` example above

                        break;
                    case firebase.auth.PhoneAuthState.ERROR: // or 'error'
                        console.log('verification error');
                        console.log(phoneAuthSnapshot.error);
                        break;

                    // ---------------------
                    // ANDROID ONLY EVENTS
                    // ---------------------
                    case firebase.auth.PhoneAuthState.AUTO_VERIFY_TIMEOUT: // or 'timeout'
                        console.log('auto verify on android timed out');
                        //const { verificationId } = phoneAuthSnapshot.verificationId;

                        if(phoneAuthSnapshot.verificationId){
                            setVerification(phoneAuthSnapshot.verificationId);
                        }
                        // proceed with your manual code input flow, same as you would do in
                        // CODE_SENT if you were on IOS
                        //return navigation.replace('Verification',{phone:mobileNumber,countrycode:countryPick,fromwhere:'login',verificationId:verificationIdlg,code:''});
                        //return navigation.replace('VerificationOtp',{phone:mobileNumber,countrycode:countryPick,verificationId:verificationId,countryId:countryId,code:''});
                        break;
                    case firebase.auth.PhoneAuthState.AUTO_VERIFIED: // or 'verified'
                        // auto verified means the code has also been automatically confirmed as correct/received
                        // phoneAuthSnapshot.code will contain the auto verified sms code - no need to ask the user for input.
                        console.log('auto verified on android');    
                        console.log(phoneAuthSnapshot);
                        // Example usage if handling here and not in optionalCompleteCb:
                        const { code } = phoneAuthSnapshot;
                        const verificationId = phoneAuthSnapshot.verificationId;
                        if(verificationId){
                            setVerification(verificationId);
                            setValue(code)                
                        }
                        setDisabled(false);
                        //return navigation.replace('VerificationOtp',{phone:mobileNumber,countrycode:countryPick,verificationId:verificationId,countryId:countryId,code:code});
                        //return navigation.replace('Verification',{phone:mobileNumber,countrycode:countryPick,fromwhere:'login',verificationId:verificationIdlg1,code:code});
                        // const credential = firebase.auth.PhoneAuthProvider.credential(verificationId, code);

                        // Do something with your new credential, e.g.:
                        // firebase.auth().signInWithCredential(credential);
                        // firebase.auth().currentUser.linkWithCredential(credential);
                        // etc ...
                        break;
                }

            }, (error) => {
                console.error(error);
            }, (phoneAuthSnapshot) => {
                //setDisabled(false);
                console.log('Success',phoneAuthSnapshot);

            });
            
            /*const phoneProvider = new firebase.auth.PhoneAuthProvider();
            const verificationId = await phoneProvider.verifyPhoneNumber(
                myPhone,
                recaptchaVerifier.current
            );
            
            //console.log("Verification code has been sent to your phone."+verificationId);
            setSpinner(false);

            if(verificationId){
                setVerification(verificationId);                
            }*/
            
        } catch (err) {
            setSpinner(false);
            setError(`Error: ${err.message}`);
        }
        setResendprocess(false);
        //setSpinner(false);
        
  	/*fetch(DOMAIN+'api/rider/login/phone',{
				method: 'POST',
				headers : {
					'Content-Type': 'application/json',
					'Accept': 'application/json'
				},
	 			body: JSON.stringify({
	 				"phone" : '+'+countrycode+''+phone,
	 			})
	 		}).then(function (response) {
	 			return response.json();
	  		}).then( (result)=> {
	  			setResendprocess(false);
	  				if(result.status  == 1){
	  					
	  					Alert.alert(
      "",
      "Resend Successfully!",
      [
        { text: "OK", onPress: () => console.log("OK Pressed") }
      ]
    );
	  				}	
			});
			*/
		
	  }
  	
  	const codesetting = (dt) => {
  		setValue(dt);
  		if(dt.length == 6){
  			setDisabled(false);
  		}else{
  			setDisabled(true);
  		}
  	}
  	
  	const handleComplete = ({
    nativeEvent: { code },
  }: NativeSyntheticEvent<{ code: string }>) => {
  	// console.log('Android Signature Key for SMS body:', code);
    Alert.alert('OTP Code Received!', code);
    codesetting(code);
  };

  // This is only needed once to get the Android Signature key for SMS body
  const handleOnAndroidSignature = ({
    nativeEvent: { code },
  }: NativeSyntheticEvent<{ code: string }>) => {
    console.log('Android Signature Key for SMS body:', code);
  };


  return (
    <SafeAreaView style={stylesv.root} keyboardShouldPersistTaps='handled'>
     <FlashMessage position="top" style={{marginTop:StatusBarheight,borderRadius:2}}  />
      <View style={stylesv.verificationBox}>
      <Text style={stylesv.heading}>We sent OTP code to Verify your number</Text>
      	<Text style={{color:'red',fontSize:12}}>{error}</Text>
      	<View><Text style={stylesv.h6}>Enter OTP Below</Text></View>
      	<OtpAutoFillViewManager
        onComplete={handleComplete}
        onAndroidSignature={handleOnAndroidSignature}
        style={stylesv.box}
        length={6} // Define the length of OTP code. This is a must.
      />
      
      <CodeField
        ref={ref}
        {...props}
        // Use `caretHidden={false}` when users can't paste a text value, because context menu doesn't appear
        value={value}
        onChangeText={codesetting}
        cellCount={CELL_COUNT}
        rootStyle={stylesv.codeFieldRoot}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        renderCell={({index, symbol, isFocused}) => (
          <Text
            key={index}
            style={[stylesv.cell, isFocused && stylesv.focusCell]}
            onLayout={getCellOnLayoutHandler(index)}>
            {symbol || (isFocused ? <Cursor /> : null)}
          </Text>
        )} />
		      	<View style={{flexDirection:'row',marginTop:20,marginBottom:20}}>
		      	<Text style={stylesv.textUnique}>If you didnt receive a code? </Text>
					<TouchableHighlight onPress={()=>resendOtp()}><Text style={[stylesv.textUnique,stylesv.textBlue]}>Resend OTP</Text></TouchableHighlight>		      	
		      	</View>
		       <ActivityIndicator
            animating={resendprocess}
            size="large"
            color='#135AA8'
          />
          <TouchableHighlight style={styles.contentBtn} onPress={()=>sendData()} disabled={disabled}>
	    <LinearGradient  
	        style={styles.priBtn}       
	        colors={['#2270b8', '#74c0ee']}
	        colors={disabled ?  ['#74c0ee', '#74c0ee'] : ['#2270b8', '#74c0ee'] }
	        end={{ x: 1.2, y: 1 }}>
	        <View style={{justifyContent:'center',alignItems:'center',flexDirection:'row',marginLeft:12}}>	
	            <Text style={[styles.priBtnTxt,{flex:7,textAlign:'center'}]}>Verify</Text>
	           
	        </View>    
	    </LinearGradient>
	</TouchableHighlight>
          			
      </View>
    </SafeAreaView>
  );
};



export default Verification;