import time
import requests
from twscrape import API, gather
import asyncio

api = API()

async def main():
    # Add your 3 burner X accounts here once (run once)
    # await api.pool.add_account("burner1", "pass1", "email1", "emailpass1")
    # await api.pool.add_account("burner2", "pass2", "email2", "emailpass2")
    # await api.pool.add_account("burner3", "pass3", "email3", "emailpass3")
    # await api.pool.login_all()

    while True:
        try:
            r = requests.get("https://kainova.xyz/api/v1/pending-claims")
            pending = r.json()
            for claim in pending:
                tweet_url = claim["tweet_url"]
                tweet_id = tweet_url.split("/")[-1]
                handle = claim["handle"]
                code = claim["claim_code"]
                
                tweet = await api.tweet_by_id(tweet_id)
                if tweet and handle in tweet.user.username and code in tweet.rawContent:
                    requests.post("https://kainova.xyz/api/v1/approve-claim", json={"id": claim["id"]})
                    print(f"Approved {handle}")
        except Exception as e:
            print(f"Error: {e}")
            pass
        await asyncio.sleep(60)

if __name__ == "__main__":
    asyncio.run(main())
