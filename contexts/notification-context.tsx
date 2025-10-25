"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useSound } from "@/contexts/sound-context";

export type NotificationType = "info" | "success" | "warning" | "error";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  duration?: number;
  actions?: {
    label: string;
    onClick: () => void;
  }[];
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, "id">) => string;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  addNotification: () => "",
  removeNotification: () => {},
  clearNotifications: () => {},
});

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { playSound } = useSound();

  const addNotification = useCallback(
    (notification: Omit<Notification, "id">) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newNotification = { ...notification, id };

      setNotifications((prev) => [...prev, newNotification]);

      // 播放对应类型的音效
      switch (notification.type) {
        case "success":
          playSound("success");
          break;
        case "error":
          playSound("error");
          break;
        case "warning":
          playSound("notification");
          break;
        default:
          playSound("notification");
      }

      // 如果设置了持续时间，自动移除通知
      if (notification.duration !== undefined && notification.duration > 0) {
        setTimeout(() => {
          removeNotification(id);
        }, notification.duration);
      }

      return id;
    },
    [playSound],
  );

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id),
    );
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        removeNotification,
        clearNotifications,
      }}
    >
      {children}
      <NotificationContainer />
    </NotificationContext.Provider>
  );
}

function NotificationContainer() {
  const { notifications, removeNotification } = useContext(NotificationContext);

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-md">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`rounded-lg border shadow-lg p-4 ${getNotificationStyles(notification.type)}`}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-bold text-sm">{notification.title}</h3>
                <p className="text-sm mt-1">{notification.message}</p>

                {notification.actions && notification.actions.length > 0 && (
                  <div className="flex gap-2 mt-2">
                    {notification.actions.map((action, index) => (
                      <button
                        key={index}
                        onClick={action.onClick}
                        className="text-xs px-2 py-1 rounded bg-[#25272E] hover:bg-[#2A2D36] transition-colors"
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={() => removeNotification(notification.id)}
                className="ml-2 p-1 rounded-full hover:bg-[#25272E] transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

function getNotificationStyles(type: NotificationType): string {
  switch (type) {
    case "success":
      return "bg-[#1F2127] border-[#4CAF50] text-[#D0D5DE]";
    case "error":
      return "bg-[#1F2127] border-[#FF4444] text-[#D0D5DE]";
    case "warning":
      return "bg-[#1F2127] border-[#FF6B3C] text-[#D0D5DE]";
    case "info":
    default:
      return "bg-[#1F2127] border-[#00B4FF] text-[#D0D5DE]";
  }
}

// 使用通知的Hook
export function useNotification() {
  return useContext(NotificationContext);
}

// 便捷函数
export const toast = {
  info: (
    message: string,
    options?: Partial<Omit<Notification, "id" | "type" | "message">>,
  ) => {
    const { addNotification } = useContext(NotificationContext);
    return addNotification({
      type: "info",
      title: options?.title || "信息",
      message,
      duration: options?.duration || 3000,
      actions: options?.actions,
    });
  },
  success: (
    message: string,
    options?: Partial<Omit<Notification, "id" | "type" | "message">>,
  ) => {
    const { addNotification } = useContext(NotificationContext);
    return addNotification({
      type: "success",
      title: options?.title || "成功",
      message,
      duration: options?.duration || 3000,
      actions: options?.actions,
    });
  },
  warning: (
    message: string,
    options?: Partial<Omit<Notification, "id" | "type" | "message">>,
  ) => {
    const { addNotification } = useContext(NotificationContext);
    return addNotification({
      type: "warning",
      title: options?.title || "警告",
      message,
      duration: options?.duration || 4000,
      actions: options?.actions,
    });
  },
  error: (
    message: string,
    options?: Partial<Omit<Notification, "id" | "type" | "message">>,
  ) => {
    const { addNotification } = useContext(NotificationContext);
    return addNotification({
      type: "error",
      title: options?.title || "错误",
      message,
      duration: options?.duration || 5000,
      actions: options?.actions,
    });
  },
};
