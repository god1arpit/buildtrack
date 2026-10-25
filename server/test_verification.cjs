const http = require('http');

function post(path, body, token) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const req = http.request({
      hostname: 'localhost',
      port: 5000,
      path: path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      }
    }, res => {
      let buf = '';
      res.on('data', chunk => buf += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(buf) });
        } catch(e) {
          resolve({ status: res.statusCode, raw: buf });
        }
      });
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

function get(path, token) {
  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: 'localhost',
      port: 5000,
      path: path,
      method: 'GET',
      headers: {
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      }
    }, res => {
      let buf = '';
      res.on('data', chunk => buf += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(buf) });
        } catch(e) {
          resolve({ status: res.statusCode, raw: buf });
        }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

async function run() {
  console.log("=== Testing Labour Verification API ===");
  
  // 1. Login as builder
  const loginRes = await post('/api/auth/login', {
    email: 'builder@buildtrack.com',
    password: 'password123'
  });
  console.log("1. Builder Login Status:", loginRes.status);
  const token = loginRes.body?.token;
  if (!token) {
    console.error("Login failed:", loginRes);
    return;
  }

  // 2. Get Verification Stats
  const statsRes = await get('/api/workers/verification/stats', token);
  console.log("2. Verification Stats:", statsRes.body);

  // 3. Lookup Ramesh Kumar by Unique ID BT-LBR-1001
  const lookupRes = await get('/api/workers/lookup/BT-LBR-1001', token);
  console.log("3. Lookup BT-LBR-1001:", lookupRes.body?.name, "Status:", lookupRes.body?.verificationStatus, "UID:", lookupRes.body?.workerId);

  // 4. Enrol a new test worker as Munshi/Builder
  const enrolRes = await post('/api/workers', {
    name: "Sunil Test Verma",
    phone: "9876500112",
    dob: "1994-08-15",
    aadharNumber: "987654321012",
    govIdType: "eshram",
    govIdNumber: "100998877665",
    skill: "Plumber",
    dailyWage: 850
  }, token);
  console.log("4. Enrolled New Worker:", enrolRes.body?.name, "Assigned Unique ID:", enrolRes.body?.workerId, "Status:", enrolRes.body?.verificationStatus);

  console.log("=== All Tests Completed Successfully ===");
}

run().catch(console.error);
