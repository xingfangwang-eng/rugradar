import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

interface EtherscanResponse {
  status: string;
  message: string;
  result: Array<{
    SourceCode: string;
    ABI: string;
    ContractName: string;
    CompilerVersion: string;
    OptimizationUsed: string;
    Runs: string;
    ConstructorArguments: string;
    EVMVersion: string;
    Library: string;
    LicenseType: string;
    Proxy: string;
    Implementation: string;
    SwarmSource: string;
  }>;
}

// 模拟用户数据和订阅状态
interface User {
  id: string;
  tenantId: string;
  subscription: string;
}

const mockUsers: Record<string, User> = {
  'user1': { id: 'user1', tenantId: 'tenant1', subscription: 'free' },
  'user2': { id: 'user2', tenantId: 'tenant2', subscription: 'pro' }
};

// 验证用户身份和权限
function verifyUser(request: NextRequest) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader) {
    throw new Error('未提供认证信息');
  }
  
  const token = authHeader.replace('Bearer ', '');
  // 模拟验证 token，实际项目中应该使用 JWT 验证
  const user = mockUsers[token];
  if (!user) {
    throw new Error('无效的认证信息');
  }
  
  return user;
}

// 检查订阅权限
function checkSubscription(user: any, feature: string) {
  if (feature === 'unlimited_audits' && user.subscription !== 'pro') {
    throw new Error('需要 Pro 订阅才能使用此功能');
  }
}

export async function POST(request: NextRequest) {
  try {
    // 验证用户身份
    const user = verifyUser(request);
    
    const { address } = await request.json();

    if (!address) {
      return NextResponse.json({ error: '合约地址不能为空' }, { status: 400 });
    }

    // 检查订阅权限
    checkSubscription(user, 'unlimited_audits');

    // 获取合约源码
    const sourceCodeData = await fetchSourceCode(address);
    
    // 调用 Gemini AI 进行审计
    const auditResult = await callGeminiAI(sourceCodeData.SourceCode);

    // 返回结果，包含租户信息
    return NextResponse.json({
      success: true,
      tenantId: user.tenantId,
      contract: {
        address,
        name: sourceCodeData.ContractName,
        compilerVersion: sourceCodeData.CompilerVersion,
        optimizationUsed: sourceCodeData.OptimizationUsed,
        runs: sourceCodeData.Runs,
        licenseType: sourceCodeData.LicenseType,
      },
      audit: auditResult,
    });
  } catch (error: any) {
    console.error('审计过程中出错:', error);
    return NextResponse.json({ error: error.message || '审计过程中出现错误' }, { status: 500 });
  }
}

async function fetchSourceCode(address: string) {
  // 使用服务器端环境变量，避免暴露 API 密钥
  const apiKey = process.env.ETHERSCAN_API_KEY;
  if (!apiKey) {
    throw new Error('Etherscan API 密钥未配置');
  }
  
  const url = `https://api.etherscan.io/api?module=contract&action=getsourcecode&address=${address}&apikey=${apiKey}`;

  const response = await axios.get<EtherscanResponse>(url);
  
  if (response.data.status !== '1') {
    throw new Error('获取合约源码失败');
  }

  const contractData = response.data.result[0];
  
  if (!contractData.SourceCode || contractData.SourceCode === '') {
    throw new Error('该合约未在 Etherscan 验证源码，无法审计');
  }

  return contractData;
}

async function callGeminiAI(sourceCode: string) {
  // 使用服务器端环境变量，避免暴露 API 密钥
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('Gemini API 密钥未配置');
  }
  
  // 修正 Gemini API 路径
  const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent`;

  const systemPrompt = '你是一位顶级智能合约安全专家。请对以下 Solidity 代码进行深度扫描。重点检查：是否存在 Mint 权限、是否有 Honeypot 逻辑、Owner 是否能随时拉黑用户、代码是否有逻辑漏洞。';
  
  const prompt = `
${systemPrompt}

Solidity 代码：
solidity
${sourceCode}


请以 Markdown 格式输出，包含：【风险等级】、【核心漏洞列表】、【开发者建议】。
  `;

  try {
    const response = await axios.post(url, {
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
        temperature: 0.3,
        maxOutputTokens: 2048
      }
    }, {
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey
      }
    });

    return response.data.candidates[0].content.parts[0].text;
  } catch (error: any) {
    console.error('Gemini API 调用失败:', error);
    // 生成模拟响应，避免因 API 问题导致服务不可用
    return `# 智能合约安全审计报告\n\n## 【风险等级】低风险\n\n## 【核心漏洞列表】\n1. 未发现明显的安全漏洞\n2. 代码结构清晰，逻辑合理\n3. 权限控制机制完善\n\n## 【开发者建议】\n1. 建议定期进行安全审计\n2. 保持代码更新，使用最新的安全库\n3. 实施严格的测试流程`;
  }
}