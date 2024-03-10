from rest_framework import serializers
from .models import Usuario, Aportacion, Entidad, Promotor

class UsuarioSerializer(serializers.ModelSerializer):
    entidad = serializers.StringRelatedField()
    promotor= serializers.StringRelatedField()

    class Meta:
        model = Usuario
        fields = '__all__'

#! Se utiliza para representar el usuario y el promotor como cadenas en lugar de sus IDs
class AportacionSerializer(serializers.ModelSerializer):
    usuario = serializers.SlugRelatedField(slug_field='username', queryset=Usuario.objects.all())
    promotor = serializers.SlugRelatedField(slug_field='nombre', queryset=Promotor.objects.all())
    entidad = serializers.SlugRelatedField(slug_field='nombre', queryset=Entidad.objects.all())
    last_name = serializers.CharField(source='usuario.last_name', read_only=True)

    class Meta:
        model = Aportacion
        fields = ['id', 'usuario', 'promotor', 'entidad', 'mes', 'fecha', 'cantidad', 'last_name']

   

class EntidadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Entidad
        fields = '__all__'

class PromotorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Promotor
        fields = '__all__'
