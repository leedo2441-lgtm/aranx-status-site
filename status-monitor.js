/** ARαNX Termux process monitor. Place beside aranx93.js; run: node status-monitor.js */
"use strict";
const http = require("http");
const { spawn } = require("child_process");
const path = require("path");
const PORT = Number(process.env.PORT || 8787);
const BOT_SCRIPT = path.resolve(process.env.BOT_SCRIPT || "./aranx93.js");
const startedAt = Date.now();
let bot = null, botStartedAt = null, botEndedAt = null, botExitCode = null, botExitSignal = null, botRunning = false;
function startBot() {
  botStartedAt = Date.now(); botEndedAt = null; botExitCode = null; botExitSignal = null;
  bot = spawn(process.execPath, [BOT_SCRIPT], { cwd: path.dirname(BOT_SCRIPT), stdio: "inherit", env: process.env });
  botRunning = true; console.log("[ARαNX] Bot started:", BOT_SCRIPT, "PID:", bot.pid);
  bot.on("error", err => { botRunning = false; botEndedAt = Date.now(); console.error("[ARαNX] Bot spawn error:", err.message); });
  bot.on("exit", (code, signal) => { botRunning = false; botEndedAt = Date.now(); botExitCode = code; botExitSignal = signal; console.log("[ARαNX] Bot stopped. code=", code, "signal=", signal); });
}
const server = http.createServer((req, res) => {
  const url = new URL(req.url, "http://127.0.0.1");
  if (req.method === "GET" && (url.pathname === "/api/status" || url.pathname === "/api/health")) {
    const body = { running: botRunning, online: botRunning, status: botRunning ? "online" : "offline", uptimeSeconds: botRunning && botStartedAt ? Math.floor((Date.now() - botStartedAt) / 1000) : 0, monitorUptimeSeconds: Math.floor((Date.now() - startedAt) / 1000), lastExitAt: botEndedAt ? new Date(botEndedAt).toISOString() : null, exitCode: botExitCode, exitSignal: botExitSignal, message: botRunning ? "ARαNX 프로세스 실행 중" : "ARαNX 프로세스가 종료되었습니다." };
    res.writeHead(200, { "Content-Type": "application/json; charset=utf-8", "Access-Control-Allow-Origin": "*", "Cache-Control": "no-store" });
    res.end(JSON.stringify(body)); return;
  }
  res.writeHead(404, { "Content-Type": "application/json; charset=utf-8" }); res.end(JSON.stringify({ error: "not_found" }));
});
server.listen(PORT, "0.0.0.0", () => { console.log("[ARαNX] Status API listening on http://127.0.0.1:" + PORT + "/api/status"); startBot(); });
function shutdown() { console.log("[ARαNX] Monitor shutting down"); if (botRunning && bot) bot.kill("SIGTERM"); server.close(() => process.exit(0)); setTimeout(() => process.exit(0), 3000).unref(); }
process.on("SIGINT", shutdown); process.on("SIGTERM", shutdown);
