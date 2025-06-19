import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import HomeScreen from "./components/HomeScreen";

import Detail from "./components/Detail";
import "./global.css";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Favourite from "./components/Favourite";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function HomeStackScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Celine"
        component={HomeScreen}
        options={{
          headerTintColor: "white",
          headerStyle: { backgroundColor: "#333232" },
          headerTitleAlign: "center",
          headerTitle: () => (
            <View
              style={{
                height: 60,
                width: "100%",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                paddingLeft: 20,
                paddingRight: 20,
              }}
            >
              <Text
                style={{ color: "white", fontSize: 28, fontWeight: "bold" }}
              >
                Players
              </Text>
            </View>
          ),
        }}
      />
      <Stack.Screen
        name="Detail"
        component={Detail}
        options={{
          headerTintColor: "white",
          headerStyle: { backgroundColor: "#333232" },
          headerTitleAlign: "center",
          headerBackVisible: false,
          headerTitle: () => (
            <View
              style={{
                height: 60,
                width: "100%",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                paddingLeft: 20,
                paddingRight: 20,
              }}
            >
              <Text
                style={{ color: "white", fontSize: 28, fontWeight: "bold" }}
              >
                Detail Player
              </Text>
            </View>
          ),
        }}
      />
    </Stack.Navigator>
  );
}

function FavouriteStackScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Favourite"
        component={Favourite}
        options={{
          headerTintColor: "white",
          headerStyle: { backgroundColor: "#333232" },
          headerTitleAlign: "center",
          headerTitle: () => (
            <View
              style={{
                height: 60,
                width: "100%",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{ color: "white", fontSize: 24, fontWeight: "bold" }}
              >
                Favourite Players
              </Text>
            </View>
          ),
        }}
      />
      <Stack.Screen
        name="Detail"
        component={Detail}
        options={{
          headerTintColor: "white",
          headerStyle: { backgroundColor: "#333232" },
          headerTitleAlign: "center",
          headerBackVisible: false,
          headerTitle: () => (
            <View
              style={{
                height: 60,
                width: "100%",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{ color: "white", fontSize: 28, fontWeight: "bold" }}
              >
                Detail Player
              </Text>
            </View>
          ),
        }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen
          name="Home"
          component={HomeStackScreen}
          options={{
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home-outline" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Favourite Player"
          component={FavouriteStackScreen} // ✅ dùng stack
          options={{
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="favorite-border" size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
