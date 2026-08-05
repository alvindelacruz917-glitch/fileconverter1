import json
import time
from pathlib import Path
from core.config import HISTORY_FILE

class HistoryManager:
    """Stores and retrieves conversion logs and recent files."""

    def __init__(self):
        self.history = []
        self.load()

    def load(self):
        if HISTORY_FILE.exists():
            try:
                with open(HISTORY_FILE, "r", encoding="utf-8") as f:
                    self.history = json.load(f)
            except Exception as e:
                print(f"Error loading history: {e}")
                self.history = []

    def save(self):
        try:
            with open(HISTORY_FILE, "w", encoding="utf-8") as f:
                json.dump(self.history, f, indent=4)
        except Exception as e:
            print(f"Error saving history: {e}")

    def add_record(self, tool_id, tool_name, source_files, output_file, status="Success", size_mb=0.0):
        record = {
            "id": str(int(time.time() * 1000)),
            "tool_id": tool_id,
            "tool_name": tool_name,
            "source_files": [str(s) for s in source_files],
            "output_file": str(output_file),
            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
            "status": status,
            "size_mb": round(size_mb, 2)
        }
        self.history.insert(0, record)
        # Keep maximum 200 items
        if len(self.history) > 200:
            self.history = self.history[:200]
        self.save()

    def clear(self):
        self.history = []
        self.save()

    def get_all(self):
        return self.history

history_manager = HistoryManager()
