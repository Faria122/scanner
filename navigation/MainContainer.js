import * as React from 'react';
import { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Screens
import HomeScreen from './screens/HomeScreen';
import HomeStack from './screens/HomeStack';
import DetailsScreen from './screens/DetailsScreen';
import SettingsScreen from './screens/SettingsScreen';
import LoginScreen from './screens/Loginscreen';
import DeliveryManHomeScreen from './screens/DeliveryManHomeScreen';
import CustomerHome from './screens/CustomerHome';
import LoaderHome from './screens/LoaderHome';
import EggLoaderStoreScreen from './screens/EggLoaderStoreScreen';



//Screen names
const homeName = "Driver";
const detailsName = "Details";
const settingsName = "Settings";
const loginName = "Login";
const deliveryManHomeName = "DeliveryMan";
const eggLoaderName = "eggloader";
const customerName = "Customer";
const loaderName = "Loader";

const Tab = createBottomTabNavigator();

function MainContainer() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState(null);


  const handleLogout = async () => {
    console.log('Logout button clicked');
    try {
      await AsyncStorage.removeItem('auth_token');
      await AsyncStorage.removeItem('user_type');

      console.log('auth_token removed from AsyncStorage');
      setIsLoggedIn(false);
      setUserType(null);

      console.log('isLoggedIn set to false');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const handleLogin = async (type) => {
    setIsLoggedIn(true);
    setUserType(type);
  };

  // Initial route 
  const getInitialRoute = () => {
    if (!isLoggedIn) return loginName;

    switch (userType) {
      case 1: return customerName;
      case 2: return homeName;
      case 3: return deliveryManHomeName;
      case 6: return loaderName;
      default: return loginName;
    }
  };

  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName={getInitialRoute()}
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            let rn = route.name;

            if (rn === homeName) {
              iconName = focused ? 'car' : 'car-outline';
            } else if (rn === detailsName) {
              iconName = focused ? 'list' : 'list-outline';
            } else if (rn === settingsName) {
              iconName = focused ? 'qr-code' : 'qr-code-outline';
            } else if (rn === loginName) {
              iconName = focused ? 'log-in' : 'log-in-outline';
            } else if (rn === deliveryManHomeName) {
              iconName = focused ? 'person' : 'person-outline';
            } else if (rn === eggLoaderName) {
              iconName = focused ? 'egg' : 'egg-outline';
            } else if (rn === customerName) {
              iconName = focused ? 'person' : 'person-outline';
            } else if (rn === loaderName) {
              iconName = focused ? 'cube' : 'cube-outline';
            }

            return <Ionicons name={iconName} size={size} color={focused ? '#edada6' : 'grey'} />;
          },
          tabBarActiveTintColor: '#edada6',
          tabBarInactiveTintColor: 'lightgray',
        })}
        tabBarOptions={{
          //activeTintColor: 'red',
          //inactiveTintColor: 'grey',
          labelStyle: { paddingBottom: 10, fontSize: 10 },
          style: { padding: 10, height: 70 },
        }}
      >
        {isLoggedIn ? (
          <>
            {userType === 1 && (
              <Tab.Screen name={customerName} options={{ headerShown: false }}>
                {(props) => <CustomerHome {...props} onLogout={handleLogout} />}
              </Tab.Screen>
            )}
            {userType === 2 && (
              <Tab.Screen name={homeName} options={{ headerShown: false }}>
                {(props) => <HomeStack {...props} onLogout={handleLogout} />}
              </Tab.Screen>
            )}
            {userType === 3 && (
              <Tab.Screen name={deliveryManHomeName} options={{ headerShown: false }}>
                {(props) => <DeliveryManHomeScreen {...props} onLogout={handleLogout} />}
              </Tab.Screen>
            )}
            {userType === 6 && (
              <Tab.Screen name={loaderName} options={{ headerShown: false }}>
                {(props) => <LoaderHome {...props}  onLogout={handleLogout} />}
              </Tab.Screen>
            )}

            {userType === 6 ? (
              <Tab.Screen name={eggLoaderName} options={{ headerShown: false }}>
                {(props) => <EggLoaderStoreScreen {...props} onLogout={handleLogout} />}
              </Tab.Screen>
            ) : (
              <Tab.Screen name={detailsName} component={DetailsScreen} options={{ headerShown: false }} />
            )}

            <Tab.Screen name={settingsName} component={SettingsScreen} options={{ headerShown: false }} />
          </>
        ) : (
          <Tab.Screen name={loginName} options={{ headerShown: false }}>
            {() => <LoginScreen onLogin={handleLogin} />}
          </Tab.Screen>
        )}
      </Tab.Navigator>
    </NavigationContainer>
  );

}
export default MainContainer;