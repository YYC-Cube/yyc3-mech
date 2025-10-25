"use client";

import type React from "react";

import { useState } from "react";
import { Bell, Globe, Moon, Sun, User, Volume2, VolumeX } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { useSound } from "@/contexts/sound-context";

interface SettingsOption {
  id: string;
  label: string;
  labelEn: string;
  icon: React.ReactNode;
  component: React.ReactNode;
}

export function UserSettings() {
  const [activeTab, setActiveTab] = useState("profile");
  const { language, t } = useLanguage();
  const { playSound } = useSound();

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    playSound("click");
  };

  const settingsOptions: SettingsOption[] = [
    {
      id: "profile",
      label: "个人资料",
      labelEn: "Profile",
      icon: <User size={18} />,
      component: <ProfileSettings />,
    },
    {
      id: "appearance",
      label: "外观设置",
      labelEn: "Appearance",
      icon: <Sun size={18} />,
      component: <AppearanceSettings />,
    },
    {
      id: "language",
      label: "语言设置",
      labelEn: "Language",
      icon: <Globe size={18} />,
      component: <LanguageSettings />,
    },
    {
      id: "notifications",
      label: "通知设置",
      labelEn: "Notifications",
      icon: <Bell size={18} />,
      component: <NotificationSettings />,
    },
    {
      id: "sound",
      label: "音效设置",
      labelEn: "Sound",
      icon: <Volume2 size={18} />,
      component: <SoundSettings />,
    },
  ];

  return (
    <div className="rounded-lg border border-[#25272E] bg-[#1F2127] overflow-hidden">
      <div className="flex flex-col md:flex-row">
        {/* 侧边栏 */}
        <div className="md:w-64 border-b md:border-b-0 md:border-r border-[#25272E] bg-[#1F2127]">
          <div className="p-4 border-b border-[#25272E]">
            <h2 className="text-xl font-bold">
              {t("用户设置", "User Settings")}
            </h2>
          </div>
          <nav className="p-2">
            {settingsOptions.map((option) => (
              <button
                key={option.id}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-md text-left transition-colors ${
                  activeTab === option.id
                    ? "bg-[#FF6B3C]/10 text-[#FF6B3C]"
                    : "hover:bg-[#25272E] text-[#D0D5DE]"
                }`}
                onClick={() => handleTabChange(option.id)}
              >
                {option.icon}
                <span>{language === "en" ? option.labelEn : option.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* 内容区域 */}
        <div className="flex-1 p-6">
          {settingsOptions.find((option) => option.id === activeTab)?.component}
        </div>
      </div>
    </div>
  );
}

// 个人资料设置
function ProfileSettings() {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold mb-4">{t("个人资料", "Profile")}</h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            {t("用户名", "Username")}
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 bg-[#25272E] border border-[#25272E] rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF6B3C]"
            defaultValue="NexusUser"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            {t("电子邮箱", "Email")}
          </label>
          <input
            type="email"
            className="w-full px-3 py-2 bg-[#25272E] border border-[#25272E] rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF6B3C]"
            defaultValue="user@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            {t("个人简介", "Bio")}
          </label>
          <textarea
            className="w-full px-3 py-2 bg-[#25272E] border border-[#25272E] rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF6B3C] h-24"
            defaultValue=""
          />
        </div>
      </div>

      <div className="pt-4">
        <button className="px-4 py-2 bg-[#FF6B3C] text-black rounded-md font-medium hover:bg-[#FF8F6C] transition-colors">
          {t("保存更改", "Save Changes")}
        </button>
      </div>
    </div>
  );
}

// 外观设置
function AppearanceSettings() {
  const { t } = useLanguage();
  const [theme, setTheme] = useState("dark");

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold mb-4">{t("外观设置", "Appearance")}</h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-3">
            {t("主题", "Theme")}
          </label>
          <div className="flex gap-4">
            <button
              className={`flex flex-col items-center p-4 rounded-md border ${
                theme === "dark" ? "border-[#FF6B3C]" : "border-[#25272E]"
              }`}
              onClick={() => setTheme("dark")}
            >
              <Moon
                size={24}
                className={theme === "dark" ? "text-[#FF6B3C]" : ""}
              />
              <span className="mt-2 text-sm">{t("深色", "Dark")}</span>
            </button>

            <button
              className={`flex flex-col items-center p-4 rounded-md border ${
                theme === "light" ? "border-[#FF6B3C]" : "border-[#25272E]"
              }`}
              onClick={() => setTheme("light")}
            >
              <Sun
                size={24}
                className={theme === "light" ? "text-[#FF6B3C]" : ""}
              />
              <span className="mt-2 text-sm">{t("浅色", "Light")}</span>
            </button>

            <button
              className={`flex flex-col items-center p-4 rounded-md border ${
                theme === "system" ? "border-[#FF6B3C]" : "border-[#25272E]"
              }`}
              onClick={() => setTheme("system")}
            >
              <div className="flex">
                <Moon
                  size={24}
                  className={theme === "system" ? "text-[#FF6B3C]" : ""}
                />
                <Sun
                  size={24}
                  className={theme === "system" ? "text-[#FF6B3C]" : ""}
                />
              </div>
              <span className="mt-2 text-sm">{t("系统", "System")}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="pt-4">
        <button className="px-4 py-2 bg-[#FF6B3C] text-black rounded-md font-medium hover:bg-[#FF8F6C] transition-colors">
          {t("保存更改", "Save Changes")}
        </button>
      </div>
    </div>
  );
}

// 语言设置
function LanguageSettings() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold mb-4">
        {t("语言设置", "Language Settings")}
      </h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-3">
            {t("界面语言", "Interface Language")}
          </label>
          <div className="flex gap-4">
            <button
              className={`flex items-center gap-2 px-4 py-2 rounded-md border ${
                language === "zh"
                  ? "border-[#FF6B3C] text-[#FF6B3C]"
                  : "border-[#25272E]"
              }`}
              onClick={() => setLanguage("zh")}
            >
              <span>🇨🇳</span>
              <span>中文</span>
            </button>

            <button
              className={`flex items-center gap-2 px-4 py-2 rounded-md border ${
                language === "en"
                  ? "border-[#FF6B3C] text-[#FF6B3C]"
                  : "border-[#25272E]"
              }`}
              onClick={() => setLanguage("en")}
            >
              <span>🇺🇸</span>
              <span>English</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// 通知设置
function NotificationSettings() {
  const { t } = useLanguage();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold mb-4">
        {t("通知设置", "Notification Settings")}
      </h3>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">
              {t("电子邮件通知", "Email Notifications")}
            </h4>
            <p className="text-sm text-[#D0D5DE]/70">
              {t(
                "接收重要更新和活动的电子邮件",
                "Receive emails for important updates and activities",
              )}
            </p>
          </div>
          <button
            className={`relative w-12 h-6 rounded-full transition-colors ${
              emailNotifications ? "bg-[#FF6B3C]" : "bg-[#25272E]"
            }`}
            onClick={() => setEmailNotifications(!emailNotifications)}
          >
            <span
              className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                emailNotifications ? "translate-x-7" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">
              {t("推送通知", "Push Notifications")}
            </h4>
            <p className="text-sm text-[#D0D5DE]/70">
              {t(
                "在应用内接收实时通知",
                "Receive real-time notifications within the app",
              )}
            </p>
          </div>
          <button
            className={`relative w-12 h-6 rounded-full transition-colors ${
              pushNotifications ? "bg-[#FF6B3C]" : "bg-[#25272E]"
            }`}
            onClick={() => setPushNotifications(!pushNotifications)}
          >
            <span
              className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                pushNotifications ? "translate-x-7" : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </div>

      <div className="pt-4">
        <button className="px-4 py-2 bg-[#FF6B3C] text-black rounded-md font-medium hover:bg-[#FF8F6C] transition-colors">
          {t("保存更改", "Save Changes")}
        </button>
      </div>
    </div>
  );
}

// 音效设置
function SoundSettings() {
  const { t } = useLanguage();
  const { isMuted, toggleMute, volume, setVolume } = useSound();

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold mb-4">
        {t("音效设置", "Sound Settings")}
      </h3>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">{t("启用音效", "Enable Sounds")}</h4>
            <p className="text-sm text-[#D0D5DE]/70">
              {t("控制界面交互音效", "Control interface interaction sounds")}
            </p>
          </div>
          <button
            className={`relative w-12 h-6 rounded-full transition-colors ${!isMuted ? "bg-[#FF6B3C]" : "bg-[#25272E]"}`}
            onClick={toggleMute}
          >
            <span
              className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                !isMuted ? "translate-x-7" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        <div>
          <h4 className="font-medium mb-2">{t("音量", "Volume")}</h4>
          <div className="flex items-center gap-4">
            <VolumeX size={18} />
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="flex-1 h-2 bg-[#25272E] rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#FF6B3C]"
            />
            <Volume2 size={18} />
          </div>
        </div>
      </div>

      <div className="pt-4">
        <button className="px-4 py-2 bg-[#FF6B3C] text-black rounded-md font-medium hover:bg-[#FF8F6C] transition-colors">
          {t("保存更改", "Save Changes")}
        </button>
      </div>
    </div>
  );
}
