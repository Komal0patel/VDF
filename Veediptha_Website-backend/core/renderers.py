from rest_framework.renderers import JSONRenderer
from bson import ObjectId
import decimal

class MongoJSONRenderer(JSONRenderer):
    def render(self, data, accepted_media_type=None, renderer_context=None):
        def convert(obj):
            if isinstance(obj, ObjectId):
                return str(obj)
            if isinstance(obj, decimal.Decimal):
                return float(obj)
            if isinstance(obj, dict):
                return {str(k) if isinstance(k, ObjectId) else k: convert(v) for k, v in obj.items()}
            if isinstance(obj, list):
                return [convert(i) for i in obj]
            return obj
        
        data = convert(data)
        return super().render(data, accepted_media_type, renderer_context)
