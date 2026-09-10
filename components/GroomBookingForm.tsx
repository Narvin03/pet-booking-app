import React from 'react';
import {Text, TextInput, TouchableOpacity, StyleSheet} from 'react-native';
import Iconicons from 'react-native-vector-icons/Ionicons';

interface Props {
  petType: string;
  setPetType: (value: string) => void;
  singleDate: Date;
  openPicker: (field: 'single', mode: 'date' | 'time') => void;
  formatDate: (date: Date) => string;
}

export default function GroomBookingForm({
  petType,
  setPetType,
  singleDate,
  openPicker,
  formatDate,
}: Props) {
  return (
    <>
      <Text style={styles.label}>Pet Size/Type</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., Small Dog, Cat"
        value={petType}
        onChangeText={setPetType}
      />

      <Text style={styles.label}>Appointment Date</Text>
      <TouchableOpacity
        style={styles.dateInput}
        onPress={() => openPicker('single', 'date')}>
        <Iconicons
          name="calendar-outline"
          size={20}
          color="#656"
          style={styles.icon}
        />
        <Text style={styles.dateText}>{formatDate(singleDate)}</Text>
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
  icon: {
    marginRight: 10,
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
});