import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle, Ellipse, Path, Rect, G } from 'react-native-svg';
import { COLORS } from '../theme';

interface AvatarProps {
  size?: number;
  avatar?: {
    skin_color?: string;
    hair_style?: string;
    hair_color?: string;
    outfit?: string;
    accessory?: string;
  };
}

export const Avatar: React.FC<AvatarProps> = ({ 
  size = 100, 
  avatar = {} 
}) => {
  const {
    skin_color = '#FFD4B8',
    hair_style = 'curly',
    hair_color = '#4A2C2A',
    outfit = 'explorer',
    accessory = 'none'
  } = avatar;

  const scale = size / 100;

  const getOutfitColor = () => {
    switch (outfit) {
      case 'explorer': return COLORS.primary;
      case 'scientist': return COLORS.info;
      case 'artist': return COLORS.secondary;
      case 'athlete': return COLORS.warning;
      default: return COLORS.primary;
    }
  };

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} viewBox="0 0 100 100">
        {/* Body/Outfit */}
        <Path
          d="M25 95 L35 65 L65 65 L75 95 Z"
          fill={getOutfitColor()}
        />
        
        {/* Head */}
        <Circle cx="50" cy="40" r="25" fill={skin_color} />
        
        {/* Hair based on style */}
        {hair_style === 'curly' && (
          <G>
            <Circle cx="35" cy="25" r="8" fill={hair_color} />
            <Circle cx="50" cy="20" r="9" fill={hair_color} />
            <Circle cx="65" cy="25" r="8" fill={hair_color} />
            <Circle cx="30" cy="35" r="6" fill={hair_color} />
            <Circle cx="70" cy="35" r="6" fill={hair_color} />
          </G>
        )}
        {hair_style === 'straight' && (
          <Path
            d="M25 35 L25 20 Q50 5 75 20 L75 35 Q65 30 50 30 Q35 30 25 35 Z"
            fill={hair_color}
          />
        )}
        {hair_style === 'spiky' && (
          <G>
            <Path d="M35 30 L30 10 L40 25 Z" fill={hair_color} />
            <Path d="M45 25 L45 5 L55 25 Z" fill={hair_color} />
            <Path d="M55 25 L55 5 L65 25 Z" fill={hair_color} />
            <Path d="M65 30 L70 10 L60 25 Z" fill={hair_color} />
          </G>
        )}
        {hair_style === 'ponytail' && (
          <G>
            <Ellipse cx="50" cy="22" rx="20" ry="10" fill={hair_color} />
            <Path d="M65 25 Q80 30 75 50 Q70 45 65 40 Z" fill={hair_color} />
          </G>
        )}
        
        {/* Eyes */}
        <Circle cx="40" cy="38" r="4" fill="#FFFFFF" />
        <Circle cx="60" cy="38" r="4" fill="#FFFFFF" />
        <Circle cx="41" cy="39" r="2" fill="#1F2937" />
        <Circle cx="61" cy="39" r="2" fill="#1F2937" />
        
        {/* Smile */}
        <Path
          d="M40 50 Q50 58 60 50"
          stroke="#1F2937"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
        
        {/* Blush */}
        <Ellipse cx="32" cy="45" rx="5" ry="3" fill="#FECACA" opacity={0.6} />
        <Ellipse cx="68" cy="45" rx="5" ry="3" fill="#FECACA" opacity={0.6} />
        
        {/* Accessories */}
        {accessory === 'glasses' && (
          <G>
            <Circle cx="40" cy="38" r="7" stroke="#374151" strokeWidth="2" fill="none" />
            <Circle cx="60" cy="38" r="7" stroke="#374151" strokeWidth="2" fill="none" />
            <Path d="M47 38 L53 38" stroke="#374151" strokeWidth="2" />
          </G>
        )}
        {accessory === 'hat' && (
          <G>
            <Ellipse cx="50" cy="18" rx="30" ry="5" fill={COLORS.warning} />
            <Rect x="35" y="5" width="30" height="15" rx="5" fill={COLORS.warning} />
          </G>
        )}
        {accessory === 'bow' && (
          <G>
            <Path d="M30 20 Q20 15 25 25 Q30 20 35 25 Q40 15 30 20 Z" fill="#EC4899" />
            <Circle cx="30" cy="22" r="3" fill="#F472B6" />
          </G>
        )}
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
