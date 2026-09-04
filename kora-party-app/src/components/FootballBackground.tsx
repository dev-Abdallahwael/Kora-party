import React from "react";
import { View } from "react-native";
import Svg, {
  Rect as RectSvg,
  Circle as CircleSvg,
  Line as LineSvg,
  Path as PathSvg,
  G as GStroke,
} from "react-native-svg";

const PITCH_LINE = "#1E4526";
const CENTER = "#14371B";
const BG = "#0B1F0E";

// A full football pitch drawn VERTICALLY (portrait) in a viewBox of
// [0,58] x [0,100] so that it fills a mobile screen top-to-bottom:
// one goal at the top, one at the bottom, like viewing the pitch
// standing on the halfway line.
export default function FootballBackground({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <View className="flex-1 bg-background overflow-hidden">
      <Svg
        pointerEvents="none"
        style={{ position: "absolute", top: 0, left: 0 }}
        width="100%"
        height="100%"
        viewBox="0 0 58 100"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Pitch grass fill */}
        <RectSvg x={0} y={0} width={58} height={100} fill={BG} />

        {/* Mowing stripes (horizontal) */}
        <GStroke>
          {[7.5, 22.5, 37.5, 52.5, 67.5, 82.5, 95].map((y) => (
            <LineSvg
              key={y}
              x1={0}
              y1={y}
              x2={58}
              y2={y}
              stroke={CENTER}
              strokeWidth={0.7}
              opacity={0.6}
            />
          ))}
        </GStroke>

        {/* Outer boundary */}
        <RectSvg
          x={3}
          y={2.5}
          width={52}
          height={95}
          fill="none"
          stroke={PITCH_LINE}
          strokeWidth={0.5}
        />

        {/* Halfway line (horizontal across middle) */}
        <LineSvg x1={3} y1={50} x2={55} y2={50} stroke={PITCH_LINE} strokeWidth={0.4} />

        {/* Center circle + spot */}
        <CircleSvg cx={29} cy={50} r={9.15} fill="none" stroke={PITCH_LINE} strokeWidth={0.4} />
        <CircleSvg cx={29} cy={50} r={0.6} fill={PITCH_LINE} />

        {/* Penalty boxes (top and bottom) */}
        <RectSvg x={15} y={2.5} width={28} height={16.5} fill="none" stroke={PITCH_LINE} strokeWidth={0.4} />
        <RectSvg x={15} y={81} width={28} height={16.5} fill="none" stroke={PITCH_LINE} strokeWidth={0.4} />

        {/* Goal areas */}
        <RectSvg x={22.5} y={2.5} width={13} height={5.5} fill="none" stroke={PITCH_LINE} strokeWidth={0.4} />
        <RectSvg x={22.5} y={92} width={13} height={5.5} fill="none" stroke={PITCH_LINE} strokeWidth={0.4} />

        {/* Penalty spots */}
        <CircleSvg cx={29} cy={11} r={0.5} fill={PITCH_LINE} />
        <CircleSvg cx={29} cy={89} r={0.5} fill={PITCH_LINE} />

        {/* Penalty arcs */}
        <PathSvg
          d="M 18.5 2.5 A 9.15 9.15 0 0 0 39.5 2.5"
          fill="none"
          stroke={PITCH_LINE}
          strokeWidth={0.4}
        />
        <PathSvg
          d="M 18.5 97.5 A 9.15 9.15 0 0 1 39.5 97.5"
          fill="none"
          stroke={PITCH_LINE}
          strokeWidth={0.4}
        />

        {/* Corner arcs */}
        <PathSvg d="M 5 4.5 A 2 2 0 0 0 3 6.5" fill="none" stroke={PITCH_LINE} strokeWidth={0.4} />
        <PathSvg d="M 53 4.5 A 2 2 0 0 1 55 6.5" fill="none" stroke={PITCH_LINE} strokeWidth={0.4} />
        <PathSvg d="M 5 95.5 A 2 2 0 0 1 3 93.5" fill="none" stroke={PITCH_LINE} strokeWidth={0.4} />
        <PathSvg d="M 53 95.5 A 2 2 0 0 0 55 93.5" fill="none" stroke={PITCH_LINE} strokeWidth={0.4} />
      </Svg>

      {/* Content on top */}
      <View className="flex-1">{children}</View>
    </View>
  );
}
