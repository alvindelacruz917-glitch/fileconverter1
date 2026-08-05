try:
    from PySide6.QtWidgets import QWidget, QVBoxLayout, QLabel, QGridLayout, QScrollArea, QFrame
    from PySide6.QtCore import Signal
    from widgets.tool_card import ToolCard
except ImportError:
    pass

class ImageToolsPage(QWidget if 'QWidget' in globals() else object):
    """Grid page showing all Image Conversion and Processing Tools."""

    tool_selected = Signal(str) if 'Signal' in globals() else None

    def __init__(self, parent=None):
        if 'QWidget' in globals():
            super().__init__(parent)
            self.init_ui()

    def init_ui(self):
        main_layout = QVBoxLayout(self)
        scroll = QScrollArea()
        scroll.setWidgetResizable(True)
        scroll.setFrameShape(QFrame.NoFrame)

        content = QWidget()
        layout = QVBoxLayout(content)
        layout.setContentsMargins(30, 20, 30, 30)
        layout.setSpacing(20)

        title = QLabel("Image Tools")
        title.setStyleSheet("font-size: 26px; font-weight: 800; color: #F8FAFC;")
        layout.addWidget(title)

        sub = QLabel("Convert, resize, compress, crop, rotate, flip, and edit image formats instantly.")
        sub.setStyleSheet("font-size: 14px; color: #94A3B8;")
        layout.addWidget(sub)

        image_tools = [
            ("jpg_to_png", "🔁", "JPG to PNG", "Convert JPG to transparent PNG format"),
            ("png_to_jpg", "🔄", "PNG to JPG", "Convert PNG to standard JPG format"),
            ("jpg_to_webp", "⚡", "JPG to WEBP", "Convert JPG to next-gen WEBP format"),
            ("webp_to_jpg", "🖼️", "WEBP to JPG", "Convert WEBP images back to JPG"),
            ("png_to_webp", "✨", "PNG to WEBP", "Convert PNG to small lossy/lossless WEBP"),
            ("webp_to_png", "🎨", "WEBP to PNG", "Convert WEBP to full PNG format"),
            ("bmp_to_png", "🖼️", "BMP to PNG", "Convert bitmap images to PNG"),
            ("tiff_to_jpg", "📸", "TIFF to JPG", "Convert multi-page or high-res TIFF to JPG"),
            ("gif_to_png", "🎞️", "GIF to PNG", "Extract frames or convert GIF to PNG"),
            ("heic_to_jpg", "📱", "HEIC to JPG", "Convert iPhone HEIC photos to JPG"),
            ("ico_to_png", "🎯", "ICO to PNG", "Convert icon files to PNG images"),
            ("svg_to_png", "✒️", "SVG to PNG", "Render vector SVG to raster PNG image"),
            ("image_resize", "📐", "Resize Image", "Change width, height, or scale ratio"),
            ("image_compress", "📉", "Compress Image", "Reduce image file size with quality control"),
            ("image_crop", "✂️", "Crop Image", "Crop region from image canvas"),
            ("image_rotate", "🔄", "Rotate Image", "Rotate image 90, 180, 270 degrees"),
            ("image_flip", "↔️", "Flip Image", "Flip image horizontally or vertically"),
            ("image_watermark", "💧", "Add Watermark", "Overlay text or logo onto image"),
            ("image_remove_bg", "🪄", "Remove Background", "AI automatic background removal"),
        ]

        grid = QGridLayout()
        grid.setSpacing(16)

        for i, (t_id, icon, name, desc) in enumerate(image_tools):
            card = ToolCard(t_id, icon, name, desc)
            if hasattr(card, "clicked") and card.clicked:
                card.clicked.connect(lambda id=t_id: self.tool_selected.emit(id) if self.tool_selected else None)
            grid.addWidget(card, i // 3, i % 3)

        layout.addLayout(grid)
        scroll.setWidget(content)
        main_layout.addWidget(scroll)
