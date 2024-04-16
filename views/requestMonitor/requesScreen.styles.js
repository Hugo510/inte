import { StyleSheet } from 'react-native';

// Function to normalize size depending on the screen size
export default StyleSheet.create({
    container: {
        flex: 1,
        /* backgroundColor: '#121212', */
      },
      header: {
        alignItems: 'center',
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor: 'grey',
      },
      profilePic: {
        width: 100,
        height: 100,
        borderRadius: 50,
      },
      title: {
        fontSize: 20,
        color: '#fff',
        marginVertical: 10,
      },
      list: {
        padding: 10,
      },
      requestItem: {
        backgroundColor: 'grey',
        padding: 20,
        marginVertical: 8,
        borderRadius: 10,
      },
      requestText: {
        fontSize: 16,
        color: '#fff',
      },
      buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 10,
      },
      acceptButton: {
        backgroundColor: 'green',
        padding: 10,
        borderRadius: 5,
      },
      rejectButton: {
        backgroundColor: 'red',
        padding: 10,
        borderRadius: 5,
      },
      buttonText: {
        color: '#fff',
      },
      // ...otros estilos
    });
    