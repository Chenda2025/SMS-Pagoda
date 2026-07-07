import os
import sys
import django
import requests

# Set up Django environment
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from core.models import Communes

def migrate_communes():
    base_url = "https://data.mef.gov.kh/api/v1/public-datasets/pd_66a8603900604c000123e146/json"
    page = 1
    page_size = 200
    
    # Do an initial fetch to get pagination metadata
    response = requests.get(f"{base_url}?page={page}&page_size={page_size}")
    if response.status_code != 200:
        print(f"Failed to fetch initial page: {response.text}")
        return
        
    data = response.json()
    total_pages = data.get('total_pages', 1)
    
    print(f"Starting migration for {data.get('total_items', 'unknown')} items across {total_pages} pages...")
    
    while page <= total_pages:
        if page > 1:
            response = requests.get(f"{base_url}?page={page}&page_size={page_size}")
            if response.status_code != 200:
                print(f"Failed to fetch page {page}: {response.text}")
                break
            data = response.json()
            
        items = data.get('items', [])
        
        objects_to_create = []
        for item in items:
            commune_code = item.get('commune_code')
            if not commune_code:
                continue
                
            name_kh = item.get('commune_kh')
            name_en = item.get('commune_en')
            
            # Since update_or_create in a loop is slow, we will just use update_or_create
            Communes.objects.update_or_create(
                commune_code=commune_code,
                defaults={
                    'name_kh': name_kh,
                    'name_en': name_en
                }
            )
        
        print(f"Processed page {page}/{total_pages}")
        page += 1
        
    print("Migration completed successfully!")

if __name__ == '__main__':
    migrate_communes()
