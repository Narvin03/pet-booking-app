import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import logo from '../images/petBookingLogo.jpg';
import Iconicons from 'react-native-vector-icons/Ionicons';
import SQLite, {Transaction} from 'react-native-sqlite-storage';

SQLite.enablePromise(true);
SQLite.DEBUG(true);

export default function Register({navigation}: any) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    if (!username || !email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      const db = await SQLite.openDatabase({
        name: 'db.sqlite',
        location: 'default',
        createFromLocation: '~db.sqlite',
      });
      await db.transaction((tx: Transaction) => {
        tx.executeSql(
          'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
          [username.trim(), email.trim(), password],
          (tx, results) => {
            if (results.rowsAffected > 0) {
              Alert.alert('Success', 'Registration successful! Please log in.');
              navigation.replace('Login');
            } else {
              Alert.alert('Error', 'Registration failed');
            }
          },
          error => {
            console.log('Registration Error: ', error);
            Alert.alert('Error', 'Database error occurred');
          },
        );
      });
    } catch (error) {
      console.log('Database Error: ', error);
      Alert.alert('Error', 'Could not open database');
    }
  };
  return (
    <View style={styles.container}>
      <Image source={logo} style={styles.logo} />
      <Text style={styles.title}>Register</Text>
      <View style={styles.inputContainer}>
        <Iconicons name="mail-outline" size={25} style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Name"
          keyboardType="default"
          autoCapitalize="words"
          value={username}
          onChangeText={text => setUsername(text)} // Update Username
        />
      </View>
      <View style={styles.inputContainer}>
        <Iconicons name="mail-outline" size={25} style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={text => setEmail(text)} // Update Email
        />
      </View>

      <View style={styles.inputContainer}>
        <Iconicons name="lock-closed-outline" size={25} style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry={true}
          value={password}
          onChangeText={text => setPassword(text)} //Update password
        />
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={handleRegister} //call the register function
      >
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.replace('Login')}>
        <Text style={styles.signUp}>
          Already have an account? <Text style={styles.signUpLink}>Login</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  logo: {
    height: 200,
    width: 200,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    marginBottom: 40,
    fontWeight: 'bold',
    color: 'black',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 50,
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: '100%',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 20,
    color: '#000',
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#1E90FF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  signUp: {
    color: '#000',
  },
  signUpLink: {
    color: '#1E90FF',
  },
  errorText: {
    color: 'red',
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
});
