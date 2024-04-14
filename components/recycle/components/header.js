import React from 'react';
import { Appbar } from 'react-native-paper';

// Props adicionales podrían incluir métodos de manejo para el botón de búsqueda y más
const CustomHeader = ({ title, navigation, onSearchPress }) => {
  return (
    <Appbar.Header>
      {navigation.canGoBack() && <Appbar.BackAction onPress={() => navigation.goBack()} />}
      <Appbar.Content title={title} style={{ alignItems: 'center' }} />
      <Appbar.Action icon="magnify" onPress={onSearchPress} />
    </Appbar.Header>
  );
};

export default CustomHeader;
