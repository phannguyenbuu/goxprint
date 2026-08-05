from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
import time
import json

def scrape_toshiba(ip):
    options = Options()
    options.add_argument('--headless=new')
    options.add_argument('--ignore-certificate-errors')
    options.add_argument('--allow-insecure-localhost')
    options.add_argument('--disable-gpu')
    options.add_argument('--no-sandbox')
    
    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=options)
    
    try:
        url = f"https://{ip}/?MAIN=TOPACCESS"
        base_url = f"https://{ip}"
        print(f"Navigating to {url}...")
        driver.get(url)
        time.sleep(5)
        
        # Try to dump the top menu
        with open("scratch/TopLevel_local.html", "w", encoding="utf-8") as f:
            f.write(driver.page_source)
            
        print("Navigating to TempGroupList...")
        driver.get(f"{base_url}/Registration/Template/TempGroupList.html")
        time.sleep(3)
        
        with open("scratch/TempGroupList_local.html", "w", encoding="utf-8") as f:
            f.write(driver.page_source)
            
        print("Navigating to TempGrpFrame...")
        driver.get(f"{base_url}/Registration/Template/TempGrpFrame.html")
        time.sleep(3)
        
        with open("scratch/TempGrpFrame_local.html", "w", encoding="utf-8") as f:
            f.write(driver.page_source)
            
        print("Done! Dumped HTML locally.")
            
    except Exception as e:
        print("Error:", e)
    finally:
        driver.quit()

if __name__ == "__main__":
    scrape_toshiba("192.168.1.156")
