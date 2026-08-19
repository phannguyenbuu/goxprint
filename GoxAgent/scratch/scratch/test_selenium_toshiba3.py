from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
import time

def scrape_toshiba(url):
    options = Options()
    # options.add_argument('--headless=new')
    options.add_argument('--ignore-certificate-errors')
    options.add_argument('--allow-insecure-localhost')
    options.add_argument('--disable-gpu')
    options.add_argument('--no-sandbox')
    
    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=options)
    
    try:
        print(f"Navigating to {url}...")
        driver.get(url)
        time.sleep(5)
        print("Page title:", driver.title)
        
        # Dump page source
        with open("scratch/selenium_source.html", "w", encoding="utf-8") as f:
            f.write(driver.page_source)
            
    finally:
        driver.quit()

if __name__ == "__main__":
    url = "https://wim17858207868101.app.goxprint.com/?MAIN=TOPACCESS"
    scrape_toshiba(url)
