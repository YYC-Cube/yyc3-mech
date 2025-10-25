"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  AlertTriangle, CheckCircle, XCircle, Clock, ArrowRight, 
  Code, Zap, ChevronDown, ChevronUp, RefreshCw, Settings,
  Play, Download, Upload, Save, Search, Filter, SlidersHorizontal
} from 'lucide-react';
import { useSound } from '@/contexts/sound-context';
import { useNotification } from '@/contexts/notification-context';
import { useLanguage } from '@/contexts/language-context';
import { TestAutoFixer } from '@/lib/test-auto-fixer';
import type { TestCase, TestFix, TestStatus, TestSuite } from '@/types/test';
import { handleError, safeFn } from '@/lib/error-handler';

// 模拟测试数据
const mockTestSuites: TestSuite[] = [
  {
    id: 'suite-1',
    name: '模块管理测试',
    description: '测试模块管理功能的核心逻辑',
    path: 'src/modules/module.test.ts',
    lastRun: new Date().toISOString(),
    duration: 1250,
    status: 'failing',
    tests: [
      {
        id: 'test-1-1',
        name: '获取模块列表测试',
        status: 'passing',
        duration: 230,
        attempt: 1,
        lastRun: new Date().toISOString()
      },
      {
        id: 'test-1-2',
        name: '获取模块详情测试',
        status: 'failing',
        duration: 150,
        attempt: 3,
        lastRun: new Date().toISOString(),
        error: {
          message: 'Cannot find module \'@/services/mock-data-xyz\'',
          stack: 'Error: Cannot find module \'@/services/mock-data-xyz\'\n    at Module.require (internal/modules/cjs/loader.js:966:19)',
          file: 'src/modules/module.test.ts',
          line: 15,
          column: 3
        }
      },
      {
        id: 'test-1-3',
        name: '更新模块评分测试',
        status: 'failing',
        duration: 210,
        attempt: 2,
        lastRun: new Date().toISOString(),
        error: {
          message: 'Expected 4 to equal 5',
          stack: 'Error: Expected 4 to equal 5\n    at Object.<anonymous> (src/modules/module.test.ts:42:12)',
          file: 'src/modules/module.test.ts',
          line: 42,
          column: 12
        }
      },
      {
        id: 'test-1-4',
        name: '模块收藏功能测试',
        status: 'pending',
        duration: 0,
        attempt: 0,
        lastRun: new Date().toISOString()
      }
    ]
  },
  {
    id: 'suite-2',
    name: '用户交互测试',
    description: '测试用户交互功能',
    path: 'src/components/interaction.test.ts',
    lastRun: new Date().toISOString(),
    duration: 850,
    status: 'passing',
    tests: [
      {
        id: 'test-2-1',
        name: '按钮点击测试',
        status: 'passing',
        duration: 180,
        attempt: 1,
        lastRun: new Date().toISOString()
      },
      {
        id: 'test-2-2',
        name: '表单提交测试',
        status: 'passing',
        duration: 320,
        attempt: 1,
        lastRun: new Date().toISOString()
      },
      {
        id: 'test-2-3',
        name: '页面导航测试',
        status: 'skipped',
        duration: 0,
        attempt: 0,
        lastRun: new Date().toISOString()
      }
    ]
  }
];

// 获取状态图标
const StatusIcon = ({ status }: { status: TestStatus }) => {
  switch (status) {
    case 'passing':
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    case 'failing':
      return <XCircle className="w-5 h-5 text-red-500" />;
    case 'pending':
      return <Clock className="w-5 h-5 text-yellow-500" />;
    case 'skipped':
      return <AlertTriangle className="w-5 h-5 text-gray-500" />;
    default:
      return null;
  }
};

// 获取状态文本
const getStatusText = (status: TestStatus) => {
  const statusMap = {
    passing: '通过',
    failing: '失败',
    pending: '待执行',
    skipped: '已跳过'
  };
  return statusMap[status] || status;
};

// 获取状态样式类名
const getStatusClass = (status: TestStatus) => {
  const classMap = {
    passing: 'bg-green-500/20 text-green-500 border-green-500/30',
    failing: 'bg-red-500/20 text-red-500 border-red-500/30',
    pending: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30',
    skipped: 'bg-gray-500/20 text-gray-500 border-gray-500/30'
  };
  return classMap[status] || '';
};

