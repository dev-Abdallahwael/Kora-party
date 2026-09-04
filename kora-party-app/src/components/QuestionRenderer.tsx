import React, { useRef } from "react";
import { View, Text, TouchableOpacity, TextInput, Image, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BundleType } from "../types";
import { useLang } from "../context/LangContext";

interface Props {
  type: BundleType;
  data: Record<string, any>;
  selectedAnswer: string | null;
  showResult: boolean;
  onSelect: (answer: string) => void;
  lang: string;
}

export default function QuestionRenderer({
  type,
  data,
  selectedAnswer,
  showResult,
  onSelect,
  lang,
}: Props) {
  const isAr = lang === "ar";

  switch (type) {
    case "guess-the-player":
      return <GuessThePlayer {...{ data, selectedAnswer, showResult, onSelect, isAr }} />;
    case "guess-by-history":
      return <GuessByHistory {...{ data, selectedAnswer, showResult, onSelect, isAr }} />;
    case "guess-the-nation":
      return <GuessTheNation {...{ data, selectedAnswer, showResult, onSelect, isAr }} />;
    case "higher-or-lower":
      return <HigherOrLower {...{ data, selectedAnswer, showResult, onSelect, isAr }} />;
    case "complete-the-lineup":
      return <CompleteTheLineup {...{ data, selectedAnswer, showResult, onSelect, isAr }} />;
    case "true-or-false":
      return <TrueOrFalse {...{ data, selectedAnswer, showResult, onSelect, isAr }} />;
    case "guess-by-silhouette":
      return <GuessBySilhouette {...{ data, selectedAnswer, showResult, onSelect, isAr }} />;
    default:
      return null;
  }
}

function BundleBadge({ label, color }: { label: string; color: string }) {
  return (
    <View className="rounded-lg px-3 py-1 mb-3" style={{ backgroundColor: `${color}20` }}>
      <Text className="text-xs font-bold" style={{ color }}>
        {label}
      </Text>
    </View>
  );
}

function OptionButton({
  label,
  sublabel,
  index,
  isSelected,
  isCorrect,
  showResult,
  onPress,
}: {
  label: string;
  sublabel?: string;
  index: number;
  isSelected: boolean;
  isCorrect: boolean;
  showResult: boolean;
  onPress: () => void;
}) {
  let borderColor = "border-border";
  let bgColor = "bg-surfaceCard";

  if (showResult && isSelected && isCorrect) {
    borderColor = "border-success";
    bgColor = "bg-success/10";
  } else if (showResult && isSelected && !isCorrect) {
    borderColor = "border-danger";
    bgColor = "bg-danger/10";
  } else if (showResult && isCorrect) {
    borderColor = "border-success";
    bgColor = "bg-success/10";
  } else if (isSelected) {
    borderColor = "border-primary";
    bgColor = "bg-primary/10";
  }

  const scale = useRef(new Animated.Value(1)).current;
  const translateX = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (!showResult) return;
    if (isCorrect) {
      scale.setValue(0.9);
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
        friction: 4,
        tension: 120,
      }).start();
    } else if (isSelected) {
      const shake = Animated.sequence([
        Animated.timing(translateX, { toValue: -10, duration: 60, useNativeDriver: true }),
        Animated.timing(translateX, { toValue: 10, duration: 60, useNativeDriver: true }),
        Animated.timing(translateX, { toValue: -8, duration: 60, useNativeDriver: true }),
        Animated.timing(translateX, { toValue: 8, duration: 60, useNativeDriver: true }),
        Animated.timing(translateX, { toValue: 0, duration: 60, useNativeDriver: true }),
      ]);
      shake.start();
    }
  }, [showResult, isCorrect, isSelected, scale, translateX]);

  const pressScale = useRef(new Animated.Value(1)).current;
  const onPressIn = () => {
    Animated.timing(pressScale, { toValue: 0.97, duration: 80, useNativeDriver: true }).start();
  };
  const onPressOut = () => {
    Animated.timing(pressScale, { toValue: 1, duration: 80, useNativeDriver: true }).start();
  };

  return (
    <Animated.View
      style={{ transform: [{ scale: pressScale }, { translateX }] }}
    >
      <TouchableOpacity
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        disabled={showResult}
        className={`rounded-2xl p-4 mb-3 border ${borderColor} ${bgColor}`}
        activeOpacity={0.8}
      >
        <Animated.View style={{ transform: [{ scale }] }} className="flex-row items-center">
          <View className="w-8 h-8 rounded-full bg-surface items-center justify-center mr-3">
            <Text className="text-textSecondary text-sm font-bold">
              {String.fromCharCode(65 + index)}
            </Text>
          </View>
          <View className="flex-1">
            <Text className="text-text font-semibold">{label}</Text>
            {sublabel && (
              <Text className="text-textMuted text-xs mt-1">{sublabel}</Text>
            )}
          </View>
          {showResult && isCorrect && (
            <Ionicons name="checkmark-circle" size={22} color="#4CAF50" />
          )}
          {showResult && isSelected && !isCorrect && (
            <Ionicons name="close-circle" size={22} color="#E53935" />
          )}
        </Animated.View>
      </TouchableOpacity>
    </Animated.View>
  );
}

