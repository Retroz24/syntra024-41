
export interface LanguageData {
  name: string;
  icon: string;
  fileExtension: string;
  defaultImport: string;
  documentation: {
    title: string;
    url: string;
    description: string;
  }[];
  syntaxHighlighting: string;
}

export const languageConfigs: Record<string, LanguageData> = {
  "JavaScript": {
    name: "JavaScript",
    icon: "JS",
    fileExtension: "js",
    defaultImport: "// JavaScript code\n\nfunction example() {\n  console.log('Hello world!');\n  return true;\n}\n\nexample();",
    documentation: [
      {
        title: "MDN JavaScript Guide",
        url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide",
        description: "Comprehensive guide to JavaScript"
      },
      {
        title: "JavaScript.info",
        url: "https://javascript.info/",
        description: "Modern JavaScript Tutorial"
      }
    ],
    syntaxHighlighting: "javascript"
  },
  "TypeScript": {
    name: "TypeScript",
    icon: "TS",
    fileExtension: "ts",
    defaultImport: "// TypeScript code\n\nfunction example(): boolean {\n  console.log('Hello world!');\n  return true;\n}\n\nexample();",
    documentation: [
      {
        title: "TypeScript Handbook",
        url: "https://www.typescriptlang.org/docs/handbook/intro.html",
        description: "The TypeScript Handbook"
      },
      {
        title: "TypeScript Deep Dive",
        url: "https://basarat.gitbook.io/typescript/",
        description: "TypeScript Deep Dive Guide"
      }
    ],
    syntaxHighlighting: "typescript"
  },
  "Python": {
    name: "Python",
    icon: "Py",
    fileExtension: "py",
    defaultImport: "# Python code\n\ndef example():\n    print('Hello world!')\n    return True\n\nexample()",
    documentation: [
      {
        title: "Python Documentation",
        url: "https://docs.python.org/3/",
        description: "Official Python Documentation"
      },
      {
        title: "Real Python",
        url: "https://realpython.com/",
        description: "Python Tutorials & Resources"
      }
    ],
    syntaxHighlighting: "python"
  },
  "React": {
    name: "React",
    icon: "Re",
    fileExtension: "jsx",
    defaultImport: "// React component\nimport React from 'react';\n\nfunction Example() {\n  return (\n    <div>\n      <h1>Hello World!</h1>\n    </div>\n  );\n}\n\nexport default Example;",
    documentation: [
      {
        title: "React Documentation",
        url: "https://reactjs.org/docs/getting-started.html",
        description: "Official React Documentation"
      },
      {
        title: "React Hooks Guide",
        url: "https://reactjs.org/docs/hooks-intro.html",
        description: "Introduction to React Hooks"
      }
    ],
    syntaxHighlighting: "jsx"
  },
  "Go": {
    name: "Go",
    icon: "Go",
    fileExtension: "go",
    defaultImport: "// Go code\npackage main\n\nimport \"fmt\"\n\nfunc main() {\n    fmt.Println(\"Hello, world!\")\n}",
    documentation: [
      {
        title: "Go Documentation",
        url: "https://golang.org/doc/",
        description: "Official Go Documentation"
      },
      {
        title: "Go by Example",
        url: "https://gobyexample.com/",
        description: "Hands-on introduction to Go"
      }
    ],
    syntaxHighlighting: "go"
  },
  "Java": {
    name: "Java",
    icon: "Ja",
    fileExtension: "java",
    defaultImport: "// Java code\npublic class Example {\n    public static void main(String[] args) {\n        System.out.println(\"Hello World!\");\n    }\n}",
    documentation: [
      {
        title: "Java Documentation",
        url: "https://docs.oracle.com/en/java/",
        description: "Official Java Documentation"
      },
      {
        title: "Spring Framework",
        url: "https://spring.io/guides",
        description: "Spring Framework Guides"
      }
    ],
    syntaxHighlighting: "java"
  },
};

export const getLanguageByName = (name: string): LanguageData => {
  return languageConfigs[name] || languageConfigs["JavaScript"];
};

export const getCategoryResources = (category: string): LanguageData => {
  switch (category.toLowerCase()) {
    case 'javascript':
    case 'js':
      return languageConfigs["JavaScript"];
    case 'typescript':
    case 'ts':
      return languageConfigs["TypeScript"];
    case 'python':
    case 'py':
      return languageConfigs["Python"];
    case 'react':
    case 're':
      return languageConfigs["React"];
    case 'go':
      return languageConfigs["Go"];
    case 'java':
    case 'ja':
      return languageConfigs["Java"];
    default:
      return languageConfigs["JavaScript"];
  }
};
