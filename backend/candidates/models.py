from django.db import models

class Candidate(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    skills = models.TextField()
    cv = models.FileField(upload_to='cvs/')

    def __str__(self):
        return self.name

