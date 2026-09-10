import React from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import type {BottomTabBarProps} from '@react-navigation/bottom-tabs';

interface CustomTabBarProps extends BottomTabBarProps {
  navigation: any;
  userId?: number | string;
}

export default function CustomTabBar({
  state,
  navigation,
  userId,
}: CustomTabBarProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.tabButton}
        onPress={() => navigation.navigate('Home', {userId})}>
        <Ionicons
          name={state.index === 0 ? 'home' : 'home-outline'}
          size={24}
          color={state.index === 0 ? '#1E90FF' : 'gray'}
        />
        <Text style={state.index === 0 ? styles.activeLabel : styles.label}>
          Home
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.tabButton}
        onPress={() => navigation.navigate('Bookings', {userId})}>
        <Ionicons
          name={state.index === 1 ? 'calendar' : 'calendar-outline'}
          size={24}
          color={state.index === 1 ? '#1E90FF' : 'gray'}
        />
        <Text style={state.index === 1 ? styles.activeLabel : styles.label}>
          Bookings
        </Text>
      </TouchableOpacity>

      <View style={styles.middleButtonContainer}>
        <TouchableOpacity
          onPress={() => navigation.navigate('CreateBooking', {userId})}
          style={styles.middleButton}>
          <Ionicons name="add" size={30} color="#fff" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.tabButton}
        onPress={() => navigation.navigate('About')}>
        <Ionicons
          name={
            state.index === 2
              ? 'information-circle'
              : 'information-circle-outline'
          }
          size={24}
          color={state.index === 2 ? '#1E90FF' : 'gray'}
        />
        <Text style={state.index === 2 ? styles.activeLabel : styles.label}>
          About
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.tabButton}
        onPress={() => navigation.navigate('Profile', {userId})}>
        <Ionicons
          name={state.index === 3 ? 'person' : 'person-outline'}
          size={24}
          color={state.index === 3 ? '#1E90FF' : 'gray'}
        />
        <Text style={state.index === 3 ? styles.activeLabel : styles.label}>
          Profile
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    height: 60,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  middleButtonContainer: {
    flex: 1,
    alignItems: 'center',
  },
  middleButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#1E90FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -20,
  },
  label: {
    color: 'gray',
    fontSize: 12,
  },
  activeLabel: {
    color: '#1E90FF',
    fontSize: 12,
  },
});
