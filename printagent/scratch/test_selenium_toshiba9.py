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
    
    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=options)
    
    try:
        url = f"http://{ip}/?MAIN=TOPACCESS"
        print(f"Navigating to {url}...")
        driver.set_page_load_timeout(60)
        driver.get(url)
        time.sleep(3)
        print("HTTP Loaded! Title:", driver.title)
        with open("scratch/Toshiba_HTTP.html", "w", encoding="utf-8") as f:
            f.write(driver.page_source)
    except Exception as e:
        print("Error HTTP:", type(e).__name__, e)
        
    try:
        url = f"https://{ip}/?MAIN=TOPACCESS"
        print(f"Navigating to {url}...")
        driver.set_page_load_timeout(60)
        driver.get(url)
        time.sleep(3)
        print("HTTPS Loaded! Title:", driver.title)
        with open("scratch/Toshiba_HTTPS.html", "w", encoding="utf-8") as f:
            f.write(driver.page_source)
    except Exception as e:
        print("Error HTTPS:", type(e).__name__, e)

    driver.quit()

if __name__ == "__main__":
    scrape_toshiba("192.168.1.156")
