import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Iconicons from 'react-native-vector-icons/Ionicons';

interface Props {
  hotelStartDate: Date;
  hotelEndDate: Date;
  openPicker: (field: 'start' | 'end', mode: 'date' | 'time') => void;
  formatDate: (date: Date) => string;
}

export default function HotelBookingForm({
  hotelStartDate,
  hotelEndDate,
  openPicker,
  formatDate,
}: Props) {
  return (
    <>
      <Text style={styles.label}>Check-In Date</Text>
      <TouchableOpacity
        style={styles.dateInput}
        onPress={() => openPicker('start', 'date')}>
        <Iconicons
          name="calendar-outline"
          size={20}
          color="#656"
          style={styles.icon}
        />
        <Text style={styles.dateText}>{formatDate(hotelStartDate)}</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Check-out</Text>
      <TouchableOpacity
        style={styles.dateInput}
        onPress={() => openPicker('end', 'date')}>
        <Iconicons
          name="calendar-outline"
          size={20}
          color="#666"
          style={styles.icon}
        />
        <Text style={styles.dateText}>{formatDate(hotelEndDate)}</Text>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
    fontWeight: '600',
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
  icon: {
    marginRight: 10,
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
});