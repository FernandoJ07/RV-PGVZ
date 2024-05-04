@echo off

echo Ubicacion actual: %~dp0

cd %~dp0

for /f "tokens=1-2 delims=:" %%a in ('ipconfig^|find "IPv4"') do set ip=%%b
set ip=%ip:~1%

start "" http://%ip%:8000/

echo -----------------
echo SERVIDOR LOCAL
echo El sistema sera hosteado en http://%ip%:8000/
echo -----------------

cmd /k python manage.py runserver %ip%:8000