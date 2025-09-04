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

const ExpertChannel = ({ navigation }) => {
    const { t } = useTranslation();
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
                    <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#031501ff' }}>
                        {t('expertChannels.channels')}
                    </Text>

                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('CreateChannel')}
                            style={{ marginRight: 10 }}
                        >
                            <Icon name="add" size={26} color="#031501ff" />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => navigation.navigate('ExpertSettingsStack')}>
                            <Icon name="settings" size={26} color="#031501ff" />
                        </TouchableOpacity>
                    </View>
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
                        placeholder={t('expertChannels.searchChannels')}
                        placeholderTextColor="#888"
                        style={{ flex: 1, marginLeft: 8, color: '#000' }}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>

                {/* Channel Lists */}
                <ScrollView style={{ flex: 1, paddingHorizontal: 10, marginTop: 10 }}>
                    {/* Your Channels */}
                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#006644', marginVertical: 5 }}>
                        {t('expertChannels.yourChannels')}
                    </Text>
                    <TouchableOpacity
                        onPress={() =>
                            navigation.navigate('OwnChannelMsgScreen', {
                                name: t('expertChannels.myFarmingChannel'),
                                image: require('../../../images/chdummyimg.png'),
                                description: t('expertChannels.personalChannel'),
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
                            <Text style={{ fontWeight: 'bold', fontSize: 15, color: '#000' }}>
                                {t('expertChannels.myFarmingChannel')}
                            </Text>
                            <Text style={{ fontSize: 12, color: '#555' }}>
                                {t('expertChannels.personalChannel')}
                            </Text>
                        </View>
                    </TouchableOpacity>

                    {/* Following */}
                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#006644', marginVertical: 5 }}>
                        {t('expertChannels.following')}
                    </Text>
                    <TouchableOpacity
                        onPress={() =>
                            navigation.navigate('ExpertChannelMsg', {
                                name: t('expertChannels.farmingTips'),
                                image: require('../../../images/chdummyimg.png'),
                                description: t('expertChannels.dailyTips'),
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
                            <Text style={{ fontWeight: 'bold', fontSize: 15, color: '#000' }}>
                                {t('expertChannels.farmingTips')}
                            </Text>
                            <Text style={{ fontSize: 12, color: '#555' }}>
                                {t('expertChannels.dailyTips')}
                            </Text>
                        </View>
                    </TouchableOpacity>

                    {/* Discover */}
                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#006644', marginVertical: 5 }}>
                        {t('expertChannels.discover')}
                    </Text>
                    <TouchableOpacity
                        onPress={() =>
                            navigation.navigate('ExpertChannelMsg', {
                                name: t('expertChannels.agriNews'),
                                image: require('../../../images/chdummyimg.png'),
                                description: t('expertChannels.latestNews'),
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
                            <Text style={{ fontWeight: 'bold', fontSize: 15, color: '#000' }}>
                                {t('expertChannels.agriNews')}
                            </Text>
                            <Text style={{ fontSize: 12, color: '#555' }}>
                                {t('expertChannels.latestNews')}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </ScrollView>
            </ImageBackground>
        </SafeAreaView>
    );
};

export default ExpertChannel;
