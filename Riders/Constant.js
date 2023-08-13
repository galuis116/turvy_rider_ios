import { StyleSheet } from "react-native";
import { configureFonts, DefaultTheme } from "react-native-paper";
//export const DOMAIN = 'http://localhost/react-native/turvy/';
//export const DOMAIN = 'https://jokojo.com/turvy/';
export const DOMAIN = "https://www.turvy.net/";
export const PrimaryColor = "#000073";

//GET PUSHER API KEYS
export const PUSHER_API = {
  APP_KEY: "389d667a3d4a50dc91a6",
  APP_CLUSTER: "ap2",
};

export const dummyPhone = "7709048573";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    width: "100%",
  },
  content: { padding: 15 },
  pickerStyle: {
    borderRadius: 20,
    backgroundColor: "#FFF",
    padding: 20,
    margin: 10,
  },
  strong: { fontWeight: "bold", fontSize: 16 },
  h1: { fontSize: 18, textAlign: "center" },
  h1Bold: { fontSize: 25, textAlign: "center" },
  space: { height: 10 },
  space30: { height: 30 },
  smallText: {
    textAlign: "center",
    fontSize: 15,
    lineHeight: 25,
    color: "gray",
  },
  btn: { width: "100%", borderRadius: 60, padding: 5 },
  inputStyle: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#cecece",
    borderRadius: 40,
    padding: 10,
    paddingLeft: 20,
    overflow: "hidden",
    color: "#8c8c8c",
    fontFamily: "Metropolis-Regular",
  },
  pickerContainer: {
    height: 45,
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#cecece",
    borderRadius: 40,
    paddingLeft: 20,
    paddingVertical: 5,
    marginLeft: 10,
    marginRight: 10,
    fontFamily: "Metropolis-Regular",
  },
  imageSelectorContainer: {
    // backgroundColor: "#FFF",
    // borderWidth: 1,
    // height: 300,
    borderColor: "#cecece",
    borderRadius: 40,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 30,
    alignItems: "center",
    fontFamily: "Metropolis-Regular",
  },
  marginTop20: { marginTop: 20 },
  marginTop10: { marginTop: 10 },
  inputContainerStyle: { borderBottomWidth: 0 },
  themetextcolor: { color: "#3f78ba", fontFamily: "Metropolis-Regular" },
  text8: { fontSize: 8, fontFamily: "Metropolis-Regular" },
  error: { color: "red", fontSize: 12 },
  paddingLeft10: { paddingLeft: 10 },
  contentBtn: {
    backgroundColor: "#2270b8",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    borderRadius: 50,
  },
  priBtn: {
    flex: 1,
    padding: 13,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 45,
  },
  priBtnTxt: {
    color: "#FFF",
    fontSize: 16,
    textTransform: "capitalize",
    letterSpacing: 2,
    fontFamily: "Metropolis-Regular",
  },
  pickerIcon: {
    position: "absolute",
    bottom: 15,
    right: 10,
    fontSize: 20,
  },
  ubarFont: {
    fontFamily: "Metropolis-Regular",
  },
});

export const stylesdp = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 40,
  },
  dropdown: {
    backgroundColor: "white",
    borderBottomColor: "gray",
    borderBottomWidth: 0,
    width: "96%",
    // marginTop: 10,
    fontSize: 16,
    paddingLeft: 15,
    // fontWeight: 100,
  },
  icon: {
    marginRight: 5,
    width: 33,
    height: 33,
  },
  item: {
    paddingVertical: 17,
    paddingHorizontal: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    fontSize: 16,
  },
  textItem: {
    flex: 1,
    fontSize: 16,
    // color: "#000",
    // fontWeight: 100,
    color: "#1f71bd",
    fontFamily: "Metropolis-Regular",
  },
  placeholderStyle: {
    fontSize: 16,
    color: "#1f71bd",
    fontFamily: "Metropolis-Regular",
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    paddingLeft: 10,
  },
});

const fontConfig = {
  web: {
    regular: {
      fontFamily: "Metropolis-Regular",
      fontWeight: "normal",
    },
    medium: {
      fontFamily: "Metropolis-Medium",
      fontWeight: "normal",
    },
    light: {
      fontFamily: "Metropolis-Light",
      fontWeight: "normal",
    },
    thin: {
      fontFamily: "Metropolis-ExtraLight",
      fontWeight: "normal",
    },
  },
  ios: {
    regular: {
      fontFamily: "Metropolis-Regular",
      fontWeight: "normal",
    },
    medium: {
      fontFamily: "Metropolis-Medium",
      fontWeight: "normal",
    },
    light: {
      fontFamily: "Metropolis-Light",
      fontWeight: "normal",
    },
    thin: {
      fontFamily: "Metropolis-ExtraLight",
      fontWeight: "normal",
    },
  },
  android: {
    regular: {
      fontFamily: "Metropolis-Regular",
      fontWeight: "normal",
    },
    medium: {
      fontFamily: "Metropolis-Medium",
      fontWeight: "normal",
    },
    light: {
      fontFamily: "Metropolis-Light",
      fontWeight: "normal",
    },
    thin: {
      fontFamily: "Metropolis-ExtraLight",
      fontWeight: "normal",
    },
  },
};

export const theme = {
  ...DefaultTheme,
  fonts: configureFonts(fontConfig),
  colors: {
    ...DefaultTheme.colors,
    primary: "#3f78ba",
    accent: "#3f78ba",
    text: "#111",
    surface: "#FFF",
    background: "#fff",
  },
};

export const debug = (string) => {
  return JSON.stringify(string, null, 2);
};
