import React, {useState, useCallback} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import Iconicons from 'react-native-vector-icons/Ionicons';
import SQLite from 'react-native-sqlite-storage';

SQLite.enablePromise(true);

export default function Bookings({route, navigation}: any) {
  const userId = route.params?.userId;

  const [hotelCount, setHotelCount] = useState(0);
  const [groomCount, setGroomCount] = useState(0);
  const [appointmentCount, setAppointmentCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBookingCounts = async () => {
    setIsLoading(true);
    try {
      const db = await SQLite.openDatabase({
        name: 'db.sqlite',
        location: 'default',
        createFromLocation: '~db.sqlite',
      });

      const [hotelRes] = await db.executeSql(
        'SELECT COUNT(*) as count FROM hotelBookings WHERE userId = ?',
        [userId],
      );
      const [groomRes] = await db.executeSql(
        'SELECT COUNT(*) as count FROM groomBookings WHERE userId = ?',
        [userId],
      );
      const [appointRes] = await db.executeSql(
        'SELECT COUNT(*) as count FROM appointments WHERE userId = ?',
        [userId],
      );

      setHotelCount(hotelRes.rows.item(0).count);
      setGroomCount(groomRes.rows.item(0).count);
      setAppointmentCount(appointRes.rows.item(0).count);
    } catch (error) {
      console.error('Error fetching booking counts: ', error);
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchBookingCounts();
    }, [userId]),
  );

  if (isLoading) {
    return (
      <ActivityIndicator size="large" color="#1e90ff" style={styles.loader} />
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{paddingBottom: 100}}>
      <Text style={styles.pageTitle}>My Bookings</Text>
      <Text style={styles.subtitle}>
        Select a category to view and manage bookings
      </Text>

      {/**Hotel Bookings Card */}
      <TouchableOpacity
        style={styles.categoryCard}
        onPress={() => navigation.navigate('HotelBookings', {userId})}>
        <View style={styles.cardIcon}>
          <Iconicons name="business" size={40} color="#fff" />
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.cardTitle}>Hotel Bookings</Text>
          <Text style={styles.cardCount}>
            {hotelCount} booking{hotelCount !== 1 ? 's' : ''}
          </Text>
        </View>
        <Iconicons name="chevron-forward" size={24} color="#666" />
      </TouchableOpacity>

      {/**Grooming Card */}
      <TouchableOpacity
        style={styles.categoryCard}
        onPress={() => navigation.navigate('GroomingBookings', {userId})}>
        <View style={[styles.cardIcon, {backgroundColor: '#e91e63'}]}>
          <Iconicons name="cut" size={40} color="#fff" />
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.cardTitle}>Grooming</Text>
          <Text style={styles.cardCount}>
            {groomCount} booking{groomCount !== 1 ? 's' : ''}
          </Text>
        </View>
        <Iconicons name="chevron-forward" size={24} color="#666" />
      </TouchableOpacity>

      {/**Appointments Card */}
      <TouchableOpacity
        style={styles.categoryCard}
        onPress={() => navigation.navigate('AppointmentBookings', {userId})}>
        <View style={[styles.cardIcon, {backgroundColor: '#4caf50'}]}>
          <Iconicons name="medkit" size={40} color="#fff" />
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.cardTitle}>Appointments</Text>
          <Text style={styles.cardCount}>
            {appointmentCount} booking{appointmentCount !== 1 ? 's' : ''}
          </Text>
        </View>
        <Iconicons name="chevron-forward" size={24} color="#666" />
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    padding: 15,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
    marginTop: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: {width: 0, height: 2},
  },
  cardIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ff9000',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  cardCount: {
    fontSize: 14,
    color: '#666',
  },
});
