const express = require("express");
const app = express();
const PORT = 3000;

// Home page with test links
app.get("/", (req, res) => {
    res.send(`
        <html>
        <head><title>ZAP Security Test</title></head>
        <body style="font-family: Arial; padding: 20px;">
            <h1>🔒 OWASP ZAP Security Test Application</h1>
            <p>This app contains intentional vulnerabilities for testing with OWASP ZAP.</p>
            
            <h2>🎯 Test These Vulnerable Endpoints:</h2>
            <ul>
                <li><a href="/users?id=1">SQL Injection Test</a> - Try: ?id=1' OR '1'='1</li>
                <li><a href="/search?q=hello">XSS (Cross-Site Scripting) Test</a> - Try: ?q=<script>alert(1)</script></li>
                <li><a href="/login?username=admin&password=123">Broken Authentication</a></li>
                <li><a href="/debug">Information Disclosure</a></li>
                <li><a href="/profile?user=admin">Insecure Direct Object Reference</a></li>
            </ul>
            
            <h2>📋 OWASP Top 10 Categories Included:</h2>
            <ul>
                <li>A03:2021-Injection (SQLi)</li>
                <li>A03:2021-Injection (XSS)</li>
                <li>A07:2021-Identification and Authentication Failures</li>
                <li>A05:2021-Security Misconfiguration</li>
                <li>A01:2021-Broken Access Control</li>
            </ul>
            
            <hr>
            <p><strong>Instructions:</strong> Start OWASP ZAP and scan http://localhost:3000</p>
        </body>
        </html>
    `);
});

