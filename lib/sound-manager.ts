// 音效管理器 - 统一管理所有机械音效

type SoundType =
  | "click" // 点击音效
  | "expand" // 展开音效
  | "close" // 关闭音效
  | "hover" // 悬停音效
  | "success" // 成功音效
  | "error" // 错误音效
  | "notification" // 通知音效
  | "startup" // 启动音效
  | "shutdown" // 关闭音效
  | "toggle" // 开关切换音效
  | "slide" // 滑动音效
  | "gear"; // 齿轮旋转音效

// 音效配置
interface SoundConfig {
  src: string;
  volume: number;
  enabled: boolean;
}

// 音效管理器类
class SoundManager {
  private sounds: Record<SoundType, SoundConfig> = {
    click: { src: "/sounds/mechanical-click.mp3", volume: 0.3, enabled: true },
    expand: {
      src: "/sounds/mechanical-expand.mp3",
      volume: 0.2,
      enabled: true,
    },
    close: { src: "/sounds/mechanical-close.mp3", volume: 0.2, enabled: true },
    hover: { src: "/sounds/mechanical-hover.mp3", volume: 0.1, enabled: true },
    success: {
      src: "/sounds/mechanical-success.mp3",
      volume: 0.3,
      enabled: true,
    },
    error: { src: "/sounds/mechanical-error.mp3", volume: 0.3, enabled: true },
    notification: {
      src: "/sounds/mechanical-notification.mp3",
      volume: 0.3,
      enabled: true,
    },
    startup: {
      src: "/sounds/mechanical-startup.mp3",
      volume: 0.4,
      enabled: true,
    },
    shutdown: {
      src: "/sounds/mechanical-shutdown.mp3",
      volume: 0.4,
      enabled: true,
    },
    toggle: {
      src: "/sounds/mechanical-toggle.mp3",
      volume: 0.2,
      enabled: true,
    },
    slide: { src: "/sounds/mechanical-slide.mp3", volume: 0.2, enabled: true },
    gear: { src: "/sounds/mechanical-gear.mp3", volume: 0.2, enabled: true },
  };

  private masterVolume = 1.0;
  private masterEnabled = true;
  private audioContext: AudioContext | null = null;
  private audioCache: Map<string, HTMLAudioElement> = new Map();
  private loadedSounds: Set<string> = new Set();
  private failedSounds: Set<string> = new Set();
  private isAudioContextSupported = false;

  constructor() {
    // 在客户端初始化音频上下文
    if (typeof window !== "undefined") {
      this.initAudioContext();
      this.loadSoundSettings();
      this.preloadSounds();
    }
  }

  // 初始化音频上下文
  private initAudioContext() {
    try {
      this.audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      this.isAudioContextSupported = true;
      console.log("Web Audio API 初始化成功");
    } catch (e) {
      console.error("Web Audio API 不受支持:", e);
      this.isAudioContextSupported = false;
    }
  }

  // 预加载所有音效
  private preloadSounds() {
    Object.keys(this.sounds).forEach((type) => {
      const soundType = type as SoundType;
      const soundConfig = this.sounds[soundType];

      // 创建一个音频元素来预加载
      const audio = new Audio();

      // 监听加载成功
      audio.addEventListener("canplaythrough", () => {
        this.loadedSounds.add(soundConfig.src);
        this.audioCache.set(soundConfig.src, audio);
        console.log(`音效预加载成功: ${soundType}`);
      });

      // 监听加载失败
      audio.addEventListener("error", () => {
        this.failedSounds.add(soundConfig.src);
        console.warn(`音效加载失败: ${soundType} - 将使用内置音效`);
      });

      // 开始加载
      audio.src = soundConfig.src;
      audio.load();
    });
  }

