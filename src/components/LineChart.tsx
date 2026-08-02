import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import { colors } from '../theme/theme';

interface LineChartProps {
  data: number[];
  height?: number;
  width?: number;
  color?: string;
}

export function LineChart({ data, height = 100, width = 300, color = colors.primary }: LineChartProps) {
  if (!data || data.length === 0) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  // Padding to keep the stroke from clipping
  const paddingY = 10;
  const paddingX = 0;
  const graphWidth = width - paddingX * 2;
  const graphHeight = height - paddingY * 2;

  const hasNegative = min < 0;
  const hasPositive = max > 0;
  
  // Calculate where the zero line falls (0 to 1)
  let zeroOffset = 1;
  let zeroY = paddingY + graphHeight;
  
  if (hasNegative && hasPositive) {
    zeroY = paddingY + graphHeight - ((0 - min) / range) * graphHeight;
    zeroOffset = (zeroY - paddingY) / graphHeight;
  } else if (!hasPositive) {
    zeroOffset = 0;
    zeroY = paddingY;
  }

  // Build the SVG path string
  let pathStr = '';
  data.forEach((val, i) => {
    const x = paddingX + (i / (data.length - 1)) * graphWidth;
    const y = paddingY + graphHeight - ((val - min) / range) * graphHeight;
    
    if (i === 0) {
      pathStr += `M ${x} ${y} `;
    } else {
      pathStr += `L ${x} ${y} `;
    }
  });

  return (
    <View style={[styles.container, { height }]}>
      <Svg height={height} width="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
        <Defs>
          <LinearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={colors.good} />
            <Stop offset={zeroOffset} stopColor={colors.good} />
            <Stop offset={zeroOffset} stopColor={colors.bad} />
            <Stop offset="1" stopColor={colors.bad} />
          </LinearGradient>

          <LinearGradient id="fillGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={colors.good} stopOpacity="0.4" />
            <Stop offset={zeroOffset} stopColor={colors.good} stopOpacity="0.0" />
            <Stop offset={zeroOffset} stopColor={colors.bad} stopOpacity="0.0" />
            <Stop offset="1" stopColor={colors.bad} stopOpacity="0.4" />
          </LinearGradient>
        </Defs>

        {hasNegative && hasPositive && (
          <Path
            d={`M ${paddingX} ${zeroY} L ${width - paddingX} ${zeroY}`}
            stroke={colors.line}
            strokeWidth="1"
            strokeDasharray="4 4"
          />
        )}

        <Path 
          d={`${pathStr} L ${width - paddingX} ${zeroY} L ${paddingX} ${zeroY} Z`} 
          fill={hasNegative ? "url(#fillGrad)" : "url(#lineGrad)"} 
          fillOpacity={hasNegative ? 1 : 0.2}
        />
        
        <Path 
          d={pathStr} 
          fill="none" 
          stroke={hasNegative ? "url(#lineGrad)" : colors.good} 
          strokeWidth="3" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    overflow: 'hidden',
    marginTop: 10,
  },
});
