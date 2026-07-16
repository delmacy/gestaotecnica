# Analytics Plan

## Activation Metrics
* **First Action Completion**
  * **Event/Source:** `OnboardingFlowCompletion`
  * **Definition:** Percentage of users who complete the initial onboarding and configure at least one workspace integration.
  * **Owner:** Growth Product Manager
  * **Frequency:** Daily
  * **Target Threshold:** > 60% of new signups within 24h
  * **Instrumentation Status:** Pending

## Engagement Metrics
* **Weekly Active Workspaces**
  * **Event/Source:** `WorkspaceActive`
  * **Definition:** Count of distinct workspaces with at least one active user action within a rolling 7-day window.
  * **Owner:** Product Manager
  * **Frequency:** Weekly
  * **Target Threshold:** > 500 active workspaces
  * **Instrumentation Status:** Measurable (DB query)

## Reliability Metrics
* **Workflow Success Rate**
  * **Event/Source:** `WorkflowExecutionResult`
  * **Definition:** Percentage of workflow executions that complete without systemic errors.
  * **Owner:** Engineering Lead
  * **Frequency:** Real-time
  * **Target Threshold:** > 99.5%
  * **Instrumentation Status:** Implemented

## Support Metrics
* **Time to First Meaningful Resolution**
  * **Event/Source:** `SupportTicketResolved`
  * **Definition:** Average time elapsed between a high-priority ticket creation and the delivery of an actionable response or fix.
  * **Owner:** Customer Success Lead
  * **Frequency:** Weekly
  * **Target Threshold:** < 4 hours
  * **Instrumentation Status:** Measurable (Helpdesk Integration)

## Conversion Metrics
* **Trial to Paid Conversion**
  * **Event/Source:** `SubscriptionUpgraded`
  * **Definition:** Percentage of trial workspaces that upgrade to a paid tier before or at trial expiration.
  * **Owner:** Revenue Operations
  * **Frequency:** Monthly
  * **Target Threshold:** > 15%
  * **Instrumentation Status:** Pending

## No-Code Instrumentation Backlog
* Set up a periodic script to measure "First Action Completion" by checking DB records until direct event tracking is live.
* Establish a manual export process from the Helpdesk system for measuring "Time to First Meaningful Resolution" until a native dashboard exists.
* Query the Trial vs. Active billing status weekly to proxy "Trial to Paid Conversion."