function GuessThePlayer({ data, selectedAnswer, showResult, onSelect, isAr }: any) {
  const clue = isAr ? data.clueAr || data.clue : data.clue;
  const options = data.options || [
    data.answer,
    "Cristiano Ronaldo",
    "Neymar",
    "Kylian Mbappe",
  ];
  const shuffled = React.useMemo(() => [...options].sort(() => Math.random() - 0.5), [options]);
  const correctAnswer = data.answer;

  return (
    <View>
      <BundleBadge label={isAr ? "خمن اللاعب" : "GUESS THE PLAYER"} color="#1B5E20" />
      <View className="bg-surfaceCard rounded-3xl p-6 mb-6 border border-border">
        <Text className="text-text text-lg leading-6">{clue}</Text>
      </View>
      <View>
        {shuffled.map((opt: string, i: number) => (
          <OptionButton
            key={opt}
            label={opt}
            index={i}
            isSelected={selectedAnswer === opt}
            isCorrect={opt === correctAnswer}
            showResult={showResult}
            onPress={() => onSelect(opt)}
          />
        ))}
      </View>
    </View>
  );
}

function GuessByHistory({ data, selectedAnswer, showResult, onSelect, isAr }: any) {
  const clubs = isAr ? data.clubsAr || data.clubs : data.clubs;
  const options = data.options || [
    data.answer,
    "Lionel Messi",
    "Neymar",
    "Kylian Mbappe",
  ];
  const shuffled = React.useMemo(() => [...options].sort(() => Math.random() - 0.5), [options]);
  const correctAnswer = data.answer;

  return (
    <View>
      <BundleBadge label={isAr ? "خمن من التاريخ" : "GUESS BY HISTORY"} color="#FFC107" />
      <View className="bg-surfaceCard rounded-3xl p-6 mb-4 border border-border">
        <Text className="text-textMuted text-sm mb-3">
          {isAr ? "الأندية التي لعب لها:" : "Clubs played for:"}
        </Text>
        <View className="flex-row flex-wrap gap-2">
          {clubs?.map((club: string, i: number) => (
            <View
              key={i}
              className="bg-surfaceLighter rounded-xl px-3 py-2 border border-border"
            >
              <Text className="text-accent text-sm font-semibold">{club}</Text>
            </View>
          ))}
        </View>
      </View>
      <View>
        {shuffled.map((opt: string, i: number) => (
          <OptionButton
            key={opt}
            label={opt}
            index={i}
            isSelected={selectedAnswer === opt}
            isCorrect={opt === correctAnswer}
            showResult={showResult}
            onPress={() => onSelect(opt)}
          />
        ))}
      </View>
    </View>
  );
}

function GuessTheNation({ data, selectedAnswer, showResult, onSelect, isAr }: any) {
  const playerName = isAr ? data.wikipediaLookupAr || data.wikipediaLookup : data.wikipediaLookup;
  const options = isAr ? data.optionsAr || data.options : data.options;
  const correctAnswer = isAr ? data.correctNationAr || data.correctNation : data.correctNation;

  return (
    <View>
      <BundleBadge label={isAr ? "خمن الجنسية" : "GUESS THE NATION"} color="#E53935" />
      <View className="bg-surfaceCard rounded-3xl p-6 mb-6 border border-border items-center">
        <View className="w-20 h-20 rounded-full bg-surface items-center justify-center mb-3">
          <Ionicons name="person" size={40} color="#6B6B8D" />
        </View>
        <Text className="text-text text-xl font-bold">{playerName}</Text>
      </View>
      <View>
        {options?.map((opt: string, i: number) => (
          <OptionButton
            key={opt}
            label={opt}
            index={i}
            isSelected={selectedAnswer === opt}
            isCorrect={opt === correctAnswer}
            showResult={showResult}
            onPress={() => onSelect(opt)}
          />
        ))}
      </View>
    </View>
  );
}

