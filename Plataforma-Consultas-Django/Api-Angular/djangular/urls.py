
from django.contrib import admin
from django.urls import path,include
from rest_framework.documentation import include_docs_urls
from rest_framework.authtoken import views


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    path('docs/',include_docs_urls(title='API Documentación')),
   path('api-token-auth/', views.obtain_auth_token, name='api_token_auth')

]