  // 从本地存储加载音效设置
  private loadSoundSettings() {
    try {
      const savedSettings = localStorage.getItem("nexus-sound-settings");
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        this.masterVolume = settings.masterVolume ?? 1.0;
        this.masterEnabled = settings.masterEnabled ?? true;

        // 更新各个音效的启用状态
        if (settings.sounds) {
          Object.keys(settings.sounds).forEach((key) => {
            if (this.sounds[key as SoundType]) {
              this.sounds[key as SoundType].enabled =
                settings.sounds[key].enabled;
              this.sounds[key as SoundType].volume =
                settings.sounds[key].volume;
            }
          });
        }
      }
    } catch (e) {
      console.error("加载音效设置失败:", e);
    }
  }

  // 保存音效设置到本地存储
  public saveSettings() {
    try {
      const settings = {
        masterVolume: this.masterVolume,
        masterEnabled: this.masterEnabled,
        sounds: Object.keys(this.sounds).reduce(
          (acc, key) => {
            acc[key] = {
              enabled: this.sounds[key as SoundType].enabled,
              volume: this.sounds[key as SoundType].volume,
            };
            return acc;
          },
          {} as Record<string, { enabled: boolean; volume: number }>,
        ),
      };
      localStorage.setItem("nexus-sound-settings", JSON.stringify(settings));
    } catch (e) {
      console.error("保存音效设置失败:", e);
    }
  }

  // 播放指定类型的音效
  public play(type: SoundType): void {
    if (!this.masterEnabled || !this.sounds[type].enabled) return;
    if (typeof window === "undefined") return;

    try {
      const soundSrc = this.sounds[type].src;

      // 检查音效是否已加载失败
      if (this.failedSounds.has(soundSrc)) {
        console.warn(`使用内置音效替代 ${type}`);
        // 使用内置音效
        this.createSimpleTone(this.sounds[type].volume);
        return;
      }

      // 使用缓存的音频元素（如果有）
      if (this.audioCache.has(soundSrc)) {
        const cachedAudio = this.audioCache.get(soundSrc)!;
        cachedAudio.currentTime = 0;
        cachedAudio.volume = this.sounds[type].volume * this.masterVolume;
        cachedAudio.play().catch((e) => {
          console.warn(`缓存音效播放失败: ${type}`, e);
          this.createSimpleTone(this.sounds[type].volume);
        });
        return;
      }

      // 否则创建新的音频元素
      const audio = new Audio(soundSrc);
      audio.volume = this.sounds[type].volume * this.masterVolume;
      audio.play().catch((e) => {
        console.warn(`音效播放失败: ${type}`, e);
        this.failedSounds.add(soundSrc);
        this.createSimpleTone(this.sounds[type].volume);
      });
    } catch (e) {
      console.error(`播放音效失败: ${type}`, e);
      this.createSimpleTone(this.sounds[type].volume);
    }
  }

  // 创建简单音调作为内置备用方案
  private createSimpleTone(volume: number): void {
    try {
      if (!this.isAudioContextSupported) {
        console.warn("Web Audio API 不受支持，无法创建内置音效");
        return;
      }

      if (!this.audioContext) {
        this.initAudioContext();
      }

      if (this.audioContext) {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(440, this.audioContext.currentTime); // 440Hz = A4

        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(
          volume * this.masterVolume * 0.2,
          this.audioContext.currentTime + 0.01,
        );
        gainNode.gain.linearRampToValueAtTime(
          0,
          this.audioContext.currentTime + 0.1,
        );

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 0.1);
      }
    } catch (e) {
      console.error("创建内置音效失败", e);
      // 此处不再尝试其他备用方案，避免无限递归
    }
  }

  // 设置主音量
  public setMasterVolume(volume: number): void {
    this.masterVolume = Math.max(0, Math.min(1, volume));
    this.saveSettings();
  }

  // 获取主音量
  public getMasterVolume(): number {
    return this.masterVolume;
  }

  // 启用/禁用所有音效
  public setMasterEnabled(enabled: boolean): void {
    this.masterEnabled = enabled;
    this.saveSettings();
  }

  // 获取主音效启用状态
  public getMasterEnabled(): boolean {
    return this.masterEnabled;
  }

  // 设置特定音效的音量
  public setSoundVolume(type: SoundType, volume: number): void {
    if (this.sounds[type]) {
      this.sounds[type].volume = Math.max(0, Math.min(1, volume));
      this.saveSettings();
    }
  }

  // 获取特定音效的音量
  public getSoundVolume(type: SoundType): number {
    return this.sounds[type]?.volume || 0;
  }

  // 启用/禁用特定音效
  public setSoundEnabled(type: SoundType, enabled: boolean): void {
    if (this.sounds[type]) {
      this.sounds[type].enabled = enabled;
      this.saveSettings();
    }
  }

  // 获取特定音效的启用状态
  public getSoundEnabled(type: SoundType): boolean {
    return this.sounds[type]?.enabled || false;
  }

  // 获取所有音效类型
  public getAllSoundTypes(): SoundType[] {
    return Object.keys(this.sounds) as SoundType[];
  }

  // 获取所有音效配置
  public getAllSoundConfigs(): Record<SoundType, SoundConfig> {
    return { ...this.sounds };
  }

  // 检查音效文件是否存在
  public checkSoundExists(type: SoundType): boolean {
    return this.loadedSounds.has(this.sounds[type].src);
  }

  // 获取已加载的音效列表
  public getLoadedSounds(): string[] {
    return Array.from(this.loadedSounds);
  }

  // 获取加载失败的音效列表
  public getFailedSounds(): string[] {
    return Array.from(this.failedSounds);
  }

  // 重新加载失败的音效
  public reloadFailedSounds(): void {
    const failedSounds = Array.from(this.failedSounds);

    failedSounds.forEach((src) => {
      // 找到对应的音效类型
      const soundType = Object.keys(this.sounds).find(
        (key) => this.sounds[key as SoundType].src === src,
      ) as SoundType | undefined;

      if (soundType) {
        console.log(`尝试重新加载音效: ${soundType}`);

        // 从失败列表中移除，以便重新尝试
        this.failedSounds.delete(src);

        const audio = new Audio();

        audio.addEventListener("canplaythrough", () => {
          this.loadedSounds.add(src);
          this.audioCache.set(src, audio);
          console.log(`音效重新加载成功: ${soundType}`);
        });

        audio.addEventListener("error", () => {
          this.failedSounds.add(src);
          console.warn(`音效重新加载失败: ${soundType}`);
        });

        audio.src = src;
        audio.load();
      }
    });
  }
}

// 创建单例实例
export const soundManager =
  typeof window !== "undefined" ? new SoundManager() : null;

// 导出便捷函数
export function playSound(type: SoundType): void {
  soundManager?.play(type);
}

// 导出重新加载音效函数
export function reloadFailedSounds(): void {
  soundManager?.reloadFailedSounds();
}
