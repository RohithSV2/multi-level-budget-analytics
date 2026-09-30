import sqlite3
import os
import hashlib
import secrets
import pandas as pd
from datetime import datetime

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ORIGINAL_DB_PATH = os.path.join(BASE_DIR, "backend", "budget_tracker.db")
CLEAN_DATA_DIR = os.path.join(BASE_DIR, "BudgetTrackerAnalytics", "02_CleanData")

def hash_password(password: str, salt: str = None) -> str:
    if not salt:
        salt = secrets.token_hex(8)
    hashed = hashlib.sha256((password + salt).encode('utf-8')).hexdigest()
    return f"{salt}:{hashed}"

def verify_password(password: str, stored_hash: str) -> bool:
    if not stored_hash or ":" not in stored_hash:
        return False
    salt, hashed = stored_hash.split(":", 1)
    return hashlib.sha256((password + salt).encode('utf-8')).hexdigest() == hashed

def get_db_path():
    # If on Vercel or running in a read-only environment
    if os.environ.get("VERCEL") or not os.access(os.path.dirname(ORIGINAL_DB_PATH), os.W_OK):
        import shutil
        tmp_db = "/tmp/budget_tracker.db"
        if not os.path.exists(tmp_db) and os.path.exists(ORIGINAL_DB_PATH):
            try:
                shutil.copyfile(ORIGINAL_DB_PATH, tmp_db)
            except Exception:
                pass
        return tmp_db
    return ORIGINAL_DB_PATH

def get_db_connection():
    db_file = get_db_path()
    conn = sqlite3.connect(db_file)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()

    # 1. Individual Transactions Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS individual_transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT NOT NULL,
        mode TEXT NOT NULL,
        category TEXT NOT NULL,
        subcategory TEXT,
        note TEXT,
        amount REAL NOT NULL,
        income_expense TEXT NOT NULL,
        currency TEXT DEFAULT 'INR'
    )
    """)

    # 2. Category Budget Targets Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS category_budgets (
        category TEXT PRIMARY KEY,
        monthly_budget REAL NOT NULL
    )
    """)

    # 3. Organization Superstore Orders / Costs Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS org_orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id TEXT NOT NULL,
        order_date TEXT NOT NULL,
        ship_date TEXT,
        ship_mode TEXT,
        department TEXT NOT NULL,
        city TEXT,
        state TEXT,
        region TEXT NOT NULL,
        category TEXT NOT NULL,
        subcategory TEXT NOT NULL,
        product_name TEXT,
        sales REAL NOT NULL,
        quantity INTEGER NOT NULL,
        discount REAL DEFAULT 0.0,
        profit REAL NOT NULL,
        cost REAL NOT NULL,
        budget_variance REAL NOT NULL
    )
    """)

    # 4. State Finance Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS state_finance (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        state TEXT NOT NULL,
        year INTEGER NOT NULL,
        indicator TEXT NOT NULL,
        value REAL NOT NULL
    )
    """)

    # 5. National Union Budget Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS national_budget (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ministry TEXT NOT NULL,
        sector TEXT NOT NULL,
        year INTEGER NOT NULL,
        allocation REAL NOT NULL,
        expenditure REAL NOT NULL
    )
    """)

    # 6. Users Authentication Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        full_name TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'Financial Analyst',
        created_at TEXT NOT NULL
    )
    """)

    conn.commit()

    # Pre-seed default demo accounts if not present
    cursor.execute("SELECT COUNT(*) FROM users")
    user_count = cursor.fetchone()[0]
    if user_count == 0:
        demo_accounts = [
            ("admin", hash_password("admin123"), "Lead Financial Administrator", "System Administrator"),
            ("student", hash_password("student123"), "Rohith S V", "Student Researcher"),
            ("demo", hash_password("demo123"), "Guest Reviewer", "Guest Analyst")
        ]
        now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        cursor.executemany("""
            INSERT OR IGNORE INTO users (username, password_hash, full_name, role, created_at)
            VALUES (?, ?, ?, ?, ?)
        """, [(u, p, n, r, now_str) for u, p, n, r in demo_accounts])
        conn.commit()

    # Check if empty, if so populate from 02_CleanData
    cursor.execute("SELECT COUNT(*) FROM individual_transactions")
    ind_count = cursor.fetchone()[0]

    if ind_count == 0:
        print("Populating database from initial cleaned datasets...")
        # Populate Category Budgets
        default_budgets = [
            ("Food & Dining", 32000.0),
            ("Groceries", 24000.0),
            ("Housing & Rent", 28000.0),
            ("Utilities", 8000.0),
            ("Transportation", 12000.0),
            ("Entertainment", 9000.0),
            ("Healthcare", 7500.0),
            ("Education", 8500.0),
            ("Shopping", 15000.0),
            ("Personal Care", 6000.0)
        ]
        cursor.executemany("INSERT OR REPLACE INTO category_budgets (category, monthly_budget) VALUES (?, ?)", default_budgets)

        # Populate Individual
        ind_csv = os.path.join(CLEAN_DATA_DIR, "individual_clean.csv")
        if os.path.exists(ind_csv):
            df_ind = pd.read_csv(ind_csv)
            for _, row in df_ind.iterrows():
                cursor.execute("""
                INSERT INTO individual_transactions (date, mode, category, subcategory, note, amount, income_expense, currency)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    str(row["Date"])[:10],
                    str(row["Mode"]),
                    str(row["Category"]),
                    str(row.get("Subcategory", "")),
                    str(row.get("Note", "")),
                    float(row["Amount"]),
                    str(row["Income/Expense"]),
                    str(row.get("Currency", "INR"))
                ))

        # Populate Organization
        org_csv = os.path.join(CLEAN_DATA_DIR, "org_clean.csv")
        if os.path.exists(org_csv):
            df_org = pd.read_csv(org_csv)
            for _, row in df_org.iterrows():
                cursor.execute("""
                INSERT INTO org_orders (order_id, order_date, ship_date, ship_mode, department, city, state, region, category, subcategory, product_name, sales, quantity, discount, profit, cost, budget_variance)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    str(row["Order ID"]),
                    str(row["Order Date"])[:10],
                    str(row.get("Ship Date", ""))[:10],
                    str(row.get("Ship Mode", "Standard Class")),
                    str(row["Department"]),
                    str(row.get("City", "")),
                    str(row.get("State", "")),
                    str(row["Region"]),
                    str(row["Category"]),
                    str(row.get("Sub-Category", "")),
                    str(row.get("Product Name", "")),
                    float(row["Sales"]),
                    int(row["Quantity"]),
                    float(row["Discount"]),
                    float(row["Profit"]),
                    float(row["Cost"]),
                    float(row["BudgetVariance"])
                ))

        # Populate State
        state_csv = os.path.join(CLEAN_DATA_DIR, "state_clean.csv")
        if os.path.exists(state_csv):
            df_state = pd.read_csv(state_csv)
            for _, row in df_state.iterrows():
                cursor.execute("""
                INSERT INTO state_finance (state, year, indicator, value)
                VALUES (?, ?, ?, ?)
                """, (
                    str(row["State"]),
                    int(row["Year"]),
                    str(row["Indicator"]),
                    float(row["Value"])
                ))

        # Populate National
        nat_csv = os.path.join(CLEAN_DATA_DIR, "national_clean.csv")
        if os.path.exists(nat_csv):
            df_nat = pd.read_csv(nat_csv)
            for _, row in df_nat.iterrows():
                cursor.execute("""
                INSERT INTO national_budget (ministry, sector, year, allocation, expenditure)
                VALUES (?, ?, ?, ?, ?)
                """, (
                    str(row["Ministry"]),
                    str(row["Sector"]),
                    int(row["Year"]),
                    float(row["Allocation"]),
                    float(row["Expenditure"])
                ))

        conn.commit()
        print("Database initialized and preloaded with sample data.")

    conn.close()

