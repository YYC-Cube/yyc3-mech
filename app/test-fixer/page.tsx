import { Metadata } from 'next';
import SmartTestFixer from '@/components/smart-test-fixer';

// 定义页面元数据
export const metadata: Metadata = {
  title: '智能测试自动修复器 - Nexus AI',
  description: '自动检测并修复测试错误，提升开发效率的智能工具',
  keywords: ['测试', '自动修复', '智能', '开发效率', 'Nexus AI'],
};

/**
 * 智能测试自动修复器页面
 * 
 * 这个页面展示了我们的智能测试自动修复功能，用户可以：
 * - 查看测试套件和测试用例的状态
 * - 获取自动生成的修复建议
 * - 一键应用修复
 * - 配置修复的最小置信度
 * - 过滤查看特定状态的测试
 */
export default function SmartTestFixerPage() {
  return (
    <div className="min-h-screen bg-[#1A1C22]">
      <SmartTestFixer />
    </div>
  );
}