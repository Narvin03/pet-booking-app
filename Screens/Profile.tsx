import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
} from 'react-native';
import logo from '../images/petBookingLogo.jpg';
import Icon from 'react-native-vector-icons/Ionicons';
import SQLite, {Transaction} from 'react-native-sqlite-storage';
import {launchImageLibrary} from 'react-native-image-picker';
import defaultAvatar from '../images/petBookingLogo.jpg'; //original logo as default profile pic

SQLite.enablePromise(true);

export default function Profile({route, navigation}: any) {
  //grab ID passed from Login
  const userId = route.params?.userId;

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    console.log('Current userId passed to Profile:', userId);

    if (!userId) {
      console.warn('No userId provided! Defaulting to empty fields.');
      return;
    }
    const fetchUser = async () => {
      const db = await SQLite.openDatabase({
        name: 'db.sqlite',
        location: 'default',
        createFromLocation: '~db.sqlite',
      });

      const [results] = await db.executeSql(
        'SELECT username, email, profile_pic FROM users WHERE id = ?',
        [userId],
      );

      console.log('Rows found in DB:', results.rows.length); // <-- IF THIS IS 0, THAT'S THE PROBLEM

      if (results.rows.length > 0) {
        const user = results.rows.item(0);
        setUsername(user.username);
        setEmail(user.email);
        setProfilePic(user.profile_pic);
      }
    };
    fetchUser();
  }, [userId]);

  //Change Image function
  const pickImage = () => {
    if (!isEditing) {
      return; //Only allow picking image if in Edit Mode
    }
    launchImageLibrary({mediaType: 'photo', quality: 0.5}, response => {
      if (response.assets && response.assets[0].uri) {
        setProfilePic(response.assets[0].uri);
      }
    });
  };

  const handleSave = async () => {
    const db = await SQLite.openDatabase({
      name: 'db.sqlite',
      location: 'default',
      createFromLocation: '~db.sqlite',
    });

    //Update user info
    await db.executeSql(
      'UPDATE users SET username = ?, email = ?, profile_pic = ? WHERE id = ?',
      [username, email, profilePic, userId],
    );

    Alert.alert('Success', 'Profile information has been updated!');
    setIsEditing(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/*Profile Header Card*/}
      <View style={styles.headerCard}>
        <View style={styles.headerBackground}>
          <TouchableOpacity
            onPress={pickImage}
            disabled={!isEditing}
            style={styles.avatarContainer}>
            <Image
              source={profilePic ? {uri: profilePic} : defaultAvatar}
              style={[styles.avatar, isEditing && styles.editingAvatar]}
            />
            {isEditing && (
              <View style={styles.cameraOverlay}>
                <Icon name="camera" size={24} color="#fff" />
              </View>
            )}
          </TouchableOpacity>
          <Text style={styles.displayName}>{username || 'User'}</Text>
          <Text style={styles.userStatus}>
            {isEditing ? 'Editing Profile' : 'User Account'}
          </Text>
        </View>
      </View>

      {/*Form Fields Card*/}
      <View style={styles.formCard}>
        <View style={styles.formRow}>
          <Icon
            name="person-circle-outline"
            size={24}
            color="#1E90FF"
            style={styles.formIcon}
          />
          <View style={styles.formField}>
            <Text style={styles.label}>Username</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.disabledInput]}
              value={username}
              onChangeText={setUsername}
              editable={isEditing}
              placeholder="Enter your username"
              placeholderTextColor="#bbb"
            />
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.formRow}>
          <Icon
            name="mail-outline"
            size={24}
            color="#1E90FF"
            style={styles.formIcon}
          />
          <View style={styles.formField}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.disabledInput]}
              value={email}
              onChangeText={setEmail}
              editable={isEditing}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder="Enter your email"
              placeholderTextColor="#bbb"
            />
          </View>
        </View>
      </View>

      {/**Action Buttons*/}
      <View style={styles.footer}>
        {!isEditing ? (
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setIsEditing(true)}>
            <Icon
              name="pencil"
              size={20}
              color="#fff"
              style={{marginRight: 10}}
            />
            <Text style={styles.buttonText}>Edit Profile</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.editActions}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setIsEditing(false)}>
              <Icon
                name="close"
                size={20}
                color="#ff6b6b"
                style={{marginRight: 8}}
              />
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Icon
                name="checkmark"
                size={20}
                color="#fff"
                style={{marginRight: 8}}
              />
              <Text style={styles.buttonText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Logout Button */}
      <View style={styles.logoutContainer}>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => navigation.navigate('Login')}>
          <Icon
            name="log-out-outline"
            size={20}
            color="#fff"
            style={{marginRight: 10}}
          />
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f5f7fa',
    paddingVertical: 20,
  },
  headerCard: {
    marginHorizontal: 15,
    marginBottom: 15,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#1E90FF',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  headerBackground: {
    backgroundColor: '#1E90FF',
    paddingVertical: 25,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#fff',
    borderWidth: 4,
    borderColor: '#fff',
  },
  editingAvatar: {
    opacity: 0.8,
    borderColor: '#FFD700',
  },
  cameraOverlay: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  displayName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 5,
  },
  userStatus: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  formCard: {
    marginHorizontal: 15,
    marginBottom: 25,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  formRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
  },
  formIcon: {
    marginRight: 15,
    marginTop: 8,
  },
  formField: {
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 5,
  },
  label: {
    color: '#555',
    fontSize: 13,
    marginBottom: 8,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    width: '100%',
    height: 48,
    backgroundColor: '#f9fafb',
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 16,
    color: '#333',
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
  },
  disabledInput: {
    backgroundColor: '#f5f5f5',
    borderColor: '#f0f0f0',
    color: '#888',
  },
  footer: {
    marginHorizontal: 15,
    marginBottom: 15,
  },
  editButton: {
    backgroundColor: '#1E90FF',
    flexDirection: 'row',
    height: 56,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#1E90FF',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    height: 56,
    borderRadius: 14,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    elevation: 4,
    shadowColor: '#4CAF50',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 5,
  },
  cancelButton: {
    height: 56,
    borderRadius: 14,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#ff6b6b',
    flexDirection: 'row',
  },
  editActions: {
    flexDirection: 'row',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  cancelText: {
    color: '#ff6b6b',
    fontSize: 16,
    fontWeight: '600',
  },
  logoutContainer: {
    marginHorizontal: 15,
    marginTop: 10,
  },
  logoutButton: {
    backgroundColor: '#FF6B6B',
    flexDirection: 'row',
    height: 56,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    elevation: 5,
    shadowColor: '#FF6B6B',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
});
