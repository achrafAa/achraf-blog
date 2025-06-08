---
title: "Building a PHP Extension in Rust or Zig: My Rollercoaster Ride Through Performance, Pitfalls & Possibilities"
author: "Achraf AAMRI"
date: "2025-07-07"
pubDate: 2025-07-07
tags: ["PHP", "Rust", "Zig", "Performance", "Extensions", "Systems Programming", "Memory Safety"]
description: "My journey building a PHP extension in Rust and Zig: from wrestling with FFI overhead to discovering when modern languages win (and when they don't). A deep dive into performance, build systems, and the future of PHP."
heroImage: "/images/blog/php.png"
---

## Chasing Memory Safety (Without Losing My Mind)

If you've ever written a PHP extension in C, you know the pain: memory issues, manual cleanup, and that constant fear of the dreaded segmentation fault. Been there. Too often.

I wanted out.

So I asked myself: *"Can I write a PHP extension in a modern, memory-safe language like Rust or Zig?"*

Spoiler: it wasn't as straightforward as I thought—but it was a wild and educational ride.

---

## First Stop: Rust (a.k.a. the Unsafe Detour)

Rust seemed like the obvious choice. It's safe, fast, and pretty popular in the systems world. I thought: *"I'll just use `serde` to write a fast JSON parser in Rust, wrap it in some FFI glue, and call it a day."*

Hah.

Turns out, once you dip your toes into FFI, Rust starts throwing `unsafe` at you like confetti. Suddenly I was:

- Managing lifetimes manually
- Wrestling with `bindgen`
- Slapping `#[no_mangle]` everywhere
- Watching performance drop because of the Rust→C→PHP overhead

It was like trying to build a modern spaceship... that needed to dock with a horse-drawn carriage.

So I ditched Rust.

---

## Enter Zig: A Breath of Fresh (Low-Level) Air

Zig caught my eye with its simple syntax, great C interop, and built-in cross-compilation. Plus, it's designed to be predictable and performant, without the complexity Rust throws at you when dealing with C APIs.

I was in.

✅ Zig compiles C headers out of the box  
✅ Manual memory control (but without C's sharp edges)  
✅ No cargo, no `bindgen`, no drama  

---

## Phase 1: Writing the Core in Zig

I started with something small: hardcoded structs for `Person` and `Company`, and a function to encode them to JSON.

```zig
const Person = struct { name: []const u8, age: u32 };
const Company = struct { name: []const u8, employees: []Person };

pub fn encodePerson(p: Person) ![]const u8 { ... }
```

But that wasn't going to cut it for real-world use. So I turned it into a more flexible, reusable JSON converter:

```zig
const JsonConverter = struct {
    options: JsonOptions,
    pub fn encode(value: anytype) ![]const u8 { ... }
    pub fn decode(comptime T: type, json_str: []const u8) !T { ... }
};
```

Cool. Now I just needed to hook this into PHP...

---

## Phase 2: Build System Nightmares

PHP extensions are shared libraries—`.so` on Linux, `.dll` on Windows. Zig's `build.zig` is great, but PHP still lives in autotools land (hello `config.m4`, my old enemy).

So yeah, things got messy:

- My x86 dev machine needed to build for ARM.
- Zig didn't expose `main()`, so the linker screamed at me.
- PHP expected `.a` files in specific locations.

I ended up writing a hybrid build system: Zig built the core logic, and PHP's build process handled the glue. Not elegant, but it worked.

---

## Phase 3: Writing the Actual PHP Extension

To expose Zig code to PHP, I had to write the usual `zend_module_entry`, some `PHP_FUNCTION()` wrappers, and glue code for parameter parsing.

```c
PHP_FUNCTION(fast_json_encode) {
    char *input;
    size_t input_len;
    if (zend_parse_parameters(ZEND_NUM_ARGS(), "s", &input, &input_len) == FAILURE) {
        RETURN_NULL();
    }

    const char *result = zig_json_encode(input, input_len);
    RETURN_STRING(result);
}
```

Simple enough. But to make it *feel* native, I also:

- Added a `FastJsonException` for proper error handling
- Supported `JSON_THROW_ON_ERROR`
- Made sure memory cleanup worked on both the Zig and PHP side

---

## The Shocking Truth: Performance Was... Always Worse?

Here's the part that completely humbled me.

I benchmarked my shiny new extension against PHP's built-in `json_encode()`, expecting a blowout win for Zig.

But no. My extension was *always* slower. 😬

Small payloads? Slower.  
Big JSON documents (10MB+)? Still slower.  
Batch processing 1,000+ calls? Yep, slower too.

Why? Because every call had to cross three boundaries:

1. PHP to C (zend_parse_parameters)
2. C to Zig (FFI overhead)
3. Zig back to C, then to PHP

The overhead was so significant that even Zig's superior raw performance couldn't overcome it.

---

## The Hard Reality Check

❌ **Small payloads**: Slower (as expected)  
❌ **Big JSON documents** (10MB+): Still slower due to FFI overhead  
❌ **Batch processing** (1,000+ small payloads): Overhead multiplied the pain  
❌ **Everything else**: You guessed it, slower  

So the lesson? Sometimes the theoretical performance gains of a better language get completely eaten by architectural overhead.

---

## What I Learned (a Lot)

1. **Extensions aren't magic bullets.**  
   Sometimes pure PHP is just faster for small tasks.

2. **Build systems matter.**  
   Zig's cross-compilation was awesome, but PHP's old-school build tools were a huge friction point.

3. **APIs need to *feel* native.**  
   Mimicking `json_encode()` behavior (errors, flags, return types) made the extension usable.

4. **Maybe we're thinking too small.**  
   Instead of building extensions, what if PHP itself ran on Zig?

   - No FFI penalty
   - Memory safety baked into the runtime
   - Actual performance improvements at the VM level

---

## Final Thoughts: Was It Worth It?

Absolutely. Not because I built the fastest JSON encoder ever, but because I got to:

🔹 Learn more about PHP internals  
🔹 Deep dive into Zig and its build system  
🔹 Rethink how we approach performance in PHP

Maybe the future isn't about writing safer PHP extensions.

Maybe it's about reimagining PHP itself in safer, faster languages.

---

**What do you think?** Have you ever tried writing a PHP extension in Rust, Zig, or anything other than C? I'd love to hear your stories—successes or horror shows welcome!

**You can check the project here** [github](https://github.com/achrafAa/FastJsonDemo)
