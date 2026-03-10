# DAETRIUS / DAYDRM — Operating System

> **World → Audience → Music**

A strategic execution dashboard for the DAETRIUS / DAYDRM 12-month world-building rollout.  
Single HTML file. No build tools. No dependencies. Fully editable. Syncs to Google Sheets.

---

## Live Demo / Deploy

### Option 1 — GitHub Pages (recommended, free)
1. Fork or upload this repo to your GitHub account
2. Go to **Settings → Pages → Source → Deploy from branch → `main` → `/ (root)`**
3. Your dashboard is live at `https://YOUR_USERNAME.github.io/daetrius-os`

### Option 2 — Netlify Drop (fastest, 30 seconds)
1. Go to [netlify.com/drop](https://app.netlify.com/drop)
2. Drag the `index.html` file onto the page
3. Done — you get a live URL instantly

### Option 3 — Vercel
1. Go to [vercel.com](https://vercel.com) → New Project → Import GitHub repo
2. No config needed — auto-deploys on every push

### Option 4 — Local
Just open `index.html` in any browser. No server needed.

---

## Google Sheets Sync Setup

Connects the dashboard to a Google Sheet so your whole team shares live data.

### Step 1 — Create a Google Spreadsheet
Go to [sheets.google.com](https://sheets.google.com) → create a new blank spreadsheet.  
Name it anything (e.g. `DAETRIUS OS — Database`).

### Step 2 — Add the Apps Script
1. In your spreadsheet: **Extensions → Apps Script**
2. Delete the default `myFunction()` code
3. Paste the contents of `apps-script/Code.gs` from this repo
4. Click **▶ Run** → select `setupSheets` → authorize when prompted
5. This creates the `os_data` tab that stores all your dashboard data

### Step 3 — Deploy as Web App
1. In Apps Script: **Deploy → New Deployment**
2. Type: **Web App**
3. Execute as: **Me**
4. Who has access: **Anyone**
5. Click **Deploy** → copy the Web App URL

### Step 4 — Connect to Dashboard
1. Open the dashboard → go to **Database / Admin** tab
2. Paste your Web App URL into the Apps Script URL field
3. Click **Test Connection**
4. ✅ Done — every save now auto-pushes to your Sheet within ~2 seconds

### How Team Sync Works
- Every edit you make **auto-pushes** to the Google Sheet
- Teammates open the dashboard and click **↓ Pull from Sheets** to get latest data
- The Sheet is the single source of truth
- Local browser storage acts as an offline cache

---

## File Structure

```
daetrius-os/
│
├── index.html              # Full dashboard app — single file, no build needed
│
├── apps-script/
│   └── Code.gs             # Google Apps Script backend (paste into Extensions → Apps Script)
│
├── config/
│   └── schema.json         # Data schema reference
│
└── README.md               # This file
```

---

## How to Edit Content

Everything in the dashboard is editable without touching code.

1. Click the **✎ Edit** button in the top right of any page (or **✎ Edit Mode** in the sidebar)
2. Click any text on the page to edit it directly
3. Use **+ Add** buttons to add rows to any table or checklist
4. Click **Save All** or **Done Editing** — saves instantly
5. If Sheets is connected, it auto-syncs in ~2 seconds

---

## Dashboard Tabs

| Tab | Purpose |
|-----|---------|
| Command Center | Executive overview, countdown, weekly priorities |
| Strategy Overview | Full DAETRIUS/DAYDRM strategic framework |
| Prep Countdown | Prep period tracker with readiness score |
| Year Roadmap | 4-phase annual plan |
| Content Calendar | Master content schedule |
| Content Pipeline | Kanban: idea → published |
| Podcast / Press CRM | Cultural voice outreach pipeline |
| Fan Forge | Audience capture infrastructure |
| DAYDRM World | Creative artifacts tracker |
| Music Rollout | Phase 4 emergence planning |
| Weekly Tasks | Task manager + Truth Mirror |
| Budget Tracker | Financial planning |
| KPI Scoreboard | Strategy performance metrics |
| Partner Notes | Decisions, meeting notes, open questions |
| Instagram Monitor | @daydrm.us + @daetrius feed integration |
| Database / Admin | Sheets setup, backup, reset |

---

## The Strategy

```
World → Audience → Music

Prep:     Mar 10 – Mar 31, 2026   Setup & systems
Phase 1:  Apr – Jun 2026          World Building    (Goal: Curiosity)
Phase 2:  Jul – Sep 2026          Cultural Voice    (Goal: Credibility)
Phase 3:  Oct – Dec 2026          Story Expansion   (Goal: Emotional Connection)
Phase 4:  Jan – Apr 2027          Music Emergence   (Goal: Inevitable Arrival)
```

> *"The goal is not to introduce music. The goal is to introduce a world."*

---

DAETRIUS / DAYDRM · Strategic Operating System v3.0  
Built: March 2026
