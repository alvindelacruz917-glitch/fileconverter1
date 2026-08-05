import os
import json
from pathlib import Path

APP_NAME = "Universal File Converter"
APP_VERSION = "2.5.0 Pro"
ORGANIZATION = "Universal Software Corp"

# Base Directory
BASE_DIR = Path.home() / ".universal_file_converter"
BASE_DIR.mkdir(parents=True, exist_ok=True)

CONFIG_FILE = BASE_DIR / "config.json"
HISTORY_FILE = BASE_DIR / "history.json"
DEFAULT_OUTPUT_DIR = str(Path.home() / "Downloads" / "ConvertedFiles")

DEFAULT_CONFIG = {
    "theme": "dark",
    "accent_color": "#2563EB",
    "output_folder": DEFAULT_OUTPUT_DIR,
    "remember_last_folder": True,
    "auto_open_output": True,
    "remember_window_size": True,
    "window_width": 1280,
    "window_height": 850,
    "language": "English",
    "sound_effects": True
}

class ConfigManager:
    """Manages application settings and local JSON state persistence."""
    
    def __init__(self):
        self.config = DEFAULT_CONFIG.copy()
        self.load()

    def load(self):
        if CONFIG_FILE.exists():
            try:
                with open(CONFIG_FILE, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    self.config.update(data)
            except Exception as e:
                print(f"Error loading config: {e}")

    def save(self):
        try:
            with open(CONFIG_FILE, "w", encoding="utf-8") as f:
                json.dump(self.config, f, indent=4)
        except Exception as e:
            print(f"Error saving config: {e}")

    def get(self, key, default=None):
        return self.config.get(key, default)

    def set(self, key, value):
        self.config[key] = value
        self.save()

config_manager = ConfigManager()
