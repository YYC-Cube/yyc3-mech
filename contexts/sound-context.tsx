"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";

type SoundType =
  | "click"
  | "expand"
  | "close"
  | "hover"
  | "success"
  | "error"
  | "notification"
  | "startup"
  | "shutdown"
  | "toggle"
  | "slide"
  | "gear";

interface SoundStatus {
  loaded: string[];
  failed: string[];
  loading: string[];
}

type SoundContextType = {
  isMuted: boolean;
  toggleMute: () => void;
  volume: number;
  setVolume: (volume: number) => void;
  playSound: (type: string) => void;
  openSoundSettings: () => void;
  soundStatus: SoundStatus;
  reloadSounds: () => void;
  isAudioSupported: boolean;
};

// 默认上下文值
const defaultContext: SoundContextType = {
  isMuted: false,
  toggleMute: () => {},
  volume: 0.5,
  setVolume: () => {},
  playSound: () => {},
  openSoundSettings: () => {},
  soundStatus: { loaded: [], failed: [], loading: [] },
  reloadSounds: () => {},
  isAudioSupported: false,
};

const SoundContext = createContext<SoundContextType>(defaultContext);

// 音效缓存
const audioCache: Map<string, HTMLAudioElement> = new Map();

// 音效文件映射
const soundFiles: Record<SoundType, string> = {
  click: "/sounds/mechanical-click.mp3",
  expand: "/sounds/mechanical-expand.mp3",
  close: "/sounds/mechanical-close.mp3",
  hover: "/sounds/mechanical-hover.mp3",
  success: "/sounds/mechanical-success.mp3",
  error: "/sounds/mechanical-error.mp3",
  notification: "/sounds/mechanical-notification.mp3",
  startup: "/sounds/mechanical-startup.mp3",
  shutdown: "/sounds/mechanical-shutdown.mp3",
  toggle: "/sounds/mechanical-toggle.mp3",
  slide: "/sounds/mechanical-slide.mp3",
  gear: "/sounds/mechanical-gear.mp3",
};

