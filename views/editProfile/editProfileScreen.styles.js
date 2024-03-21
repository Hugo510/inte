// HeaderStyles.js
import { StyleSheet, Platform } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
      },
      avatar: {
        alignSelf: 'center',
        margin: 20,
      },
      input: {
        marginBottom: 10,
      },
      button: {
        marginTop: 20,
      },
      errorText: {
        fontSize: 14,
        color: 'red',
        marginLeft: 10,
        marginBottom: 5,
      },
  headerContainer: {
    paddingTop: Platform.OS === 'android' ? 25 : 0, // Additional padding for Android
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#dedede',
    backgroundColor: '#f9f9f9',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20,
    paddingVertical: 15,
  },
  backButton: {
    paddingLeft: 10,
  },
});
