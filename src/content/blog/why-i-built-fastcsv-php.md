---
title: "Why I Built FastCSV for PHP: Finally, CSV Handling That Doesn’t Suck"
author: "Achraf Aamri"
date: "2025-07-18"
pubDate: 2025-07-18
tags: ["PHP", "CSV", "Extension", "Performance", "C"]
description: "How I brought C-level CSV speed and safety to PHP with FastCSV, a native extension powered by FastCSV-C. Benchmarks, API, and why PHP’s built-in CSV support just isn’t enough."
heroImage: "/images/projects/phpcsv.jpg"
---

If you've ever dealt with CSV files in PHP, you probably know the pain.  
`fgetcsv()`, `SplFileObject`, maybe even a third-party package. They *work*—until they don't. And then you're stuck watching your script crawl through a million rows like it's 2005.

After years of fighting CSV edge cases across multiple languages, I built [FastCSV-C](https://achrafaamri.com/blog/fastcsv-c-library/): a high-performance, memory-safe C library for CSV parsing. But there was one language I couldn't leave behind:

> **PHP.**  
> It needed some serious CSV help.

So I built **FastCSV**, a native PHP extension powered by the same C engine—no overhead, no fluff, just speed.

---

## What’s Wrong With PHP’s Built-in CSV Support?

Let me count the ways.

- **Slow on big files** – Native CSV functions get sluggish fast
- **Inconsistent behavior** – Different results with quoted values, line endings, and encodings
- **No streaming** – You end up loading too much into memory
- **No flexibility** – Good luck customizing behavior like BOMs, header skipping, or strict quote rules

If you're just looping through a few hundred rows, you'll survive. But the moment your dataset grows, or the format gets weird, or you're doing ETL-style work?

You're in for a bad time.

---

## The Idea: Bring C-Level Speed to PHP

FastCSV isn’t another PHP CSV wrapper. It’s a compiled extension that connects directly to the FastCSV-C library under the hood. Think of it like a turbocharger bolted straight into your PHP runtime.

The result? You get:
- 🚀 **Up to 4.8x faster** reads compared to `SplFileObject`
- 🧠 **Memory safety**, even with massive files
- 📦 **Drop-in APIs** that are easy to use
- 📜 **RFC 4180 compliance** (quotes, escapes, multiline — all handled properly)

And because it’s all powered by arenas in C, memory usage stays flat, even with millions of rows.

---

## Why Not Rust or Zig?

If you’re wondering why I didn’t use Rust or Zig for this extension, I actually tried! For a deep dive into my experiments with Rust and Zig for PHP extensions, see [this post](https://achrafaamri.com/blog/php-extension-in-rust-or-zig/).

In short: FFI overhead, build system headaches, and memory safety tradeoffs made C the best fit for this job.

---

## Real Benchmarks

Here’s what the extension actually does in the wild:

| Rows       | `SplFileObject` | FastCSV | Speedup |
|------------|-----------------|---------|---------|
| 1K         | 15.0 ms         | 3.6 ms  | **4.1×** |
| 100K       | 639.5 ms        | 176.0 ms | **3.6×** |
| 1M         | 9.4 sec         | 1.98 sec | **4.8×** |

---

## Using FastCSV in PHP: A Breath of Fresh API

### Simple reading:
```php
$reader = new FastCSVReader('/path/to/file.csv');

while ($reader->hasNext()) {
    $record = $reader->nextRecord();
    print_r($record);
}
```

### Advanced config:
```php
$config = new FastCSVConfig();
$config->setDelimiter(';');
$config->setHasHeader(true);

$reader = new FastCSVReader($config);
$reader->open('/path/to/file.csv');
```

### Writing CSVs:
```php
$writer = new FastCSVWriter('/path/to/output.csv', ['Name', 'Age', 'City']);
$writer->writeRecord(['Alice', '30', 'Paris']);
$writer->writeRecord(['Bob', '25', 'Madrid']);
```

---

## Built to Be Backward-Compatible

Not every production server lets you install PHP extensions. That’s why I also maintain [PHP-CSVHelper](https://github.com/csvtoolkit/PHP-CSVHelper)—a pure-PHP wrapper that uses FastCSV when available, and falls back to native PHP when it’s not.

Use the same API everywhere. Get performance where you can.  
No tradeoffs. *(More details in a future post.)*

---

## Who It’s For

FastCSV is made for:
- Devs working with *huge* CSV datasets
- ETL pipelines and data import tools
- High-performance APIs that need CSV output
- Projects needing real RFC 4180 compliance (and not just “works on my machine”)

---

## What’s Next?

- Pagination and filtering
- Chunking
- Parallelism
- Query language for CSV

---

## Final Thoughts

This isn’t about reinventing the wheel. It’s about making it spin *faster*—without wobbling.

If you’ve ever stared at a 9-second CSV import and thought, *"There has to be a better way,"* — there is.

FastCSV is what I wish PHP had built-in all along.

**Clean APIs. Native speed. No CSV tears.**  
Give it a try and let me know what you break 😄

---

**🔗 GitHub:** [csvtoolkit/FastCSV-ext](https://github.com/csvtoolkit/FastCSV-ext)  
**📖 Docs:** [csvtoolkit.org/docs/fastcsv-ext](http://csvtoolkit.org/docs/fastcsv-ext)  
**🧠 Background story:** [How I built the C core](https://achrafaamri.com/blog/fastcsv-c-library/)
