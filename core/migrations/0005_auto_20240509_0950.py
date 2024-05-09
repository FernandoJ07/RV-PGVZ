# Generated by Django 3.1.4 on 2024-05-09 09:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0004_user_is_gerente_ventas'),
    ]

    operations = [
        migrations.AddField(
            model_name='cliente',
            name='status',
            field=models.CharField(choices=[('activo', 'Activo'), ('inactivo', 'Inactivo'), ('suspendido', 'Suspendido')], default='activo', max_length=20),
        ),
        migrations.AddField(
            model_name='proveedor',
            name='status',
            field=models.CharField(choices=[('activo', 'Activo'), ('inactivo', 'Inactivo'), ('suspendido', 'Suspendido')], default='activo', max_length=20),
        ),
        migrations.AddField(
            model_name='user',
            name='status',
            field=models.CharField(choices=[('activo', 'Activo'), ('inactivo', 'Inactivo'), ('suspendido', 'Suspendido')], default='activo', max_length=20),
        ),
        migrations.AlterField(
            model_name='user',
            name='is_gerente_ventas',
            field=models.BooleanField(default='Vendedor'),
        ),
    ]