// 测试用例组件
const TestCaseItem = ({ 
  testCase, 
  onFixApply 
}: { 
  testCase: TestCase; 
  onFixApply: (fix: TestFix) => void 
}) => {
  const [expanded, setExpanded] = useState(false);
  const [fixSuggestions, setFixSuggestions] = useState<TestFix[]>([]);
  const { t } = useLanguage();
  const { playSound } = useSound();

  // 生成修复建议
  useEffect(() => {
    if (testCase.status === 'failing') {
      const fixes = TestAutoFixer.generateFixSuggestions(testCase);
      setFixSuggestions(fixes);
    }
  }, [testCase]);

  // 分析失败原因
  const failureAnalysis = testCase.status === 'failing' 
    ? TestAutoFixer.analyzeFailure(testCase) 
    : null;

  // 应用修复
  const handleApplyFix = async (fix: TestFix) => {
    try {
      playSound('loading');
      const success = await TestAutoFixer.applyFix(fix);
      
      if (success) {
        playSound('success');
        onFixApply(fix);
      } else {
        playSound('error');
      }
    } catch (error) {
      playSound('error');
      handleError(error, {
        tags: ['test-auto-fixer', 'apply-fix-ui'],
        showToUser: true
      });
    }
  };

  return (
    <div className="border border-[#25272E] rounded-md bg-[#1A1C22] overflow-hidden mb-3">
      <div 
        className="flex items-center justify-between p-3 cursor-pointer hover:bg-[#1F2127] transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          <StatusIcon status={testCase.status} />
          <div className="flex-1">
            <p className="font-medium text-[#D0D5DE]">{testCase.name}</p>
            {testCase.status === 'failing' && (
              <p className="text-xs text-[#FF6B3C] truncate mt-1 max-w-[70%]">
                {testCase.error?.message}
              </p>
            )}
          </div>
          {testCase.duration && (
            <span className="text-xs text-[#8D949F] whitespace-nowrap">
              {testCase.duration}ms
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {testCase.status === 'failing' && fixSuggestions.length > 0 && (
            <motion.div
              className="flex gap-1"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              {fixSuggestions.map(fix => (
                <button
                  key={fix.id}
                  className="px-2 py-1 text-xs rounded-md bg-[#00B4FF]/20 text-[#00B4FF] border border-[#00B4FF]/30 hover:bg-[#00B4FF]/30 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleApplyFix(fix);
                  }}
                  title={`置信度: ${fix.confidence}% - ${fix.description}`}
                >
                  <Zap className="w-3 h-3 inline mr-1" />
                  修复
                </button>
              ))}
            </motion.div>
          )}
          <button
            className="p-1 text-[#8D949F] hover:text-[#D0D5DE]"
            onClick={(e) => e.stopPropagation()}
          >
            {expanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
      
      {expanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="border-t border-[#25272E] p-3"
        >
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs text-[#8D949F]">尝试次数: {testCase.attempt}</span>
              <span className="text-xs text-[#8D949F]">最后运行: {new Date(testCase.lastRun).toLocaleString()}</span>
            </div>
            
            {testCase.status === 'failing' && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-sm font-medium text-[#D0D5DE]">失败分析</h4>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusClass(failureAnalysis?.type as any || 'unknown')}`}>
                    {failureAnalysis?.reason}
                  </span>
                </div>
                
                {testCase.error?.stack && (
                  <div className="bg-[#16181C] p-2 rounded-md border border-[#25272E] overflow-x-auto">
                    <pre className="text-xs text-[#8D949F] whitespace-pre-wrap">
                      {testCase.error.stack}
                    </pre>
                  </div>
                )}
                
                {fixSuggestions.length > 0 && (
                  <div className="mt-3">
                    <h4 className="text-sm font-medium text-[#D0D5DE] mb-2">修复建议</h4>
                    <div className="space-y-2">
                      {fixSuggestions.map((fix, index) => (
                        <motion.div
                          key={fix.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-[#1F2127] p-2 rounded-md border border-[#25272E]"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-sm text-[#D0D5DE]">{fix.description}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs px-1.5 py-0.5 rounded bg-[#00B4FF]/20 text-[#00B4FF] border border-[#00B4FF]/30">
                                  {fix.type}
                                </span>
                                <span className="text-xs px-1.5 py-0.5 rounded bg-[#4CD964]/20 text-[#4CD964] border border-[#4CD964]/30">
                                  置信度: {fix.confidence}%
                                </span>
                              </div>
                            </div>
                            <button
                              className="ml-2 px-2 py-1 text-xs rounded-md bg-[#00B4FF] text-white hover:bg-[#0095D9] transition-colors flex items-center gap-1"
                              onClick={() => handleApplyFix(fix)}
                            >
                              <Play className="w-3 h-3" />
                              应用
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};

// 测试套件组件
const TestSuiteItem = ({ 
  suite, 
  onFixApply 
}: { 
  suite: TestSuite; 
  onFixApply: (fix: TestFix) => void 
}) => {
  const [expanded, setExpanded] = useState(false);
  const { t } = useLanguage();

  const passingTests = suite.tests.filter(test => test.status === 'passing').length;
  const failingTests = suite.tests.filter(test => test.status === 'failing').length;
  const skippedTests = suite.tests.filter(test => test.status === 'skipped').length;
  const pendingTests = suite.tests.filter(test => test.status === 'pending').length;

  return (
    <div className="mb-6">
      <motion.div 
        className="flex items-center justify-between p-4 border border-[#25272E] rounded-t-md bg-gradient-to-r from-[#1F2127] to-[#1A1C22] cursor-pointer"
        onClick={() => setExpanded(!expanded)}
        whileHover={{ backgroundColor: '#1F2127' }}
      >
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded border ${getStatusClass(suite.status)}`}>
            <StatusIcon status={suite.status} />
          </div>
          <div>
            <h3 className="font-medium text-[#D0D5DE]">{suite.name}</h3>
            {suite.description && (
              <p className="text-xs text-[#8D949F]">{suite.description}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-500 border border-green-500/30">
              {passingTests}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-500 border border-red-500/30">
              {failingTests}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-500/20 text-gray-500 border border-gray-500/30">
              {skippedTests}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-500 border border-yellow-500/30">
              {pendingTests}
            </span>
          </div>
          {suite.duration && (
            <span className="text-xs text-[#8D949F]">{suite.duration}ms</span>
          )}
          <button className="p-1 text-[#8D949F] hover:text-[#D0D5DE]">
            {expanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>
      </motion.div>
      
      {expanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="border-x border-b border-[#25272E] rounded-b-md p-3 bg-[#1A1C22]"
        >
          {suite.path && (
            <div className="flex items-center gap-2 mb-3 text-xs text-[#8D949F]">
              <Code className="w-3 h-3" />
              <span>{suite.path}</span>
            </div>
          )}
          
          <div className="space-y-1">
            {suite.tests.map(test => (
              <TestCaseItem 
                key={test.id} 
                testCase={test} 
                onFixApply={onFixApply}
              />
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

// 智能测试自动修复器组件
export default function SmartTestFixer() {
  const [testSuites, setTestSuites] = useState<TestSuite[]>(mockTestSuites);
  const [isRunning, setIsRunning] = useState(false);
  const [filters, setFilters] = useState<TestStatus[]>([]);
  const [minConfidence, setMinConfidence] = useState(70);
  const { t } = useLanguage();
  const { playSound } = useSound();
  const { addNotification } = useNotification();

  // 计算统计信息
  const totalTests = testSuites.reduce((sum, suite) => sum + suite.tests.length, 0);
  const passingTests = testSuites.reduce((sum, suite) => 
    sum + suite.tests.filter(test => test.status === 'passing').length, 0
  );
  const failingTests = testSuites.reduce((sum, suite) => 
    sum + suite.tests.filter(test => test.status === 'failing').length, 0
  );
  const skippedTests = testSuites.reduce((sum, suite) => 
    sum + suite.tests.filter(test => test.status === 'skipped').length, 0
  );
  const pendingTests = testSuites.reduce((sum, suite) => 
    sum + suite.tests.filter(test => test.status === 'pending').length, 0
  );
  
  const totalDuration = testSuites.reduce((sum, suite) => sum + (suite.duration || 0), 0);
  const passingRate = totalTests > 0 ? Math.round((passingTests / totalTests) * 100) : 0;

  // 过滤测试套件
  const filteredSuites = filters.length > 0 
    ? testSuites.map(suite => ({
        ...suite,
        tests: suite.tests.filter(test => filters.includes(test.status))
      })).filter(suite => suite.tests.length > 0)
    : testSuites;

  // 运行所有测试
  const runAllTests = safeFn(async () => {
    try {
      setIsRunning(true);
      playSound('loading');
      
      // 模拟测试运行
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 这里应该是实际运行测试的逻辑
      // const results = await runTests();
      
      playSound('success');
      addNotification({
        type: 'success',
        title: '测试运行完成',
        message: `运行了 ${totalTests} 个测试用例`,
        duration: 3000
      });
    } catch (error) {
      playSound('error');
      handleError(error, {
        tags: ['test-auto-fixer', 'run-tests'],
        showToUser: true
      });
    } finally {
      setIsRunning(false);
    }
  }, handleError);

  // 自动修复所有失败的测试
  const autoFixAllTests = safeFn(async () => {
    try {
      setIsRunning(true);
      playSound('loading');
      
      // 收集所有失败的测试用例
      const failingTests = testSuites.flatMap(suite => 
        suite.tests.filter(test => test.status === 'failing')
      );
      
      if (failingTests.length === 0) {
        playSound('info');
        addNotification({
          type: 'info',
          title: '无需修复',
          message: '没有发现失败的测试用例',
          duration: 2000
        });
        setIsRunning(false);
        return;
      }
      
      // 批量修复
      const results = await TestAutoFixer.batchFixTestCases(failingTests, minConfidence);
      
      playSound('success');
      addNotification({
        type: 'success',
        title: '自动修复完成',
        message: `尝试修复 ${results.total} 个测试，成功 ${results.succeeded} 个，失败 ${results.failed} 个`,
        duration: 3000
      });
      
      // 这里应该更新测试状态
      // refreshTestSuites();
    } catch (error) {
      playSound('error');
      handleError(error, {
        tags: ['test-auto-fixer', 'auto-fix-all'],
        showToUser: true
      });
    } finally {
      setIsRunning(false);
    }
  }, handleError);

  // 处理修复应用
  const handleFixApply = (fix: TestFix) => {
    addNotification({
      type: 'success',
      title: '修复已应用',
      message: fix.description,
      duration: 2000
    });
    
    // 这里应该更新测试状态
    // refreshTestStatus(fix.testId);
  };

  // 切换过滤条件
  const toggleFilter = (status: TestStatus) => {
    setFilters(prev => 
      prev.includes(status)
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
  };

  return (
    <div className="min-h-screen bg-[#1A1C22] text-[#D0D5DE] p-4">
      <header className="border-b border-[#25272E] pb-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2">
              <Zap className="text-[#00B4FF]" />
              智能测试自动修复器
            </h1>
            <p className="text-sm text-[#8D949F] mt-1">
              自动检测并修复测试错误，提升开发效率
            </p>
          </div>
          <div className="flex gap-2">
            <button
              className="px-4 py-2 rounded-md border border-[#25272E] bg-[#1F2127] hover:bg-[#25272E] transition-colors flex items-center gap-2"
              onClick={autoFixAllTests}
              disabled={isRunning}
            >
              {isRunning ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Zap className="w-4 h-4 text-[#00B4FF]" />
              )}
              自动修复
            </button>
            <button
              className="px-4 py-2 rounded-md border border-[#25272E] bg-[#1F2127] hover:bg-[#25272E] transition-colors flex items-center gap-2"
              onClick={runAllTests}
              disabled={isRunning}
            >
              {isRunning ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Play className="w-4 h-4 text-[#4CD964]" />
              )}
              运行测试
            </button>
            <button className="p-2 rounded-md border border-[#25272E] bg-[#1F2127] hover:bg-[#25272E] transition-colors">
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* 统计信息卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="p-4 border border-[#25272E] rounded-md bg-gradient-to-br from-[#1A1C22] to-[#1F2127]">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-[#8D949F]">总测试数</p>
              <p className="text-2xl font-bold mt-1">{totalTests}</p>
            </div>
            <div className="p-2 rounded-full bg-[#00B4FF]/20 text-[#00B4FF]">
              <Code className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1 text-xs text-[#8D949F]">
            <span>总耗时: </span>
            <span className="text-[#D0D5DE]">{totalDuration}ms</span>
          </div>
        </div>
        
        <div className="p-4 border border-[#25272E] rounded-md bg-gradient-to-br from-[#1A1C22] to-[#1F2127]">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-[#8D949F]">通过率</p>
              <p className="text-2xl font-bold mt-1 text-green-500">{passingRate}%</p>
            </div>
            <div className="p-2 rounded-full bg-green-500/20 text-green-500">
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1 text-xs text-[#8D949F]">
            <span>通过: </span>
            <span className="text-green-500">{passingTests}</span>
            <span>/</span>
            <span className="text-[#D0D5DE]">{totalTests}</span>
          </div>
        </div>
        
        <div className="p-4 border border-[#25272E] rounded-md bg-gradient-to-br from-[#1A1C22] to-[#1F2127]">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-[#8D949F]">失败测试</p>
              <p className="text-2xl font-bold mt-1 text-red-500">{failingTests}</p>
            </div>
            <div className="p-2 rounded-full bg-red-500/20 text-red-500">
              <XCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1 text-xs text-[#8D949F]">
            <span>可自动修复: </span>
            <span className="text-[#D0D5DE]">~{Math.round(failingTests * 0.7)} 个</span>
          </div>
        </div>
        
        <div className="p-4 border border-[#25272E] rounded-md bg-gradient-to-br from-[#1A1C22] to-[#1F2127]">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-[#8D949F]">跳过/待定</p>
              <p className="text-2xl font-bold mt-1 text-gray-500">{skippedTests + pendingTests}</p>
            </div>
            <div className="p-2 rounded-full bg-gray-500/20 text-gray-500">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1 text-xs text-[#8D949F]">
            <span>跳过: </span>
            <span className="text-[#D0D5DE]">{skippedTests}</span>
            <span>|</span>
            <span>待定: </span>
            <span className="text-[#D0D5DE]">{pendingTests}</span>
          </div>
        </div>
      </div>

      {/* 过滤和设置区域 */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-md border border-[#25272E] bg-[#1F2127] hover:bg-[#25272E] transition-colors flex items-center gap-1">
            <Search className="w-4 h-4" />
            <span className="text-sm">搜索</span>
          </button>
          <button 
            className={`p-2 rounded-md border ${filters.length > 0 ? 'border-[#00B4FF] bg-[#00B4FF]/10' : 'border-[#25272E] bg-[#1F2127]'} hover:bg-[#25272E] transition-colors flex items-center gap-1`}
          >
            <Filter className="w-4 h-4" />
            <span className="text-sm">过滤</span>
            {filters.length > 0 && (
              <span className="text-xs px-1.5 py-0.5 rounded-full bg-[#00B4FF]/20 text-[#00B4FF]">
                {filters.length}
              </span>
            )}
          </button>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#8D949F]">最小置信度:</span>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="0"
                max="100"
                value={minConfidence}
                onChange={(e) => setMinConfidence(parseInt(e.target.value))}
                className="w-32 h-1 bg-[#25272E] rounded-lg appearance-none cursor-pointer accent-[#00B4FF]"
              />
              <span className="text-sm font-medium">{minConfidence}%</span>
            </div>
          </div>
          
          <div className="flex gap-1 bg-[#1F2127] p-1 rounded-md border border-[#25272E]">
            {(['passing', 'failing', 'skipped', 'pending'] as TestStatus[]).map(status => (
              <button
                key={status}
                className={`px-2 py-1 text-xs rounded transition-colors ${filters.includes(status)
                  ? getStatusClass(status)
                  : 'hover:bg-[#25272E]'}
                `}
                onClick={() => toggleFilter(status)}
              >
                <span className="inline-block w-3 h-3 mr-1">
                  <StatusIcon status={status} />
                </span>
                {getStatusText(status)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 测试套件列表 */}
      <div className="space-y-6">
        {filteredSuites.length > 0 ? (
          filteredSuites.map(suite => (
            <TestSuiteItem 
              key={suite.id} 
              suite={suite} 
              onFixApply={handleFixApply}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center p-10 border border-[#25272E] rounded-md bg-[#1A1C22]">
            <AlertTriangle className="w-12 h-12 text-yellow-500 mb-4" />
            <p className="text-lg font-medium text-[#D0D5DE]">没有找到匹配的测试</p>
            <p className="text-sm text-[#8D949F] mt-2">尝试调整过滤条件或运行测试</p>
            <button 
              className="mt-4 px-4 py-2 rounded-md border border-[#00B4FF] bg-[#00B4FF]/10 text-[#00B4FF] hover:bg-[#00B4FF]/20 transition-colors"
              onClick={() => setFilters([])}
            >
              清除过滤
            </button>
          </div>
        )}
      </div>
    </div>
  );
}