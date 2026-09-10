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
import Iconicons from 'react-native-vector-icons/Ionicons';
import SQLite, {Transaction} from 'react-native-sqlite-storage';
import MapView, {
  Marker,
  PROVIDER_GOOGLE,
  PROVIDER_DEFAULT,
} from 'react-native-maps';

SQLite.enablePromise(true);

export default function About() {
  //Mock location coordinates
  const clinicLocation = {
    latitude: 2.9935,
    longitude: 101.7874,
    latitudeDelta: 0.1, //Controls zoom level
    longitudeDelta: 0.1,
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{paddingBottom: 40}}>
      {/*Header Section */}
      <View style={styles.header}>
        <Image source={logo} style={styles.logo} />
        <Text style={styles.title}>About Us</Text>
        <Text style={styles.subtitle}>Your trusted pet care partners</Text>
      </View>

      {/*Information Section*/}
      <View style={styles.infoCard}>
        <Text style={styles.description}>
          Welcome to our Pet Booking App! We are dedicated to providing the
          easiest way to schedule grooming and boarding services for your
          beloved pets.
        </Text>

        <View style={styles.contactRow}>
          <Iconicons name="call-outline" size={20} color="#1E90FF" />
          <Text style={styles.contactText}>+1 (555) 123-4567</Text>
        </View>

        <View style={styles.contactRow}>
          <Iconicons name="mail-outline" size={20} color="#1E90FF" />
          <Text style={styles.contactText}>support@petbooking.com</Text>
        </View>
      </View>

      {/*Map Section*/}
      <Text style={styles.mapHeader}>Find Us Here</Text>
      <View style={styles.mapContainer}>
        <MapView
          provider={PROVIDER_GOOGLE} //Use Google Maps
          style={styles.map}
          initialRegion={clinicLocation}
          onMapReady={() => console.log('Map ready')}
          onRegionChangeComplete={r => console.log(r)}>
          <Marker
            coordinate={clinicLocation}
            title="Pet Clinic HQ"
            description="Drop your pets off here!"
          />
        </MapView>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  infoCard: {
    margin: 20,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  description: {
    fontSize: 15,
    color: '#444',
    lineHeight: 22,
    marginBottom: 20,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  contactText: {
    fontSize: 15,
    color: '#333',
    marginLeft: 10,
  },
  mapHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 20,
    marginBottom: 10,
  },
  mapContainer: {
    marginHorizontal: 20,
    height: 250,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  logo: {
    height: 100,
    width: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  map: {
    ...StyleSheet.absoluteFillObject, //Fills the parent mapContainer perfectly
  },
});
