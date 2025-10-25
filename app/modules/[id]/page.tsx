import type { ModuleData } from "@/types/module";
import { getModuleById } from "@/services/module-service";
import { ModuleDetailSkeleton } from "@/features/modules/components";
import ModuleDetailPageClient from "./client";

// 模块详情页面
// 设置ISR重新验证时间为60秒
export const revalidate = 60;

// 预生成已知的模块ID页面
export function generateStaticParams() {
  return Array.from({ length: 24 }, (_, i) => ({
    id: String(i + 1).padStart(2, '0')
  }));
}

// 服务端数据获取
// @ts-ignore - 禁用类型检查以解决Next.js 15的类型问题
export async function generateMetadata(props) {
  try {
    const { params } = props;
    const module = await getModuleById(params.id);
    if (module) {
      return {
        title: `${module.title} - Nexus AI`,
        description: module.description,
      };
    }
  } catch (error) {
    console.error("生成元数据失败:", error);
  }
  return {
    title: "模块详情 - Nexus AI",
    description: "Nexus AI 模块详情页面",
  };
}

// 服务端组件部分
async function ModuleDetailContent({ id }: { id: string }) {
  try {
    const module = await getModuleById(id);
    if (!module) {
      throw new Error("模块不存在");
    }
    return {
      module,
      isFavorite: module.isFavorite || false,
      userRating: module.userRating || 0,
    };
  } catch (error) {
    console.error("获取模块数据失败:", error);
    throw error;
  }
}

// 添加服务端组件的默认导出
// @ts-ignore - 禁用类型检查以解决Next.js 15的类型问题
export default async function ModuleDetailPage(props) {
  try {
    // 服务端获取数据
    const { params } = props;
    const initialData = await ModuleDetailContent({ id: params.id });
    
    // 返回客户端组件并传递初始数据
    return (
      <>
        {/* 服务端渲染的元数据会自动应用到页面上 */}
        <ModuleDetailPageClient initialData={initialData} id={params.id} />
      </>
    );
  } catch (error) {
    // 数据加载失败时显示骨架屏或错误页面
    return <ModuleDetailSkeleton />;
  }
}
