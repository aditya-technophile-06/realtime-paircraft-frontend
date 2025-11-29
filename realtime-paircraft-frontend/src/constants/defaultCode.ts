/**
 * Default code samples for each supported language
 */
export const DEFAULT_CODE: Record<string, string> = {
  python: `# Welcome to PairCraft - Collaborative Coding Platform
# Start coding together in real-time!

def greet(name):
    """
    A simple greeting function
    """
    return f"Hello, {name}! Welcome to PairCraft."

if __name__ == "__main__":
    message = greet("Developer")
    print(message)
`,

  javascript: `// Welcome to PairCraft - Collaborative Coding Platform
// Start coding together in real-time!

function greet(name) {
  /**
   * A simple greeting function
   */
  return \`Hello, \${name}! Welcome to PairCraft.\`;
}

const message = greet("Developer");
console.log(message);
`,

  typescript: `// Welcome to PairCraft - Collaborative Coding Platform
// Start coding together in real-time!

interface User {
  name: string;
  role: string;
}

function greet(user: User): string {
  /**
   * A simple greeting function with TypeScript types
   */
  return \`Hello, \${user.name}! You are a \${user.role}.\`;
}

const developer: User = { name: "Developer", role: "Software Engineer" };
const message = greet(developer);
console.log(message);
`,

  java: `// Welcome to PairCraft - Collaborative Coding Platform
// Start coding together in real-time!

public class Main {
    /**
     * A simple greeting method
     */
    public static String greet(String name) {
        return "Hello, " + name + "! Welcome to PairCraft.";
    }
    
    public static void main(String[] args) {
        String message = greet("Developer");
        System.out.println(message);
    }
}
`,

  cpp: `// Welcome to PairCraft - Collaborative Coding Platform
// Start coding together in real-time!

#include <iostream>
#include <string>

/**
 * A simple greeting function
 */
std::string greet(const std::string& name) {
    return "Hello, " + name + "! Welcome to PairCraft.";
}

int main() {
    std::string message = greet("Developer");
    std::cout << message << std::endl;
    return 0;
}
`,

  go: `// Welcome to PairCraft - Collaborative Coding Platform
// Start coding together in real-time!

package main

import "fmt"

// greet returns a greeting message
func greet(name string) string {
    return fmt.Sprintf("Hello, %s! Welcome to PairCraft.", name)
}

func main() {
    message := greet("Developer")
    fmt.Println(message)
}
`,

  rust: `// Welcome to PairCraft - Collaborative Coding Platform
// Start coding together in real-time!

/// A simple greeting function
fn greet(name: &str) -> String {
    format!("Hello, {}! Welcome to PairCraft.", name)
}

fn main() {
    let message = greet("Developer");
    println!("{}", message);
}
`,

  php: `<?php
// Welcome to PairCraft - Collaborative Coding Platform
// Start coding together in real-time!

/**
 * A simple greeting function
 */
function greet($name) {
    return "Hello, $name! Welcome to PairCraft.";
}

$message = greet("Developer");
echo $message . PHP_EOL;
?>
`,

  ruby: `# Welcome to PairCraft - Collaborative Coding Platform
# Start coding together in real-time!

# A simple greeting method
def greet(name)
  "Hello, #{name}! Welcome to PairCraft."
end

message = greet("Developer")
puts message
`,

  csharp: `// Welcome to PairCraft - Collaborative Coding Platform
// Start coding together in real-time!

using System;

class Program
{
    /// <summary>
    /// A simple greeting method
    /// </summary>
    static string Greet(string name)
    {
        return $"Hello, {name}! Welcome to PairCraft.";
    }
    
    static void Main()
    {
        string message = Greet("Developer");
        Console.WriteLine(message);
    }
}
`,

  swift: `// Welcome to PairCraft - Collaborative Coding Platform
// Start coding together in real-time!

/// A simple greeting function
func greet(name: String) -> String {
    return "Hello, \\(name)! Welcome to PairCraft."
}

let message = greet(name: "Developer")
print(message)
`,

  kotlin: `// Welcome to PairCraft - Collaborative Coding Platform
// Start coding together in real-time!

/**
 * A simple greeting function
 */
fun greet(name: String): String {
    return "Hello, $name! Welcome to PairCraft."
}

fun main() {
    val message = greet("Developer")
    println(message)
}
`,

  sql: `-- Welcome to PairCraft - Collaborative Coding Platform
-- Start writing SQL queries together in real-time!

-- Create a sample users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO users (username, email) 
VALUES ('developer', 'developer@paircraft.com');

-- Query users
SELECT * FROM users WHERE username = 'developer';
`,

  html: `<!-- Welcome to PairCraft - Collaborative Coding Platform -->
<!-- Start coding HTML together in real-time! -->

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PairCraft - Collaborative Coding</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            max-width: 800px;
            margin: 50px auto;
            padding: 20px;
        }
        h1 { color: #6366f1; }
    </style>
</head>
<body>
    <h1>Welcome to PairCraft!</h1>
    <p>Start building amazing things together.</p>
</body>
</html>
`,

  css: `/* Welcome to PairCraft - Collaborative Coding Platform */
/* Start styling together in real-time! */

:root {
    --primary-color: #6366f1;
    --secondary-color: #8b5cf6;
    --text-color: #1f2937;
    --bg-color: #ffffff;
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    color: var(--text-color);
    background-color: var(--bg-color);
    line-height: 1.6;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

h1 {
    color: var(--primary-color);
    margin-bottom: 20px;
}
`,

  json: `{
  "name": "paircraft-project",
  "version": "1.0.0",
  "description": "Welcome to PairCraft - Collaborative Coding Platform",
  "author": {
    "name": "Developer",
    "email": "developer@paircraft.com"
  },
  "features": [
    "Real-time collaboration",
    "Multi-language support",
    "AI-powered autocomplete",
    "Theme customization"
  ],
  "config": {
    "theme": "dark",
    "autoSave": true,
    "fontSize": 14
  }
}
`,

  markdown: `# Welcome to PairCraft

## Collaborative Coding Platform

Start coding together in real-time!

### Features

- **Real-time Sync**: See changes instantly
- **Multi-language**: Support for 15+ languages
- **AI Autocomplete**: Smart code suggestions
- **Theme Toggle**: Light and dark modes

### Getting Started

1. Create or join a room
2. Share the room ID with your team
3. Start coding together!

### Code Example

\`\`\`python
def hello_paircraft():
    print("Happy Coding!")
\`\`\`

---

*Built with ❤️ for collaborative coding*
`,

  yaml: `# Welcome to PairCraft - Collaborative Coding Platform
# Start configuring together in real-time!

app:
  name: paircraft
  version: 1.0.0
  description: "Collaborative Coding Platform"

features:
  - realtime-sync
  - multi-language
  - ai-autocomplete
  - theme-toggle

server:
  host: localhost
  port: 8000
  cors:
    - http://localhost:3000
    - http://localhost:5173

database:
  type: postgresql
  host: localhost
  port: 5432
  name: paircraft
`,
};

/**
 * Get default code for a given language
 */
export function getDefaultCode(language: string): string {
  return DEFAULT_CODE[language.toLowerCase()] || DEFAULT_CODE.python;
}
