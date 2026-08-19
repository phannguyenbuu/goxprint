from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
import time

def scrape_toshiba(url):
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
        time.sleep(4)
        
        # We know there is a frameset. Let's list all frames.
        print("Switching to TopLevelFrame...")
        driver.switch_to.frame("TopLevelFrame")
        
        frames = driver.find_elements(By.TAG_NAME, "frame")
        for i, frame in enumerate(frames):
            print(f"Frame {i}: name={frame.get_attribute('name')} src={frame.get_attribute('src')}")
            
        # Try to find "Registration" link in the current frame or child frames
        # It's usually in 'topframe'
        print("Switching to topframe...")
        driver.switch_to.frame("topframe")
        
        links = driver.find_elements(By.TAG_NAME, "a")
        for link in links:
            print("Link:", link.text)
            if "Registration" in link.text:
                print("Clicking Registration...")
                link.click()
                break
                
        time.sleep(3)
        
        # Let's dump the whole source to see what changed
        with open("scratch/selenium_source2.html", "w", encoding="utf-8") as f:
            f.write(driver.page_source)
            
    except Exception as e:
        print("Error:", e)
    finally:
        driver.quit()

if __name__ == "__main__":
    url = "https://wim17858211148101.app.goxprint.com/?MAIN=TOPACCESS"
    scrape_toshiba(url)
