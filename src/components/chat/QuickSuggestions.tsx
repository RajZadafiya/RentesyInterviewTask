import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import Animated, { FadeInRight } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Palette } from '@/constants/colors';
import { QUICK_SUGGESTIONS } from '@/constants/mockData';
import { QuickSuggestion } from '@/types/chat';
import { triggerHaptic } from '@/utils/haptics';

interface QuickSuggestionsProps {
  onSelectSuggestion: (suggestion: QuickSuggestion) => void;
}

export const QuickSuggestions: React.FC<QuickSuggestionsProps> = ({
  onSelectSuggestion,
}) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {QUICK_SUGGESTIONS.map((item, index) => (
        <Animated.View
          key={item.id}
          entering={FadeInRight.delay(index * 60).duration(260)}
        >
          <TouchableOpacity
            style={styles.chip}
            activeOpacity={0.75}
            onPress={() => {
              triggerHaptic('light');
              onSelectSuggestion(item);
            }}
          >
            <Ionicons
              name={item.iconName as any}
              size={14}
              color={Palette.secondaryLight}
            />
            <Text style={styles.chipText}>{item.label}</Text>
          </TouchableOpacity>
        </Animated.View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
    flexDirection: 'row',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Palette.surfaceElevated,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Palette.glassBorder,
  },
  chipText: {
    fontSize: 12,
    color: Palette.textSecondary,
    fontWeight: '500',
  },
});

