import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';

// Import screens
import LoginScreen from './screens/LoginScreen';
import DashboardScreen from './screens/DashboardScreen';
import IncidentReportScreen from './screens/IncidentReportScreen';
import SplashScreen from './screens/SplashScreen';
//import ResourceTrackingScreen from './screens/ResourceTrackingScreen';
//import AlertsScreen from './screens/AlertsScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen 
            name="Splash" 
            component={SplashScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="Login" 
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="Dashboard" 
            component={DashboardScreen}
            options={{ title: 'Sahyog Dashboard' }}
          />
          <Stack.Screen 
            name="ReportIncident" 
            component={IncidentReportScreen}
            options={{ title: 'Report Incident' }}
          />
          {/* <Stack.Screen 
            name="ResourceTracking" 
            component={ResourceTrackingScreen}
            options={{ title: 'Resource Tracking' }}
          /> */}
          {/* <Stack.Screen 
            name="Alerts" 
            component={AlertsScreen}
            options={{ title: 'Alerts & Notifications' }}
          /> */}
        </Stack.Navigator>
        <StatusBar style="auto" />
      </NavigationContainer>
    </PaperProvider>
  );
}