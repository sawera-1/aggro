import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTranslation } from 'react-i18next';
import ExpertChannelStack from './ExpertChannelStack';
import ExpertChatStack from './ExpertChatStack';
import ExpertUpdateStack from './ExpertUpdateStack';
import ExpertAI from '../../Expertspages/ExpertHomeScreens/ExpertAipg';



const Tab = createBottomTabNavigator();

function tabBarVisible(route, hiddenNames) {
  const name = getFocusedRouteNameFromRoute(route) ?? '';
  return hiddenNames.includes(name) ? 'none' : 'flex';
}

export default function ExpertBottomTabs() {
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
        name="ExpertChannelsTab"
        component={ExpertChannelStack}
        options={({ route }) => ({
          tabBarLabel: t('expertBottomTabs.channels'),
          tabBarStyle: {
            display: tabBarVisible(route, [
              'OwnChannelMsgScreen',
              'ExpertChannelMsg',
              'ExpertChannelDescription',
              'OwnChannelDescription',
            ]),
            backgroundColor: '#006644',
            height: 60,
          },
          tabBarIcon: ({ color, size }) => <Icon name="group" color={color} size={size} />,
        })}
      />

      <Tab.Screen
        name="EChatTab"
        component={ExpertChatStack}
        options={({ route }) => ({
          tabBarLabel: t('expertBottomTabs.chat'),
          tabBarStyle: {
            display: tabBarVisible(route, ['ExpertChatMsg', 'ExpertChatDes']),
            backgroundColor: '#006644',
            height: 60,
          },
          tabBarIcon: ({ color, size }) => <Icon name="chat" color={color} size={size} />,
        })}
      />

      <Tab.Screen
        name="ExpertAiTab"
        component={ExpertAI}
        options={{
          tabBarLabel: t('expertBottomTabs.ai'),
          tabBarStyle: {
            display: 'none',
            backgroundColor: '#006644',
            height: 60,
          },
          tabBarIcon: ({ color, size }) => <Icon name="smart-toy" color={color} size={size} />,
        }}
      />

      <Tab.Screen
        name="UpdatesTab"
        component={ExpertUpdateStack}
        options={({ route }) => ({
          tabBarLabel: t('expertBottomTabs.updates'),
          tabBarStyle: {
            display: tabBarVisible(route, [
              'ExpertGovtReadMore',
              'ExpertCropReadMore',
            ]),
            backgroundColor: '#006644',
            height: 60,
          },
          tabBarIcon: ({ color, size }) => <Icon name="update" color={color} size={size} />,
        })}
      />
    </Tab.Navigator>
  );
}

