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

// A full football pitch drawn in a viewBox of [0,100]x[0,58] (105m x 68m,
// standard pitch aspect). Scaled with preserveAspectRatio "slice" so it
// always covers the whole screen and reads as an entire pitch behind
// the app content.
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
        viewBox="0 0 100 58"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Pitch grass fill */}
        <RectSvg x={0} y={0} width={100} height={58} fill={BG} />

        {/* Mowing stripes */}
        <GStroke>
          {[7.5, 22.5, 37.5, 52.5].map((x) => (
            <LineSvg
              key={x}
              x1={x}
              y1={0}
              x2={x}
              y2={58}
              stroke={CENTER}
              strokeWidth={0.6}
              opacity={0.6}
            />
          ))}
        </GStroke>

        {/* Outer boundary */}
        <RectSvg
          x={2.5}
          y={2}
          width={95}
          height={54}
          fill="none"
          stroke={PITCH_LINE}
          strokeWidth={0.5}
        />

        {/* Halfway line */}
        <LineSvg x1={50} y1={2} x2={50} y2={56} stroke={PITCH_LINE} strokeWidth={0.4} />

        {/* Center circle + spot */}
        <CircleSvg cx={50} cy={29} r={9.15} fill="none" stroke={PITCH_LINE} strokeWidth={0.4} />
        <CircleSvg cx={50} cy={29} r={0.6} fill={PITCH_LINE} />

        {/* Penalty boxes */}
        <RectSvg x={2.5} y={15} width={16.5} height={28} fill="none" stroke={PITCH_LINE} strokeWidth={0.4} />
        <RectSvg x={81} y={15} width={16.5} height={28} fill="none" stroke={PITCH_LINE} strokeWidth={0.4} />

        {/* Goal areas */}
        <RectSvg x={2.5} y={22.5} width={5.5} height={13} fill="none" stroke={PITCH_LINE} strokeWidth={0.4} />
        <RectSvg x={92} y={22.5} width={5.5} height={13} fill="none" stroke={PITCH_LINE} strokeWidth={0.4} />

        {/* Penalty spots */}
        <CircleSvg cx={11} cy={29} r={0.5} fill={PITCH_LINE} />
        <CircleSvg cx={89} cy={29} r={0.5} fill={PITCH_LINE} />

        {/* Penalty arcs */}
        <PathSvg
          d="M 2.5 24.5 A 9.15 9.15 0 0 0 2.5 33.5"
          fill="none"
          stroke={PITCH_LINE}
          strokeWidth={0.4}
        />
        <PathSvg
          d="M 97.5 24.5 A 9.15 9.15 0 0 1 97.5 33.5"
          fill="none"
          stroke={PITCH_LINE}
          strokeWidth={0.4}
        />

        {/* Corner arcs */}
        <PathSvg d="M 2.5 4.5 A 2 2 0 0 0 4.5 2" fill="none" stroke={PITCH_LINE} strokeWidth={0.4} />
        <PathSvg d="M 97.5 2 A 2 2 0 0 0 95.5 4.5" fill="none" stroke={PITCH_LINE} strokeWidth={0.4} />
        <PathSvg d="M 2.5 53.5 A 2 2 0 0 0 4.5 56" fill="none" stroke={PITCH_LINE} strokeWidth={0.4} />
        <PathSvg d="M 97.5 56 A 2 2 0 0 0 95.5 53.5" fill="none" stroke={PITCH_LINE} strokeWidth={0.4} />
      </Svg>

      {/* Content on top */}
      <View className="flex-1">{children}</View>
    </View>
  );
}
