import React, { useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    View,
    TouchableOpacity,
    Text,
    Image,
    TextInput,
    ImageBackground
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTranslation } from 'react-i18next';

const ChannelsScreen = ({ navigation }) => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState('Channels');
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ImageBackground
                source={require('../../../images/background.jpg')}
                style={{ flex: 1 }}
                resizeMode="cover"
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
                       {t('channels.title')}
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
                        placeholder={t('channels.searchPlaceholder')}
                        placeholderTextColor="#888"
                        style={{ flex: 1, marginLeft: 8, color: '#000' }}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>

                {/* Channel List */}
                <ScrollView style={{ flex: 1, paddingHorizontal: 10, marginTop: 10 }}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#006644', marginVertical: 5 }}>
                        {t('channels.following')}
                    </Text>

                    {/* channel 1 */}
                    <TouchableOpacity
                        onPress={() =>
                            navigation.navigate('ChannelMsg', {
                                name:  t('channels.channel1.name'),
                                image: require('../../../images/chdummyimg.png'),
                                description: t('channels.channel1.description'),
                            })
                        }
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            backgroundColor: '#fff',
                            padding: 10,
                            borderRadius: 10,
                            marginBottom: 8,
                            elevation: 1,
                        }}
                    >
                        <Image
                            source={require('../../../images/chdummyimg.png')}
                            style={{ width: 50, height: 50, borderRadius: 25 }}
                        />
                        <View style={{ flex: 1, marginLeft: 10 }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 15, color: '#000' }}>{ t('channels.channel1.name')}</Text>
                            <Text style={{ fontSize: 12, color: '#555' }}> {t('channels.channel1.description')}</Text>
                        </View>
                    </TouchableOpacity>
                    {/* channel 2 */}
                    <TouchableOpacity
                        onPress={() =>
                            navigation.navigate('ChannelMsg', {
                                name:  t('channels.channel1.name'),
                                image: require('../../../images/chdummyimg.png'),
                                description:t('channels.channel1.description'),
                            })
                        }
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            backgroundColor: '#fff',
                            padding: 10,
                            borderRadius: 10,
                            marginBottom: 8,
                            elevation: 1,
                        }}
                    >
                        <Image
                            source={require('../../../images/chdummyimg.png')}
                            style={{ width: 50, height: 50, borderRadius: 25 }}
                        />
                        <View style={{ flex: 1, marginLeft: 10 }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 15, color: '#000' }}>{t('channels.channel1.name')}</Text>
                            <Text style={{ fontSize: 12, color: '#555' }}> {t('channels.channel1.description')}</Text>
                        </View>
                    </TouchableOpacity>
                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#006644', marginVertical: 5 }}>
                        {t('channels.discover')}
                    </Text>
                    {/* channel 3 */}
                    <TouchableOpacity
                        onPress={() =>
                            navigation.navigate('ChannelMsg', {
                                name:  t('channels.channel1.name'),
                                image: require('../../../images/chdummyimg.png'),
                                description:t('channels.channel1.description'),
                            })
                        }
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            backgroundColor: '#fff',
                            padding: 10,
                            borderRadius: 10,
                            marginBottom: 8,
                            elevation: 1,
                        }}
                    >
                        <Image
                            source={require('../../../images/chdummyimg.png')}
                            style={{ width: 50, height: 50, borderRadius: 25 }}
                        />
                        <View style={{ flex: 1, marginLeft: 10 }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 15, color: '#000' }}>{t('channels.channel1.name')}</Text>
                            <Text style={{ fontSize: 12, color: '#555' }}> {t('channels.channel1.description')}</Text>
                        </View>
                    </TouchableOpacity>
                    {/* channel 4 */}
                    <TouchableOpacity
                        onPress={() =>
                            navigation.navigate('ChannelMsg', {
                                name:  t('channels.channel1.name'),
                                image: require('../../../images/chdummyimg.png'),
                                description: t('channels.channel1.description'),
                            })
                        }
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            backgroundColor: '#fff',
                            padding: 10,
                            borderRadius: 10,
                            marginBottom: 8,
                            elevation: 1,
                        }}
                    >
                        <Image
                            source={require('../../../images/chdummyimg.png')}
                            style={{ width: 50, height: 50, borderRadius: 25 }}
                        />
                        <View style={{ flex: 1, marginLeft: 10 }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 15, color: '#000' }}>{t('channels.channel1.name')}</Text>
                            <Text style={{ fontSize: 12, color: '#555' }}> {t('channels.channel1.description')}</Text>
                        </View>
                    </TouchableOpacity>
                </ScrollView>
            </ImageBackground>
        </SafeAreaView>
    );
};

export default ChannelsScreen;
