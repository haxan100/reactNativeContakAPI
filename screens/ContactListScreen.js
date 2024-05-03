import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet, TouchableOpacity, Alert, PermissionsAndroid } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFetchBlob from 'rn-fetch-blob';

const ContactListScreen = ({ navigation }) => {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');  // Ambil token dari AsyncStorage
      if (!token) throw new Error("Token not found");
      
      const response = await fetch('http://103.127.135.203:3000/api/contacts', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });  
      if (response.ok) {
        const data = await response.json();
        setContacts(data);  // Pastikan ini di-set dengan benar
      } else {
        throw new Error('Failed to fetch contacts');
      }
    } catch (error) {
      console.error('Error fetching contacts', error);
      Alert.alert('Error', 'Failed to fetch contacts');
    }
  };
  
  const handleExport = async () => {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: "Storage Permission Required",
        message: "This app needs access to your storage to download files."
      }
    );

    if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
      Alert.alert('Error', 'Storage Permission Denied');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) throw new Error("Token not found");

      const url = 'http://103.127.135.203:3000/api/contacts/export'; 
      let dirs = RNFetchBlob.fs.dirs;
      RNFetchBlob.config({
        fileCache: true,
        path: RNFetchBlob.fs.dirs.CacheDir + '/contacts.xlsx'
      })
      .fetch('GET', url, {
        Authorization: `Bearer ${token}`
      })
      .then((res) => {
        console.log('File disimpan di ', res.path());
        Alert.alert('Ekspor Berhasil', 'File telah diunduh ke ' + res.path());
      })
      .catch((error) => {
        console.error('Error saat ekspor kontak', error);
        Alert.alert('Ekspor Gagal', 'Tidak dapat mengekspor kontak saat ini.');
      });
    } catch (error) {
      console.error('Error', error);
      Alert.alert('Export Failed', 'Unable to export contacts at this time.');
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={contacts}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemText}>{item.name}</Text>
            <Text style={styles.itemText}>{item.phone}</Text>
            <Text style={styles.itemText}>{item.email}</Text>
            <View style={styles.buttonContainer}>
              <Button title="Edit" color="#28a745" onPress={() => navigation.navigate('EditContact', { contact: item })}/>
              <Button title="Delete" color="#dc3545" onPress={() => deleteContact(item.id)}/>
            </View>
          </View>
        )}
      />
      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddContact')}>
        <Text style={styles.buttonText}>Add New Contact</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.exportButton} onPress={handleExport}>
        <Text style={styles.buttonText}>Export Contacts</Text>
      </TouchableOpacity>
    </View>
  );

  const deleteContact = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/contacts/deleteContact`, { data: { id } });
      fetchContacts(); // Refresh list after deletion
    } catch (error) {
      console.error('Error deleting contact', error);
      Alert.alert('Error', 'Failed to delete contact');
    }
  };
};

const styles = StyleSheet.create({
    exportButton: {
        backgroundColor: '#007BFF',  // Blue color
        padding: 10,
        margin: 20,
        borderRadius: 5,
        alignItems: 'center',
      },
    container: {
      flex: 1,
      backgroundColor: '#f0f0f0',
    },
    item: {
      backgroundColor: 'white',
      padding: 20,
      marginVertical: 8,
      marginHorizontal: 10,
      borderRadius: 10,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.23,
      shadowRadius: 2.62,
      elevation: 4,
    },
    itemText: {
      fontSize: 16,
      color: '#333',
    },
    button: {
      marginHorizontal: 10,
      backgroundColor: '#007BFF', // Blue color
      padding: 10,
      borderRadius: 5,
      alignItems: 'center',
      justifyContent: 'center',
      elevation: 3,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 1.41,
    },
    buttonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
    },
    addButton: {
      backgroundColor: '#28b715', // Green color
      padding: 10,
      margin: 20,
      borderRadius: 5,
      alignItems: 'center',
    },
  });

export default ContactListScreen;
