import os
import django

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from api.models import WebsiteBranding, WebsiteTypography, WebsiteFooter, WebsiteTheme, Hero

def seed_split_defaults():
    print("Seeding separate database collections...")

    # 1. Branding
    branding, created = WebsiteBranding.objects.get_or_create(
        is_active=True,
        defaults={
            'name': 'Videeptha Foods',
            'logo_url': 'https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/leaf.svg',
            'ticker_text': ["100% ORGANIC", "VILLAGE FRESH", "AUTHENTIC FLAVORS", "NO PRESERVATIVES"],
            'ticker_style': {
                'bg_color': '#5c8d37',
                'text_color': '#ffffff',
                'speed': 40
            }
        }
    )
    print(f"- Branding {'created' if created else 'updated'}")

    # 2. Typography
    typography, created = WebsiteTypography.objects.get_or_create(
        is_active=True,
        defaults={
            'name': 'Premium Typography',
            'font_urls': {
                'heading': 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&display=swap',
                'sans': 'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;700&display=swap'
            },
            'typography_settings': {
                'headingFont': 'Playfair Display',
                'bodyFont': 'Outfit'
            }
        }
    )
    print(f"- Typography {'created' if created else 'updated'}")

    # 3. Footer
    footer, created = WebsiteFooter.objects.get_or_create(
        is_active=True,
        defaults={
            'name': 'Main Footer Settings',
            'footer_contact': {
                'email': 'videepthafoods1602@gmail.com',
                'phone': '+91 91234 56789',
                'address': 'Bengaluru, Karnataka, India',
                'social': {
                    'instagram': '#',
                    'facebook': '#',
                    'twitter': '#'
                }
            }
        }
    )
    print(f"- Footer {'created' if created else 'updated'}")

    # 4. Theme
    theme, created = WebsiteTheme.objects.get_or_create(
        is_active=True,
        defaults={
            'name': 'Global Premium Theme',
            'colors': {
                'primary': '#5c8d37',
                'secondary': '#a3b18a',
                'accent': '#dad7cd',
                'background': '#0a0d08',
                'surface': '#1a1d1d'
            },
            'button_styles': {
                'borderRadius': '999px',
                'padding': '12px 24px'
            }
        }
    )
    print(f"- Theme {'created' if created else 'updated'}")

    # 5. Hero
    Hero.objects.get_or_create(
        title='Fresh from Our Village',
        defaults={
            'subtitle': 'Authentic flavors, delivered to your doorstep',
            'description': 'Experience the taste of tradition with our handpicked selection of village-fresh products',
            'backgroundImage': '/assets/hero.png',
            'ctaText': 'Explore Our Products',
            'ctaLink': '/products',
            'secondaryCtaText': 'Our Story',
            'secondaryCtaLink': '/#stories'
        }
    )
    print("- Hero seeded")

    print("\nDatabase seeding complete!")

if __name__ == '__main__':
    seed_split_defaults()
