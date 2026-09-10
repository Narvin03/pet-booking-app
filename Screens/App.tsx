import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

//To import the screens
import Register from './Register';
import Login from './Login';
import Home from './Home';
import Bookings from './Bookings';
import About from './About';
import Profile from './Profile';
import CreateBookingScreen from './CreateBooking';
import HotelBookings from './HotelBookings';
import GroomingBookings from './GroomingBookings';
import AppointmentBookings from './AppointmentBookings';
import CustomTabBar from '../components/CustomTabBar';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// --- Bottom Tab Navigation Bar ---
function MainTabs({route, navigation}: any) {
  //Grab userId passed from Login.tsx
  const {userId} = route.params;
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false, //Hides the double header
      }}
      tabBar={props => (
        <CustomTabBar {...props} navigation={navigation} userId={userId} />
      )}>
      <Tab.Screen
        name="Home"
        component={Home}
        initialParams={{userId: userId}}
      />
      <Tab.Screen
        name="Bookings"
        component={Bookings}
        initialParams={{userId: userId}}
      />
      <Tab.Screen name="About" component={About} />
      <Tab.Screen
        name="Profile"
        component={Profile}
        initialParams={{userId: userId}}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        {/*Tab Navigator*/}
        <Stack.Screen name="Main" component={MainTabs} />
        <Stack.Screen
          name="CreateBooking"
          component={CreateBookingScreen}
          options={{presentation: 'modal', headerShown: false}}
        />
        <Stack.Screen
          name="HotelBookings"
          component={HotelBookings}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="GroomingBookings"
          component={GroomingBookings}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="AppointmentBookings"
          component={AppointmentBookings}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
