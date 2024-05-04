@echo off

echo Ubicacion actual: %~dp0

cd %~dp0

start "" http://127.0.0.1:8000/

echo -----------------
echo SERVIDOR LOCAL
echo El sistema sera hosteado en http://127.0.0.1:8000/
echo -----------------

cmd /k python manage.py runserver