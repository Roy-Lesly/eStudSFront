import client from 'prom-client';


const register = new client.Registry();
client.collectDefaultMetrics({ register });

export async function GET(request) {
    return new Response(await register.metrics(), {
    status: 200,
    headers: {
      'Content-Type': register.contentType,
    },
  });
}
