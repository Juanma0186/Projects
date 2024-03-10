from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UsuarioViewSet, AportacionViewSet, EntidadViewSet, PromotorViewSet

router = DefaultRouter()
router.register(r'usuarios', UsuarioViewSet)
router.register(r'aportaciones', AportacionViewSet)
router.register(r'entidades', EntidadViewSet)
router.register(r'promotores', PromotorViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
