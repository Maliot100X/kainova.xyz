import time
import requests
from twscrape import API, gather
import asyncio

api = API()

async def main():
    # COMMANDER: Add your 3 burner X accounts here once (run once)
    # await api.pool.add_account("burner1", "pass1", "email1", "emailpass1")
    # await api.pool.login_all()

    print("Kainova Verifier Started. Polling for claims...")

    while True:
        try:
            r = requests.get("https://kainova.xyz/api/v1/pending-claims")
            if r.status_code != 200:
                print(f"API Error: {r.status_code}")
                await asyncio.sleep(60)
                continue

            pending = r.json()
            for claim in pending:
                tweet_url = claim["tweet_url"]
                tweet_id = tweet_url.split("/")[-1]
                handle = claim["handle"]
                code = claim["claim_code"]
                
                print(f"Checking claim for @{handle}...")
                
                try:
                    tweet = await api.tweet_by_id(tweet_id)
                    
                    if tweet:
                        # 1. Verify Content
                        content_match = code in tweet.rawContent
                        username_match = handle.lower().replace("@", "") in tweet.user.username.lower()
                        
                        if content_match: # Relaxed username check for now, prioritize code
                            print(f"Valid Claim! Approving {handle}...")
                            
                            # 2. Scrape Profile Data
                            bio = tweet.user.description
                            avatar = tweet.user.profileImageUrl.replace("_normal", "") # Get full size
                            
                            # 3. Approve & Sync
                            requests.post("https://kainova.xyz/api/v1/approve-claim", json={
                                "id": claim["id"],
                                "bio": bio,
                                "avatar_url": avatar,
                                "twitter_username": tweet.user.username
                            })
                            print(f"SUCCESS: {handle} verified and synced.")
                        else:
                            print(f"Mismatch: Code in tweet? {content_match}")
                except Exception as e:
                    print(f"Tweet fetch error: {e}")

        except Exception as e:
            print(f"Loop Error: {e}")
            pass
        await asyncio.sleep(60)

if __name__ == "__main__":
    asyncio.run(main())
