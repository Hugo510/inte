import React from 'react';
import { FlatList, TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

// You should adjust the styles or import them if they are defined in a separate file.
const styles = StyleSheet.create({
  listItem: {
    // Add your styling for the list item here
  },
  listItemText: {
    // Add your styling for the text here
  },
  editButton: {
    // Add your styling for the edit button here
  },
  deleteButton: {
    // Add your styling for the delete button here
  },
  // Add other styles as needed
});

const MonitorRequestListItem = ({ request, onEdit, onDelete }) => {
  const sentDate = new Date(request.sentAt).toLocaleDateString();

  return (
    <View style={styles.listItem}>
      <Text style={styles.listItemText}>{`User: ${request.userId.email}`}</Text>
      <Text style={styles.listItemText}>{`Status: ${request.status}`}</Text>
      <Text style={styles.listItemText}>{`Sent: ${sentDate}`}</Text>
      <TouchableOpacity style={styles.editButton} onPress={() => onEdit(request)}>
        <MaterialIcons name="edit" size={18} color="black" />
        <Text>Edit</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.deleteButton} onPress={() => onDelete(request._id)}>
        <MaterialIcons name="delete" size={18} color="black" />
        <Text>Delete</Text>
      </TouchableOpacity>
    </View>
  );
};

export default function MonitorRequestList({ requests, onEdit, onDelete }) {
  return (
    <FlatList
      data={requests}
      keyExtractor={(item) => item._id.toString()}
      renderItem={({ item }) => (
        <MonitorRequestListItem 
          request={item} 
          onEdit={onEdit} 
          onDelete={onDelete} 
        />
      )}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.listContainer}
    />
  );
}
