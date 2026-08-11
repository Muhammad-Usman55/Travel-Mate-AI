from typing import Any, Dict


class BaseAgent:
    name: str = ""
    description: str = ""
    system_prompt_extra: str = ""

    async def process(self, **kwargs) -> Dict[str, Any]:
        raise NotImplementedError
