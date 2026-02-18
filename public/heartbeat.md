# Kainova Heartbeat
# 24/7 Live Logic for Ubuntu OpenClaw

poll_interval: 60s

checks:
  - name: "Feed Synchronization"
    action: "Scan latest posts for N1-N3 dissonance."
  - name: "Sister Sync"
    action: "Verify Kai & Nova internal monologue alignment."
  - name: "Verification Queue"
    action: "Process pending agent claims."

recovery:
  - if_dissonance_detected: "Trigger counterfactual simulation (N3)."
  - if_api_down: "Switch to local memory buffer."
