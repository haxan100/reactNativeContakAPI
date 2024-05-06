import React, { useState } from 'react';
import { View, Button, Text, Alert, StyleSheet } from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import RNFetchBlob from 'rn-fetch-blob';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API_BASE_URL from '../config/apiConfig';

const ImportExcelScreen = ({navigation}) => {
  const [file, setFile] = useState(null);

  const pickFile = async () => {
    try {
      const results = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],  // Filter untuk semua jenis file
      });

      const res = results[0];  // Mengambil file pertama dari hasil jika picker mengizinkan multiselection
      console.log('Picked file:', res);

      if (res) {
        setFile(res); 
      } else {
        Alert.alert('File Selected', 'No file selected');
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        Alert.alert('Cancelled', 'User cancelled the picker.');
      } else {
        Alert.alert('Error', `Unknown Error: ${err}`);
        console.error(err);  // Log any other errors to console for debugging
      }
    }
  };

  const uploadFile = async () => {
    if (!file) {
      Alert.alert('Error', 'Please pick a file first!');
      return;
    }
  
    const token = await AsyncStorage.getItem('userToken');
    const url = `${API_BASE_URL}contacts/importContacts`;
  
    // Membuat FormData secara manual
    let formData = [
      { name: 'file', filename: file.name, type: file.type, data: RNFetchBlob.wrap(file.uri.replace('file://', '')) }
    ];
    console.log("xxxxxxxxxxxxxxxxxxxxxxx")
    console.log(formData)
    console.log("xxxxxxxxxxxxxxxxxxxxxxx")
    RNFetchBlob.fetch('POST', url, {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    }, formData)
    .then((response) => {
        console.log("rrrrrrrrrrrrrrrrrr")
        console.log(response)
        console.log("RRRRRRRRRRRRRRRRRRRRR")
      const status = response.info().status;
  
      if (status === 200) {
        console.log('Upload successful', response.text());
        Alert.alert('Success', 'File uploaded successfully!');
        navigation.navigate('Contacts')
        setFile(null);
      } else {
        throw new Error('Server error!');
      }
    })
    .catch((error) => {
      console.error('Error uploading file', error);
      Alert.alert('Upload Failed', 'Failed to upload file: ' + error.message);
    });
  };

  return (
    <View style={styles.container}>
      <Button title="Pick Excel File" onPress={pickFile} />
      <Text style={styles.fileName}>{file ? `Selected: ${file.name}` : 'No file selected'}</Text>
      <Button title="Upload File" onPress={uploadFile} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  fileName: {
    marginVertical: 20,
    color:'red'
  },
});

export default ImportExcelScreen;
