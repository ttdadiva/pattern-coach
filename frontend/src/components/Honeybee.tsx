import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle, Ellipse, Path, G, Rect } from 'react-native-svg';
import { COLORS } from '../theme';

interface HoneybeeProps {
  size?: number;
  expression?: 'happy' | 'excited' | 'thinking' | 'sleeping';
}

export const Honeybee: React.FC<HoneybeeProps> = ({ 
  size = 100,
  expression = 'happy'
}) => {
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} viewBox="0 0 100 100">
        {/* Wings */}
        <Ellipse cx="25" cy="45" rx="15" ry="20" fill="#E0F2FE" opacity={0.8} />
        <Ellipse cx="75" cy="45" rx="15" ry="20" fill="#E0F2FE" opacity={0.8} />
        
        {/* Body */}
        <Ellipse cx="50" cy="55" rx="25" ry="30" fill="#FBBF24" />
        
        {/* Stripes */}
        <Path d="M30 45 Q50 40 70 45" stroke="#1F2937" strokeWidth="6" fill="none" />
        <Path d="M28 55 Q50 50 72 55" stroke="#1F2937" strokeWidth="6" fill="none" />
        <Path d="M30 65 Q50 60 70 65" stroke="#1F2937" strokeWidth="6" fill="none" />
        
        {/* Head */}
        <Circle cx="50" cy="25" r="18" fill="#FBBF24" />
        
        {/* Antennae */}
        <Path d="M42 12 Q38 5 35 2" stroke="#1F2937" strokeWidth="2" fill="none" />
        <Circle cx="35" cy="2" r="3" fill="#1F2937" />
        <Path d="M58 12 Q62 5 65 2" stroke="#1F2937" strokeWidth="2" fill="none" />
        <Circle cx="65" cy="2" r="3" fill="#1F2937" />
        
        {/* Eyes based on expression */}
        {expression === 'happy' && (
          <G>
            <Circle cx="42" cy="23" r="5" fill="#FFFFFF" />
            <Circle cx="58" cy="23" r="5" fill="#FFFFFF" />
            <Circle cx="43" cy="24" r="3" fill="#1F2937" />
            <Circle cx="59" cy="24" r="3" fill="#1F2937" />
            <Circle cx="44" cy="23" r="1" fill="#FFFFFF" />
            <Circle cx="60" cy="23" r="1" fill="#FFFFFF" />
          </G>
        )}
        {expression === 'excited' && (
          <G>
            <Circle cx="42" cy="23" r="6" fill="#FFFFFF" />
            <Circle cx="58" cy="23" r="6" fill="#FFFFFF" />
            <Circle cx="43" cy="24" r="4" fill="#1F2937" />
            <Circle cx="59" cy="24" r="4" fill="#1F2937" />
            {/* Sparkles */}
            <Path d="M30 15 L32 12 L34 15 L32 18 Z" fill="#FBBF24" />
            <Path d="M66 15 L68 12 L70 15 L68 18 Z" fill="#FBBF24" />
          </G>
        )}
        {expression === 'thinking' && (
          <G>
            <Circle cx="42" cy="23" r="5" fill="#FFFFFF" />
            <Circle cx="58" cy="23" r="5" fill="#FFFFFF" />
            <Circle cx="44" cy="24" r="3" fill="#1F2937" />
            <Circle cx="60" cy="24" r="3" fill="#1F2937" />
            {/* Thought bubble */}
            <Circle cx="75" cy="10" r="3" fill="#E5E7EB" />
            <Circle cx="80" cy="5" r="2" fill="#E5E7EB" />
          </G>
        )}
        {expression === 'sleeping' && (
          <G>
            <Path d="M37 23 Q42 20 47 23" stroke="#1F2937" strokeWidth="2" fill="none" />
            <Path d="M53 23 Q58 20 63 23" stroke="#1F2937" strokeWidth="2" fill="none" />
            {/* Z's */}
            <Path d="M70 10 L75 10 L70 15 L75 15" stroke="#6B7280" strokeWidth="1.5" fill="none" />
            <Path d="M77 5 L81 5 L77 9 L81 9" stroke="#6B7280" strokeWidth="1" fill="none" />
          </G>
        )}
        
        {/* Smile */}
        {expression !== 'sleeping' && (
          <Path
            d="M42 32 Q50 40 58 32"
            stroke="#1F2937"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
        )}
        
        {/* Blush */}
        <Ellipse cx="35" cy="28" rx="4" ry="2" fill="#FDBA74" opacity={0.6} />
        <Ellipse cx="65" cy="28" rx="4" ry="2" fill="#FDBA74" opacity={0.6} />
        
        {/* Stinger */}
        <Path d="M50 85 L50 92" stroke="#1F2937" strokeWidth="3" strokeLinecap="round" />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
