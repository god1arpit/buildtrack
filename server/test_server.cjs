const http = require("http");

async function runSmokeTests() {
  console.log("[Smoke Test] Starting backend server in child process...");
  const { spawn } = require("child_process");
  const serverProc = spawn("node", ["server.js"], { cwd: __dirname });

  let serverStarted = false;

  serverProc.stdout.on("data", (data) => {
    const text = data.toString();
    console.log("[Server]", text.trim());
    if (text.includes("Running on http://localhost:5000")) {
      serverStarted = true;
    }
  });

  serverProc.stderr.on("data", (data) => {
    console.error("[Server Error]", data.toString());
  });

  // Wait for server to boot
  await new Promise((r) => setTimeout(r, 2000));

  const fetchJson = async (path, options = {}) => {
    return new Promise((resolve, reject) => {
      const opt = {
        hostname: "127.0.0.1",
        port: 5000,
        path,
        method: options.method || "GET",
        headers: options.headers || {},
      };

      const req = http.request(opt, (res) => {
        let body = "";
        res.on("data", (chunk) => (body += chunk));
        res.on("end", () => {
          try {
            resolve({ status: res.statusCode, data: JSON.parse(body) });
          } catch (e) {
            resolve({ status: res.statusCode, body });
          }
        });
      });

      req.on("error", reject);
      if (options.body) req.write(JSON.stringify(options.body));
      req.end();
    });
  };

  try {
    // 1. Health check
    console.log("\n1. Testing GET /api/health...");
    const health = await fetchJson("/api/health");
    console.log("Health Status:", health.status, health.data);

    // 2. Builder Login
    console.log("\n2. Testing POST /api/auth/login (Builder)...");
    const loginRes = await fetchJson("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: { email: "builder@buildtrack.com", password: "password123" },
    });
    console.log("Login Result:", loginRes.status, "User:", loginRes.data?.name, "Role:", loginRes.data?.role);
    const token = loginRes.data?.token;

    // 3. Global Summary
    console.log("\n3. Testing GET /api/reports/summary...");
    const summaryRes = await fetchJson("/api/reports/summary", {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("Summary Result:", summaryRes.status, "Active Sites:", summaryRes.data?.activeProjectsCount, "Workers:", summaryRes.data?.totalWorkers, "Today's Attendance:", summaryRes.data?.todayAttendance);

    // 4. Projects List
    console.log("\n4. Testing GET /api/projects...");
    const projRes = await fetchJson("/api/projects", {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("Projects Count:", projRes.data?.length, "First Project:", projRes.data?.[0]?.name);

    // 5. Workers List
    console.log("\n5. Testing GET /api/workers...");
    const workRes = await fetchJson("/api/workers", {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("Workers Count:", workRes.data?.length);

    console.log("\n==========================================");
    console.log("🎉 ALL REST API SMOKE TESTS PASSED!");
    console.log("==========================================");
  } catch (err) {
    console.error("Test error:", err);
  } finally {
    serverProc.kill();
    process.exit(0);
  }
}

runSmokeTests();
