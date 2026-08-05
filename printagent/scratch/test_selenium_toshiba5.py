from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
import time
import json

def scrape_toshiba(url, base_url):
    options = Options()
    options.add_argument('--headless=new')
    options.add_argument('--ignore-certificate-errors')
    options.add_argument('--allow-insecure-localhost')
    options.add_argument('--disable-gpu')
    options.add_argument('--no-sandbox')
    
    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=options)
    
    try:
        print(f"Navigating to {url}...")
        driver.get(url)
        time.sleep(3)
        
        # We don't have to login because no credentials were required or provided?
        # Let's try navigating straight to TempGroupList.html or TempGrpFrame.html
        print("Navigating to TempGroupList...")
        driver.get(f"{base_url}/Registration/Template/TempGroupList.html")
        time.sleep(3)
        
        with open("scratch/TempGroupList_selenium.html", "w", encoding="utf-8") as f:
            f.write(driver.page_source)
            
        print("Navigating to TempGrpFrame...")
        driver.get(f"{base_url}/Registration/Template/TempGrpFrame.html")
        time.sleep(3)
        
        with open("scratch/TempGrpFrame_selenium.html", "w", encoding="utf-8") as f:
            f.write(driver.page_source)
            
        print("Done! Dumped HTML.")
            
    except Exception as e:
        print("Error:", e)
    finally:
        driver.quit()

if __name__ == "__main__":
    url = "https://wim17858211148101.app.goxprint.com/?MAIN=TOPACCESS"
    base = "https://wim17858211148101.app.goxprint.com"
    scrape_toshiba(url, base)
