import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLang } from "./LangContext";

interface PlayerContextType {
  playerId: string;
  playerName: string;
  setPlayerName: (name: string) => void;
  isHost: boolean;
  setIsHost: (host: boolean) => void;
  hasSetName: boolean;
  setHasSetName: (value: boolean) => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

function generateId(): string {
  return (
    Date.now().toString(36) + Math.random().toString(36).substring(2, 10)
  );
}

export function PlayerProvider({ children }: { children: ReactNode }) {
  const { t } = useLang();
  const [playerId, setPlayerId] = useState<string>("");
  const [playerName, setPlayerNameState] = useState<string>("");
  const [isHost, setIsHost] = useState(false);
  const [hasSetName, setHasSetNameState] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const storedId = await AsyncStorage.getItem("kora_player_id");
        const storedName = await AsyncStorage.getItem("kora_player_name");
        const id = storedId || generateId();
        setPlayerId(id);
        if (!storedId) await AsyncStorage.setItem("kora_player_id", id);
        setPlayerNameState(storedName || t("guest"));
        setHasSetNameState(!!storedName);
      } catch (e) {
        setPlayerId(generateId());
      }
    })();
  }, []);

  const setPlayerName = async (name: string) => {
    setPlayerNameState(name);
    setHasSetNameState(true);
    try {
      await AsyncStorage.setItem("kora_player_name", name);
    } catch (e) {}
  };

  const setHasSetName = (value: boolean) => setHasSetNameState(value);

  return (
    <PlayerContext.Provider
      value={{ playerId, playerName, setPlayerName, isHost, setIsHost, hasSetName, setHasSetName }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer must be used within PlayerProvider");
  return ctx;
}
