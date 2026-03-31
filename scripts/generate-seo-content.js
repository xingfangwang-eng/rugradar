const fs = require('fs');
const path = require('path');
const axios = require('axios');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

// 读取痛点数据
const painPointsPath = path.join(__dirname, '..', 'data', 'pain-points.json');
const painPoints = JSON.parse(fs.readFileSync(painPointsPath, 'utf8'));

// 确保 articles 目录存在
const articlesDir = path.join(__dirname, '..', 'data', 'articles');
if (!fs.existsSync(articlesDir)) {
  fs.mkdirSync(articlesDir, { recursive: true });
}

// Gemini API 配置
const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
if (!API_KEY) {
  console.error('请设置 NEXT_PUBLIC_GEMINI_API_KEY 环境变量');
  process.exit(1);
}

const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-1.0-pro:generateContent?key=${API_KEY}`;

// 生成文章的函数
async function generateArticle(painPoint) {
  // 检查是否有实际的 API 密钥
  if (!API_KEY || API_KEY === 'your_gemini_api_key_here') {
    // 生成模拟内容
    console.log('使用模拟内容...');
    return `# ${painPoint.title}\n\n## Current State of the Problem\n\n${painPoint.description}\n\nThis is a significant issue in the blockchain space, affecting many users and projects.\n\n## Technical Principles\n\nThe technical root cause of this problem lies in the way smart contracts are designed and executed. Blockchain technology relies on immutable code, which means that once a contract is deployed, its logic cannot be changed. This creates unique challenges for security and functionality.\n\n## Risk Mitigation Strategies\n\n1. **Thorough Code Review**: Conduct comprehensive code reviews before deployment.\n2. **Security Audits**: Engage professional auditors to identify vulnerabilities.\n3. **Formal Verification**: Use mathematical proofs to verify contract behavior.\n4. **Gradual Deployment**: Start with small amounts of funds and gradually increase.\n5. **Bug Bounties**: Offer rewards for identifying security issues.\n\n## How Audit Pulse Can Help\n\nAudit Pulse provides an AI-powered solution to address this problem through:\n\n- **Automated Security Scanning**: Quickly identify potential vulnerabilities in smart contracts.\n- **Real-time Monitoring**: Keep track of contract behavior and detect anomalies.\n- **Comprehensive Reports**: Receive detailed analysis with actionable recommendations.\n- **User-Friendly Interface**: Easily understand complex security issues without deep technical knowledge.\n\nBy leveraging advanced AI technology, Audit Pulse helps developers and users mitigate risks and ensure the security of their smart contracts.\n`;
  }

  const prompt = `As a blockchain expert, please explain in depth "${painPoint.title}". The content should include: current state of the problem, technical principles, risk mitigation strategies, and how Audit Pulse tool can help solve this problem. Please return in Markdown format. The article should be around 800 words and SEO-friendly.`;

  try {
    const response = await axios.post(GEMINI_API_URL, {
      contents: [
        {
          parts: [
            {
              text: prompt
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1024
      }
    });

    return response.data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error(`生成文章失败 for ${painPoint.title}:`, error.message);
    // 出错时使用模拟内容
    return `# ${painPoint.title}\n\n## Current State of the Problem\n\n${painPoint.description}\n\nThis is a significant issue in the blockchain space, affecting many users and projects.\n\n## Technical Principles\n\nThe technical root cause of this problem lies in the way smart contracts are designed and executed. Blockchain technology relies on immutable code, which means that once a contract is deployed, its logic cannot be changed. This creates unique challenges for security and functionality.\n\n## Risk Mitigation Strategies\n\n1. **Thorough Code Review**: Conduct comprehensive code reviews before deployment.\n2. **Security Audits**: Engage professional auditors to identify vulnerabilities.\n3. **Formal Verification**: Use mathematical proofs to verify contract behavior.\n4. **Gradual Deployment**: Start with small amounts of funds and gradually increase.\n5. **Bug Bounties**: Offer rewards for identifying security issues.\n\n## How Audit Pulse Can Help\n\nAudit Pulse provides an AI-powered solution to address this problem through:\n\n- **Automated Security Scanning**: Quickly identify potential vulnerabilities in smart contracts.\n- **Real-time Monitoring**: Keep track of contract behavior and detect anomalies.\n- **Comprehensive Reports**: Receive detailed analysis with actionable recommendations.\n- **User-Friendly Interface**: Easily understand complex security issues without deep technical knowledge.\n\nBy leveraging advanced AI technology, Audit Pulse helps developers and users mitigate risks and ensure the security of their smart contracts.\n`;
  }
}

// 主函数
async function main() {
  console.log('开始生成 SEO 文章...');
  
  // 从第 11 个痛点开始生成（索引为 10）
  const startIndex = 10;
  
  for (let i = startIndex; i < painPoints.length; i++) {
    const painPoint = painPoints[i];
    console.log(`正在处理 (${i+1}/100): ${painPoint.title}`);
    
    // 生成文章
    const articleContent = await generateArticle(painPoint);
    
    if (articleContent) {
      // 保存文章
      const articlePath = path.join(articlesDir, `${painPoint.slug}.md`);
      fs.writeFileSync(articlePath, articleContent);
      console.log(`文章已保存: ${articlePath}`);
    }
    
    // 频率限制：每生成一篇文章后暂停 10 秒
    if (i < painPoints.length - 1) {
      console.log('等待 10 秒以避免 API 频率限制...');
      await new Promise(resolve => setTimeout(resolve, 10000));
    }
  }
  
  console.log('所有文章生成完成！');
}

// 运行主函数
main();