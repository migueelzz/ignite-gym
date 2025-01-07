import { createBottomTabNavigator , BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { gluestackUIConfig } from '../../config/gluestack-ui.config'

import { Exercise } from "@screens/exercise";
import { History } from "@screens/history";
import { Home } from "@screens/home";
import { Profile } from "@screens/profile";

import HomeIcon from '@assets/home.svg'
import HistoryIcon from '@assets/history.svg'
import ProfileIcon from '@assets/profile.svg'
import { Platform } from "react-native";

type AppRoutes = {
  home: undefined
  exercise: undefined
  profile: undefined
  history: undefined
}

export type AppNavigatorRoutesProps = BottomTabNavigationProp<AppRoutes>

const { Navigator, Screen } = createBottomTabNavigator<AppRoutes>();

export function AppRoutes() {
  const { tokens } = gluestackUIConfig

  const iconSize = tokens.space["6"]

  return (
    <Navigator
      screenOptions={{ 
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: tokens.colors.green500,
        tabBarInactiveTintColor: tokens.colors.gray200,
        tabBarStyle: {
          backgroundColor: tokens.colors.gray600,
          borderTopWidth: 0,
          height: Platform.OS === "android" ? "auto" : 96,
          paddingBottom: tokens.space["10"],
          paddingTop: tokens.space["6"]
        }
      }}
    >
      <Screen 
        name="home"
        component={Home}
        options={{
          tabBarIcon: ({ color }) => <HomeIcon fill={color} width={iconSize} height={iconSize} />
        }}
      />
      <Screen 
        name="history"
        component={History}
        options={{
          tabBarIcon: ({ color }) => <HistoryIcon fill={color} width={iconSize} height={iconSize} />
        }}
      />
      <Screen 
        name="profile"
        component={Profile}
        options={{
          tabBarIcon: ({ color }) => <ProfileIcon fill={color} width={iconSize} height={iconSize} />
        }}
      />
      <Screen 
        name="exercise"
        component={Exercise}
        options={{
          tabBarButton: () => null,
          tabBarItemStyle: {
            display: 'none'
          }
        }}
      />
    </Navigator>
  )
}