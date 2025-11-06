import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';
import ChannelStack from './ChannelStack';
import ChatsStack from './ChatStack';
import AIChatScreen from '../../Farmerpages/FarmerHomeScreens/FarmerAipg';
import UpdatesStack from './UpdateStack';
import FarmerAI from '../../Farmerpages/FarmerHomeScreens/FarmerAIchatBotpg';



const Tab = createBottomTabNavigator();

function tabBarVisible(route, hiddenNames) {
  const name = getFocusedRouteNameFromRoute(route) ?? '';
  return hiddenNames.includes(name) ? 'none' : 'flex';
}

export default function BottomTabs() {
  const { t } = useTranslation(); 

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#ffffff',
        tabBarInactiveTintColor: '#b2b2b2',
        tabBarStyle: { backgroundColor: '#006644', height: 60 },
      }}
    >
      <Tab.Screen
        name="ChannelsTab"
        component={ChannelStack}
        options={({ route }) => ({
          tabBarLabel: t('bottomTabs.channels'),
          tabBarStyle: {
            display: tabBarVisible(route, ['ChannelMsg', 'ChannelDes',"LocationPiker"]),
            backgroundColor: '#006644',
            height: 60,
          },
          tabBarIcon: ({ color, size }) => <Icon name="group" color={color} size={size} />,
        })}
      />

      <Tab.Screen
        name="ChatTab"
        component={ChatsStack}
        options={({ route }) => ({
          tabBarLabel: t('bottomTabs.chats'),
          tabBarStyle: {
            display: tabBarVisible(route, ['ChatMsg', 'ChatDes',"LocationPiker"]),
            backgroundColor: '#006644',
            height: 60,
          },
          tabBarIcon: ({ color, size }) => <Icon name="chat" color={color} size={size} />,
        })}
      />

      <Tab.Screen
  name="AiTab"
  component={AIChatScreen}
  options={{
    tabBarLabel: t('bottomTabs.scan'), // label like "Scan" or "Plant Scan"
    tabBarStyle: {
      display: 'none', // hide tab bar when this screen is open
      backgroundColor: '#006644',
      height: 60,
    },
    tabBarIcon: ({ color, size }) => (
      <Ionicons name="leaf-outline" color={color} size={size} />
    ),
  }}
/>

      <Tab.Screen
        name="FarmerBot"
        component={FarmerAI}
        options={{
          tabBarLabel: t('bottomTabs.ai'),
          tabBarStyle: {
            display: 'none', // always hide for AI tab
            backgroundColor: '#006644',
            height: 60,
          },
          tabBarIcon: ({ color, size }) => <Icon name="smart-toy" color={color} size={size} />,
        }}
      />

      <Tab.Screen
        name="UpdatesTab"
        component={UpdatesStack}
        options={({ route }) => ({
          tabBarLabel: t('bottomTabs.updates'),
          tabBarStyle: {
            display: tabBarVisible(route, ['GovtRead', 'PriceRead', 'CropRead']),
            backgroundColor: '#006644',
            height: 60,
          },
          tabBarIcon: ({ color, size }) => <Icon name="update" color={color} size={size} />,
        })}
      />
    </Tab.Navigator>
  );
}
