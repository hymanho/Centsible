import json
import pandas as pd
from datetime import datetime

def process_expense_data(data):
    """Process expense data from Firestore structure."""
    all_expenses = []

    # Iterate through each record in the data
    for record in data:
        expenses = record.get('expenses', [])
        all_expenses.extend(expenses)

    # Convert to DataFrame for easier manipulation
    df = pd.DataFrame(all_expenses)
    
    # Print DataFrame columns to verify
    print("Columns in DataFrame:", df.columns)
    
    # Check if 'date' column exists
    if 'date' in df.columns:
        # Convert date to datetime and amount to float
        df['date'] = pd.to_datetime(df['date'], errors='coerce')
        df['amount'] = df['amount'].astype(float)
        
        # Ensure all categories are lowercase for consistency
        df['category'] = df['category'].str.lower()
        
        # Aggregate by categories
        category_summary = df.groupby('category').agg({
            'amount': ['sum', 'mean', 'count'],
            'date': ['min', 'max']
        }).reset_index()
        
        # Flatten column names
        category_summary.columns = ['category', 'total_amount', 'average_amount', 'transaction_count', 'first_date', 'last_date']
        
        # Calculate overall statistics
        total_spent = df['amount'].sum()
        most_expensive_purchase = df.loc[df['amount'].idxmax()]
        most_frequent_category = df['category'].mode().iloc[0]
        
        # Prepare insights
        insights = {
            'total_spent': total_spent,
            'most_expensive_purchase': {
                'amount': most_expensive_purchase['amount'],
                'category': most_expensive_purchase['category'],
                'title': most_expensive_purchase['title'],
                'date': most_expensive_purchase['date'].strftime('%Y-%m-%d') if pd.notnull(most_expensive_purchase['date']) else 'N/A'
            },
            'most_frequent_category': most_frequent_category,
            'category_breakdown': category_summary.to_dict(orient='records')
        }
    else:
        print("No 'date' column found in data")
        insights = {}

    return insights

def load_firestore_data(file_path):
    """Load Firestore data from a JSON file."""
    with open(file_path, 'r') as f:
        return json.load(f)

if __name__ == "__main__":
    firestore_data = load_firestore_data('expenses.json')
    processed_data = process_expense_data(firestore_data)
    
    # Save processed data to a file
    with open('processed_expenses.json', 'w') as f:
        json.dump(processed_data, f, indent=2)
    
    print("Expense data processed and saved to processed_expenses.json")