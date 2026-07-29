import re

with open(r'd:\Dropbox\_Documents\Goxprint\printagent_v2\agent\services\polling_bridge.py', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove _show_command_popup and _show_agent_command_popup definitions
content = re.sub(r'    def _show_command_popup\(self, printer: Printer, command_type: str, command: dict\[str, object\]\) -> None:.*?    def _show_agent_command_popup', r'    def _show_agent_command_popup', content, flags=re.DOTALL)
content = re.sub(r'    def _show_agent_command_popup\(self, command_type: str, params: dict\) -> None:.*?    def _apply_command', r'    def _apply_command', content, flags=re.DOTALL)

# Remove their invocations
content = re.sub(r'        try:\n            self\._show_command_popup\(printer, command_type, command\)\n        except Exception as pop_exc:\n            LOGGER\.warning\("Failed to invoke command popup: %s", pop_exc\)\n', '', content)
content = re.sub(r'        try:\n            self\._show_agent_command_popup\(command_type, params\)\n        except Exception as pop_exc:\n            LOGGER\.warning\("Failed to invoke agent command popup: %s", pop_exc\)\n', '', content)

with open(r'd:\Dropbox\_Documents\Goxprint\printagent_v2\agent\services\polling_bridge.py', 'w', encoding='utf-8') as f:
    f.write(content)
print("Done")