function HigherOrLower({ data, selectedAnswer, showResult, onSelect, isAr }: any) {
  const statLabel = isAr ? data.statLabelAr || data.statLabel : data.statLabel;
  const playerA = isAr ? data.playerAAr || data.playerA : data.playerA;
  const playerB = isAr ? data.playerBAr || data.playerB : data.playerB;
  const correctAnswer = isAr ? data.correctAnswerAr || data.correctAnswer : data.correctAnswer;

  return (
    <View>
      <BundleBadge label={isAr ? "أعلى أو أقل" : "HIGHER OR LOWER"} color="#2196F3" />
      <View className="bg-surfaceCard rounded-3xl p-6 mb-6 border border-border">
        <Text className="text-textMuted text-sm text-center mb-4">{statLabel}</Text>
        <View className="flex-row items-center justify-center gap-4">
          <View className="flex-1 items-center">
            <View className="w-16 h-16 rounded-full bg-primary/20 items-center justify-center mb-2">
              <Text className="text-primary font-bold text-lg">A</Text>
            </View>
            <Text className="text-text font-bold text-center text-sm">{playerA}</Text>
          </View>
          <Text className="text-textMuted text-2xl font-bold">VS</Text>
          <View className="flex-1 items-center">
            <View className="w-16 h-16 rounded-full bg-accent/20 items-center justify-center mb-2">
              <Text className="text-accent font-bold text-lg">B</Text>
            </View>
            <Text className="text-text font-bold text-center text-sm">{playerB}</Text>
          </View>
        </View>
      </View>
      <View>
        {[playerA, playerB].map((player: string, i: number) => (
          <OptionButton
            key={player}
            label={player}
            sublabel={i === 0 ? "Player A" : "Player B"}
            index={i}
            isSelected={selectedAnswer === player}
            isCorrect={player === correctAnswer}
            showResult={showResult}
            onPress={() => onSelect(player)}
          />
        ))}
      </View>
    </View>
  );
}

function CompleteTheLineup({ data, selectedAnswer, showResult, onSelect, isAr }: any) {
  const title = isAr ? data.titleAr || data.title : data.title;
  const players = isAr ? data.knownPlayersAr || data.knownPlayers : data.knownPlayers;
  const answer = data.answer;

  return (
    <View>
      <BundleBadge label={isAr ? "أكمل التشكيلة" : "COMPLETE THE LINEUP"} color="#9C27B0" />
      <View className="bg-surfaceCard rounded-3xl p-5 mb-4 border border-border">
        <Text className="text-accent text-sm font-bold mb-4 text-center">{title}</Text>
        <View className="flex-row flex-wrap gap-2 justify-center">
          {players?.map((p: string, i: number) => (
            <View
              key={i}
              className="bg-surfaceLighter rounded-xl px-3 py-2 border border-border"
            >
              <Text className="text-text text-xs">{p}</Text>
            </View>
          ))}
          <View className="bg-primary/20 rounded-xl px-3 py-2 border border-primary border-dashed">
            <Text className="text-primary text-xs font-bold">???</Text>
          </View>
        </View>
      </View>
      <Text className="text-textMuted text-sm mb-3 text-center">
        {isAr ? "من اللاعب المفقود؟" : "Who is the missing player?"}
      </Text>
      <TextInput
        value={selectedAnswer || ""}
        onChangeText={(text) => onSelect(text)}
        placeholder={isAr ? "اكتب اسم اللاعب..." : "Type player name..."}
        placeholderTextColor="#6B6B8D"
        editable={!showResult}
        className="bg-surfaceCard rounded-2xl py-4 px-5 text-text text-base border border-border"
      />
      {showResult && (
        <View className="mt-3 items-center">
          <Text className="text-success font-bold text-lg">{answer}</Text>
        </View>
      )}
    </View>
  );
}

