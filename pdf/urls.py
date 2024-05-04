from django.urls import path

from . import views

urlpatterns = [
    path("factura/<int:id>", views.factura, name="factura"),
    path("factura_servicio/<int:id>", views.factura_servicio, name="factura_servicio"),
]