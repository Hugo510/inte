// styles/LoginScreenStyles.js
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    marginBottom: 30,
    color: '#333',
  },
  input: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 20,
    borderRadius: 10,
  },
  buttonContainer: {
    backgroundColor: '#7a42f4',
    padding: 15,
    borderRadius: 10,
    width: '80%',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
  forgotPassword: {
    color: 'blue',
    marginTop: 15,
  },
  or: {
    marginTop: 20,
    marginBottom: 20,
    color: '#333',
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
  },
  socialButton: {
    padding: 15,
    borderRadius: 10,
    width: '40%',
  },
  facebookButton: {
    backgroundColor: '#3b5998',
  },
  twitterButton: {
    backgroundColor: '#00acee',
  },
  socialText: {
    color: '#fff',
    textAlign: 'center',
  },
  signupContainer: {
    marginTop: 20,
    flexDirection: 'row',
  },
  signupText: {
    marginRight: 5,
    color: '#333',
  },
  signupButton: {
    color: 'blue',
  },
});
