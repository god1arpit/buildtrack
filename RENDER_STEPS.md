# BuildTrack backend hosting + APK — your steps

The working copy in this folder is already prepared for hosting and for
the APK build: security fixes applied, leaked `.env` removed, API URLs
env-driven, CORS fixed for the mobile app, and a `render.yaml`
blueprint included. What remains needs your accounts — I cannot create
Render/GitHub accounts for you.

## Step 1: Push this folder to GitHub (5 min)

```bash
cd buildtrack
git init
git add .
git status        # CHECK: server/.env must NOT appear here. If it does, stop and tell me.
git commit -m "BuildTrack ready for hosting + APK"
git branch -M main
git remote add origin https://github.com/<your-username>/buildtrack.git
git push -u origin main
```

## Step 2: Host the backend on Render — free tier (10 min)

1. https://render.com par free account banao (GitHub se sign in kar lo).
2. Dashboard -> **New -> Web Service** -> apna `buildtrack` repo connect karo.
   Render `render.yaml` ko khud padh lega (build: `cd server && npm install`,
   start: `cd server && npm start`).
3. Environment variables me ye set karo:
   - `JWT_SECRET` = **NAYA random secret** — is command se banao, purana wala
     kabhi mat use karna (woh leak ho chuka hai):
     `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`
   - `CORS_ORIGIN` = `capacitor://localhost`
   - `NODE_ENV` = `production`
4. **Create Web Service** dabao, deploy hone do (2-4 min). Status "Live"
   hone ke baad ye URL kholo — `{"status":"healthy"...}` dikhna chahiye:
   `https://<tumhara-service>.onrender.com/api/health`
5. **Demo accounts seed karo (EK BAAR hi):** Render dashboard me service
   kholo -> **Shell** -> ye chalao:
   `cd server && npm run seed`
   (Ye purana data wipe karke demo accounts banata hai — isliye sirf ek
   baar, dobara deploy pe mat chalana.)

## Step 3: Mujhe backend URL bhej do

Bas woh `https://....onrender.com` wali URL mujhe bhej do. Phir main:
frontend ko us URL ke saath build karke Capacitor se APK bana dunga —
jo kisi bhi phone, kisi bhi network pe chalegi.

## 2 sachaiyan jo pehle se pata honi chahiye

1. **Free Render par data permanent nahi hai.** App ka datastore ek JSON
   file (`server/data/db.json`) hai jo Render ke free server par restart /
   redeploy hone par reset ho jata hai. Matlab: deploy ke baad seed kiye
   hue demo accounts milenge, par jo users baad me register honge woh
   restart ke baad gayab ho sakte hain. Permanent data ke liye baad me
   ya to paid disk ya koi hosted database (MongoDB Atlas free) chahiye
   hoga — par woh alag kaam hai, demo/college ke liye ye setup kaafi hai.
2. **AI features (road inspection) isme hosted nahi hain.** Python AI
   module (torch wala, bahut bhaari) free Render par reliably nahi
   chalega. Core app — login, projects, workers, attendance, wages —
   poori tarah chalegi. AI wale pages ko AI server chahiye hoga, woh
   baad me alag se host karna padega.
3. **Free Render sota hai.** 15 min inactivity ke baad service sleep ho
   jati hai — APK ki pehli request par ~1 minute lag sakta hai. Ye
   normal hai, koi error nahi hai.
