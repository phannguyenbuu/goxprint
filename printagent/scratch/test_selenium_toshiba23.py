from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

def scrape_toshiba(base_url, user_name, password):
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
        
        driver.switch_to.frame("TopLevelFrame")
        driver.switch_to.frame("topframe")
        print("Clicking Login in topframe...")
        driver.execute_script("fnnLoginClick();")
        time.sleep(10)
        
        driver.switch_to.default_content()
        
        # safely wait and switch
        print("Waiting for TopLevelFrame...")
        WebDriverWait(driver, 10).until(EC.frame_to_be_available_and_switch_to_it("TopLevelFrame"))
        print("Waiting for contents...")
        WebDriverWait(driver, 10).until(EC.frame_to_be_available_and_switch_to_it("contents"))
        
        try:
            print("Looking for login form...")
            user_input = driver.find_element(By.NAME, "USERNAME")
            pass_input = driver.find_element(By.NAME, "PASS")
            login_btn = driver.find_element(By.XPATH, "//input[@type='button' or @type='submit' or contains(@value, 'Login')]")
            
            user_input.clear()
            user_input.send_keys(user_name)
            pass_input.clear()
            pass_input.send_keys(password)
            print("Clicking login...")
            login_btn.click()
            time.sleep(10)
        except Exception as e:
            print("Could not login:", e)
            
        driver.switch_to.default_content()
        WebDriverWait(driver, 10).until(EC.frame_to_be_available_and_switch_to_it("TopLevelFrame"))
        WebDriverWait(driver, 10).until(EC.frame_to_be_available_and_switch_to_it("topframe"))
        
        print("Executing switchTab('REGISTRATION')...")
        driver.execute_script("switchTab('REGISTRATION', true);")
        time.sleep(5)
        
        driver.switch_to.default_content()
        WebDriverWait(driver, 10).until(EC.frame_to_be_available_and_switch_to_it("TopLevelFrame"))
        WebDriverWait(driver, 10).until(EC.frame_to_be_available_and_switch_to_it("SubMenu"))
        
        try:
            template_link = driver.find_element(By.XPATH, "//a[contains(text(), 'Template') or contains(text(), 'Templates')]")
            print("Clicking Template link in SubMenu...")
            template_link.click()
            time.sleep(5)
        except Exception as e:
            print("Could not click Template link:", e)
                
        driver.switch_to.default_content()
        WebDriverWait(driver, 10).until(EC.frame_to_be_available_and_switch_to_it("TopLevelFrame"))
        WebDriverWait(driver, 10).until(EC.frame_to_be_available_and_switch_to_it("contents"))
        
        print("Switched to contents after clicking Template.")
        with open("scratch/contents_Templates4.html", "w", encoding="utf-8") as f:
            f.write(driver.page_source)
            
        print("Done!")
    except Exception as e:
        print("Error:", type(e).__name__, e)

    driver.quit()

if __name__ == "__main__":
    scrape_toshiba("https://wim17858236038101.app.goxprint.com", "admin", "123456")
