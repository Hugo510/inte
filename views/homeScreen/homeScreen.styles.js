import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'space-between',
  },
  header: {
    marginTop: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  brand: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  nav: {
    flexDirection: 'row',
  },
  navItem: {
    color: '#fff',
    paddingHorizontal: 8,
    // Add additional styling
  },
  searchSection: {
    paddingHorizontal: 20,
  },
  searchInput: {
    height: 40,
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    color: '#fff',
  },
  searchButton: {
    backgroundColor: '#00cec9',
    borderRadius: 5,
    marginVertical: 10,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButtonText: {
    color: '#fff',
    // Add additional styling
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    backgroundColor: 'rgba(0,0,0,0.1)',
    paddingVertical: 10,
  },
  footerText: {
    // Add styling
  },
  newsletterSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  newsletterInput: {
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    flex: 1,
    marginRight: 10,
    // Add additional styling
  },
  subscribeButton: {
    backgroundColor: '#00cec9',
    borderRadius: 5,
    justifyContent: 'center',
    padding: 10,
  },
  subscribeButtonText: {
    color: '#fff',
    // Add additional styling
  },
});
