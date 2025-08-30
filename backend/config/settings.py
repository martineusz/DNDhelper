from datetime import timedelta
from pathlib import Path
from decouple import Config, RepositoryEnv
import os

BASE_DIR = Path(__file__).resolve().parent.parent

# 🔹 Load different env files based on environment
# Set ENVIRONMENT=dev locally, or ENVIRONMENT=docker in docker-compose
ENVIRONMENT = os.getenv("ENVIRONMENT", "dev")

if ENVIRONMENT == "docker":
    config = Config(RepositoryEnv(BASE_DIR / ".env.prod"))
else:
    config = Config(RepositoryEnv(BASE_DIR / ".env.dev"))

SECRET_KEY = config('DJANGO_SECRET_KEY')
DEBUG = config('DEBUG', default=True, cast=bool)
#ALLOWED_HOSTS = config('ALLOWED_HOSTS', default='localhost,127.0.0.1', cast=lambda v: v.split(','))
ALLOWED_HOSTS = ['*']

INSTALLED_APPS = [
    'player_characters',
    'encounters',
    'sign_in',
    'compendium',
    'rest_framework_simplejwt',
    'corsheaders',
    'rest_framework',
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
]

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
}

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=5),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=1),
    "ROTATE_REFRESH_TOKENS": True,
    "BLACKLIST_AFTER_ROTATION": True,
}

CORS_ALLOW_ALL_ORIGINS = True

ROOT_URLCONF = "config.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / 'templates'],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "config.wsgi.application"

# 🔹 DATABASES configuration based on environment
if ENVIRONMENT == "docker":
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': config('POSTGRES_DB', default='myproject'),
            'USER': config('POSTGRES_USER', default='myuser'),
            'PASSWORD': config('POSTGRES_PASSWORD', default='supersecretpassword'),
            'HOST': 'db',       # 🔹 use service name from docker-compose.prod.yml
            'PORT': '5432',     # always container port
        }
    }
else:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': config('POSTGRES_DB', default='myproject'),
            'USER': config('POSTGRES_USER', default='myuser'),
            'PASSWORD': config('POSTGRES_PASSWORD', default='supersecretpassword'),
            'HOST': 'localhost',
            'PORT': '5432',
        }
    }

AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True

STATIC_URL = "static/"
STATIC_ROOT = BASE_DIR / 'staticfiles'
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