def authenticate_user(username, password):
    if not username or not password:
        return None
    conn = get_db_connection()
    user = conn.execute("SELECT * FROM users WHERE LOWER(username) = LOWER(?)", (username.strip(),)).fetchone()
    conn.close()
    if user and verify_password(password, user["password_hash"]):
        return {
            "id": user["id"],
            "username": user["username"],
            "full_name": user["full_name"],
            "role": user["role"]
        }
    return None

def create_user(username, password, full_name, role="Financial Analyst"):
    username = username.strip().lower()
    if not username or not password:
        return False, "Username and password are required."
    if len(username) < 3:
        return False, "Username must be at least 3 characters."
    if len(password) < 4:
        return False, "Password must be at least 4 characters."

    conn = get_db_connection()
    existing = conn.execute("SELECT id FROM users WHERE LOWER(username) = ?", (username,)).fetchone()
    if existing:
        conn.close()
        return False, f"Username '{username}' is already registered. Please choose another or login."

    hashed = hash_password(password)
    now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    conn.execute(
        "INSERT INTO users (username, password_hash, full_name, role, created_at) VALUES (?, ?, ?, ?, ?)",
        (username, hashed, full_name.strip() or username, role, now_str)
    )
    conn.commit()
    new_user = conn.execute("SELECT id, username, full_name, role FROM users WHERE username = ?", (username,)).fetchone()
    conn.close()
    return True, {
        "id": new_user["id"],
        "username": new_user["username"],
        "full_name": new_user["full_name"],
        "role": new_user["role"]
    }

def get_demo_user(role_key):
    role_map = {
        "student": "student",
        "admin": "admin",
        "demo": "demo"
    }
    uname = role_map.get(str(role_key).lower())
    if not uname:
        return None
    conn = get_db_connection()
    user = conn.execute("SELECT id, username, full_name, role FROM users WHERE username = ?", (uname,)).fetchone()
    conn.close()
    if user:
        return {
            "id": user["id"],
            "username": user["username"],
            "full_name": user["full_name"],
            "role": user["role"]
        }
    return None

if __name__ == "__main__":
    init_db()
