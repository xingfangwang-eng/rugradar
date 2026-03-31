import sqlite3

class UserDB:
    def __init__(self, db_path='crypto_analyzer.db'):
        self.db_path = db_path
        self._init_db()
    
    def _init_db(self):
        """Initialize the database and create users table if it doesn't exist"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Create users table
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            user_id TEXT PRIMARY KEY,
            credits INTEGER DEFAULT 3
        )
        ''')
        
        conn.commit()
        conn.close()
    
    def get_user_credits(self, user_id):
        """Get the number of credits for a user"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('SELECT credits FROM users WHERE user_id = ?', (user_id,))
        result = cursor.fetchone()
        
        if result:
            credits = result[0]
        else:
            # New user, insert with default 3 credits
            cursor.execute('INSERT INTO users (user_id, credits) VALUES (?, ?)', (user_id, 3))
            conn.commit()
            credits = 3
        
        conn.close()
        return credits
    
    def deduct_credit(self, user_id):
        """Deduct 1 credit from a user"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Get current credits
        cursor.execute('SELECT credits FROM users WHERE user_id = ?', (user_id,))
        result = cursor.fetchone()
        
        if result:
            credits = result[0]
            if credits > 0:
                # Deduct 1 credit
                cursor.execute('UPDATE users SET credits = credits - 1 WHERE user_id = ?', (user_id,))
                conn.commit()
                conn.close()
                return True
        
        conn.close()
        return False
    
    def add_credits(self, user_id, amount):
        """Add credits to a user (admin function)"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Check if user exists
        cursor.execute('SELECT credits FROM users WHERE user_id = ?', (user_id,))
        result = cursor.fetchone()
        
        if result:
            # Update existing user
            cursor.execute('UPDATE users SET credits = credits + ? WHERE user_id = ?', (amount, user_id))
        else:
            # New user, insert with specified credits
            cursor.execute('INSERT INTO users (user_id, credits) VALUES (?, ?)', (user_id, amount))
        
        conn.commit()
        conn.close()
        return True
    
    def get_all_users(self):
        """Get all users (admin function)"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('SELECT user_id, credits FROM users')
        users = cursor.fetchall()
        
        conn.close()
        return users
