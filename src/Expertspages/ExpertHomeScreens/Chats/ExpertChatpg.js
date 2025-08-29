import React, { useState } from 'react';
import {
    View,
    TouchableOpacity,
    Text,
    Image,
    TextInput,
    ScrollView,
    ImageBackground,
    SafeAreaView
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTranslation } from 'react-i18next';

const ExpertChat = ({ navigation }) => {
    const { t } = useTranslation();
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ImageBackground
                source={require('../../../images/background.jpg')}
                style={{ flex: 1 }}
                imageStyle={{ opacity: 0.9 }}
            >
                {/* Top Section */}
                <View
                    style={{
                        paddingHorizontal: 15,
                        paddingTop: 15,
                        paddingBottom: 10,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                >
                  

                    {/* Title */}
                    <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#031501ff' }}>
                       {t('expertChat.title')}
                    </Text>

                    {/* Settings Icon */}
                     <TouchableOpacity onPress={() => navigation.navigate('SettingStack')}>
                      <Icon name="settings" size={26} color="#031501ff" />
                    </TouchableOpacity>
                </View>

                {/* Search Bar */}
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: '#fff',
                        borderRadius: 25,
                        paddingHorizontal: 15,
                        marginHorizontal: 10,
                        elevation: 2,
                        height: 45
                    }}
                >
                    <Icon name="search" size={20} color="#888" />
                    <TextInput
                        placeholder={t('expertChat.searchChats')}
                        placeholderTextColor="#888"
                        style={{ flex: 1, marginLeft: 8, color: '#000' }}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>

                {/* Chat List */}
                <ScrollView style={{ flex: 1, paddingHorizontal: 10, marginTop: 10 }}>
                    {/* Chat 1 */}
                    <TouchableOpacity
                        onPress={() =>
                            navigation.navigate('ExpertChatMsg', {
                                name: t('expertChat.chatName'),
                                image: require('../../../images/chdummyimg.png'),
                                phone: '03544773498749'
                            })
                        }
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            backgroundColor: '#fff',
                            padding: 10,
                            borderRadius: 10,
                            marginBottom: 8,
                            elevation: 1
                        }}
                    >
                        <Image
                            source={require('../../../images/chdummyimg.png')}
                            style={{ width: 50, height: 50, borderRadius: 25 }}
                        />
                        <View style={{ flex: 1, marginLeft: 10 }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 15, color: '#000' }}>{t('expertChat.chatName')}</Text>
                            <Text style={{ fontSize: 12, color: '#555' }}>03548725395824</Text>
                        </View>
                    </TouchableOpacity>
                    {/* Chat 2 */}
                    <TouchableOpacity
                        onPress={() =>
                            navigation.navigate('ExpertChatMsg', {
                                name: t('expertChat.chatName'),
                                image: require('../../../images/chdummyimg.png'),
                                phone: '03544773498749'
                            })
                        }
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            backgroundColor: '#fff',
                            padding: 10,
                            borderRadius: 10,
                            marginBottom: 8,
                            elevation: 1
                        }}
                    >
                        <Image
                            source={require('../../../images/chdummyimg.png')}
                            style={{ width: 50, height: 50, borderRadius: 25 }}
                        />
                        <View style={{ flex: 1, marginLeft: 10 }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 15, color: '#000' }}>{t('expertChat.chatName')}</Text>
                            <Text style={{ fontSize: 12, color: '#555' }}>03548725395824</Text>
                        </View>
                    </TouchableOpacity>
                    {/* Chat 3*/}
                    <TouchableOpacity
                        onPress={() =>
                            navigation.navigate('ExpertChatMsg', {
                                name: t('expertChat.chatName'),
                                image: require('../../../images/chdummyimg.png'),
                                phone: '03544773498749'
                            })
                        }
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            backgroundColor: '#fff',
                            padding: 10,
                            borderRadius: 10,
                            marginBottom: 8,
                            elevation: 1
                        }}
                    >
                        <Image
                            source={require('../../../images/chdummyimg.png')}
                            style={{ width: 50, height: 50, borderRadius: 25 }}
                        />
                        <View style={{ flex: 1, marginLeft: 10 }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 15, color: '#000' }}>{t('expertChat.chatName')}</Text>
                            <Text style={{ fontSize: 12, color: '#555' }}>03548725395824</Text>
                        </View>
                    </TouchableOpacity>

                    {/* More chat items here... */}
                </ScrollView>
            </ImageBackground>
        </SafeAreaView>
    );
};

export default ExpertChat;
