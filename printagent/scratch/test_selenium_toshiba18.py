from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
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
        url = f"{base_url}/?MAIN=LOGIN"
        print(f"Navigating to {url}...")
        driver.set_page_load_timeout(30)
        driver.get(url)
        time.sleep(3)
        
        driver.switch_to.frame("TopLevelFrame")
        driver.switch_to.frame("contents")
        with open("scratch/Login_contents.html", "w", encoding="utf-8") as f:
            f.write(driver.page_source)
            
        print("Done!")
    except Exception as e:
        print("Error:", type(e).__name__, e)

    driver.quit()

if __name__ == "__main__":
    scrape_toshiba("https://wim17858236038101.app.goxprint.com")
