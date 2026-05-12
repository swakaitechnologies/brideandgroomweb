import http from 'k6/http';
import { check, sleep } from 'k6';

// --- PERFORMANCE CONFIGURATION ---
// This script simulates a realistic, high-volume traffic spike.
export const options = {
  stages: [
    { duration: '1m', target: 100 }, // Ramp up to 100 concurrent users
    { duration: '3m', target: 500 }, // Stay at 500 users for 3 minutes (High Volume)
    { duration: '1m', target: 1000 }, // Spike to 1,000 users
    { duration: '1m', target: 0 },    // Ramp down to 0
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests must complete below 500ms
    http_req_failed: ['rate<0.01'],    // Error rate must be below 1%
  },
};

const BASE_URL = __ENV.API_URL || 'http://localhost:5000/api';

export default function () {
  // 1. Simulate Home/Landing Discovery
  const resHome = http.get(`${BASE_URL}/stories/success`);
  check(resHome, {
    'status is 200': (r) => r.status === 200,
    'load success stories': (r) => r.body.includes('success'),
  });

  sleep(1);

  // 2. Simulate Authentication Attempt (Rate-limited path)
  const payload = JSON.stringify({
    email: 'test-load@swakai.in',
    password: 'password123',
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const resLogin = http.post(`${BASE_URL}/auth/login`, payload, params);
  check(resLogin, {
    'auth handled': (r) => r.status === 200 || r.status === 401 || r.status === 429,
  });

  sleep(Math.random() * 3 + 1); // Realistic user thinking time
}
