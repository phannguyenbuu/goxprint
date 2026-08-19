# GoxAgent - System Architecture & Behaviors

## Core Philosophy: Strict Execution (No Silent Fallbacks)

GoxAgent is designed to operate with absolute strictness. It relies **only** on explicitly provided configurations, user inputs, and database states. To prevent unexpected behaviors, silent failures, or incorrect data binding, the following fallback mechanisms have been **strictly removed and forbidden** from the codebase:

### 1. No Credential Fallbacks
The Agent will **never** attempt to "guess" printer credentials or silently inject test configurations (`test.user` / `test.password`) when authenticating with Ricoh or Toshiba printers.
- If credentials are provided via UI or Database, they are used exactly as provided.
- If no credentials are provided, it accesses the printer as a guest.
- There are no arrays of default passwords (e.g., `["admin", "123456", "password"]`) looped in the background.

### 2. No Discovery Fallbacks (MAC Guessing)
During network discovery, if a printer's IP cannot be reached or its MAC address cannot be directly resolved via proper protocols, the Agent will **not** attempt to guess or fallback to a neighbor MAC map. If it cannot be definitively identified, it is skipped.

### 3. No Payload Fallbacks (Toshiba)
When interacting with Toshiba Web APIs, the Agent uses exactly one strict payload format (`COUNTER_PAYLOADS[0]`). It will **not** silently fallback to older/simpler XML structures if the primary payload is rejected. If the firmware doesn't support the strict payload, the operation fails explicitly.

### 4. No Polling Heartbeat Fallbacks
If the Agent encounters an error while collecting data from a printer during a polling cycle, it will **not** construct an empty/fake "fallback payload" (`skip_data_update=True`) just to ping the server. The failure is logged, and no data is transmitted for that cycle.

### Allowed Fallbacks
- **DOM Parser Fallback (Ricoh):** The only permitted fallback is during HTML parsing (e.g., Address Book collection). If the primary DOM structure matching fails due to firmware variations, the parser may fallback to secondary DOM tag matching. This is purely a data extraction resilience feature, not a logic bypass.
