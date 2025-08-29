from django.db import models
from accounts.models import CustomUser


class SellerApplication(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('APPROVED', 'Approved'),
        ('REJECTED', 'Rejected'),
    ]

    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)

    # Business Info
    business_name = models.CharField(max_length=255)
    nid_number = models.CharField(max_length=30)

    # Uploaded documents
    photo = models.ImageField(upload_to='kyc/selfie/', help_text="Photo of the applicant")
    nid_front = models.ImageField(upload_to='kyc/nid_front/')
    nid_back = models.ImageField(upload_to='kyc/nid_back/')
    tax_token = models.ImageField(upload_to='kyc/tax_token/', null=True, blank=True)
    trade_license = models.ImageField(upload_to='kyc/trade_license/')

    # Status tracking
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    submitted_at = models.DateTimeField(auto_now_add=True)
    reviewed_at = models.DateTimeField(null=True, blank=True)
    review_notes = models.TextField(null=True, blank=True)

    def __str__(self):
        return f"{self.user.email} - {self.status}"
