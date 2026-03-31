const axios = require('axios');

// 要测试的URL列表
const urls = [
  // API地址
  'https://api.etherscan.io/api?module=contract&action=getsourcecode&address=0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D&apikey=demo',
  'https://generativelanguage.googleapis.com/v1/models/gemini-1.0-pro:generateContent?key=demo',
  
  // 其他链接
  'http://www.w3.org/2000/svg',
  'https://auditpulse.com/'
];

// 测试URL的函数
async function testUrl(url) {
  try {
    const response = await axios.get(url, {
      timeout: 10000, // 10秒超时
      validateStatus: () => true // 不抛出错误，无论状态码是什么
    });
    return {
      url,
      status: response.status,
      success: response.status === 200
    };
  } catch (error) {
    return {
      url,
      status: error.code || 'ERROR',
      success: false,
      error: error.message
    };
  }
}

// 主函数
async function main() {
  console.log('开始测试URL...');
  console.log('====================================');
  
  const results = await Promise.all(urls.map(testUrl));
  
  results.forEach(result => {
    const statusColor = result.success ? '\x1b[32m' : '\x1b[31m';
    const resetColor = '\x1b[0m';
    console.log(`${statusColor}${result.url}${resetColor}`);
    console.log(`  状态码: ${result.status}`);
    if (!result.success) {
      console.log(`  错误: ${result.error}`);
    }
    console.log('------------------------------------');
  });
  
  const successful = results.filter(r => r.success).length;
  const total = results.length;
  console.log(`测试完成: ${successful}/${total} 个URL成功`);
  
  // 检查是否有失败的URL
  const failedUrls = results.filter(r => !r.success);
  if (failedUrls.length > 0) {
    console.log('\n失败的URL:');
    failedUrls.forEach(url => console.log(`- ${url.url} (${url.status})`));
  }
}

// 运行测试
main();