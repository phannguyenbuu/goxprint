from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

def scrape_toshiba(base_url):
    options = Options()
    options.add_argument('--headless=new')
    options.add_argument('--ignore-certificate-errors')
    options.add_argument('--allow-insecure-localhost')
    options.add_argument('--disable-gpu')
    options.add_argument('--no-sandbox')
    options.add_argument('--no-proxy-server')
    
    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=options)
    
    try:
        url = f"{base_url}/?MAIN=TOPACCESS"
        print(f"Navigating to {url}...")
        driver.set_page_load_timeout(30)
        driver.get(url)
        time.sleep(5)
        print("Loaded! Title:", driver.title)
        
        # Switch to TopLevelFrame
        driver.switch_to.frame("TopLevelFrame")
        
        # Use javascript to load TempGrpFrame directly into the contents frame
        print("Loading TempGrpFrame via javascript...")
        driver.execute_script("window.frames['contents'].location.href = '/Registration/Template/TempGrpFrame.html';")
        time.sleep(5)
        
        # Switch to contents frame
        driver.switch_to.frame("contents")
        
        with open("scratch/contents_after_js.html", "w", encoding="utf-8") as f:
            f.write(driver.page_source)
            
        # Inside contents, we have TopGrpFrame and TempGrpListFrame or something?
        print("Done!")
    except Exception as e:
        print("Error:", type(e).__name__, e)

    driver.quit()

if __name__ == "__main__":
    scrape_toshiba("https://wim17858236038101.app.goxprint.com")
