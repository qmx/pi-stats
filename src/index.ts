import type { ExtensionAPI } from "@mariozechner/pi-coding-agent";

export default function (pi: ExtensionAPI) {
	let streamingStart: number | undefined;
	let initialOutputTokens: number = 0;
	let widgetKey = "streaming-stats";

	// Format numbers with K/M suffix
	function formatNum(n: number): string {
		if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
		if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
		return n.toString();
	}

	// Format duration
	function formatDuration(ms: number): string {
		const s = ms / 1000;
		if (s < 60) return `${s.toFixed(1)}s`;
		const m = Math.floor(s / 60);
		const rem = (s % 60).toFixed(1);
		return `${m}m${rem}s`;
	}

	pi.on("message_start", async (event, ctx) => {
		if (event.message.role === "assistant") {
			streamingStart = Date.now();
			initialOutputTokens = event.message.usage.output;
			ctx.ui.setWidget(widgetKey, undefined);
		}
	});

	pi.on("message_end", async (event, ctx) => {
		if (event.message.role === "assistant" && streamingStart) {
			const elapsed = Date.now() - streamingStart;
			const usage = event.message.usage;

			// Calculate total output tokens generated in this turn
			const outputTokens = usage.output - initialOutputTokens;
			const tps = elapsed > 0 ? (outputTokens / elapsed) * 1000 : 0;

			const total = usage.output + usage.input + usage.cacheRead + usage.cacheWrite;

			// Build cache string, only showing non-zero values
			let cacheStr = "";
			const cacheParts: string[] = [];
			if (usage.cacheRead > 0) cacheParts.push(`${formatNum(usage.cacheRead)}↓`);
			if (usage.cacheWrite > 0) cacheParts.push(`${formatNum(usage.cacheWrite)}↑`);
			if (cacheParts.length > 0) {
				cacheStr = ` | cache ${cacheParts.join(" ")}`;
			}

			const stats = `${tps.toFixed(1)} tok/s | ${formatNum(usage.input)} → ${formatNum(usage.output)}${cacheStr} | total ${formatNum(total)} | ${formatDuration(elapsed)}`;

			ctx.ui.setWidget(widgetKey, (tui, theme) => {
				const lines = [theme.fg("dim", stats)];
				return {
					render: () => lines,
					invalidate: () => {},
				};
			});

			streamingStart = undefined;
		}
	});
}
