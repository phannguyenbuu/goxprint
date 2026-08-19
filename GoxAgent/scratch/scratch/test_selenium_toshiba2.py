from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
import sys

def scrape_toshiba(url):
    options = Options()
    # options.add_argument('--headless=new')
    options.add_argument('--ignore-certificate-errors')
    options.add_argument('--allow-insecure-localhost')
    options.add_argument('--disable-gpu')
    options.add_argument('--no-sandbox')
    
    # We will try to download the chromedriver
    print("Installing ChromeDriver...")
    service = Service(ChromeDriverManager().install())
    print("Starting Chrome...")
    driver = webdriver.Chrome(service=service, options=options)
    
    try:
        print(f"Navigating to {url}...")
        driver.get(url)
        
        time.sleep(3)
        print("Page title:", driver.title)
        
        # We need to find the frame and input username/password
        # The main frameset has TopLevelFrame which points to FrameIndex.html
        # FrameIndex.html then loads TopAccessLogin.html in a frame?
        
        # Let's just dump all frames
        frames = driver.find_elements(By.TAG_NAME, "frame")
        for i, frame in enumerate(frames):
            print(f"Frame {i}: {frame.get_attribute('name')} -> {frame.get_attribute('src')}")
            
    finally:
        driver.quit()

if __name__ == "__main__":
    url = "https://wim17858207868101.app.goxprint.com/?MAIN=TOPACCESS"
    scrape_toshiba(url)
