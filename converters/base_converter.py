from abc import ABC, abstractmethod
from typing import List, Dict, Any, Callable

class BaseConverter(ABC):
    """Abstract base class for all conversion processors."""

    def __init__(self, tool_id: str, tool_name: str):
        self.tool_id = tool_id
        self.tool_name = tool_name

    @abstractmethod
    def convert(
        self,
        input_files: List[str],
        output_dir: str,
        options: Dict[str, Any] = None,
        progress_callback: Callable[[int, str], None] = None
    ) -> List[str]:
        """Runs conversion logic and returns list of created output file paths."""
        pass
