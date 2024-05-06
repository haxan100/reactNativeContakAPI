import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet, TouchableOpacity, Alert, PermissionsAndroid } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFetchBlob from 'rn-fetch-blob';
import API_BASE_URL from '../config/apiConfig';

const ContactListScreen = ({ navigation}) => {
  
  const [contacts, setContacts] = useState([]);
  const [exportTombol, setExportTombol] = useState(true);

    useEffect(() => {
      const unsubscribe = navigation.addListener('focus', () => {
        // Panggil fungsi untuk memuat ulang data kontak di sini
        fetchContacts();
      });
  
      return unsubscribe;
    }, [navigation]);


  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    console.log(Date.now()) 
    const url = `${API_BASE_URL}contacts/`; // Menggunakan template string untuk menggabungkan URL dasar dengan endpoint spesifik
    try {
      const token = await AsyncStorage.getItem('userToken');  // Ambil token dari AsyncStorage
      console.log("token=XXXXXXXXX", token);
      if (!token) throw new Error("Token not found");
  
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });  
  
      const jsonResponse = await response.json();  
      if (response.ok) {
        setContacts(jsonResponse.data);  // Use the jsonResponse directly
      } else {
        throw new Error('Failed to fetch contacts');
      }
    } catch (error) {
      console.error('Error fetching contacts?', error);
      Alert.alert('Error', 'Failed to fetch contacts!');
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
      const url = `${API_BASE_URL}contacts/export`; 
      const path = `${RNFetchBlob.fs.dirs.DownloadDir}/contacts${Date.now()}.xlsx`;
      RNFetchBlob.config({
        path: path,
        addAndroidDownloads: {
          useDownloadManager: true,
          notification: true,
          title: `contacts${Date.now()}.xlsx`,
          mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          mediaScannable: true,
          description: 'Downloading file',
          path: path  // Menentukan jalur di sini mungkin tidak diperlukan atau dapat menyebabkan masalah
        }
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
  
  const handleExports = async () => {
    // Minta izin WRITE_EXTERNAL_STORAGE
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
      if (!token) {
        throw new Error("Token not found");
      }
      const url = `${API_BASE_URL}contacts/export`;
      const path = `${RNFetchBlob.fs.dirs.DownloadDir}/contacts.xlsx`;
      RNFetchBlob.config({
        path: path,
        addAndroidDownloads: {
          useDownloadManager: true,
          notification: true,
          title: `contacts.xlsx`,
          mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          mediaScannable: true,
          description: 'Downloading file',
          path: path  // Menentukan jalur di sini mungkin tidak diperlukan atau dapat menyebabkan masalah
        }
      })
      .fetch('GET', url, {
        Authorization: `Bearer ${token}`
      })
      .then((res) => {
        setExportTombol(false)
        console.log('File saved to ', res.path());
        Alert.alert('Export Success', 'File has been downloaded to ' + res.path());
        setTimeout(() => {
          setExportTombol(true)
        }, 5500);
      })
      .catch((error) => {
        console.error('Error exporting contacts', error);
        Alert.alert('Export Failed', `Unable to export contacts at this time: ${error.message}`);
      });
    } catch (error) {
      console.error('Error', error);
      Alert.alert('Export Failed', `Unable to export contacts at this time: ${error.message}`);
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
      {exportTombol && (
        <TouchableOpacity style={styles.exportButton} onPress={handleExport}>
          <Text style={styles.buttonText}>Export Contacts</Text>
        </TouchableOpacity>
      )}
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
