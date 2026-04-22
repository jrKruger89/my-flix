import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts } from '@/constants/theme';

interface ProgressBarProps {
  minutesWatched: number;
  totalRuntime: number;
  height?: number;
}

export default function ProgressBar({
  minutesWatched,
  totalRuntime,
  height = 6,
}: ProgressBarProps) {
  const percentage = Math.min((minutesWatched / totalRuntime) * 100, 100);

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <View style={styles.container}>
      <View style={[styles.progressTrack, { height }]}>
        <View
          style={[
            styles.progressFill,
            { width: `${percentage}%`, height },
          ]}
        />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.timeText}>
          {formatTime(minutesWatched)} / {formatTime(totalRuntime)}
        </Text>
        <Text style={styles.percentageText}>{Math.round(percentage)}%</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  progressTrack: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    backgroundColor: colors.accent1,
    borderRadius: 3,
  },
  textContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: fonts.regular,
  },
  percentageText: {
    color: colors.accent1,
    fontSize: 12,
    fontFamily: fonts.regular,
    fontWeight: 'bold',
  },
});