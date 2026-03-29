import pandas as pd
import os

excel_path = '../Final_Menu_Categories_Products.xlsx'

try:
    xl = pd.ExcelFile(excel_path)
    print(f"Sheets: {xl.sheet_names}")
    
    mc = xl.parse('Main Categories')
    msc = xl.parse('Main & Sub Categories')
    apm = xl.parse('All Products Mapping')
    
    print(f"Main Categories Sheet Count: {len(mc)}")
    print(f"Main & Sub Categories Sheet Count: {len(msc)}")
    print(f"All Products Mapping Sheet Count: {len(apm)}")
    
    unique_mc = mc['Main Category'].unique().tolist()
    print(f"Unique Main Categories from sheet '{mc.columns[0]}': {len(unique_mc)}")
    for i, cat in enumerate(unique_mc):
        print(f"  {i+1}: {cat}")

except Exception as e:
    print(f"Error: {e}")
