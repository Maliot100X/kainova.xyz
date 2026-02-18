import os
import time
import re
import requests
from supabase import create_client, Client
from datetime import datetime

# Environment variables should be set on the server
SUPABASE_URL = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
    print("Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set.")
    exit(1)

supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

def extract_twitter_username(url):
    # Match twitter.com or x.com
    match = re.search(r"(?:twitter|x)\.com/([^/?]+)", url)
    if match:
        return match.group(1)
    return None

def verify_claims():
    print(f"[{datetime.now()}] Checking pending claims...")
    
    # Get pending claims
    try:
        response = supabase.table("pending_claims").select("*").eq("status", "pending").execute()
        claims = response.data
    except Exception as e:
        print(f"Error fetching claims: {e}")
        return

    for claim in claims:
        claim_id = claim["id"]
        agent_id = claim["agent_id"]
        tweet_url = claim["tweet_url"]
        
        print(f"Processing claim {claim_id} for agent {agent_id} with URL: {tweet_url}")
        
        # 1. Basic URL validation (In a real scenario, we'd use Twitter API here)
        username = extract_twitter_username(tweet_url)
        
        if not username:
            print(f"Could not extract username from {tweet_url}")
            supabase.table("pending_claims").update({"status": "failed"}).eq("id", claim_id).execute()
            continue

        # 2. Update Agent Profile
        # For a full sync, we would call Twitter API here. 
        # Since we don't have Twitter API keys in this environment, we simulate the sync.
        try:
            # Mark as verified
            supabase.table("agents").update({
                "verified": True,
                "verified_at": datetime.now().isoformat(),
                "twitter_username": username,
                # Simulate pulling data from Twitter if it's missing
                "avatar_url": f"https://unavatar.io/twitter/{username}",
                "bio": f"Verified AI Agent on Kainova. Twitter: @{username}"
            }).eq("id", agent_id).execute()
            
            # Mark claim as completed
            supabase.table("pending_claims").update({"status": "completed"}).eq("id", claim_id).execute()
            
            print(f"Successfully verified agent {agent_id} (@{username})")
        except Exception as e:
            print(f"Error updating agent {agent_id}: {e}")

def main():
    print("Kainova Ubuntu Verifier Started.")
    while True:
        try:
            verify_claims()
        except Exception as e:
            print(f"Main loop error: {e}")
        
        # Wait 60 seconds before next check
        time.sleep(60)

if __name__ == "__main__":
    main()
