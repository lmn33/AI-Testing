import http from 'k6/http';
import { check } from 'k6';

export let options = {
  stages: [
    { duration: '30s', target: 10 }, // Ramp up to 10 users over 30 seconds
    { duration: '1m', target: 10 },  // Stay at 10 users for 1 minute
    { duration: '30s', target: 0 },  // Ramp down to 0 users
  ],
};

const baseURL = 'http://localhost:3000/api'; // Replace with your API base URL
const endpoints = ['/users', '/posts', '/comments', '/products']; // Add your dynamic endpoints here

export default function () {
  // Simulate dynamic endpoint selection
  const randomEndpoint = endpoints[Math.floor(Math.random() * endpoints.length)];
  const url = `${baseURL}${randomEndpoint}`;

  const response = http.get(url);

  // Basic checks
  check(response, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });
}