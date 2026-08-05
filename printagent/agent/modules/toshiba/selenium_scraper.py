import logging
import time
from typing import Any
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException

LOGGER = logging.getLogger("agent.toshiba.selenium")

def scrape_wim(ip: str, user_name: str, password: str) -> list[dict[str, Any]]:
    """Scrapes Toshiba WIM for SMB Scan points using Selenium Headless."""
    options = Options()
    options.add_argument('--headless=new')
    options.add_argument('--ignore-certificate-errors')
    options.add_argument('--allow-insecure-localhost')
    options.add_argument('--disable-gpu')
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')
    options.add_argument('--log-level=3')
    options.add_argument('--no-proxy-server')
    options.add_argument('--proxy-server="direct://"')
    options.add_argument('--proxy-bypass-list=*')
    options.add_argument('--disable-web-security')
    options.add_argument('--ignore-ssl-errors=yes')
    options.add_argument('--remote-allow-origins=*')
    
    LOGGER.info("[ToshibaScraper] Starting Selenium for %s...", ip)
    try:
        service = Service(ChromeDriverManager().install())
        driver = webdriver.Chrome(service=service, options=options)
    except Exception as e:
        LOGGER.error("[ToshibaScraper] Failed to init ChromeDriver: %s", e)
        return [{"name": f"SELENIUM_INIT_ERROR", "registration_no": "999", "error": str(e)}]

    entries = []
    try:
        urls_to_try = [
            f"http://{ip}/?MAIN=TOPACCESS",
            f"http://{ip}:8080/?MAIN=TOPACCESS"
        ]
        
        success = False
        driver.set_page_load_timeout(15)
        for u in urls_to_try:
            try:
                driver.get(u)
                # Check if it actually loaded something instead of connection refused
                if "ERR_CONNECTION_REFUSED" not in driver.page_source:
                    success = True
                    break
            except Exception:
                continue
                
        if not success:
            raise Exception("All URL attempts failed with ERR_CONNECTION_REFUSED or timeout")
            
        time.sleep(3)
        
        try:
            driver.switch_to.frame("TopLevelFrame")
        except Exception:
            pass
            
        try:
            user_input = driver.find_element(By.XPATH, "//input[@type='text' and (contains(@name, 'user') or contains(@id, 'user') or contains(@name, 'Name'))]")
            pass_input = driver.find_element(By.XPATH, "//input[@type='password']")
            user_input.clear()
            user_input.send_keys(user_name)
            pass_input.clear()
            pass_input.send_keys(password)
            
            login_btn = driver.find_element(By.XPATH, "//input[@type='button' or @type='submit' or contains(@value, 'Login')]")
            login_btn.click()
            time.sleep(3)
        except Exception:
            LOGGER.info("[ToshibaScraper] No login form found or error logging in.")
            
        # Try to load Template group frame
        LOGGER.info("[ToshibaScraper] Loading Template group frame...")
        driver.get(f"https://{ip}/Registration/Template/TempGrpFrame.html")
        time.sleep(3)
        
        source1 = driver.page_source
        
        driver.get(f"https://{ip}/Registration/Template/TempGroupList.html")
        time.sleep(3)
        
        source2 = driver.page_source
        
        entries.append({
            "registration_no": "001",
            "name": "SELENIUM_DEBUG_HTML",
            "type": "Summary",
            "html1": source1[:1500],
            "html2": source2[:1500]
        })
        
    except Exception as e:
        LOGGER.error("[ToshibaScraper] Scrape error: %s", e)
        entries.append({
            "registration_no": "999",
            "name": "SELENIUM_EXEC_ERROR",
            "error": str(e)
        })
    finally:
        driver.quit()
        
    return entries
