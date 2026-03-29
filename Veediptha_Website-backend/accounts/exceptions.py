from rest_framework.exceptions import APIException
from rest_framework import status

class AuthBaseException(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = 'Authentication error occurred'
    default_code = 'auth_error'

class EmailAlreadyExistsException(AuthBaseException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = 'Account already exists with this email'
    default_code = 'email_exists'

class UserNotFoundException(AuthBaseException):
    status_code = status.HTTP_404_NOT_FOUND
    default_detail = 'Account does not exist'
    default_code = 'user_not_found'

class InvalidCredentialsException(AuthBaseException):
    status_code = status.HTTP_401_UNAUTHORIZED
    default_detail = 'Invalid email or password'
    default_code = 'invalid_credentials'

class AccountLockedException(AuthBaseException):
    status_code = status.HTTP_429_TOO_MANY_REQUESTS
    default_detail = 'Account is locked due to too many failed attempts'
    default_code = 'account_locked'

class DatabaseConnectionException(AuthBaseException):
    status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
    default_detail = 'Database connection error'
    default_code = 'db_error'
