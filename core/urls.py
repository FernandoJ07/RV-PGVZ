from django.urls import path
from django.conf import settings
from django.conf.urls.static import static

from . import views

urlpatterns = [
    path("", views.inicioSesion, name="inicio-sesion"),
    path("inicio", views.index, name="index"),
    path("clientes", views.clientes, name="clientes"),
    path("productos", views.productos, name="productos"),
    path("ventas", views.ventas, name="ventas"),
    path("registro-ventas", views.registroVentas, name="registro-ventas"),
    path("transacciones", views.transacciones, name="transacciones"),
    path("proveedores", views.proveedores, name="proveedores"),
    path("facturas", views.facturas, name="facturas"),
    path("usuarios", views.usuarios, name="usuarios"),
    path("servicios", views.servicios, name="servicios"),
    path("registro-servicios", views.registroServicios, name="registro-servicios"),
    path("servicio-facturado", views.servicioFacturado, name="servicio-facturado"),


    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),





] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
