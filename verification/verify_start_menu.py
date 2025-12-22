from playwright.sync_api import sync_playwright

def verify_start_menu():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            page.goto("http://localhost:3000")

            # Wait for content to load
            page.wait_for_selector("text=Start Game")

            # Take screenshot
            page.screenshot(path="verification/start_menu.png")
            print("Screenshot saved to verification/start_menu.png")

        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_start_menu()
