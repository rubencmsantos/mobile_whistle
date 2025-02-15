import React, { Component } from 'react';
import { AppRegistry, ListView, AlertIOS ,StyleSheet, AppState, Modal ,Text, View, Image, KeyboardAvoidingView, TextInput, Button, TouchableHighlight, Alert, TouchableOpacity } from 'react-native';
import { StackNavigator, NavigationActions } from 'react-navigation';
import { List, Icon } from 'react-native-elements';
import Menu from '../Screens/Menu';
import Account from '../Screens/Settings/Account';
import Notifications from '../Screens/Settings/Notifications';
import About from '../Screens/Settings/About';
import Contacts from '../Screens/Settings/Contacts';
import Help from '../Screens/Settings/Help';
import NotificationDetail from '../Screens/NotificationDetail';
import SelectedProfile from '../Screens/Profile/SelectedProfile';
import PushController from '../PushController'
import SettingsScreen from '../Screens/SettingsScreen';
import api from '../Screens/api';
import PushNotification from 'react-native-push-notification';

export default class Login extends Component {
  static navigationOptions = {
    title: '',
    headerStyle: {
      backgroundColor: '#FFCC00'
    },
    headerTitleStyle: {
      color: '#000',
      textAlign: 'center'
    }
  };
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,  
      text: '', seconds: 5,
      usernameinput: '', pass: '',
      recoveryinput: ''
    };
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  _pressAcceptReason() {
    this.setModalVisible(false);
  }

  _onPressButton() {
    api.refereeExists(this.state.usernameinput, this.state.passwordinput).then((resref) => {

      if(typeof resref.error === 'undefined'){
        this.reset();}
      else{
        this.refs.PasswordInput.setNativeProps({ text: '' });
        setTimeout(() => {
          Alert.alert(
            'Invalid credentials',
            'Try again',
            [
              { text: 'OK', onPress: () => console.log('OK pressed'), style: 'cancel' }
            ],
            { cancelable: false })},1000)
        }
    })
  }

  timealert() {

      setTimeout(() => {
        Alert.alert(
          'An email has been sent',
          'Check your inbox',
          [
            { text: 'OK', onPress: () => console.log('OK pressed'), style: 'cancel' }
          ],
          { cancelable: false }
        );
      }, 100)


    
  }

  mountModal() {
    
    return(
    <Modal
      animationType={"slide"}
      transparent={true}
      visible={this.state.modalVisible}
      onRequestClose={() => { alert("Modal has been closed.") }}
    >
        <View style={styles.overlay}>

        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
          <View style={styles.modalHeader}>
            <Text style={styles.headermodal}>Recover Password</Text>
          </View>
          <View style={styles.modalBody}>
              <TextInput underlineColorAndroid='transparent'
                ref="RecoveryInput"
                autoCorrect={false}
                style={styles.recoverInputSection}
                blurOnSubmit={false} 
                autoFocus ={true}
                autoCapitalize="none"
                keyboardType="email-address"
                placeholder="EMAIL"
                placeholderTextColor="#FFF" 
                returnKeyType="default"
                onChangeText={(recoveryinput) => this.setState({ recoveryinput })}
                value={this.state.recoveryinput}
                onSubmitEditing={(event) => {this.setModalVisible(!this.state.modalVisible) }}
              />
          </View>
            <View style={styles.modalFooter}>
              <View style={styles.modalbuttoncontainer}>
                <TouchableOpacity style={styles.modalButtons} onPress={() => { this.setModalVisible(!this.state.modalVisible) }} underlayColor="#2b2b2b">
                  <Icon color="white" name="close" size={40} type="MaterialCommunityIcons" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalButtons} onPress={() => { this.setModalVisible(!this.state.modalVisible), this.timealert() }} underlayColor="#2b2b2b">
                  <Icon color="white" name="send" size={40} type="material-icons" />
                </TouchableOpacity>
              </View>
              </View>
            </View>

        </View>
      </View>

    </Modal>

    )
  }


  reset(){
    return this.props
               .navigation
               .dispatch(NavigationActions.reset(
                 {
                    index: 0,
                    actions: [
                      NavigationActions.navigate({ routeName: 'Menu', params: { refereeid:"5a74b09292f00d13dde6a099"}})
                    ]
                  }));
  }

  componentDidMount(){
    AppState.addEventListener('change', this._handleAppStateChange);

  }

  componentWillMount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  _handleAppStateChange = (nextAppState) => {
    if (AppState === 'background') {
      PushNotification.localNotificationSchedule({
        message: "My Notification Message", // (required)
        date: new Date(Date.now() + (this.state.seconds * 1000)) // in 60 secs
      });
    }
    {/*if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      console.log('App has come to the foreground!')
    }
  this.setState({appState: nextAppState});*/}
  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
    
       {this.mountModal()}
      
      <KeyboardAvoidingView behavior="padding" style={styles.container}>

        <Image style={styles.logo} source={require('../../images/blacktext.png')} />

        <View style={styles.formContainer}>
          <View>
            <TextInput underlineColorAndroid='transparent'
              ref="UsernameInput"
              autoCorrect={false}
              style={styles.textInputSection}
              placeholder="USERNAME"
              returnKeyType="next"
              onChangeText={(usernameinput) => this.setState({ usernameinput })}
              value={this.state.usernameinput}
              keyboardType="email-address"
              autoCapitalize="none"
              onSubmitEditing={(event) => { this.refs.PasswordInput.focus(); }}
            />

            <TextInput underlineColorAndroid='transparent'
              ref = "PasswordInput"
              autoCorrect={false}
              autoCapitalize="none"
              style={styles.textInputSection}
              secureTextEntry={true}
              placeholder="PASSWORD"
              returnKeyType="done"
              onChangeText={(passwordinput) => this.setState({ passwordinput })}
              value={this.state.passwordinput}
            />
          </View>
          <View style={styles.buttonView}>
              <TouchableHighlight onPress={() => this._onPressButton()} underlayColor="#FFCC00">
              <View style={styles.button}>
                <Text style={styles.buttonText}>LOGIN</Text>
              </View>
            </TouchableHighlight>
            <TouchableHighlight style={styles.forgot} onPress={() => this.setModalVisible(true)} underlayColor="#FFCC00">
              <Text style={styles.inc}> Forgot your password? </Text>
            </TouchableHighlight>
          </View>
        </View>
        <PushController />
      </KeyboardAvoidingView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#FFCC00'
  },

  title: {
    textAlign: 'center',
    color: '#2c3e50',
    fontWeight: 'bold',
    fontSize: 40,
    padding: '20%'
  },

  logo: {
    flex: 1,
    marginTop: '30%',
    aspectRatio: 2.1,
    resizeMode: 'cover'
  },

  formContainer: {
    marginTop: '10%'
  },

  textInputSection: {
    width: '100%',
    marginTop: '5%',
    padding: '5%',
    alignItems: 'center',
    textAlign: 'center',
    alignSelf: 'center',
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 10
  },

  recoverInputSection: {
    width: '94%',
    padding: '6%',
    textAlign: 'center',
    color: 'white',
    textAlignVertical: 'top',
    backgroundColor: '#2b2b2b',
    borderRadius: 5
  },

  buttonView: {
    marginTop: '7%',
    alignItems: 'center',
    marginBottom: '3%'
  },

  button: {
    borderRadius: 10,
    padding: '2%',
    justifyContent: 'center',
    backgroundColor: '#1a1a1a',
    paddingHorizontal: '30%'
  },

  buttonText: {
    textAlign: 'center',
    padding: 10,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFCC00',
    opacity: 0.8
  },

  password: {
    textAlign: 'center',
    marginTop: '10%',
    opacity: 0.8
  },
  inc: {
    marginTop: '10%',
    textAlign: 'center',
    color: '#1a1a1a',
    fontSize: 15,
  },
  modalContainer: {
    backgroundColor: '#1a1a1a',
    marginTop: '30%',
    margin: 15,

  },

  modalView: {
  },

  modalBody: {
    margin: '5%',
    flexDirection: 'column',
    alignItems: "center"
  },

  modalFooter: {
    margin: '5%',
  },
  text: {
    margin: '8%',
    fontSize: 20,
    color: 'white'
  },

  separator: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#8E8E8E',
  },

  headermodal: {
    color: 'white',
    margin: '5%',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: "center"
  },

  forgot:{
    marginTop: '1%'
  },

  modalbuttoncontainer: {
    padding: "3%",
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#1a1a1a'
  },

  modalFooter: {
    margin: '5%',
    marginTop: '5%',
    marginBottom: '10%'

  },

  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.8)'
  }
})

const navigator = StackNavigator({
  Home: { screen: Login },
  Menu: { screen: Menu },
  Account: { screen: Account },
  Help: { screen: Help },
  Contacts: { screen: Contacts },
  Notifications: { screen: Notifications },
  About: { screen: About },
  NotificationDetail: { screen: NotificationDetail },
  SelectedProfile: { screen: SelectedProfile },
})

// skip this line if using Create React Native App
AppRegistry.registerComponent('Whistle', () => navigator);