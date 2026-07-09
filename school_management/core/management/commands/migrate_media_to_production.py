import os

import requests
from django.conf import settings
from django.core.management.base import BaseCommand, CommandError

DEFAULT_TARGET = 'https://sms-pagoda-backend.onrender.com'


class Command(BaseCommand):
    help = (
        "Uploads every file under the local MEDIA_ROOT to a deployed "
        "backend, one at a time, via the admin-only /api/core/media-sync/upload/ "
        "endpoint. Needed because media/ is gitignored, so a normal deploy "
        "never puts existing local uploads onto Render's persistent disk -- "
        "only files uploaded through the live app land there."
    )

    def add_arguments(self, parser):
        parser.add_argument(
            '--token', required=True,
            help="Auth token of an admin user on the target server (Users.role == 'admin').",
        )
        parser.add_argument(
            '--url', default=DEFAULT_TARGET,
            help=f"Base URL of the deployed backend (default: {DEFAULT_TARGET}).",
        )
        parser.add_argument(
            '--force', action='store_true',
            help="Re-upload files even if they already exist on the target.",
        )
        parser.add_argument(
            '--dry-run', action='store_true',
            help="List what would be uploaded without sending anything.",
        )

    def handle(self, *args, **options):
        media_root = settings.MEDIA_ROOT
        if not os.path.isdir(media_root):
            raise CommandError(f"MEDIA_ROOT does not exist: {media_root}")

        target = options['url'].rstrip('/')
        token = options['token']
        force = options['force']
        dry_run = options['dry_run']
        upload_url = f'{target}/api/core/media-sync/upload/'
        headers = {'Authorization': f'Token {token}'}

        uploaded = skipped = failed = 0

        for dirpath, _dirnames, filenames in os.walk(media_root):
            for filename in sorted(filenames):
                full_path = os.path.join(dirpath, filename)
                relative_path = os.path.relpath(full_path, media_root).replace(os.sep, '/')

                if not force:
                    check = requests.head(f'{target}/media/{relative_path}')
                    if check.status_code == 200:
                        self.stdout.write(f'skip   {relative_path} (already on target)')
                        skipped += 1
                        continue

                if dry_run:
                    self.stdout.write(f'would upload  {relative_path}')
                    continue

                with open(full_path, 'rb') as fh:
                    try:
                        response = requests.post(
                            upload_url,
                            headers=headers,
                            data={'path': relative_path},
                            files={'file': (filename, fh)},
                            timeout=60,
                        )
                    except requests.RequestException as exc:
                        self.stderr.write(f'FAILED {relative_path}: {exc}')
                        failed += 1
                        continue

                if response.status_code == 201:
                    self.stdout.write(f'uploaded  {relative_path}')
                    uploaded += 1
                else:
                    self.stderr.write(
                        f'FAILED {relative_path}: {response.status_code} {response.text}'
                    )
                    failed += 1

        self.stdout.write(self.style.SUCCESS(
            f'Done. uploaded={uploaded} skipped={skipped} failed={failed}'
        ))
