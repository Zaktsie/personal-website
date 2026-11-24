---
title: Miduty
description: Production duty management for MiWay's IT department, coordinating the weekly on-call rotation across 8 development teams.
tagline: On-call rotation for 8 teams, with leave conflicts handled automatically.
platforms: [web, backend]
status: in-development
stack: [Nuxt 3, Nuxt Layers, Laravel, Sanctum, Azure AD SSO, Jira API]
role: Originated, architected and built
featured: true
order: 1
color: "#2f5bea"
---

Miduty started as my own proof of concept for a problem every team at MiWay felt: working out who is on production duty, and who covers when that person is on leave.

## How it works

- **Rotation engine.** A relational schema models users, teams, duty rotations, leave records and ceremonies. Rotations are cross-referenced against leave so conflicts surface before they become a problem.
- **Fair stand-ins.** When someone can't cover, a "spin the wheel" flow picks a stand-in from eligible teammates.
- **Company sign-in.** Azure AD SSO through Laravel Socialite restricts access to the internal domain.
- **Stand-up prep.** A scheduled Laravel job pulls active sprint stories from Jira and generates an AI summary ahead of the Scrum of Scrums slot.
- **Reminders.** Automated Friday and Monday duty reminders.

The frontend is a Nuxt Layers app on top of a Laravel/Sanctum API.
