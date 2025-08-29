import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const NumericPad = ({ onPressNumber, onBackspace, onSubmit }) => {
    return (
        <View style={{ width: '100%', marginBottom: 20 }}>

            {/* Row 1 */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                <TouchableOpacity onPress={() => onPressNumber('1')} style={{ flex: 1, marginHorizontal: 5, paddingVertical: 14, borderRadius: 8, backgroundColor: '#fff', alignItems: 'center' }}>
                    <Text style={{ fontSize: 25, fontWeight: 'bold', color: '#006644' }}>1</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onPressNumber('2')} style={{ flex: 1, marginHorizontal: 5, paddingVertical: 14, borderRadius: 8, backgroundColor: '#fff', alignItems: 'center' }}>
                    <Text style={{ fontSize: 25, fontWeight: 'bold', color: '#006644' }}>2</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onPressNumber('3')} style={{ flex: 1, marginHorizontal: 5, paddingVertical: 14, borderRadius: 8, backgroundColor: '#fff', alignItems: 'center' }}>
                    <Text style={{ fontSize: 25, fontWeight: 'bold', color: '#006644' }}>3</Text>
                </TouchableOpacity>
            </View>

            {/* Row 2 */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                <TouchableOpacity onPress={() => onPressNumber('4')} style={{ flex: 1, marginHorizontal: 5, paddingVertical: 14, borderRadius: 8, backgroundColor: '#fff', alignItems: 'center' }}>
                    <Text style={{ fontSize: 25, fontWeight: 'bold', color: '#006644' }}>4</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onPressNumber('5')} style={{ flex: 1, marginHorizontal: 5, paddingVertical: 14, borderRadius: 8, backgroundColor: '#fff', alignItems: 'center' }}>
                    <Text style={{ fontSize: 25, fontWeight: 'bold', color: '#006644' }}>5</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onPressNumber('6')} style={{ flex: 1, marginHorizontal: 5, paddingVertical: 14, borderRadius: 8, backgroundColor: '#fff', alignItems: 'center' }}>
                    <Text style={{ fontSize: 25, fontWeight: 'bold', color: '#006644' }}>6</Text>
                </TouchableOpacity>
            </View>

            {/* Row 3 */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                <TouchableOpacity onPress={() => onPressNumber('7')} style={{ flex: 1, marginHorizontal: 5, paddingVertical: 14, borderRadius: 8, backgroundColor: '#fff', alignItems: 'center' }}>
                    <Text style={{ fontSize: 25, fontWeight: 'bold', color: '#006644' }}>7</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onPressNumber('8')} style={{ flex: 1, marginHorizontal: 5, paddingVertical: 14, borderRadius: 8, backgroundColor: '#fff', alignItems: 'center' }}>
                    <Text style={{ fontSize: 25, fontWeight: 'bold', color: '#006644' }}>8</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onPressNumber('9')} style={{ flex: 1, marginHorizontal: 5, paddingVertical: 14, borderRadius: 8, backgroundColor: '#fff', alignItems: 'center' }}>
                    <Text style={{ fontSize: 25, fontWeight: 'bold', color: '#006644' }}>9</Text>
                </TouchableOpacity>
            </View>

            {/* Row 4 */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                <TouchableOpacity onPress={onBackspace} style={{ flex: 1, marginHorizontal: 5, paddingVertical: 14, borderRadius: 8, backgroundColor: '#fff', alignItems: 'center' }}>
                    <Text style={{ fontSize: 25, fontWeight: 'bold', color: '#006644' }}>X</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onPressNumber('0')} style={{ flex: 1, marginHorizontal: 5, paddingVertical: 14, borderRadius: 8, backgroundColor: '#fff', alignItems: 'center' }}>
                    <Text style={{ fontSize: 25, fontWeight: 'bold', color: '#006644' }}>0</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onSubmit} style={{ flex: 1, marginHorizontal: 5, paddingVertical: 14, borderRadius: 8, backgroundColor: '#fff', alignItems: 'center' }}>
                    <Text style={{ fontSize: 25, fontWeight: 'bold', color: '#006644' }}>✓</Text>
                </TouchableOpacity>
            </View>

        </View>
    );
};

export default NumericPad;
