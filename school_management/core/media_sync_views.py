import os

from django.conf import settings
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, authentication_classes, parser_classes
from rest_framework.authentication import TokenAuthentication
from rest_framework.parsers import MultiPartParser
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response


@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAdminUser])
@parser_classes([MultiPartParser])
def media_upload(request):
    # media/ is gitignored and Render's disk starts empty, so this is how
    # manage.py migrate_media_to_production backfills existing local uploads.
    relative_path = request.data.get('path')
    upload = request.data.get('file')
    if not relative_path or not upload:
        return Response({'error': 'path and file are required'}, status=status.HTTP_400_BAD_REQUEST)

    # Normalize and confirm the target stays inside MEDIA_ROOT before writing
    # anywhere -- relative_path comes from a request body, not a trusted source.
    media_root = os.path.abspath(settings.MEDIA_ROOT)
    target_path = os.path.abspath(os.path.join(media_root, relative_path))
    if os.path.commonpath([media_root, target_path]) != media_root:
        return Response({'error': 'invalid path'}, status=status.HTTP_400_BAD_REQUEST)

    os.makedirs(os.path.dirname(target_path), exist_ok=True)
    with open(target_path, 'wb') as dest:
        for chunk in upload.chunks():
            dest.write(chunk)

    return Response({'path': relative_path}, status=status.HTTP_201_CREATED)
