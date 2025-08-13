// netlify/functions/auth-check.js
export const handler = async (event) => {
  const cookie = event.headers?.cookie || "";
  const authed = /(?:^|;\s*)vm_auth=/.test(cookie);
  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ authed }),
  };
};
