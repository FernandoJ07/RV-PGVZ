from django.db import IntegrityError
from django.http import HttpResponse
from django.shortcuts import redirect, render

from core.models import *

from pdf.utils import render_to_pdf


def factura(request, id):
    try:
        factura = Factura.objects.get(id=id)
    except IntegrityError:
        return HttpResponse("Ha ocurrido un error al generar el pdf")
    except Cliente.DoesNotExist:
        return HttpResponse("Esta factura no está registrado")

    pdf = render_to_pdf("pdf/factura.html", {"factura": factura, "host": "http://" + request.META['HTTP_HOST']})
    
    return HttpResponse(pdf, content_type="application/pdf")


def factura_servicio(request, id):
    try:
        factura_servicio = ServicioFacturacion.objects.get(id=id)
    except IntegrityError:
        return HttpResponse("Ha ocurrido un error al generar el pdf")
    except Cliente.DoesNotExist:
        return HttpResponse("Esta factura no está registrado")

    pdf = render_to_pdf("pdf/factura_servicio.html", {"factura": factura_servicio, "host": "http://" + request.META['HTTP_HOST']})
    
    return HttpResponse(pdf, content_type="application/pdf")