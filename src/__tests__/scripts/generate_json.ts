import { faker } from '@faker-js/faker';
import fs from 'node:fs';

async function main() {
  const args = Bun.argv.slice(2);
  if (args.length < 1) {
    console.error("Usage: bun generate_json.ts <size> [output-file]");
    console.error("  size: Target size (e.g. 1GB, 500MB, 100KB)");
    process.exit(1);
  }

  const targetSize = parseSize(args[0]);
  const outputFile = args[1] || "output.json";

  console.log(`Generating JSON file of ~${formatSize(targetSize)} to ${outputFile}`);

  try {
    await generateJSON(outputFile, targetSize);
    const stats = fs.statSync(outputFile);
    console.log(`Successfully generated: ${outputFile} (${formatSize(stats.size)})`);
  } catch (err) {
    console.error("Error generating JSON:", err);
    process.exit(1);
  }
}

// --- Size Utilities ---

function parseSize(s: string): number {
  const matches = s.toUpperCase().match(/^(\d+(?:\.\d+)?)\s*(B|KB|MB|GB|TB)?$/);
  if (!matches) throw new Error(`Invalid size format: ${s}`);

  const value = parseFloat(matches[1]);
  const multipliers: Record<string, number> = {
    'B': 1,
    'KB': 1024,
    'MB': 1024 ** 2,
    'GB': 1024 ** 3,
    'TB': 1024 ** 4
  };

  return Math.floor(value * (multipliers[matches[2] || 'B']));
}

function formatSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// --- Main Generator ---

async function generateJSON(filename: string, targetSize: number) {
  const writeStream = fs.createWriteStream(filename);
  let bytesWritten = 0;

  const write = (data: string): Promise<void> => {
    const buf = Buffer.from(data);
    bytesWritten += buf.length;
    return new Promise((resolve) => {
      if (!writeStream.write(buf)) {
        writeStream.once('drain', resolve);
      } else {
        process.nextTick(resolve);
      }
    });
  };

  const sectionSize = Math.floor(targetSize / 30);

  await write("{\n");

  // 1. Metadata
  await write(`  "metadata": ${JSON.stringify(generateMetadata(), null, 2)},\n`);

  // 2. Users (Streaming array)
  await write(`  "users": [`);
  await streamArray(write, () => generateUser(), sectionSize);
  await write(`],\n`);

  // 3. Products
  await write(`  "products": [`);
  await streamArray(write, () => generateProduct(), sectionSize);
  await write(`],\n`);

  // 4. Matrix Data
  await write(`  "numeric_tables": ${JSON.stringify(generateNumericTables())},\n`);

  // 5. IoT Devices
  await write(`  "iot_devices": [`);
  await streamArray(write, () => generateIoTDevice(), sectionSize);
  await write(`],\n`);

  // 30. Logs (Fill remaining up to target size)
  await write(`  "logs": [`);
  const remaining = targetSize - bytesWritten - 100;
  if (remaining > 0) {
    let logsWritten = 0;
    let first = true;
    while (logsWritten < remaining) {
      const log = JSON.stringify(generateLog());
      const prefix = first ? "" : ",";
      await write(prefix + log);
      logsWritten += Buffer.from(prefix + log).length;
      first = false;
    }
  }
  await write(`]\n`);

  await write("}\n");
  writeStream.end();

  return new Promise((resolve) => writeStream.on('finish', resolve));
}

// --- Data Functions ---

async function streamArray(writeFn: (d: string) => Promise<void>, generator: () => any, targetBytes: number) {
  let currentBytes = 0;
  let first = true;
  while (currentBytes < targetBytes) {
    const data = JSON.stringify(generator());
    const chunk = (first ? "" : ",") + data;
    await writeFn(chunk);
    currentBytes += Buffer.from(chunk).length;
    first = false;
  }
}

function generateMetadata() {
  return {
    generated_at: new Date().toISOString(),
    version: "3.0.0-bun",
    generator: "bun-jsongen",
    config: { locale: "es", checksum_algo: "sha256" }
  };
}

function generateUser() {
  return {
    id: faker.string.uuid(),
    username: faker.internet.username(),
    email: faker.internet.email(),
    profile: {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      avatar: faker.image.avatar(),
    },
    address: {
      city: faker.location.city(),
      country: faker.location.country(),
      geo: { lat: faker.location.latitude(), lng: faker.location.longitude() }
    },
    registeredAt: faker.date.past().toISOString()
  };
}

function generateProduct() {
  return {
    id: faker.string.uuid(),
    name: faker.commerce.productName(),
    price: faker.commerce.price(),
    category: faker.commerce.department(),
    description: faker.commerce.productDescription(),
    stock: faker.number.int({ min: 0, max: 1000 }),
    tags: [faker.commerce.productAdjective(), faker.commerce.productMaterial()]
  };
}

function generateNumericTables() {
  return {
    dense: Array.from({ length: 10 }, () => 
      Array.from({ length: 10 }, () => faker.number.float({ min: -1, max: 1 }))
    ),
    sparse: {
      shape: [1000, 1000],
      nnz: 5,
      data: Array.from({ length: 5 }, () => ({
        r: faker.number.int({ max: 999 }),
        c: faker.number.int({ max: 999 }),
        v: faker.number.float()
      }))
    }
  };
}

function generateIoTDevice() {
  return {
    device_id: faker.string.alphanumeric(10),
    type: faker.helpers.arrayElement(['thermometer', 'camera', 'plug']),
    status: faker.helpers.arrayElement(['online', 'offline', 'error']),
    battery: faker.number.int({ min: 0, max: 100 }),
    last_ping: faker.date.recent().toISOString()
  };
}

function generateLog() {
  return {
    ts: new Date().toISOString(),
    lvl: faker.helpers.arrayElement(['INFO', 'WARN', 'ERROR', 'DEBUG']),
    msg: faker.hacker.phrase(),
    ctx: { pid: faker.number.int({ max: 65535 }), region: faker.location.countryCode() }
  };
}

main();
