import React, { useMemo, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, PermissionsAndroid, Platform } from 'react-native';
import RNFS from 'react-native-fs';
import Icon from 'react-native-vector-icons/Ionicons';

// Optional dynamic import so the app still runs if the module isn't installed yet
let _ARPModule = null;
let _arpInstance = null;
const getAudioRecorderPlayer = () => {
  if (_arpInstance) return _arpInstance;
  try {
    _ARPModule = require('react-native-audio-recorder-player');
    const Exported = _ARPModule?.default ?? _ARPModule;
    _arpInstance = typeof Exported === 'function' ? new Exported() : Exported;
  } catch (e) {
    _ARPModule = null;
    _arpInstance = null;
  }
  return _arpInstance;
};

export default function VoiceRecorderInput({ onSendVoice, onToggleRecording, isRecordingMode }) {
  const recorderRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordSecs, setRecordSecs] = useState(0);

  const mmss = useMemo(() => {
    const total = Math.floor(recordSecs / 1000);
    const m = String(Math.floor(total / 60)).padStart(2, '0');
    const s = String(total % 60).padStart(2, '0');
    return `${m}:${s}`;
  }, [recordSecs]);

  const requestPermissionAndroid = async () => {
    if (Platform.OS !== 'android') return true;
    try {
      const result = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO);
      return result === PermissionsAndroid.RESULTS.GRANTED;
    } catch {
      return false;
    }
  };

  const startRecording = async () => {
    const ARP = getAudioRecorderPlayer();
    if (!ARP) {
      return Alert.alert('Recorder unavailable', 'Please install react-native-audio-recorder-player and rebuild.');
    }
    const ok = await requestPermissionAndroid();
    if (!ok) return Alert.alert('Permission', 'Microphone permission denied.');

    try {
      setRecordSecs(0);
      if (!recorderRef.current) recorderRef.current = ARP;
      const {
        AudioEncoderAndroidType,
        AudioSourceAndroidType,
        OutputFormatAndroidType,
        AVEncodingOption,
        AVEncoderAudioQualityIOSType,
      } = _ARPModule || {};

      recorderRef.current.removeRecordBackListener();
      recorderRef.current.addRecordBackListener((e) => {
        setRecordSecs(e.currentPosition);
      });
      const audioSet = {
        AudioEncoderAndroid: AudioEncoderAndroidType?.AAC,
        AudioSourceAndroid: AudioSourceAndroidType?.MIC,
        OutputFormatAndroid: OutputFormatAndroidType?.MPEG_4,
        AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType?.high,
        AVNumberOfChannelsKeyIOS: 2,
        AVFormatIDKeyIOS: AVEncodingOption?.aac,
      };
      const filePath = `${RNFS.CachesDirectoryPath}/voice_${Date.now()}.m4a`;
      const uri = await recorderRef.current.startRecorder(filePath, audioSet);
      setIsRecording(true);
    } catch (e) {
      const msg = (e && (e.message || e.toString())) || 'Unknown';
      Alert.alert('Error', `Unable to start recording.\n${msg}`);
    }
  };

  const stopRecording = async () => {
    try {
      const resultPath = await recorderRef.current.stopRecorder();
      recorderRef.current.removeRecordBackListener();
      setIsRecording(false);
      const durationSeconds = Math.max(1, Math.round(recordSecs / 1000));
      setRecordSecs(0);
      if (resultPath) {
        // Send and exit recording mode
        onSendVoice?.(resultPath, durationSeconds);
        onToggleRecording?.(false);
      }
    } catch (e) {
      Alert.alert('Error', 'Unable to stop recording.');
    }
  };

  const onPressRecord = () => {
    if (isRecording) stopRecording();
    else startRecording();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => onToggleRecording(false)} style={styles.iconBtn}>
        <Icon name="chevron-back" size={22} color="#075E54" />
      </TouchableOpacity>

      <View style={styles.recArea}>
        <Icon name={isRecording ? 'mic' : 'mic-outline'} size={22} color={isRecording ? '#d00' : '#075E54'} />
        <Text style={styles.recText}>{isRecording ? `Recording... ${mmss}` : 'Recording mode'}</Text>
      </View>

      <TouchableOpacity onPress={onPressRecord} style={styles.primaryBtn}>
        <Icon name={isRecording ? 'stop' : 'radio'} size={20} color="#fff" />
        <Text style={styles.primaryText}>{isRecording ? 'Stop' : 'Record'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  iconBtn: { padding: 8 },
  recArea: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  recText: { marginLeft: 8, color: '#555' },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#075E54',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  primaryText: { color: '#fff', fontWeight: '700', marginLeft: 6 },
});
