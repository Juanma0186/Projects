from django.contrib import admin
from .models import Entidad, Promotor, Usuario, Aportacion
# Register your models here.

admin.site.register(Entidad)
admin.site.register(Promotor)
admin.site.register(Usuario)
admin.site.register(Aportacion)