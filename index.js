const express = require('express');
const promClient = require('prom-client');

const app = express();
const port = process.env.PORT || 3000;

promClient.collectDefaultMetrics();

const httpRequestCounter = new promClient.Counter({
    name: 'http_requests_total',
    help: 'Total HTTP requests processed',
    labelNames: ['route', 'method', 'status']
});
const httpRequestDuration = new promClient.Histogram({
    name: 'http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['route', 'method', 'status'],
    buckets: [0.001, 0.005, 0.01, 0.05, 0.1, 0.5, 1, 2, 5]  // диапазоны в секундах
});

app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const route = req.route ? req.route.path : req.path;
        const status = res.statusCode;
        const method = req.method;
        httpRequestCounter.labels(route, method, status).inc();
        const duration = (Date.now() - start) / 1000;
        httpRequestDuration.labels(route, method, status).observe(duration);
    });
    next();
});

app.get('/', (req, res) => {
    res.send('<h1>Hello from Node.js App</h1><p>Application is running and healthy.</p>');
});

app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.get('/metrics', async (req, res) => {
    try {
        res.set('Content-Type', promClient.register.contentType);
        res.send(await promClient.register.metrics());
    } catch (err) {
        res.status(500).send('Could not gather metrics');
    }
});

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