export function SoundProvider({ children }: { children: ReactNode }) {
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolumeState] = useState(0.5);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [soundStatus, setSoundStatus] = useState<SoundStatus>({
    loaded: [],
    failed: [],
    loading: [],
  });
  const [isClient, setIsClient] = useState(false);
  const [isAudioSupported, setIsAudioSupported] = useState(false);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

  // 检测客户端环境和音频支持
  useEffect(() => {
    setIsClient(true);

    // 检查音频支持
    try {
      const AudioContextClass =
        window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        const context = new AudioContextClass();
        setAudioContext(context);
        setIsAudioSupported(true);
      }
    } catch (error) {
      console.warn("音频系统不可用:", error);
      setIsAudioSupported(false);
    }
  }, []);

  // 从本地存储加载音效设置
  useEffect(() => {
    if (!isClient) return;

    try {
      const savedSettings = localStorage.getItem("nexus-sound-settings");
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        setIsMuted(settings.isMuted ?? false);
        setVolumeState(settings.volume ?? 0.5);
      }
    } catch (error) {
      console.warn("加载音效设置失败:", error);
    }
  }, [isClient]);

  // 预加载音效
  useEffect(() => {
    if (!isClient || !isAudioSupported) return;

    const preloadSounds = async () => {
      const soundTypes = Object.keys(soundFiles) as SoundType[];

      // 设置所有音效为加载中状态
      setSoundStatus((prev) => ({
        ...prev,
        loading: soundTypes,
      }));

      // 并行预加载所有音效
      const results = await Promise.allSettled(
        soundTypes.map((type) => {
          return new Promise<string>((resolve, reject) => {
            const audio = new Audio(soundFiles[type]);

            const handleLoad = () => {
              audioCache.set(type, audio);
              resolve(type);

              // 清理事件监听器
              audio.removeEventListener("canplaythrough", handleLoad);
              audio.removeEventListener("error", handleError);
            };

            const handleError = () => {
              reject(type);

              // 清理事件监听器
              audio.removeEventListener("canplaythrough", handleLoad);
              audio.removeEventListener("error", handleError);
            };

            audio.addEventListener("canplaythrough", handleLoad);
            audio.addEventListener("error", handleError);

            // 开始加载
            audio.load();
          });
        }),
      );

      // 处理加载结果
      const loaded = results
        .filter((r) => r.status === "fulfilled")
        .map((r) => (r as PromiseFulfilledResult<string>).value);

      const failed = results
        .filter((r) => r.status === "rejected")
        .map((r) => (r as PromiseRejectedResult).reason);

      setSoundStatus({
        loaded,
        failed,
        loading: [],
      });

      console.log(
        `音效预加载完成: 成功 ${loaded.length}, 失败 ${failed.length}`,
      );
    };

    preloadSounds();
  }, [isClient, isAudioSupported]);

  // 保存音效设置到本地存储
  const saveSettings = useCallback(() => {
    if (!isClient) return;

    try {
      const settings = {
        isMuted,
        volume,
      };
      localStorage.setItem("nexus-sound-settings", JSON.stringify(settings));
    } catch (error) {
      console.warn("保存音效设置失败:", error);
    }
  }, [isClient, isMuted, volume]);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  // 在isMuted状态变化后保存设置
  useEffect(() => {
    saveSettings();

    // 如果取消静音，播放一个简单的音效反馈
    if (!isMuted && isAudioSupported && isClient) {
      playSimpleBeep();
    }
  }, [isMuted, isAudioSupported, isClient, saveSettings]);

  const setVolume = useCallback((newVolume: number) => {
    setVolumeState(newVolume);
  }, []);

  // 在volume变化后保存设置
  useEffect(() => {
    saveSettings();

    // 播放一个简单的音效反馈
    if (!isMuted && isAudioSupported && isClient) {
      playSimpleBeep();
    }
  }, [volume, isMuted, isAudioSupported, isClient, saveSettings]);

  // 使用Web Audio API生成简单音效
  const playSimpleBeep = useCallback(() => {
    if (!audioContext || isMuted) return;

    try {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // A4 音

      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(
        volume * 0.2,
        audioContext.currentTime + 0.01,
      );
      gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.1);

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.1);
    } catch (error) {
      console.warn("生成音效失败:", error);
    }
  }, [audioContext, isMuted, volume]);

  // 播放音效
  const playSound = useCallback(
    (type: string) => {
      if (!isClient || isMuted || !isAudioSupported) return;

      // 检查类型是否有效
      if (!Object.keys(soundFiles).includes(type)) {
        console.warn(`未知的音效类型: ${type}`);
        return;
      }

      try {
        // 首先尝试使用缓存的音频
        if (audioCache.has(type as SoundType)) {
          const audio = audioCache.get(type as SoundType)!;
          audio.volume = volume;
          audio.currentTime = 0;

          const playPromise = audio.play();
          if (playPromise !== undefined) {
            playPromise.catch((error) => {
              console.warn(`播放缓存音效失败: ${type}`, error);
              // 如果播放失败，回退到简单音效
              playSimpleBeep();
            });
          }
          return;
        }

        // 如果缓存中没有，回退到简单音效
        playSimpleBeep();

        // 同时尝试加载音效（用于下次播放）
        const audio = new Audio(soundFiles[type as SoundType]);
        audio.addEventListener("canplaythrough", () => {
          audioCache.set(type as SoundType, audio);
          setSoundStatus((prev) => ({
            ...prev,
            loaded: [...prev.loaded, type],
            failed: prev.failed.filter((t) => t !== type),
          }));
        });

        audio.addEventListener("error", () => {
          setSoundStatus((prev) => ({
            ...prev,
            failed: [...prev.failed, type],
            loaded: prev.loaded.filter((t) => t !== type),
          }));
        });

        audio.load();
      } catch (error) {
        console.warn(`播放音效 ${type} 失败:`, error);
        // 尝试使用简单音效作为回退
        playSimpleBeep();
      }
    },
    [isClient, isMuted, isAudioSupported, volume, playSimpleBeep],
  );

  const openSoundSettings = useCallback(() => {
    setIsSettingsOpen(true);
    playSound("click");
  }, [playSound]);

  const reloadSounds = useCallback(() => {
    // 清空缓存，强制重新加载
    audioCache.clear();

    // 更新状态
    setSoundStatus({
      loaded: [],
      failed: [],
      loading: Object.keys(soundFiles),
    });

    // 重新预加载所有音效
    Object.entries(soundFiles).forEach(([type, src]) => {
      const audio = new Audio(src);

      audio.addEventListener("canplaythrough", () => {
        audioCache.set(type as SoundType, audio);
        setSoundStatus((prev) => ({
          ...prev,
          loaded: [...prev.loaded, type],
          loading: prev.loading.filter((t) => t !== type),
        }));
      });

      audio.addEventListener("error", () => {
        setSoundStatus((prev) => ({
          ...prev,
          failed: [...prev.failed, type],
          loading: prev.loading.filter((t) => t !== type),
        }));
      });

      audio.load();
    });

    // 播放测试音效
    playSimpleBeep();
  }, [playSimpleBeep]);

  // 简化版的设置模态框
  const SoundSettingsModal = ({ onClose }: { onClose: () => void }) => {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-[#1F2127] border border-[#25272E] rounded-lg w-full max-w-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">音效设置</h3>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#25272E]"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M6 6L18 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>启用音效</span>
              <button
                onClick={toggleMute}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  !isMuted ? "bg-[#FF6B3C]" : "bg-[#25272E]"
                }`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                    !isMuted ? "translate-x-7" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
            <div>
              <p className="mb-2">音量</p>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-full"
              />
            </div>

            {/* 音效状态信息 */}
            <div className="mt-4 p-3 bg-[#25272E]/50 rounded-md text-sm">
              <p className="mb-2">音效系统状态:</p>
              <p>
                已加载: {soundStatus.loaded.length}/
                {Object.keys(soundFiles).length}
              </p>
              <p>加载中: {soundStatus.loading.length}</p>
              <p>加载失败: {soundStatus.failed.length}</p>
              <p>音频支持: {isAudioSupported ? "可用" : "不可用"}</p>
            </div>

            <button
              onClick={reloadSounds}
              className="w-full py-2 bg-[#FF6B3C] text-black rounded-md"
            >
              重新加载音效
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <SoundContext.Provider
      value={{
        isMuted,
        toggleMute,
        volume,
        setVolume,
        playSound,
        openSoundSettings,
        soundStatus,
        reloadSounds,
        isAudioSupported,
      }}
    >
      {children}
      {isSettingsOpen && isClient && (
        <SoundSettingsModal
          onClose={() => {
            setIsSettingsOpen(false);
            playSound("click");
          }}
        />
      )}
    </SoundContext.Provider>
  );
}

// 使用音效的Hook
export function useSound() {
  const context = useContext(SoundContext);
  return context;
}
