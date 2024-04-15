import { Dimensions, Platform, PixelRatio, StyleSheet } from 'react-native';

// Get device screen dimensions
const { width, height } = Dimensions.get('window');

// Based on iPhone 6 scale
const scale = width / 375;

// Function to normalize size depending on the screen size
const normalize = (size) => {
  const newSize = size * scale;
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: normalize(20),
    paddingTop: normalize(10),
  },
  profileContainer: {
    alignItems: 'center',
    marginTop: normalize(20),
  },
  profilePic: {
    width: normalize(120),
    height: normalize(120),
    borderRadius: normalize(50),
  },
  profileName: {
    fontSize: normalize(24),
    fontWeight: 'bold',
    marginTop: normalize(10),
  },
  followButton: {
    flexDirection: 'row',
    backgroundColor: '#FF6F61',
    paddingHorizontal: normalize(20),
    paddingVertical: normalize(5),
    borderRadius: normalize(20),
    marginTop: normalize(10),
    alignItems: 'center',
    justifyContent: 'center',
  },
  followButtonText: {
    color: '#fff',
    fontSize: normalize(16),
    marginLeft: normalize(5),
  },
  contactInfo: {
    fontSize: normalize(16),
    color: '#707070',
    marginTop: normalize(5),
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: normalize(20),
  },
  statBox: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: normalize(22),
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: normalize(16),
    color: '#707070',
  },
  balanceContainer: {
    backgroundColor: '#F8F8F8',
    paddingVertical: normalize(20),
    paddingHorizontal: normalize(20),
    marginHorizontal: normalize(20),
    borderRadius: normalize(10),
    marginTop: normalize(20),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  balanceAmount: {
    fontSize: normalize(24),
    fontWeight: 'bold',
  },
  balanceOrders: {
    fontSize: normalize(20),
    color: '#707070',
  },
  menuContainer: {
    marginTop: normalize(20),
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: normalize(15),
    paddingHorizontal: normalize(20),
  },
  menuText: {
    fontSize: normalize(18),
    marginLeft: normalize(20),
  },
  logoutContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: normalize(15),
    paddingHorizontal: normalize(20),
    marginTop: normalize(20),
  },
  logoutText: {
    fontSize: normalize(18),
    color: 'red',
    marginLeft: normalize(20),
  },
});

export default styles;
