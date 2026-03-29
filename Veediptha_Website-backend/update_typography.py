import os
import django

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from api.models import WebsiteTypography

def force_update_typography():
    print("Force updating typography to match new font requirements...")
    
    # Update active typography settings
    WebsiteTypography.objects.filter(is_active=True).update(
        font_urls={
            'heading': 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;700&family=Playfair+Display:wght@400;700;900&display=swap',
            'body': 'https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&family=Inter:wght@400;700&display=swap',
            'mono': 'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;700&display=swap'
        },
        typography_settings={
            'headingFont': '"Cormorant Garamond", "Playfair Display", serif',
            'bodyFont': '"Outfit", "Inter", system-ui, sans-serif',
            'monoFont': '"IBM Plex Mono", monospace'
        }
    )
    print("Done! Typography has been updated.")

if __name__ == '__main__':
    force_update_typography()
