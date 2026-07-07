import os
import django
import requests
import sys

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from core.models import Provinces, Districts, Communes, Villages
from django.db import transaction

def migrate_all():
    url = "https://raw.githubusercontent.com/RathanakSreang/cambodia-gazetteer/master/cambodia_gazetteer.json"
    print("Fetching data from Github (Cambodia Gazetteer)...")
    resp = requests.get(url)
    if resp.status_code != 200:
        print("Failed to fetch data")
        return
        
    data = resp.json()
    
    provinces_count = 0
    districts_count = 0
    communes_count = 0
    villages_count = 0
    
    print("Starting database insertion...")
    
    # We will use lists to do bulk_create or bulk update, but for simplicity
    # and since it's a one-time script, update_or_create is safer to avoid unique constraint errors.
    # To speed things up significantly, we wrap in a transaction.
    
    with transaction.atomic():
        for p in data:
            Provinces.objects.update_or_create(
                province_code=p['code'],
                defaults={'name_kh': p.get('khmer'), 'name_en': p.get('latin')}
            )
            provinces_count += 1
            
            for d in p.get('districts', []):
                Districts.objects.update_or_create(
                    district_code=d['code'],
                    defaults={'name_kh': d.get('khmer'), 'name_en': d.get('latin')}
                )
                districts_count += 1
                
                for c in d.get('communes', []):
                    Communes.objects.update_or_create(
                        commune_code=c['code'],
                        defaults={'name_kh': c.get('khmer'), 'name_en': c.get('latin')}
                    )
                    communes_count += 1
                    
                    for v in c.get('villages', []):
                        Villages.objects.update_or_create(
                            village_code=v['code'],
                            defaults={'name_kh': v.get('khmer'), 'name_en': v.get('latin')}
                        )
                        villages_count += 1

    print(f"Migration completed successfully!")
    print(f"Inserted/Updated: {provinces_count} Provinces, {districts_count} Districts, {communes_count} Communes, {villages_count} Villages.")

if __name__ == '__main__':
    migrate_all()
