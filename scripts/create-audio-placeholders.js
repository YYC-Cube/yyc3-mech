// 创建所有需要的音频占位符文件
const fs = require('fs');
const path = require('path');

// 定义需要创建的音频文件列表
const audioFiles = [
  'mechanical-click.mp3',
  'mechanical-expand.mp3',
  'mechanical-close.mp3',
  'mechanical-hover.mp3',
  'mechanical-success.mp3',
  'mechanical-error.mp3',
  'mechanical-notification.mp3',
  'mechanical-startup.mp3',
  'mechanical-shutdown.mp3',
  'mechanical-toggle.mp3',
  'mechanical-slide.mp3',
  'mechanical-gear.mp3'
];

// 获取当前目录
const currentDir = __dirname;

// 创建所有音频文件
console.log('开始创建音频占位符文件...');
audioFiles.forEach((filename, index) => {
  const filePath = path.join(currentDir, '../public/sounds', filename);
  
  // 写入一个小的空白二进制内容作为占位符
  // 这是一个非常小的MP3文件头结构
  const mp3Header = Buffer.from([
    0x49, 0x44, 0x33, 0x03, 0x00, 0x00, 0x00, 0x00, // ID3v2 header
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x54, 0x49, 0x54, 0x32, 0x00, 0x00, 0x00, 0x08, // TIT2 frame (title)
    0x00, 0x00, 0x03, 0x74, 0x65, 0x73, 0x74, 0x00, // title content
    0x45, 0x4E, 0x44, 0x00, 0x00, 0x00, 0x00, 0x00  // END tag
  ]);
  
  fs.writeFileSync(filePath, mp3Header);
  console.log(`${index + 1}/${audioFiles.length} 创建成功: ${filename}`);
});

console.log('\n✅ 所有音频占位符文件创建完成！');
console.log('这些是用于开发环境的占位符文件。在生产环境中，您应该替换为真实的音频文件。');