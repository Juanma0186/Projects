from rest_framework.response import Response
from rest_framework import viewsets
from rest_framework.authentication import TokenAuthentication
from .models import Usuario, Aportacion, Entidad, Promotor
from .serializers import UsuarioSerializer, AportacionSerializer, EntidadSerializer, PromotorSerializer
from rest_framework import permissions
from rest_framework import filters
from rest_framework.permissions import IsAuthenticated
import django_filters.rest_framework
from django_filters import rest_framework as filters
from rest_framework.decorators import action


class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    filter_backends = [filters.DjangoFilterBackend]
    filterset_fields = ['username', 'entidad__nombre', 'promotor__nombre']
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['get'])
    def me(self, request):
        print('User:', request.user) 
        #! Solo devuelve el usuario que corresponde al token de autenticación
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

class AportacionFilter(filters.FilterSet): #! iexact es para que sea case insensitive
    usuario = filters.CharFilter(field_name='usuario__username', lookup_expr='iexact')
    entidad = filters.CharFilter(field_name='entidad__nombre', lookup_expr='iexact')
    promotor = filters.CharFilter(field_name='promotor__nombre', lookup_expr='iexact')

    class Meta:
        model = Aportacion
        fields = ['usuario', 'entidad', 'promotor']

class AportacionViewSet(viewsets.ModelViewSet):
    queryset = Aportacion.objects.all()
    serializer_class = AportacionSerializer
    filter_backends = [filters.DjangoFilterBackend]
    filterset_class = AportacionFilter
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

class EntidadViewSet(viewsets.ModelViewSet):
    queryset = Entidad.objects.all()
    serializer_class = EntidadSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

class PromotorViewSet(viewsets.ModelViewSet):
    queryset = Promotor.objects.all()
    serializer_class = PromotorSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
