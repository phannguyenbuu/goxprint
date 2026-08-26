import asyncio
import time
from playwright.async_api import async_playwright
from bs4 import BeautifulSoup

# Thay đổi URL theo cấu hình của bạn (nếu chạy ssh tunnel thì dùng localhost:8080)
BASE_URL = "http://localhost:8080"

async def fetch_xerox_data():
    print("[*] Khởi động Playwright để cào dữ liệu từ Xerox SPA...")
    async with async_playwright() as p:
        # Chạy trình duyệt ẩn (headless=True)
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()

        # ---------------------------------------------------------
        # 1. Lấy dữ liệu Address Book
        # ---------------------------------------------------------
        print("\n[1] Đang truy cập Address Book...")
        url_address = f"{BASE_URL}/addressbook/index.html#hashAddressBook"
        
        try:
            await page.goto(url_address, wait_until="networkidle", timeout=15000)
            # Chờ thêm 1 chút để JS (WUI/JSheep) render xong bảng dữ liệu
            await page.wait_for_timeout(3000)
            
            # Lấy toàn bộ HTML sau khi JS đã render
            html_content = await page.content()
            soup = BeautifulSoup(html_content, "html.parser")
            
            # TODO: Cần inspect cụ thể thẻ HTML chứa danh bạ (ví dụ thẻ <table> hoặc <div class="row">)
            # Dưới đây là code mẫu để in ra text của trang
            print("--- Nội dung Address Book (rút gọn) ---")
            print(soup.get_text(separator=' ', strip=True)[:500] + "...\n")
        except Exception as e:
            print(f"[!] Lỗi khi lấy Address Book: {e}")

        # ---------------------------------------------------------
        # 2. Lấy dữ liệu Status & Counter (Billing)
        # ---------------------------------------------------------
        print("\n[2] Đang truy cập Status & Counter (Home)...")
        url_home = f"{BASE_URL}/home/index.html"
        
        try:
            await page.goto(url_home, wait_until="networkidle", timeout=15000)
            await page.wait_for_timeout(3000)
            
            html_content = await page.content()
            soup = BeautifulSoup(html_content, "html.parser")
            
            print("--- Nội dung Trang chủ (Status/Billing) ---")
            print(soup.get_text(separator=' ', strip=True)[:500] + "...\n")
        except Exception as e:
            print(f"[!] Lỗi khi lấy Status & Counter: {e}")

        # ---------------------------------------------------------
        # 3. Lấy dữ liệu System / Admin Setup
        # ---------------------------------------------------------
        print("\n[3] Đang truy cập System Info...")
        url_system = f"{BASE_URL}/system/index.html"
        
        try:
            await page.goto(url_system, wait_until="networkidle", timeout=15000)
            await page.wait_for_timeout(3000)
            
            html_content = await page.content()
            soup = BeautifulSoup(html_content, "html.parser")
            
            print("--- Nội dung System ---")
            print(soup.get_text(separator=' ', strip=True)[:500] + "...\n")
        except Exception as e:
            print(f"[!] Lỗi khi lấy System (Có thể yêu cầu Admin Login): {e}")

        await browser.close()
        print("\n[*] Hoàn thành!")

if __name__ == "__main__":
    asyncio.run(fetch_xerox_data())
