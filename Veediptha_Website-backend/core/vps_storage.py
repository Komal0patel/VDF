# import os
# import paramiko
# from django.core.files.storage import Storage
# from django.conf import settings


# class VPSStorage(Storage):

#     def _save(self, name, content):
#         ssh = paramiko.SSHClient()
#         ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())

#         ssh.connect(
#             hostname=settings.VPS_HOST,
#             username=settings.VPS_USER,
#             password=settings.VPS_PASSWORD,
#             port=settings.VPS_PORT
#         )

#         sftp = ssh.open_sftp()

#         remote_base_path = "/var/www/videeptha/media"
#         remote_path = f"{remote_base_path}/{name}"

#         # Ensure directory exists
#         try:
#             sftp.chdir(os.path.dirname(remote_path))
#         except IOError:
#             self._mkdir_p(sftp, os.path.dirname(remote_path))

#         with sftp.file(remote_path, "wb") as f:
#             f.write(content.read())

#         sftp.close()
#         ssh.close()

#         return name

#     def url(self, name):
#         return f"{settings.VPS_MEDIA_URL}/{name}"

#     def exists(self, name):
#         return False

#     def _mkdir_p(self, sftp, remote_directory):
#         dirs = remote_directory.split("/")
#         path = ""
#         for dir in dirs:
#             if dir:
#                 path += "/" + dir
#                 try:
#                     sftp.mkdir(path)
#                 except IOError:
#                     pass