---
title: "Why I Built FastCSV-C: Making CSV Handling Easy Across Languages"
author: "Achraf Aamri"
date: "2025-07-14"
pubDate: 2025-07-14
tags: ["C", "CSV", "FFI", "PHP", "Rust", "Zig", "Performance"]
description: "For years, I had nightmares handling CSV in both Python and PHP—across many real-world projects. Here’s why I built FastCSV-C: a fast, memory-safe CSV library in C, embeddable in any language. Lessons learned about FFI, memory, and performance."
heroImage: "/images/blog/fastcsv-c.png"
---

For years, I had nightmares handling CSV in both Python and PHP—across many real-world projects. Sure, there are packages out there. But they’re often slow, leak memory, choke on edge cases, or silently corrupt data with encoding quirks.

I didn’t want to keep rewriting the same CSV handling logic over and over.  
I wanted something faster, safer, and simpler—a library I could trust, and plug into any runtime without dealing with high-level overhead.

That’s exactly why I built FastCSV-C:  
A fast, memory-safe CSV library written in C, designed to be embedded in PHP, Python, Go, or any language that can talk to C.

---

## The Problem: CSV Is Simple—Until It's Not

CSV should be easy. But in practice, it's messy:

- Newlines in quoted fields
- Files with broken UTF-8 or mixed delimiters
- Huge files that eat memory or crash halfway through
- Language-specific quirks that break cross-platform portability

Even worse, the overhead of working in high-level languages (like PHP or Python) can be a deal-breaker. You're stuck managing logic in the app layer, which slows everything down—especially when reading or writing many small rows.

---

## The Vision: A Core Engine That Works Everywhere

My goal was clear:

✅ **Fast:** Stream massive files with low memory usage  
✅ **Safe:** No leaks, no corrupt output, no guesswork  
✅ **Embeddable:** Use it from any language—PHP, Python, Go, etc.  
✅ **Standard-aware:** Handle the weirdness of real-world CSV, while sticking close to RFC 4180

I didn’t want to build “yet another CSV parser”—I wanted to move the logic closer to the runtime, so app code stays clean and fast.

---

## Why Not Rust or Zig?

Good question. I actually started there. I wrote a whole post about it ([Why I Tried Writing a PHP Extension in Rust or Zig](https://achrafaamri.com/blog/php-extension-in-rust-or-zig/)), but the short version:

⚠️ FFI overhead kills performance for small, frequent operations  
⚠️ Build systems can be tricky to integrate with ecosystems like PHP, which have their own mature (and sometimes rigid) extension-building workflows.  
⚠️ Memory safety isn’t free when you cross the language boundary  
⚠️ Ironically, C was faster and simpler when used well

This isn’t a post about why I didn’t use Zig or Rust—that story is told elsewhere.  
This post is about why I returned to C and what I learned building something usable, fast, and clean across language boundaries.

---

## Introducing FastCSV-C

[FastCSV-C](https://github.com/csvtoolkit/FastCSV-C) is a minimal, efficient CSV library written in C, with clean APIs and custom memory management via arenas (memory pools). It's designed to:

🧠 Prevent memory leaks with scoped arenas  
⚡ Stream data efficiently without wasting memory  
🔌 Connect easily to any language with C FFI  
📚 Stay documented and readable ([docs are improving, promise!](https://csvtoolkit.org/docs/fastcsv-c/))

### Example Usage

```c
#include "csv_writer.h"
#include "arena.h"
#include "csv_config.h"

int main() {
    Arena arena;
    arena_create(&arena, 1024 * 1024); // 1MB arena

    CSVConfig *config = csv_config_new(&arena);
    csv_config_set_path(config, "output.csv");
    csv_config_set_delimiter(config, ',');

    char *headers[] = {"name", "age", "city"};
    CSVWriter *writer = NULL;
    csv_writer_init(&writer, config, headers, 3, &arena);

    char *row1[] = {"Alice", "30", "New York"};
    csv_writer_write_record(writer, row1, 3);

    char *row2[] = {"Bob Smith", "25", "Los Angeles"};
    csv_writer_write_record(writer, row2, 3);

    csv_writer_free(writer);
    arena_destroy(&arena);
    return 0;
}
```

---

## Made for Extensions: PHP, Python, and More

Because FastCSV-C is written in plain, modern C, it can be integrated into almost any language runtime with minimal overhead.

The PHP extension I’m working on (stay tuned for a separate post) is just a thin layer with no speed loss—and similar wrappers are easy for other languages too.

---

## What I Learned

🧠 **High-level code shouldn't carry low-level burden:** CSV logic belongs in the engine, not in scripts  
🧱 **C is powerful when used safely:** With arenas and clean APIs, it’s not scary  
🔧 **Make the API feel native:** Keep it simple and ergonomic to wrap  
🚫 **Avoid overengineering:** No macros, no templates, just a clean core

---

## Try It Out

- 📦 [GitHub: FastCSV-C](https://github.com/csvtoolkit/FastCSV-C)
- 📚 [Documentation](https://csvtoolkit.org/docs/fastcsv-c/)
- 🚀 Use it in your language of choice, or build your own binding

If you’re tired of fighting CSV in your app logic—especially across multiple platforms—FastCSV-C is made for you. It’s not magic. It’s just clean C code, doing its job well.

> “I built the CSV library I wish I had years ago—maybe now, others won’t have to suffer the same pain.” 