// HomeStack.js
import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './HomeScreen';
import PackageDetailsScreen from '../../components/PackageDetailsScreen';

const Stack = createStackNavigator();

const HomeStack = ({ onLogout }) => {
  console.log('onLogout prop in HomeStack:', onLogout); // Debugging

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeScreen"
        //component={HomeScreen}
        options={{ headerShown: false }}
      >
        {(props) => (
          <HomeScreen
            {...props} 
            onLogout={onLogout} 
          />
        )}
      </Stack.Screen>
      <Stack.Screen
        name="PackageDetails"
        component={PackageDetailsScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default HomeStack;