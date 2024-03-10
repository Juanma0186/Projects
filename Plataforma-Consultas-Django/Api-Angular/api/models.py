from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone

class Rol(models.TextChoices):
    CIUDADANO = 'ciudadano'
    BANCO = 'banco'
    ADMIN = 'admin'
    PROMOTOR = 'promotor'


class Entidad(models.Model):
    nombre = models.CharField(max_length=255)
    localidad = models.CharField(max_length=255, default="")

    def __str__(self):
        return self.nombre

class Promotor(models.Model):
    nombre = models.CharField(max_length=255)
    ciudad = models.CharField(max_length=255, default="")

    def __str__(self):
        return self.nombre

class Usuario(AbstractUser):
    rol = models.CharField(max_length=10, choices=Rol.choices)
    entidad = models.ForeignKey(Entidad, on_delete=models.SET_NULL, null=True, blank=True)
    promotor = models.ForeignKey(Promotor, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return self.username


class Aportacion(models.Model):
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    promotor = models.ForeignKey(Promotor, on_delete=models.CASCADE)
    entidad = models.ForeignKey(Entidad, on_delete=models.CASCADE)
    mes = models.CharField(max_length=255)
    fecha = models.DateTimeField(default=timezone.now)
    cantidad = models.IntegerField()

    def __str__(self):
        return f"{self.usuario.username} - {self.promotor.nombre} - {self.mes}"
