import os
import django
import pandas as pd
from django.utils.text import slugify

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from api.models import Category, Product

def seed_from_excel():
    excel_path = '../Final_Menu_Categories_Products.xlsx'
    sheet_name = 'All Products Mapping'
    
    try:
        df = pd.read_excel(excel_path, sheet_name=sheet_name)
    except Exception as e:
        print(f"Error reading Excel: {e}")
        return

    # Cleanup names
    df['Main Category'] = df['Main Category'].str.strip()
    df['Subcategory'] = df['Subcategory'].str.strip()
    df['Product'] = df['Product'].str.strip()

    print(f"Total rows in Excel: {len(df)}")

    for index, row in df.iterrows():
        main_cat_name = row['Main Category']
        sub_cat_name = row['Subcategory']
        product_name = row['Product']

        if pd.isna(main_cat_name) or not main_cat_name:
            continue

        # 1. Ensure Main Category exists
        main_cat, created = Category.objects.get_or_create(
            name=main_cat_name,
            parent=None,
            defaults={'slug': slugify(main_cat_name)}
        )
        if created:
            print(f"Created Main Category: {main_cat_name}")

        # 2. Ensure Subcategory exists
        sub_cat = None
        if not pd.isna(sub_cat_name) and sub_cat_name:
            sub_cat, created = Category.objects.get_or_create(
                name=sub_cat_name,
                parent=main_cat,
                defaults={'slug': slugify(f"{main_cat_name}-{sub_cat_name}")[:50]}
            )
            if created:
                print(f"Created Subcategory: {sub_cat_name} (Parent: {main_cat_name})")

        # 3. Ensure Product exists
        if not pd.isna(product_name) and product_name:
            # Check if product with this name already exists
            product = Product.objects.filter(name=product_name).first()
            target_cat = sub_cat if sub_cat else main_cat
            
            if not product:
                product = Product.objects.create(
                    name=product_name,
                    price=0.0, # Default price since excel doesn't have it
                    stock=100,
                    category_ids=[str(target_cat.id)],
                    is_active=True
                )
                print(f"Created Product: {product_name}")
            else:
                # Update category_ids if not already present
                if str(target_cat.id) not in product.category_ids:
                    product.category_ids.append(str(target_cat.id))
                    product.save()
                    print(f"Added category {target_cat.name} to Product: {product_name}")

    print("Seeding complete!")

if __name__ == '__main__':
    seed_from_excel()