function TrueOrFalse({ data, selectedAnswer, showResult, onSelect, isAr }: any) {
  const statement = isAr ? data.statementAr || data.statement : data.statement;
  const correctValue = data.answer ? "true" : "false";
  const trueLabel = isAr ? "صح" : "True";
  const falseLabel = isAr ? "خطأ" : "False";

  return (
    <View>
      <BundleBadge label={isAr ? "صواب أم خطأ" : "TRUE OR FALSE"} color="#4CAF50" />
      <View className="bg-surfaceCard rounded-3xl p-6 mb-6 border border-border">
        <Text className="text-text text-lg leading-6 text-center">{statement}</Text>
      </View>
      <View className="flex-row gap-4">
        {[
          { value: "true", label: trueLabel, color: "#4CAF50" },
          { value: "false", label: falseLabel, color: "#E53935" },
        ].map(({ value, label, color }) => {
          const isSelected = selectedAnswer === value;
          const isCorrect = value === correctValue;

          return (
            <TrueFalseButton
              key={value}
              value={value}
              label={label}
              color={color}
              isSelected={isSelected}
              isCorrect={isCorrect}
              showResult={showResult}
              onPress={() => onSelect(value)}
            />
          );
        })}
      </View>
    </View>
  );
}

function TrueFalseButton({
  value,
  label,
  color,
  isSelected,
  isCorrect,
  showResult,
  onPress,
}: {
  value: string;
  label: string;
  color: string;
  isSelected: boolean;
  isCorrect: boolean;
  showResult: boolean;
  onPress: () => void;
}) {
  const pressScale = useRef(new Animated.Value(1)).current;
  const scale = useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    if (!showResult) return;
    if (isCorrect) {
      scale.setValue(0.9);
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
        friction: 4,
        tension: 120,
      }).start();
    } else if (isSelected) {
      Animated.sequence([
        Animated.timing(pressScale, { toValue: 0.97, duration: 60, useNativeDriver: true }),
        Animated.timing(pressScale, { toValue: 1, duration: 60, useNativeDriver: true }),
      ]).start();
    }
  }, [showResult, isCorrect, isSelected, scale, pressScale]);

  const onPressIn = () => {
    Animated.timing(pressScale, { toValue: 0.95, duration: 80, useNativeDriver: true }).start();
  };
  const onPressOut = () => {
    Animated.timing(pressScale, { toValue: 1, duration: 80, useNativeDriver: true }).start();
  };
  const onPressAll = () => {
    onPress();
  };

  return (
    <Animated.View className="flex-1" style={{ transform: [{ scale: pressScale }] }}>
      <TouchableOpacity
        onPress={onPressAll}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        disabled={showResult}
        className={`flex-1 rounded-2xl py-6 items-center border ${borderColorHelper(
          isSelected,
          isCorrect,
          showResult
        )}`}
        activeOpacity={0.8}
      >
        <Animated.View style={{ transform: [{ scale }] }}>
          <Ionicons
            name={value === "true" ? "checkmark-circle" : "close-circle"}
            size={36}
            color={isSelected && showResult ? color : "#6B6B8D"}
          />
          <Text className="text-text font-bold text-lg mt-2 text-center">{label}</Text>
        </Animated.View>
      </TouchableOpacity>
    </Animated.View>
  );
}

function borderColorHelper(isSelected: boolean, isCorrect: boolean, showResult: boolean) {
  if (showResult && isSelected && isCorrect) return "border-success bg-success/10";
  if (showResult && isSelected && !isCorrect) return "border-danger bg-danger/10";
  if (showResult && isCorrect) return "border-success bg-success/10";
  if (isSelected) return "border-primary bg-primary/10";
  return "border-border bg-surfaceCard";
}

function GuessBySilhouette({ data, selectedAnswer, showResult, onSelect, isAr }: any) {
  const answer = typeof data === "string" ? data : data.answer;

  return (
    <View>
      <BundleBadge label={isAr ? "خمن من الظل" : "GUESS BY SILHOUETTE"} color="#FF9800" />
      <View className="bg-surfaceCard rounded-3xl p-8 mb-6 border border-border items-center">
        <View className="w-32 h-40 bg-surface rounded-2xl items-center justify-center">
          <Ionicons name="person" size={64} color="#2A2A4A" />
        </View>
      </View>
      <Text className="text-textMuted text-sm mb-3 text-center">
        {isAr ? "من هذا اللاعب؟" : "Who is this player?"}
      </Text>
      <TextInput
        value={selectedAnswer || ""}
        onChangeText={(text) => onSelect(text)}
        placeholder={isAr ? "اكتب اسم اللاعب..." : "Type player name..."}
        placeholderTextColor="#6B6B8D"
        editable={!showResult}
        className="bg-surfaceCard rounded-2xl py-4 px-5 text-text text-base border border-border"
      />
      {showResult && (
        <View className="mt-3 items-center">
          <Text className="text-success font-bold text-lg">{answer}</Text>
        </View>
      )}
    </View>
  );
}
