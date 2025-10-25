export interface ModuleData {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  features: string[];
  featuresEn: string[];
  icon: string;
  status?: 'completed' | 'in-progress' | 'not-started';
  statusEn?: string;
  duration?: string | number;
  progress?: number;
  tags?: string[];
  tagsEn?: string[];
  isFavorite?: boolean; // 是否被收藏
  rating?: number; // 平均评分
  userRating?: number; // 用户评分
}

export interface ModuleRatingData {
  moduleId: string;
  rating: number;
  count: number;
}

export interface UserInteraction {
  moduleId: string;
  action: "view" | "favorite" | "rate" | "share";
  timestamp: number;
  data?: any;
}
