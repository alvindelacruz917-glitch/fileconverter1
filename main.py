import sys
import os

def main():
    try:
        from PySide6.QtWidgets import QApplication
        from app.application import MainWindow
        from core.logger import logger
        
        logger.info("Starting Universal File Converter Desktop Application...")
        app = QApplication(sys.argv)
        app.setApplicationName("Universal File Converter")
        app.setOrganizationName("Universal Software Corp")

        window = MainWindow()
        window.show()
        sys.exit(app.exec())
    except ImportError as e:
        print("PySide6 GUI module not present or running in web-only environment.")
        print(f"Error detail: {e}")
        print("To run locally on desktop, install dependencies via: pip install -r requirements.txt")

if __name__ == "__main__":
    main()
