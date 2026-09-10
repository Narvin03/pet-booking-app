import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SQLite from 'react-native-sqlite-storage';

SQLite.enablePromise(true);

//Define shapes for the state
interface NextAppt {
  type: string;
  date: string;
  detail: string;
}

interface Stats {
  vet: number;
  groom: number;
  hotel: number;
}

export default function Home({route}: any) {
  const userId = route.params?.userId;

  const [userName, setUserName] = useState('');
  const [nextAppt, setNextAppt] = useState<NextAppt | null>(null);
  const [stats, setStats] = useState<Stats>({vet: 0, groom: 0, hotel: 0});
  const [isLoading, setIsLoading] = useState(true);

  //useFocusEffect runs everytime the screen is focused (when user navigates back), to fetch latest data
  useFocusEffect(
    useCallback(() => {
      const fetchDashboardData = async () => {
        setIsLoading(true);
        try {
          const db = await SQLite.openDatabase({
            name: 'db.sqlite',
            location: 'default',
            createFromLocation: '~db.sqlite',
          });

          //Get username from db using userId
          const name = (
            await db.executeSql('SELECT username FROM users WHERE id=?', [
              userId,
            ])
          )[0].rows.item(0).username;
          setUserName(name);

          //Get todays date and compare with the booking dates in db
          const today = new Date().toISOString().split('T')[0];

          //get appointment data from db logic
          const [nextRes] = await db.executeSql(
            `
                        SELECT 'Hotel' as type, bookDateStart as date, 'Check-in' as detail FROM hotelBookings WHERE userId = ? AND bookDateStart >= ?
                        UNION ALL
                        SELECT 'Grooming' as type, bookDate as date, petType as detail FROM groomBookings WHERE userId = ? AND bookDate >= ?
                        UNION ALL
                        SELECT 'Vet' as type, bookDate as date, 'Vet Visit' as detail FROM appointments WHERE userId = ? AND bookDate >= ?
                        ORDER BY date ASC LIMIT 1
                        `,
            [userId, today, userId, today, userId, today],
          );

          if (nextRes.rows.length > 0) {
            setNextAppt(nextRes.rows.item(0)); //set next appointment data to state
          } else {
            setNextAppt(null); //if no upcoming appointments, set to null
          }

          //fetch stats for statistics summary section
          const [vetRes] = await db.executeSql(
            'SELECT COUNT(*) as count FROM appointments WHERE userId=?',
            [userId],
          );
          const [groomRes] = await db.executeSql(
            'SELECT COUNT(*) as count FROM groomBookings WHERE userId=?',
            [userId],
          );
          const [hotelRes] = await db.executeSql(
            'SELECT COUNT(*) as count FROM hotelBookings WHERE userId=?',
            [userId],
          );

          setStats({
            vet: vetRes.rows.item(0).count,
            groom: groomRes.rows.item(0).count,
            hotel: hotelRes.rows.item(0).count,
          });
        } catch (error) {
          console.error('Dashboard Fetch Error:', error);
        } finally {
          setIsLoading(false); //stop loading indicator after data is fetched
        }
      };

      fetchDashboardData();
    }, [userId]),
  );

  //to handle emergency contact button press
  const handleEmergencyCall = () => {
    //opens native phone dialer with phone number
    Linking.openURL('tel:+60123456789');
  };

  if (isLoading) {
    return (
      <ActivityIndicator size="large" color="#1e90ff" style={styles.loader} />
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{paddingBottom: 100}}>
      {/**Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Hello {userName}!</Text>
        <Text style={styles.subtitle}>Here is your pet care overview.</Text>
      </View>

      {/**Up next card */}
      <View style={styles.upNextCard}>
        <View style={styles.upNextHeader}>
          <Ionicons name="calendar" size={20} color="#fff" />
          <Text style={styles.upNextTitle}>Up Next</Text>
        </View>

        {nextAppt ? (
          <View style={styles.upNextBody}>
            <View style={styles.upNextIconCircle}>
              <Ionicons
                name={
                  nextAppt.type === 'Hotel'
                    ? 'business'
                    : nextAppt.type === 'Grooming'
                    ? 'cut'
                    : 'medkit'
                }
                size={30}
                color="#1e90ff"
              />
            </View>

            <View style={styles.upNextInfo}>
              <Text style={styles.upNextType}>{nextAppt.type} Appointment</Text>
              <Text style={styles.upNextDate}>{nextAppt.date}</Text>
              <Text style={styles.upNextDetail}>{nextAppt.detail}</Text>
            </View>
          </View>
        ) : (
          <View style={styles.upNextEmpty}>
            <Text style={styles.emptyText}>
              You have no upcoming appointments.
            </Text>
            <Text style={styles.emptySubText}>
              Tap the + button to book one!
            </Text>
          </View>
        )}
      </View>

      {/**Stats summary and activity grid */}
      <Text style={styles.sectionTitle}>Your Activity</Text>
      <View style={styles.statsGrid}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{stats.vet}</Text>
          <Text style={styles.statLabel}>Vet Visits</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{stats.groom}</Text>
          <Text style={styles.statLabel}>Groomings</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{stats.hotel}</Text>
          <Text style={styles.statLabel}>Hotel Stays</Text>
        </View>
      </View>

      {/**Care tips card*/}
      <View style={styles.tipCard}>
        <Ionicons
          name="bulb"
          size={24}
          color="#ffc107"
          style={{marginRight: 10}}
        />
        <View style={{flex: 1}}>
          <Text style={styles.tipTitle}>Tip of the Day</Text>
          <Text style={styles.tipText}>
            Make sure your pets always have access to fresh water, especially
            after grooming sessions!
          </Text>
        </View>
      </View>

      {/**Emergency contact button */}
      <TouchableOpacity
        style={styles.emergencyBtn}
        onPress={handleEmergencyCall}>
        <Ionicons
          name="call"
          size={24}
          color="#fff"
          style={{marginRight: 10}}
        />
        <Text style={styles.emergencyText}>Emergency Clinic Call</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    padding: 20,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  header: {
    marginBottom: 25,
    marginTop: 10,
  },
  greeting: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },

  // Up Next Card
  upNextCard: {
    backgroundColor: '#1E90FF',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: {width: 0, height: 3},
    marginBottom: 30,
  },
  upNextHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.15)',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  upNextTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  upNextBody: {
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
  },
  upNextIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  upNextInfo: {
    flex: 1,
  },
  upNextType: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  upNextDate: {
    color: '#e0f0ff',
    fontSize: 16,
    marginBottom: 2,
  },
  upNextDetail: {
    color: '#b3d9ff',
    fontSize: 14,
    fontStyle: 'italic',
  },
  upNextEmpty: {
    padding: 30,
    alignItems: 'center',
  },
  emptyText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  emptySubText: {
    color: '#e0f0ff',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 5,
  },

  // Stats Grid
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    shadowOffset: {width: 0, height: 1},
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E90FF',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 13,
    color: '#656',
    fontWeight: '600',
  },

  // Tip Card
  tipCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFDE7',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFF59D',
    marginBottom: 30,
    alignItems: 'center',
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F57F17',
    marginBottom: 4,
  },
  tipText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },

  // Emergency Button
  emergencyBtn: {
    flexDirection: 'row',
    backgroundColor: '#E53935',
    padding: 18,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#E53935',
    shadowOpacity: 0.4,
    shadowRadius: 5,
    shadowOffset: {width: 0, height: 2},
  },
  emergencyText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});
