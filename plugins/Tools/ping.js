import os from "node:os";
import v8 from "node:v8";

export default (handler) => {
  handler.add({
    cmd: [["ping", "server"]],
    cats: ["Main Menu"],
    typing: true,

    run: async ({sys, exp}) => {
      const ba = await exp.getPing(sys.m);
      await sys.text(ba);
    },
  });
  
  handler.func(async ({ exp }) => {
    const formatSize = (size) => {
      return `${(size / 1024 / 1024).toFixed(2)} MB;`;
    };

    const runtime = (seconds) => {
      seconds = Math.round(seconds);
      let days = Math.floor(seconds / (3600 * 24));
      seconds %= 3600 * 24;
      let hrs = Math.floor(seconds / 3600);
      seconds %= 3600;
      let mins = Math.floor(seconds / 60);
      let secs = seconds % 60;

      return `${days}d ${hrs}h ${mins}m ${secs}s;`;
    };

    const fetchJson = async (url) => {
      let res = await fetch(url);
      return await res.json();
    };

    exp.getPing = async function getPing(m) {
      const used = process.memoryUsage();
      const cpus = os.cpus().map((cpu) => {
        cpu.total = Object.keys(cpu.times).reduce(
          (last, type) => last + cpu.times[type],
          0
        );
        return cpu;
      });

      const cpu = cpus.reduce(
        (last, cpu, _, { length }) => {
          last.total += cpu.total;
          last.speed += cpu.speed / length;
          last.times.user += cpu.times.user;
          last.times.nice += cpu.times.nice;
          last.times.sys += cpu.times.sys;
          last.times.idle += cpu.times.idle;
          last.times.irq += cpu.times.irq;
          return last;
        },
        {
          speed: 0,
          total: 0,
          times: {
            user: 0,
            nice: 0,
            sys: 0,
            idle: 0,
            irq: 0,
          },
        }
      );

      let heapStat = v8.getHeapStatistics();
      const x = "`";
      const myip = await fetchJson("https://ipinfo.io/json");

      function hideIp(ip) {
        const ipSegments = ip.split(".");
        if (ipSegments.length === 4) {
          // ipSegments[0] = "*"
          ipSegments[2] = "*";
          ipSegments[3] = "*";
          return ipSegments.join(".");
        } else {
          throw new Error("Invalid IP address");
        }
      }

      const ips = hideIp(myip.ip);
      const respTimeInSeconds =
        (Date.now() - new Date(m.timestamp * 1000)) / 1000;
        const resp = `${respTimeInSeconds.toFixed(3)} second${
          respTimeInSeconds !== 1 ? "s" : ""
        }`;

      let teks = `${x}INFO SERVER${x}
- Speed Respons: ${resp}
- Hostname: ${os.hostname()}
- CPU Core: ${cpus.length}
- Platform : ${os.platform()}
- OS : ${os.version()} / ${os.release()}
- Arch: ${os.arch()}
- Ram: ${formatSize(os.totalmem() - os.freemem())} / ${formatSize(
        os.totalmem()
      )}

${x}PROVIDER INFO${x}
- IP: ${ips}
- Region : ${myip.region} ${myip.country}
- ISP : ${myip.org}

${x}RUNTIME OS${x}
- ${runtime(os.uptime())}

${x}RUNTIME BOT${x}
- ${runtime(process.uptime())}

${x}NODE MEMORY USAGE${x}
${Object.keys(used)
.map(
  (key, _, arr) =>
    `*- ${key.padEnd(
      Math.max(...arr.map((v) => v.length)),
      " "
    )} :* ${formatSize(used[key])}`
)
.join("\n")}
- Heap Executable : ${formatSize(heapStat?.total_heap_size_executable)}
- Physical Size : ${formatSize(heapStat?.total_physical_size)}
- Available Size : ${formatSize(heapStat?.total_available_size)}
- Heap Limit : ${formatSize(heapStat?.heap_size_limit)}
- Malloced Memory : ${formatSize(heapStat?.malloced_memory)}
- Peak Malloced Memory : ${formatSize(heapStat?.peak_malloced_memory)}
- Does Zap Garbage : ${formatSize(heapStat?.does_zap_garbage)}
- Native Contexts : ${formatSize(heapStat?.number_of_native_contexts)}
- Detached Contexts : ${formatSize(heapStat?.number_of_detached_contexts)}
- Total Global Handles : ${formatSize(heapStat?.total_global_handles_size)}
- Used Global Handles : ${formatSize(heapStat?.used_global_handles_size)}

${
cpus[0]
  ? `
Total CPU Usage
${cpus[0].model.trim()} (${cpu.speed} MHZ)
${Object.keys(cpu.times)
.map(
  (type) =>
    `*- ${(type + "*").padEnd(6)}: ${(
      (100 * cpu.times[type]) /
      cpu.total
    ).toFixed(2)}%`
)
.join("\n")}

CPU Core(s) Usage (${cpus.length} Core CPU)
${cpus
.map(
  (cpu, i) =>
    `${i + 1}. ${cpu.model.trim()} (${cpu.speed} MHZ)\n${Object.keys(
      cpu.times
    )
      .map(
        (type) =>
          `*- ${(type + "*").padEnd(6)}: ${(
            (100 * cpu.times[type]) /
            cpu.total
          ).toFixed(2)}%`
      )
      .join("\n")}`
)
.join("\n\n")}
`
  : ""
}
`.trim();

      return teks;
    }
  });
};
