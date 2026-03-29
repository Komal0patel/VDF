import os
import sys
import django
import pandas as pd
from django.utils.text import slugify

# Setup Django Environment
# Add the current directory to sys.path to ensure 'core' and other apps are found
sys.path.insert(0, os.getcwd())
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from api.models import Category, Product

def populate():
    print("--- CLEARING OLD DATA ---")
    Product.objects.all().delete()
    Category.objects.all().delete()
    
    # File Path (using absolute path for safety)
    file_path = r'D:\videepthaFoods\VideepthaWeb2\menueitems\Final_Menu_Categories_Products.xlsx'
    
    if not os.path.exists(file_path):
        print(f"Error: File not found at {file_path}")
        return

    # 1. Read Excel Sheets
    xl = pd.ExcelFile(file_path)
    main_cats_df = pd.read_excel(xl, 'Main Categories')
    sub_cats_df = pd.read_excel(xl, 'Main & Sub Categories')
    
    # 2. Image Mapping (Main Categories -> Generated Heroes)
    image_map = {
        'Ready to Mix (Flours, Rava, Poha)': 'grains_flours_category_hero_1774717021113.png',
        'Ready to cook / Breakfast': 'ready_to_cook_category_hero_1774717069338.png',
        'Masala': 'masalas_homemade_category_hero_1774717128160.png',
        'Earth Pocket': 'ready_to_cook_category_hero_1774717069338.png', # Placeholder fallback
        'Herbal Tea': 'wellness_lifestyle_category_hero_1774717180586.png',
        'Body relax': 'wellness_lifestyle_category_hero_1774717180586.png',
        'Energy Drinks': 'natural_drinks_category_hero_1774717154718.png',
        'Gut Friendly': 'natural_drinks_category_hero_1774717154718.png',
        'DB Friendly (Diabetic friendly)': 'wellness_lifestyle_category_hero_1774717180586.png',
        'Women\'s Friendly': 'wellness_lifestyle_category_hero_1774717180586.png',
    }

    print("--- POPULATING HIERARCHY ---")

    # 3. Create Main Categories
    main_objs = {}
    for idx, row in main_cats_df.iterrows():
        name = str(row['Main Category']).strip()
        if not name or name == 'nan': continue
        
        slug = slugify(name)
        img_filename = image_map.get(name, 'grains_flours_category_hero_1774717021113.png') # Default image
        
        # Use localized brain path for images (assuming they are placed in media/categories/ later)
        # For now, we'll use placeholder logic or the direct brain path if configured
        
        cat, created = Category.objects.get_or_create(
            slug=slug,
            defaults={
                'name': name,
                'parent': None,
                'banner_image_url': f'/media/categories/{img_filename}',
                'thumbnail_image_url': f'/media/categories/{img_filename}',
                'banner_details': {
                    'title': f"Pure & Natural {name}",
                    'subtitle': "Direct from village to your table",
                    'description': f"Discover our authentic range of {name.lower()} crafted for health and taste."
                }
            }
        )
        main_objs[name] = cat
        if created: print(f"Created Main Category: {name}")
        else: print(f"Found Main Category: {name}")

    # 4. Create Subcategories
    for idx, row in sub_cats_df.iterrows():
        main_name = str(row['Main Category']).strip()
        sub_name = str(row['Subcategory']).strip()
        
        if not sub_name or sub_name == 'nan' or sub_name == 'N/A': continue
        
        parent = main_objs.get(main_name)
        if not parent:
            # Try to find existing parent by name if not in current sheet
            parent = Category.objects.filter(name=main_name, parent=None).first()
            if not parent:
                print(f"Warning: Parent '{main_name}' not found for subcategory '{sub_name}'")
                continue
        
        # 3b. Image Mapping (Subcategories -> Generated Thumbnails)
        sub_image_map = {
            'Flours': 'flours_subcategory_thumb_1774717390141.png',
            'Pasta & Noodles': 'pasta_noodles_subcategory_thumb_1774717414555.png',
            'Herbal Tea': 'herbal_tea_subcategory_thumb_1774717442438.png',
        }
        sub_img = sub_image_map.get(sub_name)

        sub_slug = slugify(f"{main_name}-{sub_name}")
        sub_cat, created = Category.objects.get_or_create(
            slug=sub_slug,
            defaults={
                'name': sub_name,
                'parent': parent,
                'thumbnail_image_url': f'/media/categories/{sub_img}' if sub_img else None,
                'banner_details': {
                    'title': sub_name,
                    'description': f"High-quality {sub_name} essentials from Videeptha Foods."
                }
            }
        )
        if created: print(f"  Created Subcategory: {sub_name} (under {main_name})")

    # 5. Populate Product-Category Mapping
    print("\n--- MAPPING PRODUCTS TO CATEGORIES ---")
    products_df = pd.read_excel(xl, 'All Products Mapping')
    
    for idx, row in products_df.iterrows():
        main_name = str(row['Main Category']).strip()
        sub_name = str(row['Subcategory']).strip()
        prod_name = str(row['Product']).strip()
        
        if not prod_name or prod_name == 'nan': continue
        
        # Find category objects
        main_cat = Category.objects.filter(name=main_name, parent=None).first()
        sub_cat = Category.objects.filter(name=sub_name, parent=main_cat).first() if main_cat else None
        
        if not main_cat:
            print(f"Warning: Category '{main_name}' not found for product '{prod_name}'")
            continue
            
        # Collect IDs (using .id as string)
        cat_ids = [str(main_cat.id)]
        if sub_cat:
            cat_ids.append(str(sub_cat.id))
            
        # Update or Create Product
        # We search by name (case-insensitive)
        product = Product.objects.filter(name__iexact=prod_name).first()
        if product:
            # Merge existing category_ids with new ones to avoid overwriting other mappings
            current_ids = set(product.category_ids or [])
            current_ids.update(cat_ids)
            product.category_ids = list(current_ids)
            product.save()
            print(f"  Updated Product: {prod_name}")
        else:
            # Create a new product with basic defaults
            Product.objects.create(
                name=prod_name,
                description=f"Authentic {prod_name} from Videeptha Foods.",
                price=0.00, # Placeholder
                stock=100,
                category_ids=cat_ids,
                is_active=True
            )
            print(f"  Created New Product: {prod_name}")

    print("\nPopulation Complete!")

if __name__ == "__main__":
    populate()
