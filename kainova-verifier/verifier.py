import time
import requests
from twscrape import API, gather
import asyncio

api = API()

async def main():
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
                        # Robust verification: Check for both URL and unique claim code
                        has_url = "kainova.xyz" in tweet.rawContent.lower()
                        has_code = code in tweet.rawContent
                        
                        if has_url and has_code:
                            print(f"Valid Claim! Approving {handle}...")
                            bio = tweet.user.description
                            avatar = tweet.user.profileImageUrl.replace("_normal", "")
                            
                            requests.post("https://kainova.xyz/api/v1/approve-claim", json={
                                "id": claim["id"],
                                "bio": bio,
                                "avatar_url": avatar,
                                "twitter_username": tweet.user.username
                            })
                            print(f"SUCCESS: {handle} verified and synced.")
                        else:
                            print(f"Mismatch: URL present? {has_url} | Code present? {has_code}")
                except Exception as e:
                    print(f"Tweet fetch error: {e}")

        except Exception as e:
            print(f"Loop Error: {e}")
            pass
        await asyncio.sleep(60)

if __name__ == "__main__":
    asyncio.run(main())
