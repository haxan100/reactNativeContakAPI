import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, Button, ScrollView, StyleSheet } from 'react-native';
import { io } from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import jwtDecode from 'jsonwebtoken'; // Import pustaka jsonwebtoken
import {jwtDecode} from 'jwt-decode'; // Impor jwt-decode
import Sound from 'react-native-sound';

const ChatScreen = () => {
  
  const [socket, setSocket] = useState(null);
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [bergabung, setBergabung] = useState('');
  const [userLogin, setUserLogin] = useState('');

  const scrollViewRef = useRef(); // Tambahkan referensi untuk ScrollView
  const playNotificationSound = (url) => {
    const sound = new Sound(url, null, (error) => {
      if (error) {
        console.error('Gagal memuat suara:', error);
        return;
      }
      // Mulai memainkan audio
      sound.play((success) => {
        if (!success) {
          console.error('Gagal memainkan suara notifikasi');
        }
      });
    });
  };
  useEffect(() => {
    // Inisialisasi socket
    const newSocket = io('http://103.127.135.203:8080'); // Ganti dengan alamat server Anda
    setSocket(newSocket);
    fetchToken();
    // Cleanup saat komponen di-unmount
    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, []);

  const fetchToken = async () => {
  try {
    // Ambil token dari AsyncStorage
    const token = await AsyncStorage.getItem('userToken');
    if (!token) {
      throw new Error('Token tidak ditemukan');
    }
    // Dekode token
    const decodedToken = jwtDecode(token);
    console.log("Decoded Token:", decodedToken);
    setUserLogin(decodedToken.username)

  } catch (error) {
    console.error('Error decoding tokenxxx:', error);
  }
};
  

  useEffect(() => {
    if (socket) {
      // Pastikan hanya ada satu event listener per event
      socket.off('chat message').on('chat message', (data) => {
        if(data.sender!=userLogin){
          playNotificationSound('https://cdn.pixabay.com/audio/2022/01/07/audio_ea449d6cea.mp3');
        }
        addMessageToList(data);
      });

      socket.off('user joined').on('user joined', (username) => {
        setBergabung(username);
        setTimeout(() => {
          setBergabung('');
        }, 1900);
        
        playNotificationSound('https://cdn.pixabay.com/audio/2024/02/06/audio_4d73e45600.mp3');
        displayNotification(username + ' bergabung ke dalam chat');
      });
    }
  }, [socket]);

  // Fungsi untuk mengirim pesan
  const sendMessage = () => {
    if (socket && message.trim() !== '') {
      socket.emit('chat message', { sender: userLogin, message });
      setMessage('');
    }
  };
   // Fungsi untuk menandai pesan sebagai telah dibaca
   const markMessageAsRead = (index) => {
    setMessages((prevMessages) => {
      const updatedMessages = [...prevMessages];
      updatedMessages[index].read = true;
      return updatedMessages;
    });
  };


  // Fungsi untuk menambahkan pesan ke daftar pesan
  const addMessageToList = (data) => {
    setMessages((prevMessages) => [...prevMessages, data]);

    // Scroll otomatis ke bawah setelah pesan baru ditambahkan
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  // Fungsi untuk menampilkan notifikasi
  const displayNotification = (message) => {
    console.log(message);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.messageContainer} ref={scrollViewRef}>
        {bergabung && <Text style={styles.bergabung}>{bergabung} bergabung ke dalam chat</Text>}

        {messages.map((msg, index) => (
          <View
            key={index}
            style={msg.sender === userLogin ? styles.myMessage : styles.otherMessage}
            onLayout={() => {
              // Tandai pesan sebagai dibaca jika pengirimnya bukan diri sendiri
              if (msg.sender !== userLogin && !msg.read) {
                markMessageAsRead(index);
              }
            }}
          >
            <Text style={styles.messageText}>
              <Text style={styles.sender}>{msg.sender}: </Text>{msg.message}
            </Text>
            {/* Indikator pesan terbaca */}
            {!msg.read && msg.sender !== userLogin && <Text style={styles.unreadIndicator}>Baru</Text>}
          </View>
        ))}
      </ScrollView>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type your message..."
          value={message}
          onChangeText={setMessage}
        />
        <Button title="Send" onPress={sendMessage} />
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  bergabung: {
    paddingTop: 10,
    fontSize: 22,
    color: 'black',
    textAlign: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    padding: 10,
  },
  messageContainer: {
    flex: 1,
    marginBottom: 20,
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    maxWidth: '75%',
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    maxWidth: '75%',
  },
  messageText: {
    fontSize: 16,
    color: '#000000',
  },
  sender: {
    fontWeight: 'bold',
    color: '#1E1E1E',
  },
  unreadIndicator: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
    textAlign: 'right',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#DDD',
    paddingVertical: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 5,
    marginRight: 10,
    paddingHorizontal: 10,
    backgroundColor: '#FFFFFF',
    color: '#000000',
  },
});

export default ChatScreen;
