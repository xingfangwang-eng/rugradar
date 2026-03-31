interface AuditCache {
  [tenantId: string]: {
    [address: string]: {
      timestamp: number;
      data: any;
    };
  };
}

// 获取当前用户的租户 ID（实际项目中应该从登录状态获取）
const getCurrentTenantId = (): string => {
  // 模拟获取租户 ID，实际项目中应该从认证状态中获取
  return 'tenant1'; // 默认租户
};

export const getCachedAudit = (address: string): any => {
  try {
    const tenantId = getCurrentTenantId();
    const cache = localStorage.getItem('auditCache');
    if (!cache) return null;

    const parsedCache: AuditCache = JSON.parse(cache);
    const tenantCache = parsedCache[tenantId];
    if (!tenantCache) return null;

    const cachedItem = tenantCache[address];

    // 检查缓存是否过期（24小时）
    if (cachedItem && Date.now() - cachedItem.timestamp < 24 * 60 * 60 * 1000) {
      return cachedItem.data;
    }

    // 缓存过期，删除该条目
    if (cachedItem) {
      delete tenantCache[address];
      localStorage.setItem('auditCache', JSON.stringify(parsedCache));
    }

    return null;
  } catch (error) {
    console.error('读取缓存失败:', error);
    return null;
  }
};

export const setCachedAudit = (address: string, data: any): void => {
  try {
    const tenantId = getCurrentTenantId();
    const cache = localStorage.getItem('auditCache');
    const parsedCache: AuditCache = cache ? JSON.parse(cache) : {};

    // 确保租户缓存存在
    if (!parsedCache[tenantId]) {
      parsedCache[tenantId] = {};
    }

    parsedCache[tenantId][address] = {
      timestamp: Date.now(),
      data,
    };

    // 限制每个租户的缓存大小，最多保存10个结果
    const tenantEntries = Object.entries(parsedCache[tenantId]);
    if (tenantEntries.length > 10) {
      // 按时间戳排序，删除最旧的
      tenantEntries.sort((a, b) => a[1].timestamp - b[1].timestamp);
      const oldestAddress = tenantEntries[0][0];
      delete parsedCache[tenantId][oldestAddress];
    }

    localStorage.setItem('auditCache', JSON.stringify(parsedCache));
  } catch (error) {
    console.error('写入缓存失败:', error);
  }
};

export const clearCache = (): void => {
  try {
    const tenantId = getCurrentTenantId();
    const cache = localStorage.getItem('auditCache');
    if (cache) {
      const parsedCache: AuditCache = JSON.parse(cache);
      // 只清除当前租户的缓存，不影响其他租户
      delete parsedCache[tenantId];
      localStorage.setItem('auditCache', JSON.stringify(parsedCache));
    }
  } catch (error) {
    console.error('清除缓存失败:', error);
  }
};