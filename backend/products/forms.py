# backend/products/forms.py
import io
from django import forms
from django.core.exceptions import ValidationError
from accounts.models import CustomUser

SELLER_QS = CustomUser.objects.filter(role='SELLER', is_active=True)

class BulkImportForm(forms.Form):
    seller = forms.ModelChoiceField(
        queryset=SELLER_QS,
        widget=forms.Select(attrs={'class': 'vTextField'}),
        help_text="All rows will be imported for this seller."
    )
    csv_file = forms.FileField(
        help_text="Upload a CSV following the template."
    )
    images_zip = forms.FileField(
        required=False,
        help_text="Optional ZIP of images referenced by image_filename/media_filenames."
    )
    auto_create_categories = forms.BooleanField(
        required=False, initial=True,
        help_text="If checked, unknown categories will be created automatically."
    )

    def clean_csv_file(self):
        f = self.cleaned_data['csv_file']
        name = (f.name or '').lower()
        if not (name.endswith('.csv') or name.endswith('.txt')):
            raise ValidationError("Please upload a .csv file.")
        # light size guard
        if f.size > 5 * 1024 * 1024:
            raise ValidationError("CSV too large (limit 5MB).")
        return f

    def clean_images_zip(self):
        f = self.cleaned_data.get('images_zip')
        if not f:
            return None
        name = (f.name or '').lower()
        if not name.endswith('.zip'):
            raise ValidationError("Images archive must be a .zip file.")
        if f.size > 200 * 1024 * 1024:
            raise ValidationError("ZIP too large (limit 200MB).")
        return f


class CommitForm(forms.Form):
    # signed preview payload (JSON) + selected row ids to commit
    payload = forms.CharField(widget=forms.HiddenInput)
    # Checkbox list of row indices to commit
    include_rows = forms.MultipleChoiceField(choices=(), required=False)
    # For duplicates: rows the user explicitly allows to update
    allow_update_rows = forms.MultipleChoiceField(choices=(), required=False)

    def set_row_count(self, n):
        choices = [(str(i), f"Row {i+1}") for i in range(n)]
        self.fields['include_rows'].choices = choices
        self.fields['allow_update_rows'].choices = choices
