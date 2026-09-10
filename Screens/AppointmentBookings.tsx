import React, {useState, useCallback} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Iconicons from 'react-native-vector-icons/Ionicons';
import SQLite from 'react-native-sqlite-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import VetBookingForm from '../components/VetBookingForm';

SQLite.enablePromise(true);

interface Appointment {
  aId: number;
  bookDate: string;
}

export default function AppointmentBookings({route, navigation}: any) {
  const userId = route.params?.userId;

  const [bookings, setBookings] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingBooking, setEditingBooking] = useState<Appointment | null>(
    null,
  );
  const [editDate, setEditDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const db = await SQLite.openDatabase({
        name: 'db.sqlite',
        location: 'default',
        createFromLocation: '~db.sqlite',
      });
      const [res] = await db.executeSql(
        'SELECT * FROM appointments WHERE userId = ? ORDER BY bookDate ASC',
        [userId],
      );

      const bookingsList: Appointment[] = [];
      for (let i = 0; i < res.rows.length; i++) {
        bookingsList.push(res.rows.item(i));
      }
      setBookings(bookingsList);
    } catch (error) {
      console.error('Error fetching appointments: ', error);
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchBookings();
    }, [userId]),
  );

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const handleEditDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (selectedDate) {
      setEditDate(selectedDate);
    }
  };

  const openEditPicker = (_field: 'single', _mode: 'date' | 'time') => {
    setShowDatePicker(true);
  };

  const openEditModal = (booking: Appointment) => {
    setEditingBooking(booking);
    setEditDate(new Date(booking.bookDate));
  };

  const handleSaveBooking = async () => {
    if (!editingBooking) return;

    try {
      const db = await SQLite.openDatabase({
        name: 'db.sqlite',
        location: 'default',
        createFromLocation: '~db.sqlite',
      });
      await db.executeSql(
        'UPDATE appointments SET bookDate = ? WHERE aId = ? AND userId = ?',
        [formatDate(editDate), editingBooking.aId, userId],
      );

      Alert.alert('Success', 'Appointment updated successfully.');
      setEditingBooking(null);
      fetchBookings();
    } catch (error) {
      console.error('Error updating appointment: ', error);
      Alert.alert('Error', 'Failed to update appointment.');
    }
  };

  const handleCancelBooking = (booking: Appointment) => {
    Alert.alert(
      'Cancel Appointment',
      'Are you sure you want to cancel this appointment?',
      [
        {text: 'No', onPress: () => {}},
        {
          text: 'Yes',
          onPress: async () => {
            try {
              const db = await SQLite.openDatabase({
                name: 'db.sqlite',
                location: 'default',
                createFromLocation: '~db.sqlite',
              });
              await db.executeSql(
                'DELETE FROM appointments WHERE aId = ? AND userId = ?',
                [booking.aId, userId],
              );
              Alert.alert('Success', 'Appointment cancelled successfully.');
              fetchBookings();
            } catch (error) {
              console.error('Error cancelling appointment: ', error);
              Alert.alert('Error', 'Failed to cancel appointment.');
            }
          },
        },
      ],
    );
  };

  if (isLoading) {
    return (
      <ActivityIndicator size="large" color="#1e90ff" style={styles.loader} />
    );
  }

  if (editingBooking) {
    return (
      <KeyboardAvoidingView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => setEditingBooking(null)}
            style={styles.backButton}>
            <Iconicons name="close" size={28} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Appointment</Text>
          <View style={{width: 28}} />
        </View>

        <ScrollView contentContainerStyle={{padding: 20}}>
          <View style={styles.formContainer}>
            <VetBookingForm
              singleDate={editDate}
              openPicker={openEditPicker}
              formatDate={formatDate}
            />
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSaveBooking}>
              <Text style={styles.submitText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {showDatePicker && (
          <DateTimePicker
            value={editDate}
            mode="date"
            display="default"
            onChange={handleEditDateChange}
            minimumDate={new Date()}
          />
        )}
      </KeyboardAvoidingView>
    );
  }

  return (
    <>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Iconicons name="chevron-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Appointments</Text>
        <View style={{width: 28}} />
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={{paddingBottom: 100, padding: 15}}>
        {bookings.length === 0 ? (
          <Text style={styles.emptyText}>No appointments yet.</Text>
        ) : (
          bookings.map(booking => (
            <View key={booking.aId} style={styles.bookingCard}>
              <View style={styles.bookingInfo}>
                <View style={styles.infoRow}>
                  <Iconicons
                    name="calendar"
                    size={24}
                    color="#4caf50"
                    style={{marginRight: 12}}
                  />
                  <View>
                    <Text style={styles.label}>Appointment Date</Text>
                    <Text style={styles.dateValue}>{booking.bookDate}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => openEditModal(booking)}>
                  <Iconicons name="pencil" size={18} color="#1e90ff" />
                  <Text style={styles.editButtonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => handleCancelBooking(booking)}>
                  <Iconicons name="trash" size={18} color="#ff6b6b" />
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/**Date Picker */}
      {showDatePicker && (
        <DateTimePicker
          value={editDate}
          mode="date"
          display="default"
          onChange={handleEditDateChange}
          minimumDate={new Date()}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#4caf50',
    paddingHorizontal: 15,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 15,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 40,
  },
  bookingCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: {width: 0, height: 2},
  },
  bookingInfo: {
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    fontSize: 12,
    color: '#999',
    marginBottom: 2,
  },
  formContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 2,
    shadowOffset: {width: 0, height: 1},
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
  dateValue: {
    fontSize: 16,
    fontWeight: '600',
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
    fontWeight: 'bold',
    fontSize: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    gap: 5,
  },
  editButtonText: {
    color: '#1e90ff',
    fontWeight: '600',
    fontSize: 14,
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffebee',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    gap: 5,
  },
  cancelButtonText: {
    color: '#ff6b6b',
    fontWeight: '600',
    fontSize: 14,
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
});
