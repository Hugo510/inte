// helpers/fonts.js
import * as Font from 'expo-font';

export const loadFonts = async () => {
  await Font.loadAsync({
    'WorkSans-Thin': require('../assets/fonts/WorkSans-Thin.ttf'),
    'WorkSans-ExtraLight': require('../assets/fonts/WorkSans-ExtraLight.ttf'),
    'WorkSans-Light': require('../assets/fonts/WorkSans-Light.ttf'),
    'WorkSans-Regular': require('../assets/fonts/WorkSans-Regular.ttf'),
    'WorkSans-Medium': require('../assets/fonts/WorkSans-Medium.ttf'),
    'WorkSans-SemiBold': require('../assets/fonts/WorkSans-SemiBold.ttf'),
    'WorkSans-Bold': require('../assets/fonts/WorkSans-Bold.ttf'),
    'WorkSans-ExtraBold': require('../assets/fonts/WorkSans-ExtraBold.ttf'),
    'WorkSans-Black': require('../assets/fonts/WorkSans-Black.ttf'),
    'WorkSans-ThinItalic': require('../assets/fonts/WorkSans-ThinItalic.ttf'),
    'WorkSans-ExtraLightItalic': require('../assets/fonts/WorkSans-ExtraLightItalic.ttf'),
    'WorkSans-LightItalic': require('../assets/fonts/WorkSans-LightItalic.ttf'),
    'WorkSans-Italic': require('../assets/fonts/WorkSans-Italic.ttf'),
    'WorkSans-MediumItalic': require('../assets/fonts/WorkSans-MediumItalic.ttf'),
    'WorkSans-SemiBoldItalic': require('../assets/fonts/WorkSans-SemiBoldItalic.ttf'),
    'WorkSans-BoldItalic': require('../assets/fonts/WorkSans-BoldItalic.ttf'),
    'WorkSans-ExtraBoldItalic': require('../assets/fonts/WorkSans-ExtraBoldItalic.ttf'),
    'WorkSans-BlackItalic': require('../assets/fonts/WorkSans-BlackItalic.ttf'),
    // Incluye también las fuentes variables si vas a usarlas
    'WorkSans-Variable': require('../assets/fonts/WorkSans-VariableFont_wght.ttf'),
    'WorkSans-VariableItalic': require('../assets/fonts/WorkSans-Italic-VariableFont_wght.ttf'),
  });
  console.log('Fuentes cargadas');
};
