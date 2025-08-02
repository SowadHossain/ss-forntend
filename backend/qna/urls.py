from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import QuestionViewSet, AnswerViewSet, get_qna_for_product

router = DefaultRouter()
router.register('questions', QuestionViewSet, basename='question')
router.register('answers', AnswerViewSet, basename='answer')

urlpatterns = [
    path('', include(router.urls)),
    path('questions/<int:product_id>/qna/', get_qna_for_product, name='product-qna'),  # ✅ Added this
]
