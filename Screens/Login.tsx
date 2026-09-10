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

export default function Login({navigation}: any) {
  //State for input fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  //Handle the Login Function
  const handleLogin = async () => {
    //Check if user typed in anything in both fields
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      //Open the database
      const db = await SQLite.openDatabase({
        name: 'db.sqlite',
        location: 'default',
        createFromLocation: '~db.sqlite',
      });
      console.log('DB opened: ', db);

      await db.transaction((tx: Transaction) => {
        tx.executeSql(
          'SELECT * FROM users WHERE email = ? AND password = ?',
          [email.trim(), password], //values for the sql query
          (tx, results) => {
            if (results.rows.length > 0) {
              const user = results.rows.item(0); //to get the first (and only) user found
              Alert.alert('Success', `Welcome back, ${user.username}!`);
              // Here you would navigate to the Home screen:
              navigation.replace('Main', {userId: user.id});
            } else {
              //No user found
              Alert.alert('Error', 'Invalid email or password');
            }
          },
          //If any error is found or table doesn't exist, this will run
          error => {
            console.log('Login Error: ', error);
            Alert.alert('Error', 'Database error occurred');
          },
        );
      });
    } catch (error) {
      console.error('Database failed to open: ', error);
      Alert.alert('Error', 'Failed to open database');
    }
  };

  return (
    <View style={styles.container}>
      <Image source={logo} style={styles.logo} />
      <Text style={styles.title}>Login</Text>
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
        onPress={handleLogin} //call the login function
      >
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.replace('Register')}>
        <Text style={styles.signUp}>
          Don't have an account? <Text style={styles.signUpLink}>Register</Text>
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
