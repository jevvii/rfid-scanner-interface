from django.db import models


class RFIDLog(models.Model):
    tag_id = models.CharField(max_length=100)
    name = models.CharField(max_length=30, blank=True, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name or 'unknown'} {self.tag_id} @ {self.timestamp}"
