from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import status
from django.conf import settings
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
import os
import uuid

class ImageUploadView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):
        file_obj = request.FILES.get('file')
        if not file_obj:
            return Response({'error': 'No file provided'}, status=status.HTTP_400_BAD_REQUEST)

        # Generate a unique filename
        filename = f"{uuid.uuid4()}{os.path.splitext(file_obj.name)[1]}"
        path = default_storage.save(filename, ContentFile(file_obj.read()))

        # Build absolute URL
        # request.build_absolute_uri() might return http://localhost:8000/media/...
        # We need to ensure it's correct.
        file_url = request.build_absolute_uri(settings.MEDIA_URL + path)

        return Response({'url': file_url}, status=status.HTTP_201_CREATED)
