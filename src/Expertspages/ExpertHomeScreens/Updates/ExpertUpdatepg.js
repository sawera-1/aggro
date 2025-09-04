import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, TextInput, SafeAreaView, ImageBackground } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTranslation } from 'react-i18next';
const ExpertUpdate = ({ navigation }) => {
  const [selectedTab, setSelectedTab] = useState('GovtSchemes');
 const { t } = useTranslation();
 return (
     <SafeAreaView style={{ flex: 1 }}>
       {/* Background Image */}
       <ImageBackground
         source={require('../../../images/background.jpg')}
         style={{ flex: 1 }}
         resizeMode="cover"
       >
 
         {/* Top Section */}
         <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15, paddingTop: 15, paddingBottom: 10 }}>
 
 
           {/* Title */}
           <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#031501ff' }}> {t('expertUpdates.title')}</Text>
 
           {/* Setting Icon */}
           <TouchableOpacity onPress={() => navigation.navigate('ExpertSettingsStack')}>
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
             height: 45,
             marginHorizontal: 15,
             marginTop: 15,
             elevation: 3,
           }}
         >
           <Icon name="search" size={20} color="#666" />
           <TextInput
             placeholder={t('expertUpdates.search')}
             placeholderTextColor="#888"
             style={{
               flex: 1,
               marginLeft: 10,
               color: '#000',
               fontSize: 16,
             }}
           />
         </View>
 
 
         {/* Tabs */}
         <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10, marginTop: 10 }}>
           <TouchableOpacity onPress={() => setSelectedTab('GovtSchemes')} style={{ paddingBottom: 5, borderBottomWidth: selectedTab === 'GovtSchemes' ? 2 : 0, borderBottomColor: '#006644' }}>
             <Text style={{ color: selectedTab === 'GovtSchemes' ? '#006644' : '#031501ff', fontWeight: selectedTab === 'GovtSchemes' ? 'bold' : 'normal' }}>{t('expertUpdates.etabs.govt')}</Text>
           </TouchableOpacity>
 
           <TouchableOpacity onPress={() => setSelectedTab('MarketPrices')} style={{ paddingBottom: 5, borderBottomWidth: selectedTab === 'MarketPrices' ? 2 : 0, borderBottomColor: '#006644' }}>
             <Text style={{ color: selectedTab === 'MarketPrices' ? '#006644' : '#031501ff', fontWeight: selectedTab === 'MarketPrices' ? 'bold' : 'normal' }}>{t('expertUpdates.etabs.market')}</Text>
           </TouchableOpacity>
 
           <TouchableOpacity onPress={() => setSelectedTab('CropInfo')} style={{ paddingBottom: 5, borderBottomWidth: selectedTab === 'CropInfo' ? 2 : 0, borderBottomColor: '#006644' }}>
             <Text style={{ color: selectedTab === 'CropInfo' ? '#006644' : '#031501ff', fontWeight: selectedTab === 'CropInfo' ? 'bold' : 'normal' }}>{t('expertUpdates.etabs.crop')}</Text>
           </TouchableOpacity>
         </View>
 
         {/* Scroll Content */}
         <ScrollView contentContainerStyle={{ paddingHorizontal: 30, paddingBottom: 20 }}>
           {/* Govt Schemes */}
           {selectedTab === 'GovtSchemes' && (
             <>
               <View style={{ flexDirection: 'row', borderWidth: 1, borderColor: '#006644', borderRadius: 10, padding: 10, marginBottom: 10, backgroundColor: '#e9e9e1' }}>
                 <Image source={require('../../../images/govt.png')} style={{ width: 80, height: 80, borderRadius: 8, marginRight: 20 }} />
                 <View style={{ flex: 1, justifyContent: 'space-between' }}>
                   <Text style={{ color: '#006644', fontWeight: 'bold', fontSize: 16 }}>{t('expertUpdates.eschemes.subsidyTitle')}</Text>
                   <Text style={{ color: '#888', fontSize: 12, marginVertical: 5 }}>2025-08-13</Text>
                   <TouchableOpacity onPress={() => navigation.navigate('ExpertGovtReadMore')} style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', backgroundColor: '#006644', paddingVertical: 5, paddingHorizontal: 10, borderRadius: 20 }}>
            <Text style={{ color: '#fff', marginRight: 5 }}>{t('expertUpdates.ereadMore')}</Text>
 
                     <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: '#e9e9e1', justifyContent: 'center', alignItems: 'center' }}>
                       <Icon name="arrow-forward" size={14} color="#006644" />
                     </View>
                   </TouchableOpacity>
                 </View>
               </View>
 
               <View style={{ flexDirection: 'row', borderWidth: 1, borderColor: '#006644', borderRadius: 10, padding: 10, marginBottom: 10, backgroundColor: '#e9e9e1' }}>
                 <Image source={require('../../../images/govt.png')} style={{ width: 80, height: 80, borderRadius: 8, marginRight: 20 }} />
                 <View style={{ flex: 1, justifyContent: 'space-between' }}>
                   <Text style={{ color: '#006644', fontWeight: 'bold', fontSize: 16 }}>{t('expertUpdates.eschemes.subsidyTitle')}</Text>
                   <Text style={{ color: '#888', fontSize: 12, marginVertical: 5 }}>2025-08-10</Text>
                   <TouchableOpacity onPress={() => navigation.navigate('ExpertGovtReadMore')} style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', backgroundColor: '#006644', paddingVertical: 5, paddingHorizontal: 10, borderRadius: 20 }}>
                    <Text style={{ color: '#fff', marginRight: 5 }}>{t('expertUpdates.ereadMore')}</Text>
 
                     <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: '#e9e9e1', justifyContent: 'center', alignItems: 'center' }}>
                       <Icon name="arrow-forward" size={14} color="#006644" />
                     </View>
                   </TouchableOpacity>
                 </View>
               </View>
             </>
           )}
 
           {/* Market Prices */}
           {selectedTab === 'MarketPrices' && (
             <>
               <View style={{ flexDirection: 'row', borderWidth: 1, borderColor: '#006644', borderRadius: 10, padding: 10, marginBottom: 10, backgroundColor: '#e9e9e1' }}>
                 <Image source={require('../../../images/c.png')} style={{ width: 80, height: 80, borderRadius: 8, marginRight: 20 }} />
                 <View style={{ flex: 1, justifyContent: 'space-between' }}>
                   <Text style={{ color: '#006644', fontWeight: 'bold', fontSize: 16 }}>{t('expertUpdates.emarket.marketTitle')}</Text>
                   <Text style={{ color: '#888', fontSize: 12, marginVertical: 5 }}>2025-08-14</Text>
                   <TouchableOpacity onPress={() => navigation.navigate('ExpertMPriceReadMore')} style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', backgroundColor: '#006644', paddingVertical: 5, paddingHorizontal: 10, borderRadius: 20 }}>
                     <Text style={{ color: '#fff', marginRight: 5 }}>{t('expertUpdates.ereadMore')}</Text>
 
                     <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: '#e9e9e1', justifyContent: 'center', alignItems: 'center' }}>
                       <Icon name="arrow-forward" size={14} color="#006644" />
                     </View>
                   </TouchableOpacity>
                 </View>
               </View>
 
               <View style={{ flexDirection: 'row', borderWidth: 1, borderColor: '#006644', borderRadius: 10, padding: 10, marginBottom: 10, backgroundColor: '#e9e9e1' }}>
                 <Image source={require('../../../images/a.png')} style={{ width: 80, height: 80, borderRadius: 8, marginRight: 20 }} />
                 <View style={{ flex: 1, justifyContent: 'space-between' }}>
                   <Text style={{ color: '#006644', fontWeight: 'bold', fontSize: 16 }}>{t('expertUpdates.emarket.marketTitle')}</Text>
                   <Text style={{ color: '#888', fontSize: 12, marginVertical: 5 }}>2025-08-11</Text>
                   <TouchableOpacity onPress={() => navigation.navigate('ExpertMPriceReadMore')} style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', backgroundColor: '#006644', paddingVertical: 5, paddingHorizontal: 10, borderRadius: 20 }}>
                    <Text style={{ color: '#fff', marginRight: 5 }}>{t('expertUpdates.ereadMore')}</Text>
 
                     <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: '#e9e9e1', justifyContent: 'center', alignItems: 'center' }}>
                       <Icon name="arrow-forward" size={14} color="#006644" />
                     </View>
                   </TouchableOpacity>
                 </View>
               </View>
             </>
           )}
 
           {/* Crop Info */}
           {selectedTab === 'CropInfo' && (
             <>
               <View style={{ flexDirection: 'row', borderWidth: 1, borderColor: '#006644', borderRadius: 10, padding: 10, marginBottom: 10, backgroundColor: '#e9e9e1' }}>
                 <Image source={require('../../../images/b.png')} style={{ width: 80, height: 80, borderRadius: 8, marginRight: 20 }} />
                 <View style={{ flex: 1, justifyContent: 'space-between' }}>
                   <Text style={{ color: '#006644', fontWeight: 'bold', fontSize: 16 }}> {t('expertUpdates.ecrop.cropTitle')}</Text>
                   <Text style={{ color: '#888', fontSize: 12, marginVertical: 5 }}>2025-08-12</Text>
                   <TouchableOpacity onPress={() => navigation.navigate('ExpertCropReadMore')} style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', backgroundColor: '#006644', paddingVertical: 5, paddingHorizontal: 10, borderRadius: 20 }}>
                    <Text style={{ color: '#fff', marginRight: 5 }}>{t('expertUpdates.ereadMore')}</Text>
 
                     <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: '#e9e9e1', justifyContent: 'center', alignItems: 'center' }}>
                       <Icon name="arrow-forward" size={14} color="#006644" />
                     </View>
                   </TouchableOpacity>
                 </View>
               </View>
 
               <View style={{ flexDirection: 'row', borderWidth: 1, borderColor: '#006644', borderRadius: 10, padding: 10, marginBottom: 10, backgroundColor: '#e9e9e1' }}>
                 <Image source={require('../../../images/a.png')} style={{ width: 80, height: 80, borderRadius: 8, marginRight: 20 }} />
                 <View style={{ flex: 1, justifyContent: 'space-between' }}>
                   <Text style={{ color: '#006644', fontWeight: 'bold', fontSize: 16 }}> {t('expertUpdates.ecrop.cropTitle')}</Text>
                   <Text style={{ color: '#888', fontSize: 12, marginVertical: 5 }}>2025-08-09</Text>
                   <TouchableOpacity onPress={() => navigation.navigate('ExpertCropReadMore')} style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', backgroundColor: '#006644', paddingVertical: 5, paddingHorizontal: 10, borderRadius: 20 }}>
                     <Text style={{ color: '#fff', marginRight: 5 }}>{t('expertUpdates.ereadMore')}</Text>
 
                     <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: '#e9e9e1', justifyContent: 'center', alignItems: 'center' }}>
                       <Icon name="arrow-forward" size={14} color="#006644" />
                     </View>
                   </TouchableOpacity>
                 </View>
               </View>
             </>
           )}
         </ScrollView>
       </ImageBackground>
     </SafeAreaView>
   );
};

export default ExpertUpdate;
