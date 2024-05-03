// screens/EditContactScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import axios from 'axios';

const EditContactScreen = ({ route, navigation }) => {
  const { contact } = route.params;
  const [name, setName] = useState(contact.name);
  const [phone, setPhone] = useState(contact.phone);
  const [email, setEmail] = useState(contact.email);

  const updateContact = async () => {
    try {
      await axios.put(`http://localhost:3000/api/contacts/updateContact`, { id: contact.id, name, phone, email });
      navigation.goBack(); // Go back to contact list after updating
    } catch (error) {
      console.error('Failed to update contact', error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput placeholder="Name" value={name} onChangeText={setName} style={styles.input} />
      <TextInput placeholder="Phone" value={phone} onChangeText={setPhone} style={styles.input} />
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} />
      <Button title="Update Contact" onPress={updateContact} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20
  },
  input: {
    marginBottom: 12,
    borderWidth: 1,
    padding: 8
  }
});

export default EditContactScreen;
