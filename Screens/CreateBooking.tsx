import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import SQLite from 'react-native-sqlite-storage';
import Iconicons from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import HotelBookingForm from '../components/HotelBookingForm';
import GroomBookingForm from '../components/GroomBookingForm';
import VetBookingForm from '../components/VetBookingForm';

SQLite.enablePromise(true);

export default function CreateBookingScreen({route, navigation}: any) {
  //To get userId from login screen
  const userId = route.params?.userId;

  //Set the form state to hotel booking by default
  const [activeForm, setActiveForm] = useState<'hotel' | 'groom' | 'vet'>(
    'hotel',
  );
  const [petType, setPetType] = useState('');

  //Date states (different types for different forms)
  const [singleDate, setSingleDate] = useState(new Date()); //For groom bookings and appointments
  const [hotelStartDate, setHotelStartDate] = useState(new Date()); //For hotel
  const [hotelEndDate, setHotelEndDate] = useState(new Date()); //For hotel

  //Controls the date picker popup visibility
  const [showPicker, setShowPicker] = useState(false);
  const [pickerMode, setPickerMode] = useState<'date' | 'time'>('date');
  const [activeDateField, setActiveDateField] = useState<
    'single' | 'start' | 'end' | null
  >(null);

  //Helper function to format date JS date to YYYY-MM-DD
  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  //Date picker
  const openPicker = (
    field: 'single' | 'start' | 'end',
    mode: 'date' | 'time',
  ) => {
    setActiveDateField(field);
    setPickerMode(mode);
    setShowPicker(true);
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    //Hide the picker immediately after date selection
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }

    if (selectedDate) {
      if (activeDateField === 'single') {
        setSingleDate(selectedDate);
      }
      if (activeDateField === 'start') {
        setHotelStartDate(selectedDate);
      }
      if (activeDateField === 'end') {
        setHotelEndDate(selectedDate);
      }
    }
  };

  //Handle form submissions
  const handleBooking = async () => {
    try {
      const db = await SQLite.openDatabase({
        name: 'db.sqlite',
        location: 'default',
        createFromLocation: '~db.sqlite',
      });

      if (activeForm === 'hotel') {
        if (!hotelStartDate || !hotelEndDate) {
          return Alert.alert('Error', 'Please fill in all fields.');
        } else if (hotelStartDate >= hotelEndDate) {
          return Alert.alert(
            'Error',
            'Check-out date must be after check-in date.',
          );
        }
        await db.executeSql(
          'INSERT INTO hotelBookings (userId, bookDateStart, bookDateEnd) VALUES (?, ?, ?)',
          [userId, formatDate(hotelStartDate), formatDate(hotelEndDate)],
        );
      } else if (activeForm === 'groom') {
        if (!petType || !singleDate) {
          return Alert.alert('Error', 'Please fill in all fields.');
        }
        await db.executeSql(
          'INSERT INTO groomBookings (userId, petType, bookDate) VALUES (?, ?, ?)',
          [userId, petType, formatDate(singleDate)],
        );
      } else if (activeForm === 'vet') {
        if (!singleDate) {
          return Alert.alert('Error', 'Please fill in all fields.');
        }
        await db.executeSql(
          'INSERT INTO appointments (userId, bookDate) VALUES (?, ?)',
          [userId, formatDate(singleDate)],
        );
      }

      //Success message and to reset form and active state
      Alert.alert('Success!', 'Your booking has been made.', [
        //Go back to previous screen after booking completed
        {text: 'OK', onPress: () => navigation.goBack()},
      ]);
    } catch (error) {
      console.error('Booking error: ', error); //for troubleshoot purpose
      Alert.alert('Error', 'An error occurred while making the booking.');
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      {/**Custom header with back button */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Iconicons name="close" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Booking</Text>
        <View style={{width: 28}} />
        {/**To center title*/}
      </View>

      <ScrollView contentContainerStyle={{padding: 20}}>
        {/**Segmented Control to choose form/booking type*/}
        <View style={styles.segmentedControl}>
          {/**hotel booking (default)*/}
          <TouchableOpacity
            style={[
              styles.segment,
              activeForm === 'hotel' && styles.activeSegment,
            ]}
            onPress={() => setActiveForm('hotel')}>
            <Text
              style={[
                styles.segmentText,
                activeForm === 'hotel' && styles.activeSegmentText,
              ]}>
              Hotel
            </Text>
          </TouchableOpacity>

          {/**pet grooming booking (default)*/}
          <TouchableOpacity
            style={[
              styles.segment,
              activeForm === 'groom' && styles.activeSegment,
            ]}
            onPress={() => setActiveForm('groom')}>
            <Text
              style={[
                styles.segmentText,
                activeForm === 'groom' && styles.activeSegmentText,
              ]}>
              Pet Grooming
            </Text>
          </TouchableOpacity>

          {/**vet appointment booking (default)*/}
          <TouchableOpacity
            style={[
              styles.segment,
              activeForm === 'vet' && styles.activeSegment,
            ]}
            onPress={() => setActiveForm('vet')}>
            <Text
              style={[
                styles.segmentText,
                activeForm === 'vet' && styles.activeSegmentText,
              ]}>
              Appointment
            </Text>
          </TouchableOpacity>
        </View>

        {/**Booking forms*/}
        <View style={styles.formContainer}>
          {activeForm === 'hotel' && (
            <HotelBookingForm
              hotelStartDate={hotelStartDate}
              hotelEndDate={hotelEndDate}
              openPicker={openPicker}
              formatDate={formatDate}
            />
          )}

          {/**Grooming Form */}
          {activeForm === 'groom' && (
            <GroomBookingForm
              petType={petType}
              setPetType={setPetType}
              singleDate={singleDate}
              openPicker={openPicker}
              formatDate={formatDate}
            />
          )}

          {/*Vet Form */}
          {activeForm === 'vet' && (
            <VetBookingForm
              singleDate={singleDate}
              openPicker={openPicker}
              formatDate={formatDate}
            />
          )}

          {/**Submit Button */}
          <TouchableOpacity style={styles.submitButton} onPress={handleBooking}>
            <Text style={styles.submitText}>Confirm Booking</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/*Date picker component */}
      {showPicker && (
        <DateTimePicker
          value={
            activeDateField === 'single'
              ? singleDate
              : activeDateField === 'start'
              ? hotelStartDate
              : hotelEndDate
          }
          mode={pickerMode}
          display="default"
          onChange={onDateChange}
          minimumDate={new Date()} //Prevents booking in the past
        />
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  backButton: {
    padding: 5,
  },

  // Segmented Control Styles
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    padding: 4,
    marginBottom: 25,
  },
  segment: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeSegment: {
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 2,
    shadowOffset: {width: 0, height: 1},
  },
  segmentText: {
    color: '#666',
    fontWeight: '600',
    fontSize: 15,
  },
  activeSegmentText: {
    color: '#1E90FF',
    fontWeight: 'bold',
  },

  formContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    elevation: 2,
  },
  label: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
