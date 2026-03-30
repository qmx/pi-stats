# @qmxme/pi-stats

Stats widget extension for [pi](https://github.com/badlogic/pi) that displays token usage, throughput, and response duration.

## Features

- **Token throughput**: Tokens per second during response
- **Token usage**: Input → Output tokens per message
- **Cache tracking**: Cache read (↓) and write (↑) when applicable
- **Total tokens**: Cumulative token count
- **Duration**: Response time in seconds or minutes

## Widget Display

Example output in the UI status bar:

```
12.3 tok/s | 1.2k → 450 | cache 500↓ 300↑ | total 2.1k | 3.2s
```

## Installation

```bash
pi install npm:@qmxme/pi-stats
```

With a pinned version:

```bash
pi install npm:@qmxme/pi-stats@0.1.0
```

Project-local installation:

```bash
pi install npm:@qmxme/pi-stats -l
```

Try without installing:

```bash
pi -e npm:@qmxme/pi-stats
```

## Development

```bash
npm install      # install build dependencies
npm run build    # compile to dist/
npm run dev      # watch mode
```

## License

MIT
