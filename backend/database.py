import sqlite3
import os
import pandas as pd
from datetime import datetime

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ORIGINAL_DB_PATH = os.path.join(BASE_DIR, "backend", "budget_tracker.db")
CLEAN_DATA_DIR = os.path.join(BASE_DIR, "BudgetTrackerAnalytics", "02_CleanData")

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

if __name__ == "__main__":
    init_db()
