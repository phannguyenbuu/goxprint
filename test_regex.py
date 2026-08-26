import re

body = """
<div id="pgm-overall-container">
  <div id="pgm-left-pane-bkground" style="display: block;"></div>
  <div id="pgm-banner"><div id="login" class="gui-hidden ra"> <span class="login_msg">EWS_STRING_WELCOME</span><span> | </span> <a href="#"></a> </div><div id="banner-logo-div"> <a href="http://www.hp.com" target="_blank"><img alt="HP.com Home" title="" src="/images/icon_hp_logo_masthead.png"></a> </div><div id="banner-section-title"><h1>HP PageWide Pro 452dw Printer</h1> <span>Embedded Web Server</span> </div></div>
"""

m = re.search(r'<div[^>]*id="banner-section-title"[^>]*>.*?<h1[^>]*>(.*?)</h1>', body, re.IGNORECASE | re.DOTALL)
print("REGEX 1:", m.group(1) if m else 'NOT FOUND')
