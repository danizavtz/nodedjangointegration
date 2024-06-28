import os
import sys
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'settings')
django.setup()
from django.contrib.auth import authenticate

user = authenticate(username=sys.argv[1], password=sys.argv[2])
if user is not None:
    print(user.username, end='')
    sys.stdout.flush()
else:
    print(None)
    sys.stdout.flush()



