from analyzer import CryptoAnalyzer
from database import UserDB
from config import TELEGRAM_BOT_TOKEN, PAYPAL_EMAIL
import re

# Telegram bot implementation
if TELEGRAM_BOT_TOKEN:
    from telegram import Update
    from telegram.ext import Application, CommandHandler, MessageHandler, filters, ContextTypes

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle /start command"""
    user_id = str(update.effective_user.id)
    db = UserDB()
    credits = db.get_user_credits(user_id)
    
    await update.message.reply_text(
        f"👋 你好！我是 AI 链上侦探，专注于以太坊地址分析。\n\n"+
        f"我可以帮你分析以太坊地址的财富等级、近期活跃度和行为特征。\n\n"+
        f"🎁 你目前有 {credits} 次免费查询额度。\n\n"+
        f"使用方法：\n"+
        f"1. 直接发送以太坊地址进行分析\n"+
        f"2. 输入 /buy 查看付费信息\n"+
        f"3. 输入 /start 查看此帮助信息"
    )

async def buy(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle /buy command"""
    paypal_link = f"https://www.paypal.com/paypalme/{PAYPAL_EMAIL.split('@')[0]}/5USD"
    await update.message.reply_text(
        f"💎 付费套餐\n\n"+
        f"💰 5 USD = 50 次深度分析额度\n\n"+
        f"收款 PayPal 账号：{PAYPAL_EMAIL}\n"+
        f"支付链接：{paypal_link}\n\n"+
        f"💡 支付后请联系管理员为您充值额度"
    )

async def analyze_address(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle Ethereum address messages"""
    message_text = update.message.text.strip()
    
    # Check if it's a valid Ethereum address
    if not (message_text.startswith('0x') and len(message_text) == 42):
        return
    
    user_id = str(update.effective_user.id)
    db = UserDB()
    analyzer = CryptoAnalyzer()
    
    # Check user credits
    credits = db.get_user_credits(user_id)
    
    if credits <= 0:
        # Generate PayPal payment link
        paypal_link = f"https://www.paypal.com/paypalme/{PAYPAL_EMAIL.split('@')[0]}/5USD"
        await update.message.reply_text(
            f"⚠️ 您的免费额度已用完。\n\n"+
            f"请支付 5 USD 获取 50 次深度分析额度。\n\n"+
            f"收款 PayPal 账号：{PAYPAL_EMAIL}\n"+
            f"支付链接：{paypal_link}"
        )
        return
    
    # Send processing message
    processing_message = await update.message.reply_text("🤖 AI 正在调取链上数据，请稍候...")
    
    try:
        # Analyze the address
        analysis_result = analyzer.analyze_address(message_text)
        
        # Deduct credit after successful analysis
        if "Error" not in analysis_result:
            db.deduct_credit(user_id)
            new_credits = db.get_user_credits(user_id)
            await update.message.reply_text(
                f"📊 分析报告\n\n"+
                f"{analysis_result}\n\n"+
                f"💎 剩余查询额度: {new_credits}"
            )
        else:
            await update.message.reply_text(
                f"❌ 分析失败\n\n"+
                f"{analysis_result}"
            )
    except Exception as e:
        await update.message.reply_text(
            f"❌ 发生错误\n\n"+
            f"{str(e)}"
        )
    finally:
        # Delete processing message
        await processing_message.delete()

def main():
    """Main function for the AI Crypto Analyzer"""
    analyzer = CryptoAnalyzer()
    db = UserDB()
    
    # Check if Telegram bot token is provided
    if TELEGRAM_BOT_TOKEN:
        print("=== AI 链上侦探 - Telegram 机器人模式 ===")
        print("正在启动机器人...")
        
        # Create the Application and pass it your bot's token
        application = Application.builder().token(TELEGRAM_BOT_TOKEN).build()
        
        # Add handlers
        application.add_handler(CommandHandler("start", start))
        application.add_handler(CommandHandler("buy", buy))
        application.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, analyze_address))
        
        # Run the bot until the user presses Ctrl-C
        print("机器人已启动，正在监听消息...")
        application.run_polling()
    else:
        # Local testing mode
        print("=== AI 链上侦探 - 本地测试模式 ===")
        print("请输入以太坊地址进行分析，输入 'exit' 退出程序")
        print("输入 'admin' 进入管理员模式")
        
        # Default user ID for local testing
        local_user_id = "local_user"
        
        while True:
            address = input("\n以太坊地址: ").strip()
            
            if address.lower() == 'exit':
                print("程序已退出")
                break
            
            if address.lower() == 'admin':
                # Admin mode
                print("\n=== 管理员模式 ===")
                print("1. 查看所有用户")
                print("2. 给用户添加额度")
                print("3. 返回")
                
                admin_choice = input("请选择操作: ").strip()
                
                if admin_choice == '1':
                    # List all users
                    users = db.get_all_users()
                    if users:
                        print("\n所有用户:")
                        for user_id, credits in users:
                            print(f"用户 ID: {user_id}, 剩余额度: {credits}")
                    else:
                        print("暂无用户")
                elif admin_choice == '2':
                    # Add credits to user
                    user_id = input("请输入用户 ID: ").strip()
                    amount = input("请输入要添加的额度: ").strip()
                    try:
                        amount = int(amount)
                        if amount > 0:
                            db.add_credits(user_id, amount)
                            print(f"成功为用户 {user_id} 添加 {amount} 次额度")
                        else:
                            print("请输入有效的额度数量")
                    except ValueError:
                        print("请输入有效的数字")
                elif admin_choice == '3':
                    # Return to main menu
                    continue
                else:
                    print("无效的选择")
                continue
            
            if not address:
                print("请输入有效的以太坊地址")
                continue
            
            # Validate Ethereum address format (basic check)
            if not (address.startswith('0x') and len(address) == 42):
                print("请输入有效的以太坊地址 (以 0x 开头，共 42 个字符)")
                continue
            
            # Check user credits
            credits = db.get_user_credits(local_user_id)
            print(f"\n剩余查询额度: {credits}")
            
            if credits <= 0:
                # Generate PayPal payment link
                paypal_link = f"https://www.paypal.com/paypalme/{PAYPAL_EMAIL.split('@')[0]}/5USD"
                print("\n您的免费额度已用完。请支付 5 USD 获取 50 次 深度分析额度。")
                print(f"收款 PayPal 账号：{PAYPAL_EMAIL}")
                print(f"支付链接：{paypal_link}")
                continue
            
            print("\n正在分析地址...")
            analysis_result = analyzer.analyze_address(address)
            
            # Deduct credit after successful analysis
            if "Error" not in analysis_result:
                db.deduct_credit(local_user_id)
                new_credits = db.get_user_credits(local_user_id)
                print(f"\n=== 分析报告 ===")
                print(analysis_result)
                print("================")
                print(f"剩余查询额度: {new_credits}")
            else:
                print(f"\n=== 分析报告 ===")
                print(analysis_result)
                print("================")

if __name__ == "__main__":
    main()
