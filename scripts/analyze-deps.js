#!/usr/bin/env node

/**
 * 依赖体积分析工具
 * 用于分析项目中未使用的依赖和可以按需导入的组件
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 项目根目录
const PROJECT_ROOT = path.resolve(__dirname, '..');

// Radix UI组件列表
const RADIX_UI_COMPONENTS = [
  '@radix-ui/react-accordion',
  '@radix-ui/react-alert-dialog',
  '@radix-ui/react-aspect-ratio',
  '@radix-ui/react-avatar',
  '@radix-ui/react-checkbox',
  '@radix-ui/react-collapsible',
  '@radix-ui/react-context-menu',
  '@radix-ui/react-dialog',
  '@radix-ui/react-dropdown-menu',
  '@radix-ui/react-hover-card',
  '@radix-ui/react-label',
  '@radix-ui/react-menubar',
  '@radix-ui/react-navigation-menu',
  '@radix-ui/react-popover',
  '@radix-ui/react-progress',
  '@radix-ui/react-radio-group',
  '@radix-ui/react-scroll-area',
  '@radix-ui/react-select',
  '@radix-ui/react-separator',
  '@radix-ui/react-slider',
  '@radix-ui/react-slot',
  '@radix-ui/react-switch',
  '@radix-ui/react-tabs',
  '@radix-ui/react-toast',
  '@radix-ui/react-toggle',
  '@radix-ui/react-toggle-group',
  '@radix-ui/react-tooltip'
];

function analyzeDependencies() {
  console.log('开始分析项目依赖...\n');

  try {
    // 读取package.json
    const packageJson = JSON.parse(fs.readFileSync(path.join(PROJECT_ROOT, 'package.json'), 'utf-8'));
    const dependencies = packageJson.dependencies || {};
    
    console.log('项目依赖总数:', Object.keys(dependencies).length);
    console.log('\nRadix UI组件库依赖:');
    
    // 统计Radix UI组件数量
    const radixDependencies = Object.keys(dependencies).filter(dep => RADIX_UI_COMPONENTS.includes(dep));
    console.log(`发现 ${radixDependencies.length} 个Radix UI组件依赖:`);
    radixDependencies.forEach(dep => console.log(`- ${dep}`));
    
    // 检查是否有未使用的依赖的方法（简化版）
    console.log('\n建议：考虑使用以下方式优化依赖体积:');
    console.log('1. 对于Radix UI组件，可以考虑使用统一的入口包或按需导入');
    console.log('2. 使用next build --analyze分析构建体积');
    console.log('3. 定期检查并移除未使用的依赖');
    console.log('\n依赖分析完成。');
  } catch (error) {
    console.error('分析依赖时出错:', error);
  }
}

// 执行分析
analyzeDependencies();