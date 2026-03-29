import pandas as pd
import json

try:
    df = pd.read_excel('../Final_Menu_Categories_Products.xlsx', sheet_name='All Products Mapping')
    print("Columns:", df.columns.tolist())
    print("\nFirst 5 rows:")
    print(df.head(5).to_json(orient='records', indent=2))
except Exception as e:
    print(f"Error: {e}")
