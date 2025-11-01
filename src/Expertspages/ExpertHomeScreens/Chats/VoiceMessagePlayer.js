import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

// Optional dynamic import to avoid hard dependency at bundle time
let _arpInstance = null;
const getAudioRecorderPlayer = () => {
  if (_arpInstance) return _arpInstance;
  try {
    const mod = require('react-native-audio-recorder-player');
    const Exported = mod?.default ?? mod;
    _arpInstance = typeof Exported === 'function' ? new Exported() : Exported;
  } catch (e) {
    _arpInstance = null;
  }
  return _arpInstance;
};

export default function VoiceMessagePlayer({
  isCurrentUser,
  audioUrl,
  durationMs,
  isRead,
  isDelivered,
  createdAt,
}) {
  const playerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(durationMs || 0);

  // Display TOTAL duration (mm:ss), not remaining time
  const mmss = useMemo(() => {
    const total = Math.max(0, Math.round((duration || 0) / 1000));
    const m = String(Math.floor(total / 60)).padStart(2, '0');
    const s = String(total % 60).padStart(2, '0');
    return `${m}:${s}`;
  }, [duration]);

  // If prop provides duration, adopt it
  useEffect(() => {
    if (durationMs && !duration) setDuration(durationMs);
  }, [durationMs, duration]);

  useEffect(() => {
    return () => {
      try {
        playerRef.current?.stopPlayer?.();
        playerRef.current?.removePlayBackListener?.();
      } catch {}
    };
  }, []);

  const start = async () => {
    if (!audioUrl) return;
    const ARP = getAudioRecorderPlayer();
    if (!ARP) return; // silently no-op if not installed
    try {
      if (!playerRef.current) playerRef.current = ARP;
      playerRef.current.removePlayBackListener();
      await playerRef.current.startPlayer(audioUrl);
      playerRef.current.addPlayBackListener((e) => {
        setPosition(e.currentPosition);
        if (!duration && e.duration > 0) setDuration(e.duration);
        if (e.currentPosition >= e.duration) {
          setIsPlaying(false);
          playerRef.current.removePlayBackListener();
        }
      });
      setIsPlaying(true);
    } catch {}
  };

  const stop = async () => {
    try {
      await playerRef.current?.stopPlayer?.();
      playerRef.current?.removePlayBackListener?.();
    } catch {}
    setIsPlaying(false);
    setPosition(0);
  };

  const togglePlay = () => {
    if (isPlaying) stop();
    else start();
  };

  const progressPct = duration > 0 ? Math.min(100, Math.max(0, (position / duration) * 100)) : 0;

  return (
    <View style={[
      styles.voiceBubbleBase,
      isCurrentUser ? styles.senderVoiceBubble : styles.receiverVoiceBubble,
    ]}>
      <TouchableOpacity onPress={togglePlay} style={styles.playBtn}>
        <Icon name={isPlaying ? 'pause' : 'play'} size={18} color="#075E54" />
      </TouchableOpacity>
      <View style={styles.progressBar}>
        <View style={[styles.progress, { width: `${progressPct}%` }]} />
      </View>
      <Text style={styles.duration}>{mmss}</Text>
      <View style={styles.meta}>
        <Text style={styles.timeText}>
          {new Date(createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
        {isCurrentUser && (
          <Text style={[styles.tickText, { color: isRead ? '#34B7F1' : isDelivered ? '#999' : '#aaa' }]}>
            {isRead ? '✓✓' : isDelivered ? '✓✓' : '✓'}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  voiceBubbleBase: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    maxWidth: '80%',
    minWidth: 180,
    marginBottom: 6,
  },
  senderVoiceBubble: {
    backgroundColor: '#DCF8C6',
    borderTopRightRadius: 2,
    marginRight: 8,
    paddingRight: 45,
  },
  receiverVoiceBubble: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 2,
    marginLeft: 8,
  },
  playBtn: { padding: 6 },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 10,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
    backgroundColor: '#075E54',
  },
  duration: { fontSize: 12, color: '#888', marginLeft: 6 },
  meta: { position: 'absolute', right: 12, bottom: 4, flexDirection: 'row', alignItems: 'center' },
  timeText: { fontSize: 10, color: '#667781', opacity: 0.9, marginRight: 2 },
  tickText: { fontSize: 11 },
});
