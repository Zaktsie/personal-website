---
title: "Miduty"
description: "Enterprise production duty management system for MiWay's IT department, coordinating weekly on-call rotation across 8 development teams."
tags: ["Nuxt 3", "Laravel", "Azure AD SSO", "Jira API"]
status: "wip"
order: 1
---

Architected and built as a Nuxt Layers app on a Laravel/Sanctum API, with a relational schema modeling users, teams, duty rotations, leave records, and ceremonies. Duty rotation is cross-referenced against leave records to auto-detect conflicts, with a gamified "Spin the Wheel" flow for picking a fair stand-in. Company Azure AD SSO restricts access to the internal domain via Laravel Socialite. A Laravel-scheduled job pulls active sprint stories from Jira and generates an AI summary delivered ahead of the team's Scrum of Scrums slot, alongside automated Friday/Monday duty reminders.
