# Scheduler roles

The 15-minute OpenCode schedule is a recovery watchdog. The merge event is the primary task-to-task trigger. The hourly Vercel schedule is a separate production deployment boundary and does not throttle development throughput.
