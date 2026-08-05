from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

def scrape_toshiba(ip, username, password):
    options = Options()
    # options.add_argument('--headless=new')
    options.add_argument('--ignore-certificate-errors')
    options.add_argument('--allow-insecure-localhost')
    options.add_argument('--disable-gpu')
    options.add_argument('--no-sandbox')
    
    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=options)
    
    try:
        url = f"https://{ip}/?MAIN=TOPACCESS"
        print(f"Navigating to {url}...")
        driver.get(url)
        
        # Wait for login form
        # We need to see how the login form looks. Let's just dump the page source first.
        time.sleep(3)
        print("Page title:", driver.title)
        print("Frames:", len(driver.find_elements(By.TAG_NAME, "frame")) + len(driver.find_elements(By.TAG_NAME, "iframe")))
        
    finally:
        driver.quit()

if __name__ == "__main__":
    scrape_toshiba("192.168.1.156", "admin", "123456")
