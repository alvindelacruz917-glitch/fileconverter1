try:
    from PySide6.QtWidgets import QWidget, QVBoxLayout, QHBoxLayout, QLabel, QPushButton, QComboBox, QSlider, QCheckBox, QLineEdit, QScrollArea, QFrame, QGridLayout
    from PySide6.QtCore import Signal, Qt
    from widgets.drop_zone import DropZone
except ImportError:
    pass

class ImageToPdfPage(QWidget if 'QWidget' in globals() else object):
    """Dedicated studio page for Image to PDF conversion with options & reordering."""

    back_requested = Signal() if 'Signal' in globals() else None

    def __init__(self, parent=None):
        if 'QWidget' in globals():
            super().__init__(parent)
            self.images = []
            self.init_ui()

    def init_ui(self):
        layout = QVBoxLayout(self)
        layout.setContentsMargins(30, 20, 30, 30)
        layout.setSpacing(16)

        header = QHBoxLayout()
        back_btn = QPushButton("← Back")
        back_btn.setObjectName("secondaryBtn")
        if hasattr(back_btn, "clicked"):
            back_btn.clicked.connect(lambda: self.back_requested.emit() if self.back_requested else None)
        header.addWidget(back_btn)

        title = QLabel("🖼️ Image to PDF Studio")
        title.setStyleSheet("font-size: 24px; font-weight: 800; color: #F8FAFC;")
        header.addWidget(title)
        header.addStretch()
        layout.addLayout(header)

        body = QHBoxLayout()
        body.setSpacing(20)

        # Left Column: Upload & Image List Preview
        left_col = QVBoxLayout()
        self.drop_zone = DropZone(subtitle="Drop JPG, PNG, WEBP, BMP, TIFF images to arrange into PDF")
        left_col.addWidget(self.drop_zone)

        # Preview list area
        preview_box = QFrame()
        preview_box.setObjectName("card")
        preview_layout = QVBoxLayout(preview_box)
        preview_title = QLabel("Page Order & Thumbnails (Drag to reorder)")
        preview_title.setStyleSheet("font-weight: 700; color: #94A3B8;")
        preview_layout.addWidget(preview_title)

        self.thumb_scroll = QScrollArea()
        self.thumb_scroll.setWidgetResizable(True)
        self.thumb_container = QWidget()
        self.thumb_layout = QGridLayout(self.thumb_container)
        self.thumb_scroll.setWidget(self.thumb_container)
        preview_layout.addWidget(self.thumb_scroll)

        left_col.addWidget(preview_box)
        body.addLayout(left_col, stretch=3)

        # Right Column: PDF Settings Panel
        settings_card = QFrame()
        settings_card.setObjectName("card")
        settings_card.setFixedWidth(320)
        settings_layout = QVBoxLayout(settings_card)
        settings_layout.setContentsMargins(20, 20, 20, 20)
        settings_layout.setSpacing(14)

        stitle = QLabel("PDF Settings")
        stitle.setStyleSheet("font-size: 16px; font-weight: bold; color: #2563EB;")
        settings_layout.addWidget(stitle)

        # Merge option
        self.merge_checkbox = QCheckBox("Merge into single PDF document")
        self.merge_checkbox.setChecked(True)
        settings_layout.addWidget(self.merge_checkbox)

        # Page Size
        settings_layout.addWidget(QLabel("Page Size:"))
        self.page_size_combo = QComboBox()
        self.page_size_combo.addItems(["A4", "Letter", "Legal", "Auto Size (Match Image)"])
        settings_layout.addWidget(self.page_size_combo)

        # Orientation
        settings_layout.addWidget(QLabel("Orientation:"))
        self.orient_combo = QComboBox()
        self.orient_combo.addItems(["Portrait", "Landscape", "Auto"])
        settings_layout.addWidget(self.orient_combo)

        # Margins
        settings_layout.addWidget(QLabel("Margins:"))
        self.margin_combo = QComboBox()
        self.margin_combo.addItems(["None (0px)", "Small (10px)", "Medium (20px)", "Large (30px)"])
        settings_layout.addWidget(self.margin_combo)

        # Image Fit
        settings_layout.addWidget(QLabel("Image Fit:"))
        self.fit_combo = QComboBox()
        self.fit_combo.addItems(["Fit to Page", "Fill Page (Crop)", "Original Size", "Stretch"])
        settings_layout.addWidget(self.fit_combo)

        # Quality Slider
        settings_layout.addWidget(QLabel("Quality / Compression (90%):"))
        self.quality_slider = QSlider(Qt.Horizontal)
        self.quality_slider.setRange(10, 100)
        self.quality_slider.setValue(90)
        settings_layout.addWidget(self.quality_slider)

        # Output Filename
        settings_layout.addWidget(QLabel("Output File Name:"))
        self.out_name_input = QLineEdit("converted_album.pdf")
        settings_layout.addWidget(self.out_name_input)

        settings_layout.addStretch()

        self.convert_btn = QPushButton("⚡ Convert to PDF")
        self.convert_btn.setStyleSheet("font-size: 15px; padding: 12px 20px;")
        settings_layout.addWidget(self.convert_btn)

        body.addWidget(settings_card, stretch=1)
        layout.addLayout(body)
