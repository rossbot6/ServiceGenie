# Generate QR Code for ServiceGenie App

import qrcode
import io
import base64

# App URL
app_url = "http://localhost:5174"

# Generate QR code
qr = qrcode.QRCode(version=1, box_size=10, border=4)
qr.add_data(app_url)
qr.make(fit=True)

# Create image
qr_img = qr.make_image(fill_color="black", back_color="white")
img_buffer = io.BytesIO()
qr_img.save(img_buffer, format='PNG')
img_buffer.seek(0)

# Convert to base64 for easy sharing
img_base64 = base64.b64encode(img_buffer.getvalue()).decode()

# Save to file
with open('app-qr-code.png', 'wb') as f:
    f.write(img_buffer.getvalue())

print(f"QR Code generated for: {app_url}")
print(f"Base64 image data: {img_base64[:50]}...")

# Also save as text file with URL
with open('app-url.txt', 'w') as f:
    f.write(f"ServiceGenie App URL: {app_url}\n")
    
print(f"URL saved to: app-url.txt")