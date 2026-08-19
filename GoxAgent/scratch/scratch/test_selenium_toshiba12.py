from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
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
        
        # We are at the root frame set.
        # Switch to TopLevelFrame
        driver.switch_to.frame("TopLevelFrame")
        
        # Switch to topframe to click the Registration button
        driver.switch_to.frame("topframe")
        print("Switched to topframe.")
        
        # Click the Registration tab
        try:
            reg_tab = driver.find_element(By.ID, "Menu_1")
            print("Clicking Registration tab...")
            reg_tab.click()
            time.sleep(2)
        except Exception as e:
            print("Could not click Registration:", e)
            
        driver.switch_to.parent_frame()
        
        # Now click the "Template" button in the SubMenu frame
        try:
            driver.switch_to.frame("SubMenu")
            template_btn = driver.find_element(By.ID, "SubMenu_0_0")
            print("Clicking Template sub-menu...")
            template_btn.click()
            time.sleep(2)
            driver.switch_to.parent_frame()
        except Exception as e:
            print("Could not click Template:", e)
            
        # The templates should now load in the "contents" frame.
        try:
            driver.switch_to.frame("contents")
            print("Switched to contents frame.")
            # Inside contents, we have the TempGrpFrame
            with open("scratch/ContentsFrame.html", "w", encoding="utf-8") as f:
                f.write(driver.page_source)
                
            driver.switch_to.frame("TemplateFrame") # This might be the group list frame
            print("Switched to TemplateFrame.")
            with open("scratch/TemplateFrame.html", "w", encoding="utf-8") as f:
                f.write(driver.page_source)
                
            driver.switch_to.parent_frame()
        except Exception as e:
            print("Could not switch to TemplateFrame:", e)
            
        print("Done!")
    except Exception as e:
        print("Error:", type(e).__name__, e)

    driver.quit()

if __name__ == "__main__":
    scrape_toshiba("https://wim17858236038101.app.goxprint.com")
