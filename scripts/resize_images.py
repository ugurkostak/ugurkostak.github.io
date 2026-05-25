"""
Image Resizer Utility

Resizes all images in the assets/photos directory to a maximum of 800x800 pixels
while maintaining aspect ratio. Useful for optimizing images for web delivery.

Usage:
    python scripts/resize_images.py

Output:
    Resized images are saved to assets/photos/small/
    Original images in assets/photos/ are preserved.

Requirements:
    - Pillow (PIL)
"""

import os
from PIL import Image


def resize_images():
    """
    Resizes all image files in assets/photos to max 800x800 and saves to small/ subdirectory.
    Supported formats: .jpg, .jpeg, .png, .webp
    """
    input_dir = os.path.join(os.path.dirname(__file__), '../assets/photos')
    output_dir = os.path.join(input_dir, 'small')

    # Ensure the output directory exists
    os.makedirs(output_dir, exist_ok=True)

    supported_formats = ('.jpg', '.jpeg', '.png', '.webp')
    resized_count = 0
    error_count = 0

    # Resize images
    for file_name in os.listdir(input_dir):
        input_file_path = os.path.join(input_dir, file_name)

        # Skip directories and the output subdirectory
        if os.path.isdir(input_file_path) or file_name == 'small':
            continue

        output_file_path = os.path.join(output_dir, file_name)

        # Check if the file is an image
        if file_name.lower().endswith(supported_formats):
            try:
                with Image.open(input_file_path) as img:
                    # Resize to fit within 800x800, maintaining aspect ratio
                    img.thumbnail((800, 800), Image.Resampling.LANCZOS)
                    img.save(output_file_path)
                    print(f"✓ Resized: {file_name}")
                    resized_count += 1
            except Exception as e:
                print(f"✗ Error resizing {file_name}: {e}")
                error_count += 1

    print(f"\nSummary: {resized_count} images resized, {error_count} errors")


if __name__ == '__main__':
    resize_images()

