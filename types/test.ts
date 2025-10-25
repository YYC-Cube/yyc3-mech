// 测试相关类型定义

export type TestStatus = 'passing' | 'failing' | 'pending' | 'skipped';

export interface TestCase {
  id: string;
  name: string;
  status: TestStatus;
  duration?: number; // 毫秒
  error?: {
    message: string;
    stack?: string;
    line?: number;
    column?: number;
    file?: string;
  };
  attempt: number;
  lastRun: string; // ISO日期字符串
}

export interface TestSuite {
  id: string;
  name: string;
  description?: string;
  tests: TestCase[];
  status: TestStatus;
  duration?: number;
  lastRun: string;
  path?: string;
}

export interface TestReport {
  suites: TestSuite[];
  totalTests: number;
  passingTests: number;
  failingTests: number;
  skippedTests: number;
  totalDuration: number;
  timestamp: string;
  environment: string;
  version: string;
}

export interface TestFix {
  id: string;
  testId: string;
  description: string;
  code: string;
  confidence: number; // 0-100%
  type: 'syntax' | 'logical' | 'import' | 'api' | 'timeout';
  applied: boolean;
  suggestion?: string; // 可选的修复建议
  appliedAt?: string;
  success?: boolean;
}