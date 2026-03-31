import requests
import google.generativeai as genai
from config import ETHERSCAN_API_KEY, GEMINI_API_KEY

class CryptoAnalyzer:
    def __init__(self):
        # Initialize Gemini API
        if GEMINI_API_KEY:
            genai.configure(api_key=GEMINI_API_KEY)
            self.model = genai.GenerativeModel('gemini-1.5-flash')
        else:
            self.model = None
    
    def get_eth_balance(self, address):
        """Get ETH balance for a given address"""
        if not ETHERSCAN_API_KEY:
            return {"error": "Etherscan API key not configured"}
        
        url = f"https://api.etherscan.io/api"
        params = {
            "module": "account",
            "action": "balance",
            "address": address,
            "tag": "latest",
            "apikey": ETHERSCAN_API_KEY
        }
        
        try:
            response = requests.get(url, params=params)
            data = response.json()
            if data.get("status") == "1":
                # Convert wei to ETH
                balance_wei = int(data.get("result"))
                balance_eth = balance_wei / 10**18
                return {"balance": balance_eth, "unit": "ETH"}
            else:
                return {"error": data.get("message")}
        except Exception as e:
            return {"error": str(e)}
    
    def get_recent_transactions(self, address):
        """Get recent 5 transactions for a given address"""
        if not ETHERSCAN_API_KEY:
            return {"error": "Etherscan API key not configured"}
        
        url = f"https://api.etherscan.io/api"
        params = {
            "module": "account",
            "action": "txlist",
            "address": address,
            "startblock": 0,
            "endblock": 99999999,
            "page": 1,
            "offset": 5,
            "sort": "desc",
            "apikey": ETHERSCAN_API_KEY
        }
        
        try:
            response = requests.get(url, params=params)
            data = response.json()
            if data.get("status") == "1":
                transactions = data.get("result", [])
                # Process transactions to make them more readable
                processed_transactions = []
                for tx in transactions:
                    processed_tx = {
                        "hash": tx.get("hash"),
                        "from": tx.get("from"),
                        "to": tx.get("to"),
                        "value": int(tx.get("value")) / 10**18,  # Convert wei to ETH
                        "gas": int(tx.get("gas")),
                        "gasPrice": int(tx.get("gasPrice")) / 10**9,  # Convert wei to Gwei
                        "blockNumber": tx.get("blockNumber"),
                        "timeStamp": tx.get("timeStamp")
                    }
                    processed_transactions.append(processed_tx)
                return {"transactions": processed_transactions}
            else:
                return {"error": data.get("message")}
        except Exception as e:
            return {"error": str(e)}
    
    def analyze_address(self, address):
        """Analyze an Ethereum address using Gemini AI"""
        # Get balance and transactions
        balance_data = self.get_eth_balance(address)
        tx_data = self.get_recent_transactions(address)
        
        if "error" in balance_data or "error" in tx_data:
            return "Error: Could not fetch data from Etherscan API"
        
        if not self.model:
            return "Error: Gemini API key not configured"
        
        # Prepare prompt for Gemini
        prompt = f"""请分析以下以太坊地址的信息，并给出详细的中文分析报告：

地址：{address}

余额信息：
{balance_data}

最近5笔交易：
{tx_data}

请从以下几个方面进行分析：
1. 财富等级：根据余额和交易金额评估该地址的财富水平
2. 近期活跃度：分析该地址的交易频率和活跃度
3. 行为特征：分析该地址的交易模式和可能的用途

请提供详细、专业的分析，使用中文回答。"""
        
        try:
            response = self.model.generate_content(prompt)
            return response.text
        except Exception as e:
            return f"Error during analysis: {str(e)}"