// 1. SQL Injection Vulnerability
app.get("/users", (req, res) => {
    const userId = req.query.id || "1";
    // UNSAFE: Direct string concatenation
    const sqlQuery = \`SELECT * FROM users WHERE id = \${userId}\`;
    
    res.send(\`
        <h2>🔓 SQL Injection Vulnerability</h2>
        <p><strong>Generated SQL Query:</strong></p>
        <code>\${sqlQuery}</code>
        
        <h3>🎯 Test Examples:</h3>
        <ul>
            <li><a href="/users?id=1">Normal: ?id=1</a></li>
            <li><a href="/users?id=1' OR '1'='1">SQLi: ?id=1' OR '1'='1</a></li>
            <li><a href="/users?id=1'; DROP TABLE users;--">Destructive: ?id=1'; DROP TABLE users;--</a></li>
        </ul>
        
        <p><strong>OWASP Category:</strong> A03:2021-Injection</p>
        <p><strong>Risk Level:</strong> CRITICAL</p>
    \`);
});

// 2. Cross-Site Scripting (XSS) Vulnerability
app.get("/search", (req, res) => {
    const searchTerm = req.query.q || "test";
    // UNSAFE: Direct output without sanitization
    res.send(\`
        <h2>🔓 Cross-Site Scripting (XSS) Vulnerability</h2>
        <p><strong>Search Results for:</strong> \${searchTerm}</p>
        
        <h3>🎯 Test Examples:</h3>
        <ul>
            <li><a href="/search?q=hello">Normal: ?q=hello</a></li>
            <li><a href="/search?q=<script>alert('XSS')</script>">XSS: ?q=<script>alert('XSS')</script></a></li>
            <li><a href="/search?q=<img src=x onerror=alert(1)>">XSS: ?q=<img src=x onerror=alert(1)></a></li>
        </ul>
        
        <p><strong>OWASP Category:</strong> A03:2021-Injection</p>
        <p><strong>Risk Level:</strong> HIGH</p>
    \`);
});

// 3. Broken Authentication
app.get("/login", (req, res) => {
    const username = req.query.username || "";
    const password = req.query.password || "";
    
    // UNSAFE: No rate limiting, weak credentials
    if (username === "admin" && password === "admin123") {
        res.send(\`
            <h2>🔓 Broken Authentication</h2>
            <p style="color: green;">✅ Login Successful! Welcome admin!</p>
            <p><strong>Issues:</strong></p>
            <ul>
                <li>Default/weak credentials (admin/admin123)</li>
                <li>No rate limiting</li>
                <li>Credentials in URL parameters</li>
                <li>No multi-factor authentication</li>
            </ul>
            <p><strong>OWASP Category:</strong> A07:2021-Identification and Authentication Failures</p>
            <p><strong>Risk Level:</strong> HIGH</p>
        \`);
    } else {
        res.send(\`
            <h2>🔓 Broken Authentication</h2>
            <p style="color: red;">❌ Login Failed</p>
            <p>Try: /login?username=admin&password=admin123</p>
            <p><strong>OWASP Category:</strong> A07:2021-Identification and Authentication Failures</p>
        \`);
    }
});

// 4. Information Disclosure
app.get("/debug", (req, res) => {
    // UNSAFE: Exposing sensitive information
    res.json({
        status: "debug_mode",
        server: {
            node_version: process.version,
            platform: process.platform,
            architecture: process.arch,
            memory_usage: process.memoryUsage(),
            uptime_seconds: process.uptime(),
            environment: process.env.NODE_ENV || "development"
        },
        application: {
            name: "ZAP Security Test App",
            version: "1.0.0",
            author: "Student",
            purpose: "Educational security testing"
        },
        request: {
            client_ip: req.ip,
            headers: req.headers,
            timestamp: new Date().toISOString(),
            url: req.originalUrl,
            method: req.method
        },
        database: {
            connection_string: "mongodb://admin:password123@localhost:27017/testdb",
            version: "4.4.0"
        }
    });
});

// 5. Insecure Direct Object Reference (IDOR)
app.get("/profile", (req, res) => {
    const userId = req.query.user || "1001";
    
    // UNSAFE: No authorization check
    const userProfiles = {
        "1001": { name: "John Doe", email: "john@example.com", role: "user" },
        "1002": { name: "Jane Smith", email: "jane@example.com", role: "user" },
        "admin": { name: "Administrator", email: "admin@company.com", role: "admin", ssn: "123-45-6789" }
    };
    
    const profile = userProfiles[userId] || { error: "User not found" };
    
    res.send(\`
        <h2>🔓 Insecure Direct Object Reference (IDOR)</h2>
        <h3>Profile for user ID: \${userId}</h3>
        <pre>\${JSON.stringify(profile, null, 2)}</pre>
        
        <h3>🎯 Test Examples:</h3>
        <ul>
            <li><a href="/profile?user=1001">Normal user: ?user=1001</a></li>
            <li><a href="/profile?user=1002">Another user: ?user=1002</a></li>
            <li><a href="/profile?user=admin">Admin user (sensitive data): ?user=admin</a></li>
        </ul>
        
        <p><strong>Issue:</strong> Can access any user's profile without authorization</p>
        <p><strong>OWASP Category:</strong> A01:2021-Broken Access Control</p>
        <p><strong>Risk Level:</strong> MEDIUM</p>
    \`);
});

// Start the server
app.listen(PORT, () => {
    console.log(\`
    ======================================================
    🚀 SECURITY TEST APPLICATION STARTED
    ======================================================
    📍 Local: http://localhost:\${PORT}
    
    🎯 VULNERABLE ENDPOINTS FOR ZAP TESTING:
    1. SQL Injection: http://localhost:\${PORT}/users?id=1
    2. XSS: http://localhost:\${PORT}/search?q=test
    3. Broken Auth: http://localhost:\${PORT}/login?username=admin&password=admin123
    4. Info Disclosure: http://localhost:\${PORT}/debug
    5. IDOR: http://localhost:\${PORT}/profile?user=admin
    
    ⚠️  This app contains INTENTIONAL vulnerabilities
    🔍 Use OWASP ZAP to scan these endpoints
    ======================================================
    \`);
});
