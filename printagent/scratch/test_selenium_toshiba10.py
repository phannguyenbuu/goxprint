from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
import time

def scrape_toshiba(ip):
    options = Options()
    options.add_argument('--headless=new')
    options.add_argument('--ignore-certificate-errors')
    options.add_argument('--allow-insecure-localhost')
    options.add_argument('--disable-gpu')
    options.add_argument('--no-sandbox')
    options.add_argument('--no-proxy-server')
    options.page_load_strategy = 'eager'
    
    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=options)
    
    try:
        url = f"http://{ip}/?MAIN=TOPACCESS"
        print(f"Navigating to {url}...")
        driver.set_page_load_timeout(30)
        driver.get(url)
        time.sleep(5)
        print("HTTP Loaded! Title:", driver.title)
        
        # Now try to access the template frames directly
        base_url = f"http://{ip}"
        
        print("Navigating to TempGroupList...")
        driver.get(f"{base_url}/Registration/Template/TempGroupList.html")
        time.sleep(3)
        with open("scratch/TempGroupList_eager.html", "w", encoding="utf-8") as f:
            f.write(driver.page_source)
            
        print("Navigating to TempGrpFrame...")
        driver.get(f"{base_url}/Registration/Template/TempGrpFrame.html")
        time.sleep(3)
        with open("scratch/TempGrpFrame_eager.html", "w", encoding="utf-8") as f:
            f.write(driver.page_source)
            
        print("Done!")
    except Exception as e:
        print("Error:", type(e).__name__, e)

    driver.quit()

if __name__ == "__main__":
    scrape_toshiba("192.168.1.156")
