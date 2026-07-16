# Commercial Launch Alpha Roles and Responsibilities

## Operating Model and Role Table

| Owner Role | Responsibility | Decision Authority | Backup Owner | Evidence Expected | Escalation Trigger |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Product Manager | Launch approval, scope definition | Go/No-Go for Launch | Engineering Lead | Launch Scope PR, Sign-off document | Customer blocker, missing core feature |
| Engineering Lead | Technical readiness, rollback, deploy | Technical Go/No-Go | Platform Engineer | Readiness Checklist, CI/CD logs | Deployment failure, architecture risk |
| Platform Engineer | Infrastructure, deployments, monitoring | Infrastructure changes | Engineering Lead | Environment Baseline | Environment outage, rate-limit blocking |
| Support Lead | Triage, customer communication, incident response | Support escalation | Product Manager | Incident response plan | Security breach, critical bug in production |
| Sales/Demo Lead | Customer pilot setup, alpha demonstrations | Pilot acceptance | Product Manager | Pilot setup confirmation | Demo environment unavailable |

## RACI Matrix

*R = Responsible, A = Accountable, C = Consulted, I = Informed*

| Activity | Product Manager | Engineering Lead | Platform Engineer | Support Lead | Sales/Demo Lead |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Launch Approval | A | C | I | I | C |
| Deploy to Production | I | A | R | I | I |
| Rollback Decision | I | A | C | I | I |
| Customer Pilot Setup | C | I | I | I | A |
| Incident Response | I | R | C | A | I |
| Post-Launch Acceptance | A | C | I | C | R |

## Launch Decision State Machine

Launch readiness and decisions are driven by a strict state-machine flow. Readiness labels are derived from this state machine, not manual interpretation.

`draft` -> `reviewed` -> `approved` -> `active` -> `paused` -> `closed`

- **draft**: Initial task planning and scope definition. Not ready for alpha or demo.
- **reviewed**: Code and documentation complete, reviewed by peers.
- **approved**: Engineering Lead and Product Manager sign-off. Alpha/Demo readiness achieved.
- **active**: Deployed to production, customer pilot live. Customer-ready launch.
- **paused**: Active launch suspended due to rollback, incident, or critical blocker.
- **closed**: Launch phase completed, transitioned to standard operations or post-launch backlog.

*Note: The distinction between alpha/demo readiness (state: approved) and customer-ready launch (state: active) is enforced.*

## Escalation Paths

- **Security**: Escalate immediately to Engineering Lead and Platform Engineer. Stop all active deployments.
- **Data Loss**: Escalate to Engineering Lead and Support Lead. Trigger rollback or restore from backup if applicable.
- **Deployment**: Escalate to Platform Engineer and Engineering Lead. Trigger rollback procedures.
- **Customer Blocker**: Escalate to Support Lead and Product Manager. Prioritize hotfix or mitigation.
- **Support Incident**: Escalate to Support Lead. Follow standard incident response protocol.
